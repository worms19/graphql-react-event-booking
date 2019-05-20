const auhtResolver = require('./auth');
const eventsResolver = require('./events');
const bookingResolver = require('./booking');


const rootResolver = {
    ...auhtResolver,
    ...eventsResolver,
    ...bookingResolver
}

module.exports = rootResolver;