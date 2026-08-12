// server/models/index.js
// Registers every schema with mongoose in one place, regardless of which
// routes are mounted - cross-model hooks (e.g. Item's cascade cleanup
// calling mongoose.model('LaundryLoad')) need every schema loaded
// somewhere, and this keeps that centralized instead of a one-off require
// per model wherever the gap happens to surface.
require('./Closet');
require('./Item');
require('./LaundryLoad');
