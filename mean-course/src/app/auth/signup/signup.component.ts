import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  private authServiceSubs: Subscription;
  isLoading = false;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.authServiceSubs = this.authService.getAuthStatusListener().subscribe(status => {
      this.isLoading = status;
    });
  }
  ngOnDestroy() {
    this.authServiceSubs.unsubscribe();
  }
  onSignup(formData: NgForm) {
    if (formData.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.createUser(formData.value.email, formData.value.password);
  }
}
