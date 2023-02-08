import { UserService } from './../../services/user.service';
import { NavigationEnd, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  isCollapsed = true;
  public usuarioLogado = false;

  constructor(private router: Router,
    public userService: UserService) {
      router.events.subscribe(
        (val)=>{
          if(val instanceof NavigationEnd){
            this.userService.currentUser$.subscribe(
              (value) => this.usuarioLogado = value !== null
            )
          }
        }
      )
    }

  ngOnInit(): void {

  }

  logout(): void{
    this.userService.logout();
    this.router.navigateByUrl('/user/login');
    window.location.reload();

  }
  showMenu(): boolean{
    return this.router.url !== '/user/login';
  }



}
