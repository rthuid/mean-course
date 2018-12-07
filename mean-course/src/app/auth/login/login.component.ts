import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  constructor(public authService: AuthService) {}
  private authStatussubs: Subscription;
  isLoading = false;

  ngOnInit() {
    this.authStatussubs = this.authService.getAuthStatusListener().subscribe(status => {
      this.isLoading = status;
    });
  }
  ngOnDestroy() {
    this.authStatussubs.unsubscribe();
  }
  onLogin(formData: NgForm) {
    if (formData.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.login(formData.value.email, formData.value.password);
  }
}
