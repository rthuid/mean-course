import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject, from } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>();
  constructor(private http: HttpClient, private route: Router) {}

  getPosts(postPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postPerPage}&page=${currentPage}`;
    this.http
    .get<{message: string, posts: any, maxPosts: number }>('http://localhost:3000/api/posts' + queryParams)
    .pipe(map((postData) => {
      return  {
        posts: postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath,
            creator: post.creator
          };
        }),
        maxPosts: postData.maxPosts
      };
    }))
    .subscribe((transformedPostData) => {
      console.log(transformedPostData);
      this.posts = transformedPostData.posts;
      this.postsUpdated.next({posts: [...this.posts], postCount: transformedPostData.maxPosts});
    })
  }
  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  deletePost(postId: string) {
    return this.http.delete('http://localhost:3000/api/posts/' + postId)
    // .subscribe(() => {
    //   const updatedPost = this.posts.filter(post => post.id !== postId);
    //   this.posts = updatedPost;
    //   this.postsUpdated.next([...this.posts]);
    // });
  }

  getPost(postId: string) {
    return this.http.get<{_id: string, title: string, content: string, imagePath: string}>('http://localhost:3000/api/posts/' + postId);
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof(image) === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, image.name);
    } else {
      postData = { id: id, title: title, content: content, imagePath: image }
    }
    // const post: Post = { id: id, title: title, content: content, imagePath: null };
    this.http.put('http://localhost:3000/api/posts/' + id, postData)
    .subscribe(response => {
      console.log('Post updated!');
      this.route.navigate(['/']);
    });
  }

  addPost(title: string, content: string, image: File) {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('image', image, image.name);

    this.http.post<{message: string, post: Post}>('http://localhost:3000/api/posts', formData).subscribe((result) => {
      // const post: Post = result.post;
      // this.posts.push(post);
      // this.postsUpdated.next([...this.posts]);
      this.route.navigate(['/']);
    });
  }
}
