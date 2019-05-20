const Event = require('../../models/event')
const User = require('../../models/user')
const {dateToString} = require('../../helpers/date');


const events = async eventIds => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } });
        return events.map(event => {
            return transformEvent(event);
        });
    }catch (e) {
        throw e;
    }
};

const singleEvent = async eventId => {
    try {
        const event = await Event.findById(eventId);
        return transformEvent(event);
    }catch (e) {
        throw e;
    }
};

const user = async (userId) => {
    try {
        const userFound = await User.findById(userId);
        return {
            ...userFound._doc,
            _id: userFound.id,
            createdEvent: events.bind(this, userFound._doc.createdEvent),
        };
    } catch (err) {
        throw err;
    }
};


const transformBookings = bookings => {
    return {
        ...booking._doc,
        _id: booking.id,
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
        createdAt:dateToString(booking._doc.createdAt),
        updatedAt:dateToString(booking._doc.updatedAt)
    };
};

const transformEvent = event => {
    return {
        ...event._doc,
        _id: event.id,
        date: dateToString(event._doc.date),
        creator: user.bind(this, event.creator)
    };
};


exports.user= user;
exports.events = events;
exports.singleEvent = singleEvent;
exports.transformEvent = transformEvent;
exports.transformBookings = transformBookings;