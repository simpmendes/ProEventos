import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
              private toaster: ToastrService) {
  }
  canActivate(): boolean {
    if (localStorage.getItem('user') !== null) return true;

    this.router.navigate(['user/login']);
    this.toaster.info('Usuário não cadastrado');
    return false;
  }
}
