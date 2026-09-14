import { Component, OnInit, signal } from '@angular/core';
import { Register } from '../register/register';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  imports: [Register],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  RegisterMode = signal(false);

  constructor() {}

  ngOnInit() {}

  registerToggle() {
    this.RegisterMode.set(!this.RegisterMode());
  }
  
  cancelRegisterMode(event: boolean) {
    this.RegisterMode.set(event);
  }
}
