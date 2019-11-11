import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as sinon from "sinon";
import { AppComponent } from './app.component';
import { CustomersService } from './services/customers.service';
import { CustomersComponent } from './components/customers/customers.component';
import { CustomersNewComponent } from './components/customers-new/customers-new.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let customersSvcSTUB: sinon.SinonStubbedInstance<CustomersService>;

  beforeEach(async(() => {
    customersSvcSTUB = sinon.createStubInstance(
      CustomersService
    );
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        CustomersComponent,
        CustomersNewComponent
      ],
      providers: [
        {
          provide: CustomersService,
          useValue: customersSvcSTUB
        }
      ]
    }).compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('constructor', () => {

    it('should run init functions', () => {

      expect(customersSvcSTUB.storeAllCustomers.callCount).toBe(1);

    });
  });

});
