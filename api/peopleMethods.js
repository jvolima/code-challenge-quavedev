import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { People } from '../people/people';

Meteor.methods({
  'people.checkIn'(personId) {
    check(personId, String);

    const date = new Date();
    const checkInDate = date.toLocaleDateString('en-US');
    const checkInTime = date.toLocaleTimeString('en-us', { hour12: false, timeStyle: 'short' });

    const checkIn = `${checkInDate}, ${checkInTime}`;

    People.update(personId, {
      $set: {
        checkIn,
      },
    });
  },
});
