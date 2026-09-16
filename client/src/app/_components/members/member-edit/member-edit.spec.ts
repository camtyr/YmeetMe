import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberEdit } from './member-edit';

describe('MemberEdit', () => {
  let component: MemberEdit;
  let fixture: ComponentFixture<MemberEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
