import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UserLogin } from '@app/models/identity/UserLogin';
import { UserService } from '@app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  model = {} as UserLogin;

  constructor(private userService: UserService,
              private router: Router,
              private toaster: ToastrService) { }

  ngOnInit(): void {
  }

  public login(): void {
    this.userService.login(this.model).subscribe(
      () => { this.router.navigateByUrl('/dashboard'); },
      (error: any) => {
        if (error.status === 401) {
          this.toaster.error('usuário ou senha inválido');
        }
        else {
        console.error(error);
        }
      }
    );
  }

}
