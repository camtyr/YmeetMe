import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { environment } from '../../../environments/environment.development';
import { BehaviorSubject, take } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { User } from '../../_models/user';

@Injectable({
  providedIn: 'root',
})
export class PresenceService {
  hubUrl = environment.hubUrl;
  private hubConnection: HubConnection | undefined;
  private onlineUsersSource = new BehaviorSubject<string[]>([]);
  onlineUsers$ = this.onlineUsersSource.asObservable();

  constructor(
    private toastr: ToastrService,
    private router: Router,
  ) {}

  createHubConnection(user: User) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'presence', {
        accessTokenFactory: () => user.token,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.on('UserIsOnline', (userName) => {
      this.onlineUsers$.pipe(take(1)).subscribe((userNames) => {
        this.onlineUsersSource.next([...userNames, userName]);
      });
    });

    this.hubConnection.on('UserIsOffline', (userName) => {
      this.onlineUsers$.pipe(take(1)).subscribe((userNames) => {
        this.onlineUsersSource.next([
          ...userNames.filter((x) => x !== userName),
        ]);
      });
    });

    this.hubConnection.on('GetOnlineUsers', (userNames: string[]) => {
      this.onlineUsersSource.next(userNames);
    });

    this.hubConnection.on('NewMessageReceived', ({ userName, knownAs }) => {
      this.toastr
        .info(knownAs + ' has sent new message!')
        .onTap.pipe(take(1))
        .subscribe(() =>
          this.router.navigateByUrl('/members/' + userName + '?tab=3'),
        );
    });

    this.hubConnection.start().catch((error) => console.log(error));
  }

  stopHubConnection() {
    this.hubConnection?.stop().catch((error) => console.log(error));
  }
}
