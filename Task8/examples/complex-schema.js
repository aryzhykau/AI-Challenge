const { Schema } = require('../src/schema');

// --- Object and Array Validator Example ---

const orderSchema = Schema.object({
  orderId: Schema.string().required(),
  items: Schema.array(
    Schema.object({
      productId: Schema.string().required(),
      quantity: Schema.number().positive('Quantity must be positive.'),
      price: Schema.number().min(0.01, 'Price must be at least 0.01.')
    })
  ).minLength(1, 'Order must contain at least one item.'),
  customer: Schema.object({
    name: Schema.string().required(),
    email: Schema.email().required('A valid email is required for the customer.'),
    shippingAddress: Schema.string().optional()
  }).required()
});

// --- Valid Data Example ---
const validOrder = {
  orderId: 'ORD-12345',
  items: [
    { productId: 'PROD-001', quantity: 2, price: 9.99 },
    { productId: 'PROD-002', quantity: 1, price: 19.99 }
  ],
  customer: {
    name: 'Jane Doe',
    email: 'jane.doe@example.com'
  }
};

const validResult = orderSchema.validate(validOrder);
console.log('Valid order validation passed:', validResult.isValid); // true

// --- Invalid Data Example ---
const invalidOrder = {
  orderId: 'ORD-12346',
  items: [
    { productId: 'PROD-003', quantity: -1, price: 15.00 } // Invalid quantity
  ],
  customer: {
    name: 'John Smith',
    email: 'john.smith' // Invalid email
  }
};

const invalidResult = orderSchema.validate(invalidOrder);
console.log('Invalid order validation passed:', invalidResult.isValid); // false
console.log('Validation errors:', invalidResult.errors);
// Expected output:
// Validation errors: [
//   'Index 0: Quantity must be positive.',
//   'A valid email is required for the customer.'
// ] 