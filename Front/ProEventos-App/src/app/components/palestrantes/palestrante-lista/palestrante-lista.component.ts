import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Pagination, PaginationResult } from '@app/models/Pagination';
import { Palestrante } from '@app/models/Palestrante';
import { PalestranteService } from '@app/services/palestrante.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-palestrante-lista',
  templateUrl: './palestrante-lista.component.html',
  styleUrls: ['./palestrante-lista.component.scss']
})
export class PalestranteListaComponent implements OnInit {
  termoBuscaChanged: Subject<string> = new Subject<string>();
  public palestrantes: Palestrante[] = [];
  public palestranteId = 0;
  public pagination = {} as Pagination;

  constructor(private palestranteService: PalestranteService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router) { }


  ngOnInit() {
    this.pagination = { currentPage: 1, itensPerPage: 3, totalItems: 1 } as Pagination;
    this.carregarPalestrantes();
  }

  public filtrarPalestrantes(evt: any): void{
    if(this.termoBuscaChanged.observers.length == 0){

      this.termoBuscaChanged.pipe(debounceTime(1500)).subscribe(
        filtrarPor =>{
          this.spinner.show();

          this.palestranteService.getPalestrantes(this.pagination.currentPage, this.pagination.itensPerPage, filtrarPor).subscribe(
            (response: PaginationResult<Palestrante[]>) =>{
              this.palestrantes = response.result;
              this.pagination = response.pagination;
            },
            (error: any)=>{
              this.spinner.hide();
              this.toastr.error('Erro ao Carregar os Palestrantes', 'Erro!');
            }

          ).add(() => this.spinner.hide())
        });
      }
      this.termoBuscaChanged.next(evt.value);

  }

  public getImagemURL(imagemName: string): string{
    if(imagemName)
    return environment.apiURL + `resources/perfil/${imagemName}`;
    else
    return './assets/img/perfil.png'
  }

  public carregarPalestrantes(): void{
    this.spinner.show();
    this.palestranteService.getPalestrantes(this.pagination.currentPage, this.pagination.itensPerPage).subscribe({
      next: (response: PaginationResult<Palestrante[]>) => {
       this.palestrantes = response.result,

       this.pagination = response.pagination;
     },
      error: (error: any) => {
        this.spinner.hide();
        this.toastr.error('Erro ao carregar os Palestrantes', 'Erro');
      },
      complete: () => this.spinner.hide()
    });
  }

}
