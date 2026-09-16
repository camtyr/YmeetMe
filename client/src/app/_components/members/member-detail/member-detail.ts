import { Component, OnInit, signal } from '@angular/core';
import { Member } from '../../../_models/member';
import { MembersService } from '../../../_services/members/members-service';
import { ActivatedRoute } from '@angular/router';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-member-detail',
  imports: [TabsModule, GalleryModule, NgStyle],
  templateUrl: './member-detail.html',
  styleUrl: './member-detail.css',
})
export class MemberDetail implements OnInit {
  member = signal<Member | undefined>(undefined);
  images = signal<GalleryItem[]>([]);
  
  constructor(private memberService: MembersService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.loadMember();
    this.images.set(this.getImages());
  }

  getImages(): GalleryItem[] {
    const imageUrls: GalleryItem[] = [];
    const photos = this.member()?.photos ?? [];

    for (const photo of photos) {
      imageUrls.push(new ImageItem({
        thumb: photo?.url,
        src: photo?.url
      }));
    }

    return imageUrls;
  }


  loadMember(){
    const username = this.route.snapshot.paramMap.get('username');
    if (!username) return;

    this.memberService.getMember(username).subscribe(member =>{
        this.member.set(member);
        this.images.set(this.getImages());
    })
  }
}
