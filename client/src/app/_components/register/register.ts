import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../_services/account/account-service';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  @Output() cancelRegister = new EventEmitter();

  model: any = {};

  constructor(private accountService: AccountService) {}

  ngOnInit() {}

  register() {
    this.accountService.register(this.model).subscribe({
      next: () => {
        this.cancel();
      }
    });

  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
