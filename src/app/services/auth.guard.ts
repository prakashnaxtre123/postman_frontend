import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  if(localStorage.getItem('postman_user_details')){
    return true;
  }
  else{
    router.navigate(['auth/signin'])
    return false
  }

};
