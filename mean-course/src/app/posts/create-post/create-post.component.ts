import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { Post } from '../post.model';
import { PostService } from '../posts.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class PostCreateComponent implements OnInit {

  post: Post;
  private mode = 'create';
  private postId: string;

  constructor(private postService: PostService, private route: ActivatedRoute) {}
  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.postService.getPost(this.postId).subscribe(postData => {
          this.post = {id: postData._id, title: postData.title, content: postData.content}
        });
      } else {
        this.postId = null;
        this.mode = 'create';
      }
    });
  }

  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    if (this.mode == 'create') {
      this.postService.addPost(form.value.title, form.value.content);
      form.resetForm();
    }
    if (this.mode == 'edit') {
      this.postService.updatePost(this.postId, form.value.title, form.value.content);
      form.resetForm();
    }
  }
}
