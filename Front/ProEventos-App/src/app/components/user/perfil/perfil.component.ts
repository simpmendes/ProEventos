import { UserUpdate } from './../../../models/identity/UserUpdate';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { UserService } from './../../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorField } from '@app/helpers/ValidatorField';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  userUpdate = {} as UserUpdate;
  form!: FormGroup;
  get f(): any {
    return this.form.controls;
  }

  constructor(public fb: FormBuilder,
              public userService: UserService,
              private router: Router,
              private toaster: ToastrService,
              private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.validation();
    this.carregarUsuario();
  }

  private carregarUsuario(): void{
    this.spinner.show();
    this.userService.getUser().subscribe(
      (userRetorno: UserUpdate) => {
        console.log(userRetorno)
        this.userUpdate = userRetorno;
        this.form.patchValue(this.userUpdate);
        this.toaster.success('Usuário Carregado', 'Sucesso');
        this.spinner.hide()
      },
      (error) => {
        console.error(error);
        this.toaster.error('Usuário não carregado', 'Erro');
        this.router.navigate(['/dashboard']);
      }
    )
  }

  private validation(): void {
    const formOptions: AbstractControlOptions = {
      validators: ValidatorField.MustMatch('password', 'confirmePassword')
    };
    this.form = this.fb.group(
      {
        userName: [''],
        titulo: ['NaoInformado', Validators.required],
        primeiroNome: ['', Validators.required],
        ultimoNome: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: ['', Validators.required],
        funcao: ['NaoInformado', Validators.required],
        descricao: ['', Validators.required],
        password: ['', [Validators.minLength(6), Validators.nullValidator]],
        confirmePassword: ['', Validators.nullValidator],
      }
      // , formOptions
    );
  }

  public resetForm(event: any): void{
    event.preventDefault();
    this.form.reset();
  }

  onSubmit(): void{
    this.atualizarUsuario();
  }
  public atualizarUsuario(){
    this.userUpdate = { ...this.form.value}
    this.spinner.show();
    this.userService.updateUser(this.userUpdate).subscribe(
      ()=> this.toaster.success('Usuário atualizado', 'Sucesso'),
      (error) => {
        this.toaster.error(error.error);
        console.error(error);
      },
    )
    .add(() => this.spinner.hide())
  }

}
