export const users = {
  standard: {
    username: process.env.TEST_USERNAME || 'standard_user',
    password: process.env.TEST_PASSWORD || 'secret_sauce',
  },
  lockedOut: {
    username: 'locked_out_user',
    password: 'secret_sauce',
  },
  invalid: {
    username: 'invalid_user',
    password: 'wrong_password',
  },
};

export const products = {
  backpack: 'Sauce Labs Backpack',
  bikeLight: 'Sauce Labs Bike Light',
};

export const shippingInfo = {
  valid: { firstName: 'Damla', lastName: 'Pinar', postalCode: '10001' },
};
