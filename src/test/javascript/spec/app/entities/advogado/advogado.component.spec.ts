/* tslint:disable max-line-length */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {of} from 'rxjs';
import {HttpHeaders, HttpResponse} from '@angular/common/http';
import {ActivatedRoute, Data} from '@angular/router';

import {ServicosJuridicosTestModule} from '../../../test.module';
import {AdvogadoComponent} from 'app/entities/advogado/advogado.component';
import {AdvogadoService} from 'app/entities/advogado/advogado.service';
import {Advogado} from 'app/shared/model/advogado.model';

describe('Component Tests', () => {
    describe('Advogado Management Component', () => {
        let comp: AdvogadoComponent;
        let fixture: ComponentFixture<AdvogadoComponent>;
        let service: AdvogadoService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ServicosJuridicosTestModule],
                declarations: [AdvogadoComponent],
                providers: [
                    {
                        provide: ActivatedRoute,
                        useValue: {
                            data: {
                                subscribe: (fn: (value: Data) => void) =>
                                    fn({
                                        pagingParams: {
                                            predicate: 'id',
                                            reverse: false,
                                            page: 0
                                        }
                                    })
                            }
                        }
                    }
                ]
            })
            .overrideTemplate(AdvogadoComponent, '')
            .compileComponents();

            fixture = TestBed.createComponent(AdvogadoComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(AdvogadoService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new Advogado(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.listResultQuery[0]).toEqual(jasmine.objectContaining({id: 123}));
        });

        it('should load a page', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new Advogado(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.loadPage(1);

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.listResultQuery[0]).toEqual(jasmine.objectContaining({id: 123}));
        });

        it('should not load a page is the page is the same as the previous page', () => {
            spyOn(service, 'query').and.callThrough();

            // WHEN
            comp.loadPage(0);

            // THEN
            expect(service.query).toHaveBeenCalledTimes(0);
        });

        it('should re-initialize the page', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new Advogado(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.loadPage(1);
            comp.clear();

            // THEN
            expect(comp.page).toEqual(0);
            expect(service.query).toHaveBeenCalledTimes(2);
            expect(comp.listResultQuery[0]).toEqual(jasmine.objectContaining({id: 123}));
        });
    });
});
