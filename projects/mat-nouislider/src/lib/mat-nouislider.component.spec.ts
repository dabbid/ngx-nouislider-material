import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatNouisliderComponent } from './mat-nouislider.component';

describe('MatNouisliderComponent', () => {
  let component: MatNouisliderComponent;
  let fixture: ComponentFixture<MatNouisliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatNouisliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatNouisliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
