import React, { useState, useEffect } from 'react';
import { databaseService } from 'fbase';
import { useParams, Redirect } from 'react-router-dom';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import Tweet from 'components/Tweet';

export default function AccountPage({ isLoggedIn }) {
	let { username } = useParams();
	const [tweetObjects, setTweetObjects] = useState([]);
	const tweetCollection = collection(databaseService, 'tweets');

	useEffect(async () => {
		try {
			const q = query(tweetCollection, where('ownerUsername', '==', username), orderBy('tweetedAt', 'desc'));
			const querySnapshot = await getDocs(q);
			const tweets = querySnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));

			setTweetObjects(tweets);
		} catch (error) {
			console.log(error);
		}
	}, [username]);

	return isLoggedIn ? (
		<>
			<h1>@{username}</h1>
			{tweetObjects.map((tweetObject) => (
				<Tweet key={tweetObject.id} tweetObject={tweetObject} />
			))}
		</>
	) : (
		<Redirect to="/" />
	);
}
