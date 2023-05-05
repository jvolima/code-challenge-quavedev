import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Texts } from '../infra/constants';
import { Communities } from '../communities/communities';

export const App = () => {
  const [communityId, setCommunityId] = useState('');

  /*
    The userTracker is responsible for fetching community data. First, I subscribe to the communities
    publisher to obtain the data. Next, I check the handler for readiness. If the handler isn't ready,
    I set isLoading to true and return an empty communities array. Finally, I fetch the Communities collection.
    Once the data was successfully fetch, I set isLoading to false and return the populated array.
  */
  const { isLoading, communities } = useTracker(() => {
    const handler = Meteor.subscribe('communities');

    if (!handler.ready()) {
      return { isLoading: true, communities: [] };
    }

    const data = Communities.find({}).fetch();

    return { isLoading: false, communities: data };
  });

  return (
    <div>
      <h1>{Texts.HOME_TITLE}</h1>

      {isLoading ? (
        <span>Loading...</span>
      ) : (
        <select value={communityId} onChange={(e) => setCommunityId(e.target.value)} required>
          <option value="" disabled>Select an event</option>
          {communities.map(community => (
            <option key={community._id} value={community._id}>{community.name}</option>
          ))}
        </select>
      )}
    </div>
  );
};
