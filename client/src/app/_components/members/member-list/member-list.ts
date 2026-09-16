import { Component, OnInit, signal } from '@angular/core';
import { Member } from '../../../_models/member';
import { MembersService } from '../../../_services/members/members-service';
import { MemberCard } from '../member-card/member-card';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-member-list',
  imports: [MemberCard, AsyncPipe],
  templateUrl: './member-list.html',
  styleUrl: './member-list.css',
})
export class MemberList implements OnInit {
  members$!: Observable<Member[]>;

  constructor(private memberService: MembersService){}

  ngOnInit() {
    this.members$ = this.memberService.getMembers();
  }
}
