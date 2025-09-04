const notFound = (req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
    };
    
    
    const errorHandler = (err, req, res, next) => {
    console.error(err); // In prod, send to log aggregator
    const status = err.statusCode || 500;
    res.status(status).json({ message: err.message || 'Server error' });
    };
    
    
    module.exports = { errorHandler, notFound };