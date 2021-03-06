import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {faMinus} from '@fortawesome/free-solid-svg-icons';
import * as _ from 'lodash';
import * as R from 'ramda';
import {Observable} from 'rxjs/Observable';
import {BaseEntity} from '../model/base-entity';
import {BasicService} from '../service-commons/basic-service.service';

export abstract class UpdateComponentAbstract<T extends BaseEntity> {

    public model: T;
    public isSaving: boolean;
    public tituloPagina: string;
    protected listModification: string;
    public readonly iconFaMinus = faMinus;

    constructor(protected service: BasicService<T>, protected activatedRoute: ActivatedRoute) {
        this.isSaving = false;
    }

    protected onInit(): void {
        this.isSaving = false;
        this.subscribeModelRoute();
    }

    protected defineTituloPagina(titulo: string): void {
        const setTituloEditar = () => (this.tituloPagina = 'Editar ' + titulo);
        const setTituloCadastrar = () => (this.tituloPagina = 'Cadastrar ' + titulo);
        R.ifElse(_.isNumber, setTituloEditar, setTituloCadastrar)(this.model.id);
    }

    private subscribeModelRoute(): void {
        this.activatedRoute.data.subscribe(({model}) => (this.model = model));
    }

    previousState(): void {
        window.history.back();
    }

    save(): void {
        this.isSaving = true;
        const id = this.model.id;
        const create = this.subscribeToCreate();
        const update = this.subscribeToUpdate();
        R.ifElse(_.isNumber, update, create)(id);
    }

    private subscribeToCreate() {
        return this.subscribeToSaveResponse(this.service.create(this.model));
    }

    private subscribeToUpdate() {
        return this.subscribeToSaveResponse(this.service.update(this.model));
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<T>>) {
        return () => result.subscribe(this.onSaveSuccess(), this.onSaveError());
    }

    private onSaveSuccess() {
        return (res: HttpResponse<T>) => {
            this.isSaving = false;
            this.previousState();
        };
    }

    private onSaveError() {
        return (error: HttpErrorResponse) => {
            this.isSaving = false;
        };
    }
}
