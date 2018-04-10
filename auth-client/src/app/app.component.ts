import {Component, OnInit} from '@angular/core';
import {AuthService} from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Authentication Interceptor';

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.authService.login();
  }

  getTodos(): void {
    this.authService.getTodos().subscribe();
  }

  get401(): void {
    this.authService.get401().subscribe();
  }
}
