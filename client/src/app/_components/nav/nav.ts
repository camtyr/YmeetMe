import { Component, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../_services/account/account-service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { User } from '../../_models/user';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-nav',
  imports: [FormsModule, BsDropdownModule, AsyncPipe],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav implements OnInit {
  model: any = {};

  constructor(public accountService: AccountService) {
  }

  ngOnInit() {
  }

  login() {
    this.accountService.login(this.model).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  logout() {
    this.accountService.logout();
  }
}
