import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(public authService: AuthService) {}
  isLoading = false;
  onLogin(formData: NgForm) {
    this.isLoading = true;
    if (formData.invalid) {
      return;
    }
    this.authService.login(formData.value.email, formData.value.password);
  }
}
