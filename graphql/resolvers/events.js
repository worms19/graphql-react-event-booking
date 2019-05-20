
const Event = require('../../models/event');
const User  = require('../../models/user');
const {dateToString} = require('../../helpers/date');
const {user,transformEvent} = require('./merge')



module.exports = {
    events: async () =>{
        try {
            const events = await Event.find();
            return events.map(event => {
                return transformEvent(event);
            });
        }catch (e) {
            throw e;
        }
    },
    createEvent: async (args, req) => {
        if (!req.isAuth){
            throw new Error('Unauthentificated');
        }
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: req.userId,
        });
        let createdEvent;
        try {
            const result = await event.save();
            console.log(result);
            createdEvent = transformEvent(result);
            console.log(createdEvent);

            const creator = await User.findById(req.userId);

            if (!creator) {
                throw new Error('This user doesn\'t exist');
            }
            creator.createdEvents.push(event);
            await creator.save();
            return createdEvent;
        }catch (e) {
            throw e;
        }

    },
};