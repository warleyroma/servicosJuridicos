import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JhiAlertService, JhiEventManager, JhiParseLinks } from 'ng-jhipster';
import { Principal } from '../../core';
import { ComponentAbstract } from '../../shared/components-abstract/component.abstract';
import { Assunto } from '../../shared/model/assunto.model';
import { AssuntoUtils } from './assunto-utils';
import { ASSUNTO_LIST_MODIFICATION } from './assunto.constants';
import { AssuntoService } from './assunto.service';
import * as _ from 'lodash';
import * as R from 'ramda';

@Component({
    selector: 'assunto-component',
    templateUrl: './assunto.component.html'
})
export class AssuntoComponent extends ComponentAbstract<Assunto> implements OnInit {
    private readonly path = '/assunto';

    constructor(
        private assuntoService: AssuntoService,
        protected principal: Principal,
        protected activatedRoute: ActivatedRoute,
        protected router: Router,
        protected eventManager: JhiEventManager,
        public assuntoUtils: AssuntoUtils,
        protected parseLinks: JhiParseLinks,
        protected jhiAlertService: JhiAlertService
    ) {
        super(
            parseLinks,
            router,
            jhiAlertService,
            principal,
            activatedRoute,
            eventManager
        );
    }

    private createModelConsulta(): void {
        this.modelConsulta = new Assunto();
        this.modelConsulta.ativo = undefined;
    }

    transition(): void {
        super.basicTransition(this.path);
    }

    protected clear() {
        this.listResultQuery = null;
        this.setPageDefault();
        this.router.navigate([this.path]);
    }

    ngOnInit() {
        this.createModelConsulta();
        this.setCurrentAccount();
        this.registerChangeInAssuntos();
    }

    trackId(index: number, item: Assunto) {
        return item.id;
    }

    registerChangeInAssuntos() {
        this.registerChangeInEntidades(ASSUNTO_LIST_MODIFICATION);
    }

    createPesos(): number[] {
        return _.range(1, 6);
    }

    protected query(): void {
        this.sanitizeInputValues();
        this.assuntoService
            .queryByInput(this.modelConsulta, this.getPageable())
            .subscribe(this.onQuerySuccess(), this.onQueryError());
    }

    protected sanitizeInputValues(): void {
        const setDescricacaoNull = () => (this.modelConsulta.descricao = null);
        R.when(_.isEmpty, setDescricacaoNull)(_.trim(this.modelConsulta.descricao));
    }
}
