import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ICoordenacaoJuridica } from 'app/shared/model/coordenacao-juridica.model';
import { CoordenacaoJuridicaService } from './coordenacao-juridica.service';

@Component({
    selector: 'jhi-coordenacao-juridica-delete-dialog',
    templateUrl: './coordenacao-juridica-delete-dialog.component.html'
})
export class CoordenacaoJuridicaDeleteDialogComponent {
    coordenacaoJuridica: ICoordenacaoJuridica;

    constructor(
        private coordenacaoJuridicaService: CoordenacaoJuridicaService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.coordenacaoJuridicaService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'coordenacaoJuridicaListModification',
                content: 'Deleted an coordenacaoJuridica'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-coordenacao-juridica-delete-popup',
    template: ''
})
export class CoordenacaoJuridicaDeletePopupComponent implements OnInit, OnDestroy {
    private ngbModalRef: NgbModalRef;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ coordenacaoJuridica }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(CoordenacaoJuridicaDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.coordenacaoJuridica = coordenacaoJuridica;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate([{ outlets: { popup: null } }], { replaceUrl: true, queryParamsHandling: 'merge' });
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate([{ outlets: { popup: null } }], { replaceUrl: true, queryParamsHandling: 'merge' });
                        this.ngbModalRef = null;
                    }
                );
            }, 0);
        });
    }

    ngOnDestroy() {
        this.ngbModalRef = null;
    }
}
