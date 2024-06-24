const express = require('express');
const connectDB = require('./config.js/db');
const cors = require('cors');

require('dotenv').config();

const app = express();

connectDB();

app.use(express.json({ extended: false }));
app.use(cors());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));