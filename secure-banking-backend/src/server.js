const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const { errorHandler, notFound } = require('./middleware/error');
const { generalLimiter } = require('./middleware/ratelimiter');


dotenv.config();


const app = express();
connectDB();


app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({
origin: process.env.CORS_ORIGIN?.split(',').map((s) => s.trim()) || '*',
credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('tiny'));
app.use(generalLimiter);


app.get('/api/health', (req, res) => {
res.json({ status: 'ok', time: new Date().toISOString() });
});


app.use('/api', require('./routes/auth'));
app.use('/api', require('./routes/payment'));
app.use('/api', require('./routes/admin'));


app.use(notFound);
app.use(errorHandler);


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));