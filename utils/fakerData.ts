import { faker } from '@faker-js/faker';

// Generates fresh, realistic payloads per call instead of hardcoded literals
// (e.g. 'QA Widget') — request bodies stop colliding across parallel workers
// and specs stop silently relying on one fixed string. Safe for the
// dummyjson/jsonplaceholder write endpoints these feed: they either echo
// back whatever fields are submitted or ignore the body's exact content, so
// randomizing the values doesn't change what a test needs to assert.
export function randomTodo() {
  return {
    todo: faker.lorem.sentence(),
    completed: faker.datatype.boolean(),
    userId: faker.number.int({ min: 1, max: 30 }),
  };
}

export function randomProduct() {
  return {
    title: faker.commerce.productName(),
    price: Number(faker.commerce.price({ min: 1, max: 999 })),
  };
}

export function randomUser() {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    age: faker.number.int({ min: 18, max: 90 }),
  };
}

export function randomPost() {
  return {
    title: faker.lorem.sentence(),
    body: faker.lorem.paragraph(),
    userId: faker.number.int({ min: 1, max: 10 }),
  };
}
