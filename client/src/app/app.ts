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
  protected title = 'Dating App';

  constructor(
    private accountService: AccountService,
    private presenceService: PresenceService,
  ) {}

  ngOnInit() {
    this.setCurrentUser();
  }

  setCurrentUser() {
    const user: string | null = localStorage.getItem('user');
    if (user) {
      const currentUser: User = JSON.parse(user);

      this.accountService.setCurrentUser(currentUser);
      this.presenceService.createHubConnection(currentUser);
    } else {
      this.accountService.setCurrentUser(null);
    }
  }
}
