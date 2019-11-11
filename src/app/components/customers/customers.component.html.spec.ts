import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import * as sinon from "sinon";
import { CustomersComponent } from './customers.component';
import { Customer } from '../../models/customer';
import { CustomersStoreService } from '../../services/customers-store.service';
import { of } from 'rxjs';

describe('CustomersComponentHTML', () => {
  let component: CustomersComponent;
  let fixture: ComponentFixture<CustomersComponent>;
  let html: HTMLElement

  const customersFAKE: Customer[] = [
    { id: 123, name: 'Billy', firstTime: false },
    { id: 456, name: 'Jo', firstTime: false },
    { id: 999, name: 'Bob', firstTime: true }
  ];

  beforeEach(async(() => {

    const customersStoreSvcSTUB = sinon.createStubInstance(CustomersStoreService);
    customersStoreSvcSTUB.getCustomers.returns(of(customersFAKE));

    TestBed.configureTestingModule({
      declarations: [
        CustomersComponent
      ],
      providers: [
        {
          provide: CustomersStoreService,
          useValue: customersStoreSvcSTUB
        }
      ],
      imports: []
    }).compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomersComponent);
    component = fixture.componentInstance;
    html = fixture.nativeElement;
  });

  afterEach(() => sinon.restore());

  it('should render 3 elements in the unordered list', () => {

    fixture.detectChanges();

    const nodeList = html.querySelectorAll("li");
    // nodeList[2].outerHTML //?
    // console.log(nodeList[2].outerHTML);

    expect(nodeList.length).toBe(3);
    expect(nodeList[1].innerHTML.trim()).toBe('Jo (id: 456)');

  });

  it('should show list empty message to user', () => {

    component.customers$ = undefined;

    fixture.detectChanges();

    const spanEle = html.querySelector("span");
    // spanEle.innerHTML //?

    expect(spanEle.innerHTML.trim()).toBe('fetching customer data...');

  });

});
