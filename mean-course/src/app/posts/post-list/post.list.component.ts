import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';

import { Post } from '../post.model';
import { PostService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post.list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  isLoading = false;
  postsPerPage = 2;
  pageSizeOption = [2, 3, 5, 7];
  totalPosts = 10;
  private postSub: Subscription;
  constructor(public postService: PostService) {}

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts();
    this.postSub = this.postService.getPostUpdateListener().subscribe((posts: Post[]) => {
      this.isLoading = false;
      this.posts = posts;
    });
  }

  onDelete(postId) {
    this.postService.deletePost(postId);
  }
  onChangedPage(pageData: PageEvent) {
    console.log(pageData);
  }

  ngOnDestroy() {
    this.postSub.unsubscribe();
  }
}
