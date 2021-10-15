import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { postCollection } from 'fbase';
import { query, onSnapshot, orderBy } from 'firebase/firestore';

// Import components
import Post from 'components/Post';
import Header from 'components/Header';
import CurrentUserCard from 'components/CurrentUserCard';

export default function Home({ isLoggedIn, currentUserObject }) {
	const [postObjects, setPostObjects] = useState([]);

	// Get all posts on component mount
	useEffect(() => {
		const q = query(postCollection, orderBy('postedAt', 'desc'));
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
	}, []);

	return isLoggedIn ? (
		<>
			<Header currentUserObject={currentUserObject} />
			<div className="homepage-container">
				<CurrentUserCard currentUserObject={currentUserObject} />
				<div className="homepage-content">
					{postObjects.map((postObject) => (
						<Post key={postObject.id} postObject={postObject} currentUserObject={currentUserObject} />
					))}
				</div>
			</div>
		</>
	) : (
		<Redirect to="/" />
	);
}
