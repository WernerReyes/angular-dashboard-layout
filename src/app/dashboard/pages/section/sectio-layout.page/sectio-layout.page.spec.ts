import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectioLayoutPage } from './sectio-layout.page';

describe('SectioLayoutPage', () => {
  let component: SectioLayoutPage;
  let fixture: ComponentFixture<SectioLayoutPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectioLayoutPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectioLayoutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
