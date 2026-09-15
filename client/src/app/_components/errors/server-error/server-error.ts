import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-server-error',
  imports: [],
  templateUrl: './server-error.html',
  styleUrl: './server-error.css',
})
export class ServerError implements OnInit{
  error: any;

  constructor(private router: Router){
    const navigation = this.router.currentNavigation();
    this.error = navigation?.extras?.state?.error;
  }

  ngOnInit(): void {
    
  }
}
