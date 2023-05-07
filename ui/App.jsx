import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Texts } from '../infra/constants';
import { Communities } from '../communities/communities';
import { People } from '../people/people';

export const App = () => {
  const [communityId, setCommunityId] = useState('');

  /*
    The userTracker is responsible for fetching community data. First, I subscribe to the communities
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

          {isPeopleLoading ? (
            <span className="mt-4">Loading...</span>
          ) : (
            <ul className="mt-6 flex flex-col gap-6">
              {people.map(person => (
                <li key={person._id} className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span>Name: {person.firstName} {person.lastName}</span>
                    {person.companyName && person.title ? (
                      <div className="flex gap-4">
                        <span>Company: {person.companyName}</span>
                        <span>Title: {person.title}</span>
                      </div>
                    ) : ''}
                    <div className="flex gap-4">
                      <time>Check-in: 05/05/2023,20:00</time>
                      <time>Check-out: 05/10/2023,14:00</time>
                    </div>
                  </div>
                  <button className="bg-gray-300 p-2 rounded-md">Check in {person.firstName} {person.lastName}</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
