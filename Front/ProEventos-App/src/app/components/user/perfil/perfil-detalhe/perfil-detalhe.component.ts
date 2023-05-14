import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidatorField } from '@app/helpers/ValidatorField';
import { UserUpdate } from '@app/models/identity/UserUpdate';
import { PalestranteService } from '@app/services/palestrante.service';
import { UserService } from '@app/services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-perfil-detalhe',
  templateUrl: './perfil-detalhe.component.html',
  styleUrls: ['./perfil-detalhe.component.css']
})
export class PerfilDetalheComponent implements OnInit {
  @Output() changeFormValue = new EventEmitter();
  userUpdate = {} as UserUpdate;
  form!: FormGroup;
  get f(): any {
    return this.form.controls;
  }

  constructor(public fb: FormBuilder,
    public userService: UserService,
    private router: Router,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService,
    private palestranteService: PalestranteService) { }

  ngOnInit() {
    this.validation();
    this.carregarUsuario();
    this.verificaForm();
  }

  private verificaForm(): void{
    this.form.valueChanges
             .subscribe(()=> this.changeFormValue.emit({...this.form.value}))
  }
  private carregarUsuario(): void{
    this.spinner.show();
    this.userService.getUser().subscribe(
      (userRetorno: UserUpdate) => {
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
        imagemURL: [''],
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
    if(this.f.funcao.value == 'Palestrante'){
      this.palestranteService.post().subscribe(
        () => this.toaster.success('Função Palestrante Ativada!', 'Sucesso!'),
        (error) => {
          this.toaster.error(error.error, 'Error');

        }
      )
    }

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
