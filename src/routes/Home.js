import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { databaseService } from 'fbase';

import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';

// Import components
import Tweet from 'components/Tweet';
import TweetInput from 'components/TweetInput';
import Nav from 'components/Nav';

export default function Home({ isLoggedIn, userObject }) {
	const [tweetObjects, setTweetObjects] = useState([]);
	const tweetCollection = collection(databaseService, 'tweets');

	useEffect(() => {
		const q = query(tweetCollection, orderBy('tweetedAt', 'desc'));
		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			const tweets = querySnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));

			setTweetObjects(tweets);
		});

		return () => {
			unsubscribe();
		};
	}, []);

	return isLoggedIn ? (
		<>
			<Nav userObject={userObject} />
			<img src={userObject.photoURL} height="20px" />
			{/* <div style={{ backgroundImage: userObject.photURL }}></div> */}
			<TweetInput userObject={userObject} tweetCollection={tweetCollection} />
			{tweetObjects.map((tweetObject) => (
				<Tweet key={tweetObject.id} tweetObject={tweetObject} currentUserObject={userObject} />
			))}
		</>
	) : (
		<Redirect to="/" />
	);
}
