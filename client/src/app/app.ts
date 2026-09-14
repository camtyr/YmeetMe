import { CommonModule, JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Nav } from './_components/nav/nav';
import { User } from './_models/user';
import { AccountService } from './_services/account/account-service';
import { Home } from './_components/home/home';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, JsonPipe, Nav, Home],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected title = 'Dating App';
  users = signal<any[]>([]);

  constructor(private accountService: AccountService) {}

  ngOnInit() {
    this.setCurrentUser();
  }

  setCurrentUser() {
    const user = localStorage.getItem('user');
    if (user) {
      this.accountService.setCurrentUser(JSON.parse(user));
    } else {
      this.accountService.setCurrentUser(null);
    }
  }
}
