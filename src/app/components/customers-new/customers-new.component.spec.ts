import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as sinon from "sinon";
import { CustomersNewComponent } from './customers-new.component';
import { CustomersStoreService } from '../../services/customers-store.service';
import { Customer } from '../../models/customer';
import { of } from 'rxjs';

describe('CustomersNewComponent', () => {
  let component: CustomersNewComponent;
  let fixture: ComponentFixture<CustomersNewComponent>;

  const customersFAKE: Customer[] = [
    { id: 999, name: 'Bob', firstTime: true }
  ];

  let customersStoreSvcSTUB: sinon.SinonStubbedInstance<CustomersStoreService>;

  beforeEach(async(() => {

    customersStoreSvcSTUB = sinon.createStubInstance(CustomersStoreService);
    customersStoreSvcSTUB.getNewCustomersOnly.returns(of(customersFAKE));

    TestBed.configureTestingModule({
      declarations: [
        CustomersNewComponent
      ],
      providers: [
        {
          provide: CustomersStoreService,
          useValue: customersStoreSvcSTUB
        }
      ]
    }).compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomersNewComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('startup', () => {

    it('should run init functions', (done) => {

      expect(customersStoreSvcSTUB.getNewCustomersOnly.callCount).toBe(1);

      component.newCustomers$.subscribe((testResult) => {
        expect(testResult).toEqual(customersFAKE);
        done();
      });

    });
  });

});
