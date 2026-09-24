import {
  Component,
  OnInit,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { Member } from '../../../_models/member';
import { MembersService } from '../../../_services/members/members-service';
import { ActivatedRoute } from '@angular/router';
import { TabDirective, TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { DatePipe, NgStyle } from '@angular/common';
import { TimeagoPipe } from 'ngx-timeago';
import { MemberMessages } from '../member-messages/member-messages';
import { MessageService } from '../../../_services/message/message-service';
import { Message } from '../../../_models/message';

@Component({
  selector: 'app-member-detail',
  imports: [
    TabsModule,
    GalleryModule,
    NgStyle,
    DatePipe,
    TimeagoPipe,
    MemberMessages,
  ],
  templateUrl: './member-detail.html',
  styleUrl: './member-detail.css',
})
export class MemberDetail implements OnInit {
  @ViewChild('memberTabs', { static: true }) memberTabs!: TabsetComponent;
  member = signal<Member>({} as Member);
  images = signal<GalleryItem[]>([]);
  activeTab!: TabDirective;
  messages = signal<Message[] | undefined>(undefined);

  constructor(
    private messageService: MessageService,
    private route: ActivatedRoute,
  ) {}

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
    if (this.activeTab.heading === 'Messages') {
      this.loadMessages();
    }
  }
}
