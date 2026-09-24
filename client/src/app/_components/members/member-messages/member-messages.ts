import {
  Component,
  Input,
  OnInit,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { MessageService } from '../../../_services/message/message-service';
import { Message } from '../../../_models/message';
import { TimeagoModule } from 'ngx-timeago';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-member-messages',
  imports: [TimeagoModule, FormsModule],
  templateUrl: './member-messages.html',
  styleUrl: './member-messages.css',
})
export class MemberMessages implements OnInit {
  @ViewChild('messageForm') messageForm!: NgForm;
  @Input() messages!: WritableSignal<Message[]>;
  @Input() username!: string;
  messageContent!: string;

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {}

  sendMessage() {
    this.messageService.sendMessage(this.username, this.messageContent).subscribe(message =>{
      this.messages().push(message);
      this.messageForm.reset();
    });
  }
}
