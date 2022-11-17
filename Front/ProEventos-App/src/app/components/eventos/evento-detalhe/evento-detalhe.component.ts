import { environment } from './../../../../environments/environment';
import { Observable } from 'rxjs';
import { LoteService } from './../../../services/lote.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Evento } from './../../../models/Evento';
import { EventoService } from './../../../services/evento.service';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsLocaleService, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Lote } from '@app/models/Lote';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss']
})
export class EventoDetalheComponent implements OnInit {
   modalRef: BsModalRef;
   eventoId: number;
   evento = {} as Evento;
   form!: FormGroup;
   estadoSalvar = 'post';
   loteAtual = {id: 0, nome: '', indice: 0};
   imagemURL = 'assets/cloudUpload.png';
   file: File;

   get f(): any{
    return this.form.controls;
   }
   get modoEditar(): boolean{
    return this.estadoSalvar === 'put';
   }
   get lotes(): FormArray{
    return this.form.get('lotes') as FormArray;
   }
   datePickerConfig: Partial<BsDatepickerConfig>;
   datePickerConfigLote: Partial<BsDatepickerConfig>;

  //  get bsConfig(): any{
  //   return {isAnimated: true,
  //     adaptivePosition: true,
  //     dateInputFormat: 'DD/MM/YYYY hh:mm a',
  //     containerClass: 'theme-dark-blue',
  //   showWeekNumbers: false};
  //  }
  constructor(private fb: FormBuilder,
              private localeService: BsLocaleService,
              private activatedRouter: ActivatedRoute,
              private router: Router,
              private eventoService: EventoService,
              private loteService: LoteService,
              private spinner: NgxSpinnerService,
              private modalService: BsModalService,
              private toastr: ToastrService) {
                this.datePickerConfig = Object.assign({}, {isAnimated: true,
                  adaptivePosition: true,
                  dateInputFormat: 'DD/MM/YYYY hh:mm a',
                  containerClass: 'theme-dark-blue',
                showWeekNumbers: false});

                this.datePickerConfigLote = Object.assign({}, {isAnimated: true,
                  adaptivePosition: true,
                  dateInputFormat: 'DD/MM/YYYY',
                  containerClass: 'theme-dark-blue',
                showWeekNumbers: false});
                this.localeService.use('pt-br');
               }
  public carregarEvento(): void{
    this.eventoId = +this.activatedRouter.snapshot.paramMap.get('id');
    if (this.eventoId != null && this.eventoId !== 0){
      this.spinner.show();
      this.estadoSalvar = 'put';
      this.eventoService.getEventosById(this.eventoId).subscribe(
        (evento: Evento) => {
          this.evento = {...evento};
          this.form.patchValue(this.evento);
          if (this.evento.imagemURL !== '') {
            this.imagemURL = environment.apiURL + 'resources/images/' + this.evento.imagemURL;
          }
          this.evento.lotes.forEach(lote =>
            this.lotes.push(this.criarLote(lote)));
        },
        (error: any) => {
          this.toastr.error('Erro ao tentar carregar o evento.', 'Erro!');
          console.error(error);
        }
      ).add(() => this.spinner.hide());
    }
  }

  ngOnInit(): void {
    this.carregarEvento();

    this.validation();
  }

  public validation(): void {
    this.form = this.fb.group({
      tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      imagemURL: [''],
      lotes: this.fb.array([])
    });
  }

  adicionarLote(): void{
    this.lotes.push(this.criarLote({id: 0} as Lote));
  }
  criarLote(lote: Lote): FormGroup {
    return this.fb.group({
      id : [lote.id],
      nome: [lote.nome, Validators.required],
      preco: [lote.preco, Validators.required],
      dataInicio: [lote.dataInicio, Validators.required],
      dataFim: [lote.dataFim, Validators.required],
      quantidade: [lote.quantidade, Validators.required]
    });
  }
  public resetForm(): void{
    this.form.reset();
  }

  public salvarEvento(): void{
    this.spinner.show();
    if (this.form.valid){

      if (this.estadoSalvar === 'post')
      {
        this.evento = {...this.form.value};
        this.corrigirFusoInput();
      }
      else{
        this.evento = {id: this.evento.id, ...this.form.value};
        this.corrigirFusoInput();
      }

      this.eventoService[this.estadoSalvar](this.evento).subscribe(
          (eventoRetorno: Evento) => {this.toastr.success('Evento salvo com sucesso', 'Sucesso');
                                      this.router.navigate([`eventos/detalhe/${eventoRetorno.id}`]);
          },
          (error: any) => {
            console.error(error);
            this.spinner.hide();
            this.toastr.error('Error ao salvar o evento', 'Erro');
          },
          () => this.spinner.hide()
        );

    }
  }
  public salvarLotes(): void{
    if (this.form.controls.lotes.valid){
      this.spinner.show();
      this.loteService.saveLote(this.eventoId, this.form.value.lotes)
      .subscribe(
        () => {
          this.toastr.success('Lotes salvos com Sucesso', 'Sucesso!');
          //this.lotes.reset();
        },
        (error: any) => {
          this.toastr.error('Erro ao tentar  salvar lotes.', 'Erro');
          console.error(error);
        }
      ).add(() => this.spinner.hide());
    }
  }
  public retornaTituloLote(nome: string): string{
    return nome === null || nome === '' ? 'Nome do Lote' : nome;
  }

  corrigirFusoInput(): void{
    if (this.evento.dataEvento !== undefined){
      const d = new Date(this.evento.dataEvento);
      const userTimezoneOffset = d.getTimezoneOffset() * 60000;
      const newDate = new Date (d.getTime() - userTimezoneOffset);
      this.evento.dataEvento = newDate.toISOString();
    }
  }
  public removerLote(template: TemplateRef<any>, index: number): void{
    this.loteAtual.id = this.lotes.get(index + '.id').value;
    this.loteAtual.nome = this.lotes.get(index + '.nome').value;
    this.loteAtual.indice = index;

    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});

  }
  confirmDeleteLote(): void{
    this.modalRef.hide();
    this.spinner.show();
    this.loteService.deleteLote(this.eventoId, this.loteAtual.id)
    .subscribe(
      () => {
        this.toastr.success('Lote deleteado com sucesso', 'Sucesso');
        this.lotes.removeAt(this.loteAtual.indice);
      },
      (error: any) => {
        this.toastr.error(`Erro ao tentar deletar o lote ${this.loteAtual.id}`, 'Erro');
        console.error(error);
      }
    ).add(() => this.spinner.hide());
  }
  declineDeleteLote(): void{
    this.modalRef.hide();
  }
  onFileChange(ev: any): void{
    const reader = new FileReader();
    reader.onload = (event: any) => this.imagemURL = event.target.result;
    this.file = ev.target.files;
    reader.readAsDataURL(this.file[0]);
    this.uploadImagem();
  }

  uploadImagem(): void{
    this.spinner.show();
    this.eventoService.postUpload(this.eventoId, this.file).subscribe(
      () => {
        this.carregarEvento();
        this.toastr.success('Imagem atualizada com Sucesso', 'Sucesso!');
      },
      (error: any) => {
        this.toastr.error('Erro ao fazer upload de Imagem', 'Erro!');
        console.error(error);
      }
    ).add(() => this.spinner.hide());
  }

}
