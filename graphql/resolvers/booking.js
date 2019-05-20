
const Event = require('../../models/event');
const Booking = require('../../models/booking');
const {dateToString} = require('../../helpers/date');
const {transformBookings,transformEvent} = require('./merge')



module.exports = {


    bookings: async () => {
        try {
            const bookings = await Booking.find();
            return  bookings.map(booking => {
                return transformBookings(booking);
            });
        } catch (e) {
            throw e;
        }
    },
    bookEvent: async (args, req) => {
        if (!req.isAuth){
            throw new Error('Unauthentificated');
        }
        const fetchedEvent = await Event.findOne({_id: args.eventId});
        const booking = new Booking({
            user:  req.userId,
            event: fetchedEvent,


        });
        const result = await booking.save();
        return transformBookings(result);

    },
    cancelBooking: async (args, req) => {
        if (!req.isAuth){
            throw new Error('Unauthentificated');
        }
        try{
            const booking = await Booking.findById(args.bookingId).populate('event');
            const event = transformEvent(booking.event);
            await Booking.deleteOne({_id: args.bookingId});
            return event;
        }catch (e) {
            throw e;
        }
    }
};
