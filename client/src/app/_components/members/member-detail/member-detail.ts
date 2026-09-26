import {
  Component,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { Member } from '../../../_models/member';
import { MembersService } from '../../../_services/members/members-service';
import { ActivatedRoute, Router } from '@angular/router';
import { TabDirective, TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { AsyncPipe, DatePipe, NgStyle } from '@angular/common';
import { TimeagoPipe } from 'ngx-timeago';
import { MemberMessages } from '../member-messages/member-messages';
import { MessageService } from '../../../_services/message/message-service';
import { Message } from '../../../_models/message';
import { PresenceService } from '../../../_services/presence/presence-service';
import { AccountService } from '../../../_services/account/account-service';
import { User } from '../../../_models/user';
import { take } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [
    TabsModule,
    GalleryModule,
    NgStyle,
    DatePipe,
    TimeagoPipe,
    MemberMessages,
    AsyncPipe,
  ],
  templateUrl: './member-detail.html',
  styleUrl: './member-detail.css',
})
export class MemberDetail implements OnInit, OnDestroy {
  @ViewChild('memberTabs', { static: true }) memberTabs!: TabsetComponent;
  member = signal<Member>({} as Member);
  images = signal<GalleryItem[]>([]);
  activeTab!: TabDirective;
  messages = signal<Message[]>([]);
  user!: User | null;

  constructor(
    private messageService: MessageService,
    private route: ActivatedRoute,
    private memberService: MembersService,
    public presenceService: PresenceService,
    private accountService: AccountService,
    private toastr: ToastrService,
    private router: Router,
  ) {
    this.accountService.currentUser$
      .pipe(take(1))
      .subscribe((user) => (this.user = user));

    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.member.set(data.member);
    });

    this.route.queryParams.subscribe((params) => {
      const tab = params.tab ? params.tab : 0;

      setTimeout(() => {
        this.selectTab(tab);
      });
    });

    this.images.set(this.getImages());
  }

  getImages(): GalleryItem[] {
    const imageUrls: GalleryItem[] = [];
    const photos = this.member().photos ?? [];

    for (const photo of photos) {
      imageUrls.push(
        new ImageItem({
          thumb: photo?.url,
          src: photo?.url,
        }),
      );
    }

    return imageUrls;
  }

  loadMessages() {
    const username = this.member().userName;
    if (!username) return;

    this.messageService.getMessageThread(username).subscribe((messages) => {
      this.messages.set(messages);
    });
  }

  selectTab(tabId: number) {
    this.memberTabs.tabs[tabId].active = true;
  }

  onTabActivated(data: TabDirective) {
    this.activeTab = data;
    if (
      this.activeTab.heading === 'Messages' &&
      this.messages()?.length === 0
    ) {
      if (!this.user) return;

      this.messageService.createHubConnection(
        this.user,
        this.member().userName,
      );
    } else {
      this.messageService.stopHubConnection();
    }
  }

  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }

  addLike(member: Member) {
    this.memberService.addLike(member.userName).subscribe(() => {
      this.toastr.success('You have liked ' + member.knownAs);
    });
  }
}
