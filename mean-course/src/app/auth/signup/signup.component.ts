import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  constructor(public authService: AuthService) {}

  isLoading = false;
  onSignup(formData: NgForm) {
    this.isLoading = true;
    if (formData.invalid) {
      return;
    }
    this.authService.createUser(formData.value.email, formData.value.password);
  }
}
