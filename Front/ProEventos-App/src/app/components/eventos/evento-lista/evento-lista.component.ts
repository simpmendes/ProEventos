import { Pagination, PaginationResult } from './../../../models/Pagination';
import { environment } from './../../../../environments/environment';
import { Router } from '@angular/router';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Evento } from '@app/models/Evento';
import { EventoService } from '@app/services/evento.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-evento-lista',
  templateUrl: './evento-lista.component.html',
  styleUrls: ['./evento-lista.component.scss']
})
export class EventoListaComponent implements OnInit {

  public eventos: Evento[] = [];
  public widthImg: number = 50;
  public marginImg = 2;
  public eventoId = 0;
  public pagination = {} as Pagination;
  public showImg: boolean = true;
  // private _filtroLista: string = '';
  modalRef?: BsModalRef;
  message?: string;

  // public get filtroLista(): string{
  //   return this._filtroLista;
  // }

  // public set filtroLista(value: string){
  //   this._filtroLista = value;
  //   this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
  // }
  termoBuscaChanged: Subject<string> = new Subject<string>();

  public filtrarEventos(evt: any): void{
    if(this.termoBuscaChanged.observers.length == 0){

      this.termoBuscaChanged.pipe(debounceTime(1500)).subscribe(
        filtrarPor =>{
          this.spinner.show();

          this.eventoService.getEventos(this.pagination.currentPage, this.pagination.itensPerPage, filtrarPor).subscribe(
            (response: PaginationResult<Evento[]>) =>{
              this.eventos = response.result;
              this.pagination = response.pagination;
            },
            (error: any)=>{
              this.spinner.hide();
              this.toastr.error('Erro ao Carregar os Eventos', 'Erro!');
            }

          ).add(() => this.spinner.hide())
        });
      }
      this.termoBuscaChanged.next(evt.value);

  }

  constructor(private eventoService: EventoService,
              private modalService: BsModalService,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService,
              private router: Router) { }

  public ngOnInit(): void {
    this.pagination = { currentPage: 1, itensPerPage: 3, totalItems: 1 } as Pagination;
    this.getEventos();
  }

  public alterarImg(): void{
    this.showImg = !this.showImg;
  }

  public mostraImagem(imagemURL: string): string{
    return (imagemURL !== '')
    ? `${environment.apiURL}resources/images/${imagemURL}`
    : '/assets/semImagem.jpeg';
  }

  public getEventos(): void{
    this.spinner.show();
    this.eventoService.getEventos(this.pagination.currentPage, this.pagination.itensPerPage).subscribe({
      next: (response: PaginationResult<Evento[]>) => {
       this.eventos = response.result,

       this.pagination = response.pagination;
     },
      error: (error: any) => {
        this.spinner.hide();
        this.toastr.error('Erro ao carregar os Eventos', 'Erro');
      },
      complete: () => this.spinner.hide()
    });
  }

  openModal(event: any, template: TemplateRef<any>, eventoId: number): void {
    event.stopPropagation();
    this.eventoId = eventoId;
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  public pageChanged(event): void{
    this.pagination.currentPage = event.page;
    this.getEventos();
  }

  confirm(): void {
    this.modalRef?.hide();
    this.spinner.show();
    this.eventoService.deleteEvento(this.eventoId).subscribe(
      (result: any) => {
        if (result.message === 'Deletado'){
        this.toastr.success('O Evento foi deletado com Sucesso.', 'Deletado!');
        this.getEventos();
        }
      },
      (error: any) => {
        console.error(error);
        this.toastr.error(`Erro ao tentar deletar o evento ${this.eventoId}`, 'Erro');
      }
    ).add(() => this.spinner.hide());

  }

  decline(): void {
    this.message = 'Declined!';
    this.modalRef?.hide();
  }
  detalheEvento(id: number): void {
    this.router.navigate([`eventos/detalhe/${id}`]);
  }

}
