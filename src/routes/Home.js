import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { postCollection } from 'fbase';

import { query, onSnapshot, orderBy } from 'firebase/firestore';

// Import components
import Post from 'components/Post';
import PostInput from 'components/PostInput';
import Nav from 'components/Nav';

export default function Home({ isLoggedIn, currentUserObject }) {
	const [postObjects, setPostObjects] = useState([]);

	// Display all posts on mount
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
			<Nav currentUserObject={currentUserObject} />
			{/* <img src={userObject.photoURL} height="20px" /> */}
			{/* <div style={{ backgroundImage: userObject.photURL }}></div> */}
			<PostInput currentUserObject={currentUserObject} postCollection={postCollection} />
			{postObjects.map((postObject) => (
				<Post key={postObject.id} postObject={postObject} currentUserObject={currentUserObject} />
			))}
		</>
	) : (
		<Redirect to="/" />
	);
}
