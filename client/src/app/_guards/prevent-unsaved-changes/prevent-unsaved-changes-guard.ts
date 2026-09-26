import { CanDeactivateFn } from '@angular/router';
import { MemberEdit } from '../../_components/members/member-edit/member-edit';
import { ConfirmService } from '../../_services/confirm/confirm-service';
import { inject } from '@angular/core';

export const preventUnsavedChangesGuard: CanDeactivateFn<MemberEdit> = (component, currentRoute, currentState, nextState) => {
  const confirmService = inject(ConfirmService);
  
  if(component.editForm?.dirty){
    return confirmService.confirm();
  }
  
  return true;
};
