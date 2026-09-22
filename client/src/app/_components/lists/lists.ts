import { Component, OnInit, signal } from '@angular/core';
import { Member } from '../../_models/member';
import { MembersService } from '../../_services/members/members-service';
import { ButtonRadioDirective, ButtonsModule } from 'ngx-bootstrap/buttons';
import { FormsModule } from '@angular/forms';
import { MemberCard } from '../members/member-card/member-card';
import { Pagination } from '../../_models/pagination';

@Component({
  selector: 'app-lists',
  imports: [ButtonRadioDirective, ButtonsModule, FormsModule, MemberCard],
  templateUrl: './lists.html',
  styleUrl: './lists.css',
})
export class Lists implements OnInit {
  members = signal<Partial<Member[]> | null | undefined>(undefined);
  pagination = signal<Pagination | undefined>(undefined);
  predicate = 'liked';
  pageNumber = 1;
  pageSize = 5;
  

  constructor(private memberService: MembersService) {}

  ngOnInit(): void {
    this.loadLikes();
  }

  loadLikes() {
    this.memberService
      .getLikes(this.predicate, this.pageNumber, this.pageSize)
      .subscribe((response) => {
        this.members.set(response.result);
        this.pagination.set(response.pagination);
      });
  }

  pageChanged(event: any) {

    this.pageNumber = event.page;
    this.loadLikes();
  }
}
