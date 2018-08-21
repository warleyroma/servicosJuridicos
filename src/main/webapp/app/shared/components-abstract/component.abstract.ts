import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faMinus } from '@fortawesome/free-solid-svg-icons';
import * as _ from 'lodash';
import { JhiAlertService, JhiEventManager, JhiParseLinks } from 'ng-jhipster';
import * as R from 'ramda';
import { Subscription } from 'rxjs/Subscription';
import { ITEMS_PER_PAGE } from '..';
import { Principal } from '../../core';
import { BaseEntity } from '../model/base-entity';
import { BasicService } from '../service-commons/basic-service.service';

export abstract class ComponentAbstract<T extends BaseEntity> implements OnDestroy {
    page: any;
    links: any;
    error: any;
    success: any;
    reverse: any;
    predicate: any;
    routeData: any;
    totalItems: any;
    queryCount: any;
    modelConsulta: T;
    previousPage: any;
    currentAccount: any;
    listResultQuery: T[];
    itemsPerPage: number;
    eventSubscriber: Subscription;
    protected hasMadeQuery: boolean;
    public readonly iconFaMinus: IconDefinition = faMinus;

    constructor(
        protected service: BasicService<T>,
        protected parseLinks: JhiParseLinks,
        protected router: Router,
        protected jhiAlertService: JhiAlertService,
        protected principal: Principal,
        protected activatedRoute: ActivatedRoute,
        protected eventManager: JhiEventManager
    ) {
        this.setRouteData();
        this.itemsPerPage = ITEMS_PER_PAGE;
    }

    protected onInit(): void {
        this.createModelConsulta();
        this.setCurrentAccount();
    }

    private setRouteData(): void {
        this.routeData = this.activatedRoute.data.subscribe(({ pagingParams }) => {
            this.page = pagingParams.page;
            this.previousPage = pagingParams.page;
            this.reverse = pagingParams.ascending;
            this.predicate = pagingParams.predicate;
        });
    }

    loadPage(page: number) {
        const previusPageNotEq = _.negate(R.equals(this.previousPage));
        const changePage = pg => {
            this.previousPage = pg;
            this.transition();
        };
        R.when(previusPageNotEq, changePage)(page);
    }

    protected findResults(): boolean {
        return !_.isEmpty(this.listResultQuery);
    }

    protected setPageDefault(): void {
        this.page = 1;
        this.setPredicateDefault();
    }

    protected setPredicateDefault(): void {
        this.predicate = 'id';
    }

    private getSort(): any {
        const order = this.reverse ? 'asc' : 'desc';
        const result = [this.predicate + ',' + order];
        const predicateNotEqId = _.negate(R.equals(this.predicate));
        const resultPushId = () => result.push('id');
        R.when(predicateNotEqId, resultPushId)('id');
        return result;
    }

    protected getPageable(): any {
        return {
            page: this.page - 1,
            size: this.itemsPerPage,
            sort: this.getSort()
        };
    }

    protected onQuerySuccess() {
        return (response: HttpResponse<T[]>) => {
            this.hasMadeQuery = true;
            const headers = response.headers;
            this.links = this.parseLinks.parse(headers.get('link'));
            this.totalItems = parseInt(headers.get('X-Total-Count'), 10);
            this.queryCount = this.totalItems;
            this.listResultQuery = response.body;
        };
    }

    protected onQueryError() {
        return (res: HttpErrorResponse) => this.onError(res.message);
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    protected getNavigationExtras() {
        const order = this.reverse ? 'asc' : 'desc';
        return {
            queryParams: {
                page: this.page,
                size: this.itemsPerPage,
                sort: this.predicate + ',' + order
            }
        };
    }

    protected basicTransition(route: string) {
        const navigationExtras = this.getNavigationExtras();
        this.router.navigate([route], navigationExtras);
        this.query();
    }

    protected setCurrentAccount(): void {
        this.principal.identity()
                      .then(account => (this.currentAccount = account));
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    protected registerChangeInEntidades(listModificationName: string) {
        const onSuccessQuery = response => this.query();
        this.eventSubscriber = this.eventManager.subscribe(listModificationName, onSuccessQuery);
    }

    protected clear(path: string) {
        this.listResultQuery = null;
        this.setPageDefault();
        this.hasMadeQuery = false;
        this.router.navigate([path]);
    }

    trackId(index: number, item: T) {
        return item.id;
    }

    protected abstract sanitizeInputValues(): void;

    protected query(): void {
        this.sanitizeInputValues();
        this.service.queryByInput(this.modelConsulta, this.getPageable())
                    .subscribe(this.onQuerySuccess(), this.onQueryError());
    }

    abstract transition(): void;

    protected abstract createModelConsulta(): void;
}
