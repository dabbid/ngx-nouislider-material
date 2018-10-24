import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NouisliderComponent } from './nouislider.component';

describe('NouisliderComponent', () => {
  let component: NouisliderComponent;
  let fixture: ComponentFixture<NouisliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NouisliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NouisliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
