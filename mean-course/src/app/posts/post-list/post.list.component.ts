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
  pageSizeOption = [1, 2, 5, 7];
  totalPosts = 0;
  currentPage = 1;
  private postSub: Subscription;
  constructor(public postService: PostService) {}

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
    this.postSub = this.postService.getPostUpdateListener().subscribe((postData: {posts: Post[], postCount: number}) => {
      this.isLoading = false;
      this.totalPosts = postData.postCount;
      this.posts = postData.posts;
    });
  }

  onDelete(postId) {
    this.isLoading = true;
    this.postService.deletePost(postId).subscribe(() => {
      this.postService.getPosts(this.postsPerPage, this.currentPage);
    });
  }
  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    console.log(pageData);
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
  }

  ngOnDestroy() {
    this.postSub.unsubscribe();
  }
}
