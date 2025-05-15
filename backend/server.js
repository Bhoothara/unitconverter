const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/unit', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Define schema and model
const conversionSchema = new mongoose.Schema({
  value: Number,
  fromUnit: String,
  toUnit: String,
  result: Number,
  date: { type: Date, default: Date.now }
});
const Conversion = mongoose.model('Conversion', conversionSchema);

// Handle conversion and save to MongoDB
app.post('/convert', async (req, res) => {
  const { value, fromUnit, toUnit } = req.body;
  let result;
  let resultUnit;

  // Conversion logic
  if (fromUnit === 'cm' && toUnit === 'm') {
    result = value / 100;
    resultUnit = 'm';
  }
  else if (fromUnit === 'm' && toUnit === 'cm') {
    result = value * 100;
    resultUnit = 'cm';
  }
  else if (fromUnit === 'inches' && toUnit === 'cm') {
    result = value * 2.54;
    resultUnit = 'cm';
  }
  else if (fromUnit === 'cm' && toUnit === 'inches') {
    result = value / 2.54;
    resultUnit = 'inches';
  }
  else if (fromUnit === 'feet' && toUnit === 'm') {
    result = value * 0.3048;
    resultUnit = 'm';
  }
  else if (fromUnit === 'm' && toUnit === 'feet') {
    result = value / 0.3048;
    resultUnit = 'feet';
  }
  else if (fromUnit === 'inches' && toUnit === 'feet') {
    result = value / 12;
    resultUnit = 'feet';
  }
  else if (fromUnit === 'feet' && toUnit === 'inches') {
    result = value * 12;
    resultUnit = 'inches';
  }
  else if (fromUnit === 'miles' && toUnit === 'km') {
    result = value * 1.60934;
    resultUnit = 'km';
  }
  else if (fromUnit === 'km' && toUnit === 'miles') {
    result = value / 1.60934;
    resultUnit = 'miles';
  }
  else if (fromUnit === toUnit) {
    result = value;  // No conversion, just return the same value
    resultUnit = fromUnit;
  }
  else {
    return res.status(400).json({ error: 'Conversion not supported yet' });
  }

  // Save to MongoDB
  const conversion = new Conversion({ value, fromUnit, toUnit, result });
  await conversion.save();

  // Return the result with the unit in the correct format
  res.json({ result: `${result} ${resultUnit}` });
});

app.listen(5000, () => {
  console.log('Unit Converter API is running on http://localhost:5000');
});
