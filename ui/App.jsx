import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Texts } from '../infra/constants';
import { Communities } from '../communities/communities';
import { People } from '../people/people';
import { formatDate } from '../utils/formatDate';
import { timePassedInSeconds } from '../utils/timePassedInSeconds';

export const App = () => {
  const [communityId, setCommunityId] = useState('');
  const [, setReload] = useState(false);

  /*
    This userTracker is responsible for fetching community data. First, I subscribe to the communities
    publisher to obtain the data. Next, I check the handler for readiness. If the handler isn't ready,
    I set isLoading to true and return an empty communities array. Finally, I fetch the Communities collection.
    Once the data was successfully fetch, I set isLoading to false and return the populated array.
  */

  const { communities, isCommuitiesLoading } = useTracker(() => {
    const communitiesHandler = Meteor.subscribe('communities');

    if (!communitiesHandler.ready()) {
      return { isCommuitiesLoading: true, communities: [] };
    }

    const communitiesData = Communities.find({}).fetch();

    return { isCommuitiesLoading: false, communities: communitiesData };
  });

  /*
    This userTracker is responsible for fetching people data. First I check if there is any community id,
    because if not there is no way to search for people in the community. After that I subscribe to the people
    publisher to obtain the data. Next, I check the handler for readiness. If the handler isn't ready,
    I set isLoading to true and return an empty people array. Finally, I fetch the People collection passing the community id.
    Once the data was successfully fetch, I set isLoading to false and return the populated array.
  */

  const { people, isPeopleLoading } = useTracker(() => {
    if (!communityId) {
      return { isPeopleLoading: false, people: [] };
    }

    const peopleHandler = Meteor.subscribe('people');

    if (!peopleHandler.ready()) {
      return { isPeopleLoading: true, people: [] };
    }

    const peopleData = People.find({ communityId }).fetch();

    return { isPeopleLoading: false, people: peopleData };
  });

  // This function is to return the text of the button, so just need to return 'in' or 'out'.

  function checkText(checkIn) {
    if (!checkIn) {
      return 'in';
    }

    return 'out';
  }

  /*
    This function is responsible for checking if the button will be shown or not. First it checks if
    the user has already checked out to return false, then check if the user has checked in and the
    time passed is less than 5, if the person does not match these conditions, the function returns true
  */

  function showButton(person) {
    if (person.checkOut) {
      return false;
    }

    if (person.checkIn && timePassedInSeconds(new Date(person.checkIn)) < 5) {
      return false;
    }

    return true;
  }

  /*
    This function receives the person as a parameter and is responsible for calling either
    the checkIn or checkOut function. First, it checks if the person has already checkedIn,
    if not, it calls the checkIn function and gives a 5 second timeout to reload the screen
    and show the checkOut button, if the person has already checkedOut, the function will call the function checkout.
  */

  function handleCheck(person) {
    if (!person.checkIn) {
      Meteor.call('people.checkIn', person._id);
      setTimeout(() => {
        setReload(oldState => !oldState);
      }, 5000);
      return;
    }

    Meteor.call('people.checkOut', person._id);
  }

  function peopleInTheEvent() {
    return people.filter(person => person.checkIn && !person.checkOut).length;
  }

  function peopleNotCheckedIn() {
    return people.filter(person => !person.checkIn).length;
  }

  function peopleByCompanyInTheEvent() {
    const peopleIn = people.filter(person => person.checkIn && !person.checkOut);

    let companies = [];

    peopleIn.forEach(person => {
      const { companyName } = person;

      if (!companyName) {
        return;
      }

      const companyNameAlreadyInList = companies.findIndex(name => name.includes(companyName));

      if (companyNameAlreadyInList !== -1) {
        const companiesCopy = [...companies];

        const [, companyNumberWithParentheses] = companiesCopy[companyNameAlreadyInList].split(/(?<=\D)(?=\d)/);
        const companyNumber = Number(companyNumberWithParentheses.replace('(', '').replace(')', ''));

        companiesCopy[companyNameAlreadyInList] = `${companyName} (${companyNumber + 1})`;
        companies = [...companiesCopy];
        return;
      }

      companies.push(`${companyName} (1)`);
    });

    return companies;
  }

  return (
    <div className="max-w-7xl w-full mx-auto my-12">
      <h1 className="text-3xl">{Texts.HOME_TITLE}</h1>

      {isCommuitiesLoading ? (
        <span>Loading...</span>
      ) : (
        <div className="mt-6 flex flex-col">
          <select value={communityId} onChange={(e) => setCommunityId(e.target.value)} required>
            <option value="" disabled>Select an event</option>
            {communities.map(community => (
              <option key={community._id} value={community._id}>{community.name}</option>
            ))}
          </select>

          {!isPeopleLoading && communityId && (
            <div className="flex flex-col my-10">
              <strong>People in the event right now: {peopleInTheEvent()}</strong>
              <strong>People by company in the event right now: {peopleByCompanyInTheEvent().join(' ')}</strong>
              <strong>People not checked-in: {peopleNotCheckedIn()}</strong>
            </div>
          )}

          {isPeopleLoading ? (
            <span className="mt-4">Loading...</span>
          ) : (
            <ul className="flex flex-col gap-6">
              {people.map(person => (
                <li key={person._id} className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span>Name: {person.firstName} {person.lastName}</span>
                    {person.companyName && person.title && (
                      <div className="flex gap-4">
                        <span>Company: {person.companyName}</span>
                        <span>Title: {person.title}</span>
                      </div>
                    )}
                    <div className="flex gap-4">
                      <time>Check-in: {person.checkIn ? formatDate(new Date(person.checkIn)) : 'N/A'}</time>
                      <time>Check-out: {person.checkOut ? formatDate(new Date(person.checkOut)) : 'N/A'}</time>
                    </div>
                  </div>
                  {showButton(person) === true && (
                    <button onClick={() => handleCheck(person)} className="bg-gray-300 p-2 rounded-md">
                      Check {checkText(person.checkIn)} {person.firstName} {person.lastName}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
