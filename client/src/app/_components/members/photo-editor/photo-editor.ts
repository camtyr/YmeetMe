import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  Signal,
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
import { ConfirmService } from '../../../_services/confirm/confirm-service';

@Component({
  selector: 'app-photo-editor',
  imports: [FileUploadModule, CommonModule],
  templateUrl: './photo-editor.html',
  styleUrl: './photo-editor.css',
})
export class PhotoEditor implements OnInit {
  @Input() member!: WritableSignal<Member>;
  uploader = signal<FileUploader | null>(null);
  hasBaseDropzoneOver = signal(false);
  baseUrl = environment.apiUrl;
  user!: User | null;

  constructor(
    private accountService: AccountService,
    private cdr: ChangeDetectorRef,
    private memberService: MembersService,
    private confirmService: ConfirmService,
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
        this.member().photoUrl = photo.url;
        this.member().photos.forEach((p) => {
          if (p.isMain) p.isMain = false;
          if (p.id === photo.id) p.isMain = true;
        });
      }
    });
  }

  deletePhoto(photoId: number) {
    this.confirmService
      .confirm('Confirm delete photo', 'This cannot be undone')
      .subscribe((result) => {
        this.memberService.deletePhoto(photoId).subscribe(() => {
          this.member.update((member) => ({
            ...member,
            photos: member.photos.filter((photo) => photo.id !== photoId),
          }));
        });
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
        const photo: Photo = JSON.parse(response);
        this.member().photos.push(photo);
        if (photo.isMain) {
          if (this.user) {
            this.user.photoUrl = photo.url;
            this.accountService.setCurrentUser(this.user);
            this.member().photoUrl = photo.url;
          }
        }
      }
    };

    this.uploader()!.onCompleteAll = () => {
      this.cdr.detectChanges();
    };
  }
}
