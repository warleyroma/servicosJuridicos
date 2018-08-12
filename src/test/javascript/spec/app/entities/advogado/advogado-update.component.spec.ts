/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { ServicosJuridicosTestModule } from '../../../test.module';
import { AdvogadoUpdateComponent } from 'app/entities/advogado/advogado-update.component';
import { AdvogadoService } from 'app/entities/advogado/advogado.service';
import { Advogado } from 'app/shared/model/advogado.model';

describe('Component Tests', () => {
    describe('Advogado Management Update Component', () => {
        let comp: AdvogadoUpdateComponent;
        let fixture: ComponentFixture<AdvogadoUpdateComponent>;
        let service: AdvogadoService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ServicosJuridicosTestModule],
                declarations: [AdvogadoUpdateComponent]
            })
                .overrideTemplate(AdvogadoUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(AdvogadoUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(AdvogadoService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new Advogado(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.advogado = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.update).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );

            it(
                'Should call create service on save for new entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new Advogado();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.advogado = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.create).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );
        });
    });
});