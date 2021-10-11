import React, { useState, useEffect } from 'react';
import { databaseService } from 'fbase';
import { useParams, Redirect } from 'react-router-dom';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';

// Import components
import Tweet from 'components/Tweet';
import Nav from 'components/Nav';

export default function AccountPage({ isLoggedIn, userObject }) {
	let { username } = useParams();
	const [tweetObjects, setTweetObjects] = useState([]);
	const tweetCollection = collection(databaseService, 'tweets');

	useEffect(() => {
		const q = query(tweetCollection, where('ownerUsername', '==', username), orderBy('tweetedAt', 'desc'));
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
	}, [username]);

	return isLoggedIn ? (
		<>
			<Nav userObject={userObject} />
			<h1>@{username}</h1>
			{tweetObjects.map((tweetObject) => (
				<Tweet key={tweetObject.id} tweetObject={tweetObject} currentUserObject={userObject} />
			))}
		</>
	) : (
		<Redirect to="/" />
	);
}
