import { VisitPriceInput, visitPriceOf } from '../visit-price';

// `discountedPriceOf` lives next to a hook that imports the API singletons.
jest.mock('@/api', () => ({ insuranceApi: {} }));

const offer = { price: 6000, serviceName: 'Онлайн-консультация врача' };
const medicService = { price: 12000, service: 'Консультация: Терапевт' };

const input = (overrides: Partial<VisitPriceInput>): VisitPriceInput => ({
  isTelemedicine: false,
  isPaidVisit: false,
  isMedAccountVisit: false,
  telemedicineOffer: null,
  medicService: null,
  servicePrice: null,
  loadingServicePrice: false,
  ...overrides,
});

describe('visitPriceOf — telemedicine', () => {
  it('a paid visit costs the backend price, with no discount and its service name', () => {
    expect(
      visitPriceOf(
        input({
          isTelemedicine: true,
          isPaidVisit: true,
          telemedicineOffer: offer,
          // Whatever the doctor's own service says, it is not what is charged.
          medicService,
          servicePrice: { price: 9500, priceMedAccount: 8075 },
        }),
      ),
    ).toEqual({
      price: 6000,
      discountedPrice: null,
      serviceName: 'Онлайн-консультация врача',
    });
  });

  it('a paid visit has no price until the offer is loaded', () => {
    expect(
      visitPriceOf(
        input({ isTelemedicine: true, isPaidVisit: true, medicService }),
      ),
    ).toBeNull();
  });

  it('a med-account visit shows the backend price, with no discount', () => {
    expect(
      visitPriceOf(
        input({
          isTelemedicine: true,
          isMedAccountVisit: true,
          telemedicineOffer: offer,
          medicService,
          servicePrice: { price: 9500, priceMedAccount: 8075 },
        }),
      ),
    ).toEqual({
      price: 6000,
      discountedPrice: null,
      serviceName: 'Онлайн-консультация врача',
    });
  });

  it('a med-account visit has no price until the offer is loaded', () => {
    expect(
      visitPriceOf(
        input({ isTelemedicine: true, isMedAccountVisit: true, medicService }),
      ),
    ).toBeNull();
  });

  it('a visit under any other programme shows no price', () => {
    expect(
      visitPriceOf(
        input({ isTelemedicine: true, telemedicineOffer: offer, medicService }),
      ),
    ).toBeNull();
  });
});

describe('visitPriceOf — in person', () => {
  it('a paid visit with a med-account discount strikes the full price out', () => {
    expect(
      visitPriceOf(
        input({
          isPaidVisit: true,
          medicService,
          servicePrice: { price: 12000, priceMedAccount: 10200 },
          // Ignored for an in-person visit.
          telemedicineOffer: offer,
        }),
      ),
    ).toEqual({
      price: 12000,
      discountedPrice: 10200,
      serviceName: 'Консультация: Терапевт',
    });
  });

  it('a paid visit without a discount costs the full price', () => {
    expect(visitPriceOf(input({ isPaidVisit: true, medicService }))).toEqual({
      price: 12000,
      discountedPrice: null,
      serviceName: 'Консультация: Терапевт',
    });
  });

  it('a paid visit waits for the discount lookup to settle', () => {
    expect(
      visitPriceOf(
        input({ isPaidVisit: true, medicService, loadingServicePrice: true }),
      ),
    ).toBeNull();
  });

  it('a paid visit has no price without the doctor’s service', () => {
    expect(visitPriceOf(input({ isPaidVisit: true }))).toBeNull();
  });

  it('a med-account visit shows the insurer price', () => {
    expect(
      visitPriceOf(
        input({
          isMedAccountVisit: true,
          medicService,
          servicePrice: { price: 9500, priceMedAccount: 8075 },
        }),
      ),
    ).toEqual({
      price: 9500,
      discountedPrice: 8075,
      serviceName: 'Консультация: Терапевт',
    });
  });

  it('a visit under any other programme shows no price', () => {
    expect(
      visitPriceOf(
        input({
          medicService,
          servicePrice: { price: 9500, priceMedAccount: null },
        }),
      ),
    ).toBeNull();
  });
});
