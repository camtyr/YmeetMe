import { Component, OnInit, signal } from '@angular/core';
import { Message } from '../../_models/message';
import { Pagination } from '../../_models/pagination';
import { MessageService } from '../../_services/message/message-service';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { TimeagoModule } from 'ngx-timeago';

@Component({
  selector: 'app-messages',
  imports: [
    PaginationModule,
    ButtonsModule,
    FormsModule,
    RouterLink,
    TitleCasePipe,
    RouterLink,
    TimeagoModule,
  ],
  templateUrl: './messages.html',
  styleUrl: './messages.css',
})
export class Messages implements OnInit {
  messages = signal<Message[] | null | undefined>(undefined);
  pagination = signal<Pagination | undefined>(undefined);
  container = 'Unread';
  pageNumber = 1;
  pageSize = 5;
  loading = signal(false);

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages() {
    this.loading.set(true);

    this.messageService
      .getMessages(this.pageNumber, this.pageSize, this.container)
      .subscribe((response) => {
        this.messages.set(response.result);
        this.pagination.set(response.pagination);
        this.loading.set(false);
      });
  }

  deleteMessage(id: number){
    this.messageService.deleteMessage(id).subscribe(() =>{
      this.messages.update(messages =>
        messages?.filter(message => message.messageId !== id)
      );
    })
  }

  pageChanged(event: any) {
    this.pageNumber = event.page;
    this.loadMessages();
  }
}
