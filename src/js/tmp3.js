// import createTypedField from './helpers/createTypedField.js';

// const z = {};
// createTypedField({ object: z, fieldName: 'string', type: String, initValue: 'asdf' });
// console.log(z);


const array = [1, 1, 1, 1];
console.log({ ...array });
console.log(Object.keys({ ...array }));
