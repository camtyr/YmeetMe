import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { FileUploader, FileUploadModule } from 'ng2-file-upload';
import { Member } from '../../../_models/member';
import { environment } from '../../../../environments/environment.development';
import { AccountService } from '../../../_services/account/account-service';
import { User } from '../../../_models/user';
import { take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MembersService } from '../../../_services/members/members-service';
import { Photo } from '../../../_models/photo';

@Component({
  selector: 'app-photo-editor',
  imports: [FileUploadModule, CommonModule],
  templateUrl: './photo-editor.html',
  styleUrl: './photo-editor.css',
})
export class PhotoEditor implements OnInit {
  @Input() member!: Member;
  uploader = signal<FileUploader | null>(null);
  hasBaseDropzoneOver = signal(false);
  baseUrl = environment.apiUrl;
  user!: User | null;

  constructor(
    private accountService: AccountService,
    private cdr: ChangeDetectorRef,
    private memberService: MembersService,
  ) {
    this.accountService.currentUser$
      .pipe(take(1))
      .subscribe((user) => (this.user = user));
  }

  ngOnInit() {
    this.initializeUploader();
  }

  fileOverBase(e: any) {
    this.hasBaseDropzoneOver.set(e);
  }

  setMainPhoto(photo: Photo) {
    this.memberService.setMainPhoto(photo.id).subscribe(() => {
      if (this.user) {
        this.user.photoUrl = photo.url;
        this.accountService.setCurrentUser(this.user);
        this.member.photoUrl = photo.url;
        this.member.photos.forEach((p) => {
          if (p.isMain) p.isMain = false;
          if (p.id === photo.id) p.isMain = true;
        });
      }
    });
  }

  deletePhoto(photoId: number) {
    this.memberService.deletePhoto(photoId).subscribe(() => {
      if (this.member) {
        this.member.photos = this.member.photos.filter((x) => x.id !== photoId);
      }
    });
  }

  initializeUploader() {
    this.uploader.set(
      new FileUploader({
        url: this.baseUrl + 'users/add-photo',
        authToken: 'Bearer ' + this.user?.token,
        isHTML5: true,
        allowedFileType: ['image'],
        removeAfterUpload: true,
        autoUpload: false,
        maxFileSize: 10 * 1024 * 1024,
      }),
    );

    this.uploader()!.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };

    this.uploader()!.onSuccessItem = (item, response, status, header) => {
      if (response) {
        const photo = JSON.parse(response);
        this.member.photos.push(photo);
      }
    };

    this.uploader()!.onCompleteAll = () => {
      this.cdr.detectChanges();
    };
  }
}
