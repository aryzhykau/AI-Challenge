const { Schema } = require('../src/schema');

// --- String Validator Example ---
const nameSchema = Schema.string().minLength(2, 'Name must be at least 2 characters long.');
const nameResult = nameSchema.validate('Al');
console.log('Name validation passed:', nameResult.isValid); // true

const failedNameResult = nameSchema.validate('A');
console.log('Name validation failed:', failedNameResult.errors); // ['Name must be at least 2 characters long.']

// --- Number Validator Example ---
const ageSchema = Schema.number().min(18, 'Must be 18 or older.').max(100);
const ageResult = ageSchema.validate(25);
console.log('Age validation passed:', ageResult.isValid); // true

const failedAgeResult = ageSchema.validate(17);
console.log('Age validation failed:', failedAgeResult.errors); // ['Must be 18 or older.']

// --- Boolean Validator Example ---
const activeSchema = Schema.boolean().required('isActive is required.');
const activeResult = activeSchema.validate(true);
console.log('Boolean validation passed:', activeResult.isValid); // true

const failedActiveResult = activeSchema.validate(null);
console.log('Boolean validation failed:', failedActiveResult.errors); // ['isActive is required.']

// --- Date Validator Example ---
const dateSchema = Schema.date().min(new Date('2023-01-01'), 'Date must be after 2023.');
const dateResult = dateSchema.validate(new Date('2024-05-21'));
console.log('Date validation passed:', dateResult.isValid); // true

const failedDateResult = dateSchema.validate(new Date('2022-12-31'));
console.log('Date validation failed:', failedDateResult.errors); // ['Date must be after 2023.'] 