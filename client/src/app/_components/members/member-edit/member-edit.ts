import {
  Component,
  HostListener,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { Member } from '../../../_models/member';
import { User } from '../../../_models/user';
import { AccountService } from '../../../_services/account/account-service';
import { MembersService } from '../../../_services/members/members-service';
import { take } from 'rxjs';
import { GalleryModule } from 'ng-gallery';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PhotoEditor } from '../photo-editor/photo-editor';

@Component({
  selector: 'app-member-edit',
  imports: [GalleryModule, TabsModule, FormsModule, PhotoEditor],
  templateUrl: './member-edit.html',
  styleUrl: './member-edit.css',
})
export class MemberEdit implements OnInit {
  @ViewChild('editForm') editForm: NgForm | undefined;

  member = signal<Member | undefined>(undefined);
  user = signal<User | null | undefined>(undefined);

  @HostListener('window:beforeunload', ['$event']) unloadNotification(
    $event: any,
  ) {
    if (this.editForm?.dirty) {
      $event.returnValue = true;
    }
  }

  constructor(
    private accountService: AccountService,
    private memberService: MembersService,
    private toastr: ToastrService,
  ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe((user) => {
      this.user.set(user);
    });
  }

  ngOnInit() {
    this.loadMember();
  }

  loadMember() {
    const currentUser = this.user();

    if (currentUser) {
      this.memberService.getMember(currentUser.userName).subscribe((member) => {
        this.member.set(member);
      });
    }
  }

  updateMember() {
    const member = this.member();

    if (!member) return;

    this.memberService.updateMember(member).subscribe(() => {
      this.toastr.success('Profile updated successfully');
      this.editForm?.reset(member);
    });
  }
}
