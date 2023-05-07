import { Meteor } from 'meteor/meteor';
import { loadInitialData } from '../infra/initial-data';
import '../api/communitiesPublications';
import '../api/peoplePublications';

Meteor.startup(() => {
  // DON'T CHANGE THE NEXT LINE
  loadInitialData();

  // YOU CAN DO WHATEVER YOU WANT HERE
});
