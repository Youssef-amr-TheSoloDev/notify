import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MobileNavBar } from './mobile-nav-bar';

describe('MobileNavBar', () => {
  let component: MobileNavBar;
  let fixture: ComponentFixture<MobileNavBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileNavBar],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileNavBar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
