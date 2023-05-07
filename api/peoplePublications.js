import { Meteor } from 'meteor/meteor';
import { People } from '../people/people';

Meteor.publish('people', function publishPeople() {
  return People.find({});
});
