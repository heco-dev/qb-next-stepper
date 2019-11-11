import { TestBed } from '@angular/core/testing';
import * as sinon from 'sinon';
import { of } from 'rxjs';
import { CustomersService } from './customers.service';
import { CustomersStoreService } from './customers-store.service';
import { Customer } from '../models/customer';
import { CustomersControllerService } from '../../externals/customers-controller.service';

describe('CustomersService', () => {
  let service: CustomersService;

  let customersControllerSvcSTUB: sinon.SinonStubbedInstance<CustomersControllerService>;
  let customersStoreSvcSTUB: sinon.SinonStubbedInstance<CustomersStoreService>;

  beforeEach(() => {

    customersControllerSvcSTUB = sinon.createStubInstance(CustomersControllerService);
    customersStoreSvcSTUB = sinon.createStubInstance(CustomersStoreService);

    TestBed.configureTestingModule({
      providers: [
        {
          provide: CustomersControllerService,
          useValue: customersControllerSvcSTUB
        },
        {
          provide: CustomersStoreService,
          useValue: customersStoreSvcSTUB
        }
      ]
    });

    service = TestBed.get(CustomersService);

  });

  afterEach(() => {
    sinon.restore();
  });

  describe('getAllCustomers', () => {

    const customersFAKE: Customer[] = [{ id: 999, name: 'foo', firstTime: false }];

    it('should get data from server and put into local store', () => {

      customersControllerSvcSTUB.getCustomers.returns(of(customersFAKE));

      service.storeAllCustomers();

      expect(customersControllerSvcSTUB.getCustomers.callCount).toBe(1);
      expect(customersStoreSvcSTUB.setCustomers.calledWith(customersFAKE)).toBe(true);

    });

  });
});
