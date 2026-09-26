import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Nav } from './_components/nav/nav';
import { AccountService } from './_services/account/account-service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { PresenceService } from './_services/presence/presence-service';
import { User } from './_models/user';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Nav, NgxSpinnerModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  constructor(
    private accountService: AccountService,
    private presenceService: PresenceService,
  ) {}

  ngOnInit() {
    this.setCurrentUser();
  }

  setCurrentUser() {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      this.accountService.setCurrentUser(null);
      return;
    }

    const currentUser: User = JSON.parse(storedUser);
    if (this.isTokenExpired(currentUser.token)) {
      this.accountService.setCurrentUser(null);
      return;
    }

    this.accountService.setCurrentUser(currentUser);
    this.presenceService.createHubConnection(currentUser);
  }

  private isTokenExpired(token: string): boolean {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 <= Date.now();
  }
}
