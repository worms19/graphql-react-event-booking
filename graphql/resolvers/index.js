const bcrypt = require('bcryptjs');

const Event = require('../../models/event');
const User = require('../../models/user');
const Booking = require('../../models/booking');

const transformEvent = event => {
    return {
        ...event._doc,
        _id: event.id,
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, event.creator)
    };
};

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

  bookings: async () => {
      try {
          const bookings = await Booking.find();
          return  bookings.map(booking => {
             return {
                 ...booking._doc,
                 _id: booking.id,
                 user: user.bind(this, booking._doc.user),
                 event: singleEvent.bind(this, booking._doc.event),
                 createdAt:new Date(booking._doc.createdAt).toISOString(),
                 updatedAt:new Date(booking._doc.updatedAt).toISOString(),
             };
          });
      } catch (e) {
          throw e;
      }
  },
  createEvent: async args => {
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: '5ce1863ab1ef7935c822aa33',
    });
        let createdEvent;
    try {
        const result = await event.save();
        console.log(result);
        createdEvent = transformEvent(result);
        console.log(createdEvent);

        const creator = await User.findById('5ce1863ab1ef7935c822aa33');

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
  createUser: args => User.findOne({ email: args.userInput.email }).then((user) => {
    if (user) {
      throw new Error('User exist already');
    }
    return bcrypt.hash(args.userInput.password, 12);
  })
    .then((hashedPassword) => {
      const user = new User({
        email: args.userInput.email,
        password: hashedPassword,
      });
      return user.save();
    })
    .then(result => ({ ...result._doc, password: null, _id: result.id }))
    .catch((err) => {
      throw err;
    }),
    bookEvent: async args =>{
      const fetchedEvent = await Event.findOne({_id: args.eventId});
      const booking = new Booking({
          user: '5ce1863ab1ef7935c822aa33',
          event: fetchedEvent,


      });
      const result = await booking.save();
      return {
          ...result._doc,
          _id:result.id,
          user: user.bind(this, booking._doc.user),
          event: singleEvent.bind(this, booking._doc.event),
          createdAt:new Date(result._doc.createdAt).toISOString(),
          updatedAt:new Date(result._doc.updatedAt).toISOString(),
      }
    },
    cancelBooking: async args =>{
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
