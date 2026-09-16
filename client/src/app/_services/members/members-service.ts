import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Member } from '../../_models/member';
import { map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  baseUrl = environment.apiUrl;
  members = signal<Member[]>([]);

  constructor(private http: HttpClient) {}

  getMembers() {
    if(this.members().length > 0) return of(this.members());
    return this.http.get<Member[]>(this.baseUrl + 'users').pipe(
      map(members => {
        this.members.set(members);
        return members;
      }));
  }

  getMember(userName: string) {
    const member = this.members().find(x => x.userName === userName);
    if(member !== undefined) return of(member);
    return this.http.get<Member>(this.baseUrl + 'users/' + userName);
  }

  updateMember(member: Member){
    return this.http.put(this.baseUrl + 'users', member).pipe(
      map(() => {
        const index = this.members().indexOf(member);
        this.members()[index] = member;
      })
    )
  }
}
