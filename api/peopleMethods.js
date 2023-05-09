import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { People } from '../people/people';

Meteor.methods({
  'people.checkIn'(personId) {
    check(personId, String);

    /* const date = new Date();
    const checkInDate = date.toLocaleDateString('en-US');
    const checkInTime = date.toLocaleTimeString('en-us', { hour12: false, timeStyle: 'short' });

    const checkIn = `${checkInDate}, ${checkInTime}`; */

    People.update(personId, {
      $set: {
        checkIn: new Date().getTime(),
      },
    });
  },

  'people.checkOut'(personId) {
    check(personId, String);

    /* const date = new Date();
    const checkOutDate = date.toLocaleDateString('en-US');
    const checkOutTime = date.toLocaleTimeString('en-us', { hour12: false, timeStyle: 'short' });

    const checkOut = `${checkOutDate}, ${checkOutTime}`; */

    People.update(personId, {
      $set: {
        checkOut: new Date().getTime(),
      },
    });
  },
});
