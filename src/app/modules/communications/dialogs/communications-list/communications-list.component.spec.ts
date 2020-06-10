import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunicationsListComponent } from './communications-list.component';

describe('CommunicationsListComponent', () => {
  let component: CommunicationsListComponent;
  let fixture: ComponentFixture<CommunicationsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CommunicationsListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunicationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
