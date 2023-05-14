import { UserUpdate } from './../../../models/identity/UserUpdate';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserService } from './../../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  public usuario = {} as UserUpdate;
  public imagemURL = '';
  public file: File;
  public get ehPalestrante(): boolean{
    return this.usuario.funcao === 'Palestrante';
  }
  constructor(private spinner: NgxSpinnerService,
              private toastr: ToastrService,
              private userService: UserService) { }

  ngOnInit(): void {

  }

  public setFormValue(usuario: UserUpdate): void {
    this.usuario = usuario;
    if(this.usuario.imagemURL)
      this.imagemURL = environment.apiURL + `resources/perfil/${this.usuario.imagemURL}`;
    else
      this.imagemURL = './assets/img/perfil.png';
  }

  onFileChange(ev: any): void{
    const reader = new FileReader();
    reader.onload = (event: any) => this.imagemURL = event.target.result;
    this.file = ev.target.files;
    reader.readAsDataURL(this.file[0]);
    this.uploadImagem();
  }

  private uploadImagem(): void{
    this.spinner.show();
    this.userService
        .postUpload(this.file)
        .subscribe(
          () => this.toastr.success('Imagem atualizada com Sucesso', 'Sucesso!'),
          (error: any) =>{
            this.toastr.error('Erro ao fazer o upload de imagem', 'Erro!');
            console.log(error);
          }
        ).add(()=> this.spinner.hide());
  }

}
