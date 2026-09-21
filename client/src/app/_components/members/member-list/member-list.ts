import { Component, OnInit, signal } from '@angular/core';
import { Member } from '../../../_models/member';
import { MembersService } from '../../../_services/members/members-service';
import { MemberCard } from '../member-card/member-card';
import { take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Pagination } from '../../../_models/pagination';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { AccountService } from '../../../_services/account/account-service';
import { UserParams } from '../../../_models/userParams';
import { User } from '../../../_models/user';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

@Component({
  selector: 'app-member-list',
  imports: [
    MemberCard,
    PaginationModule,
    CommonModule,
    FormsModule,
    ButtonsModule,
  ],
  templateUrl: './member-list.html',
  styleUrl: './member-list.css',
})
export class MemberList implements OnInit {
  members = signal<Member[] | null | undefined>(undefined);
  pagination = signal<Pagination | undefined>(undefined);
  userParams = signal<UserParams | undefined>(undefined);
  user!: User | null;
  genderList = [
    { value: 'male', display: 'Males' },
    { value: 'female', display: 'Females' },
  ];

  constructor(private memberService: MembersService) {
    this.userParams.set(this.memberService.getUserParams());
  }

  ngOnInit() {
    this.loadMember();
  }

  loadMember() {
    const userParams = this.userParams();
    if (!userParams) return;

    this.memberService.setUserParams(userParams);

    this.memberService.getMembers(userParams).subscribe((response) => {
      this.members.set(response.result);
      this.pagination.set(response.pagination);
    });
  }

  resetFilter() {
    if (this.user) {
      this.userParams.set(this.memberService.resetUserParams());
      this.loadMember();
    }
  }

  pageChanged(event: any) {
    const userParams = this.userParams();
    if (!userParams) return;

    userParams.pageNumber = event.page;
    this.memberService.setUserParams(userParams);
    this.loadMember();
  }
}
