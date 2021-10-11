import React, { useState, useEffect } from 'react';
import { postCollection, userCollection } from 'fbase';
import { useParams, Redirect } from 'react-router-dom';
import { query, getDocs, where, orderBy, onSnapshot } from 'firebase/firestore';

// Import components
import Post from 'components/Post';
import Nav from 'components/Nav';

export default function AccountPage({ isLoggedIn, currentUserObject }) {
	// States
	const [postObjects, setPostObjects] = useState([]);

	// Constants
	const currentUsername = useParams().username;

	useEffect(async () => {
		const currentUserId = await getUserId();
		const q = query(postCollection, where('ownerUserId', '==', currentUserId), orderBy('postedAt', 'desc'));
		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			const posts = querySnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));

			setPostObjects(posts);
		});

		return () => {
			unsubscribe();
		};
	}, [currentUsername]);
	
	const getUserId = async () => {
		try {
			const q = query(userCollection, where('username', '==', currentUsername));
			const querySnapshot = await getDocs(q);

			return querySnapshot.docs[0].data().userId;
		} catch (error) {
			console.log(error);
			return '';
		}
	};

	return isLoggedIn ? (
		<>
			<Nav currentUserObject={currentUserObject} />
			<h1>{currentUsername}</h1>
			{postObjects.map((postObject) => (
				<Post key={postObject.id} postObject={postObject} currentUserObject={currentUserObject} />
			))}
		</>
	) : (
		<Redirect to="/" />
	);
}
