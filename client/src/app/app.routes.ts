import { Routes } from '@angular/router';
import { Home } from './_components/home/home';
import { MemberList } from './_components/members/member-list/member-list';
import { MemberDetail } from './_components/members/member-detail/member-detail';
import { Lists } from './_components/lists/lists';
import { Messages } from './_components/messages/messages';
import { authGuard } from './_guards/auth/auth-guard';
import { TestErrors } from './_components/errors/test-errors/test-errors';
import { NotFound } from './_components/errors/not-found/not-found';
import { ServerError } from './_components/errors/server-error/server-error';
import { MemberEdit } from './_components/members/member-edit/member-edit';
import { preventUnsavedChangesGuard } from './_guards/prevent-unsaved-changes/prevent-unsaved-changes-guard';

export const routes: Routes = [
  { path: '', component: Home },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard],
    children: [
      { path: 'members', component: MemberList },
      { path: 'members/:username', component: MemberDetail },
      { path: 'member/edit', component: MemberEdit, canDeactivate: [preventUnsavedChangesGuard] },
      { path: 'lists', component: Lists },
      { path: 'messages', component: Messages },
    ],
  },
  { path: 'errors', component: TestErrors },
  { path: 'not-found', component: NotFound },
  { path: 'server-error', component: ServerError },
  { path: '**', component: NotFound, pathMatch: 'full' },
];
