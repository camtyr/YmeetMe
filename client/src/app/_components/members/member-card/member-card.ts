import { Component, Input, OnInit } from '@angular/core';
import { Member } from '../../../_models/member';
import { RouterLink } from '@angular/router';
import { MembersService } from '../../../_services/members/members-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-member-card',
  imports: [RouterLink],
  templateUrl: './member-card.html',
  styleUrl: './member-card.css',
})
export class MemberCard implements OnInit {
  @Input() member!: Member;

  constructor(
    private memberService: MembersService,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {}

  addLike(member: Member) {
    this.memberService.addLike(member.userName).subscribe(() => {
      this.toastr.success('You have liked ' + member.knownAs);
    });
  }
  
}
