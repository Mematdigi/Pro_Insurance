const mongoose = require('mongoose');

const bankSchema = new mongoose.Schema({
  name: String
});

const Bank = mongoose.model('Person', bankSchemaSchema);

// Add a new name
const newBank = new Person({ name: 'HDFC' });
newBank.save();