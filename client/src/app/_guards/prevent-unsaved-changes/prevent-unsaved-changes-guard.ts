import { CanDeactivateFn } from '@angular/router';
import { MemberEdit } from '../../_components/members/member-edit/member-edit';

export const preventUnsavedChangesGuard: CanDeactivateFn<MemberEdit> = (component, currentRoute, currentState, nextState) => {
  if(component.editForm?.dirty){
    return confirm('Are you sure you want to countinue? Any unsaved changes will be lost')
  }
  return true;
};
