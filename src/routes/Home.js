import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { postCollection } from 'fbase';

import { query, onSnapshot, orderBy } from 'firebase/firestore';

// Import components
import HomepagePost from 'components/HomepagePost';
import PostInput from 'components/PostInput';
import Header from 'components/Header';

export default function Home({ isLoggedIn, currentUserObject }) {
	const [postObjects, setPostObjects] = useState([]);

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
				<PostInput currentUserObject={currentUserObject} postCollection={postCollection} />
				<div className="homepage-content">
					{postObjects.map((postObject) => (
						<HomepagePost key={postObject.id} postObject={postObject} currentUserObject={currentUserObject} />
					))}
				</div>
			</div>
		</>
	) : (
		<Redirect to="/" />
	);
}
