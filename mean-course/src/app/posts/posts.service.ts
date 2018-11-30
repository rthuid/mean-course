import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject, from } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();
  constructor(private http: HttpClient, private route: Router) {}

  getPosts() {
    this.http
    .get<{message: string, posts: any }>('http://localhost:3000/api/posts')
    .pipe(map((postData) => {
      return  postData.posts.map(post => {
        return {
          title: post.title,
          content: post.content,
          id: post._id
        };
      });
    }))
    .subscribe((transformedPosts) => {
      this.posts = transformedPosts;
      this.postsUpdated.next([...this.posts]);
    })
  }
  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  deletePost(postId: string) {
    this.http.delete('http://localhost:3000/api/posts/' + postId)
    .subscribe(() => {
      const updatedPost = this.posts.filter(post => post.id !== postId);
      this.posts = updatedPost;
      this.postsUpdated.next([...this.posts]);
    });
  }

  getPost(postId: string) {
    return this.http.get<{_id: string, title: string, content: string}>('http://localhost:3000/api/posts/' + postId)
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = { id: id, title: title, content: content };
    this.http.put('http://localhost:3000/api/posts/' + id, post)
    .subscribe(response => {
      console.log('Post updated!');
      this.route.navigate(['/']);
    });
  }

  addPost(title: string, content: string) {
    const post: Post = { id: null, title: title, content: content };
    this.http.post<{message: string, postId: string}>('http://localhost:3000/api/posts', post).subscribe((result) => {
      post.id = result.postId;
      this.posts.push(post);
      this.postsUpdated.next([...this.posts]);
      this.route.navigate(['/']);
    });
  }
}
