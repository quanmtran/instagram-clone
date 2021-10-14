import React, { useState, useEffect } from 'react';
import { Redirect, useParams } from 'react-router';
import { postCollection } from 'fbase';
import { doc, getDoc } from 'firebase/firestore';

// Import components
import Post from 'components/Post';
import Header from 'components/Header';

export default function PostPage({ isLoggedIn, currentUserObject }) {
	// States
	const [isPostDataReady, setIsPostDataReady] = useState(false);
	const [postObject, setPostObject] = useState({});

	// Constants
	const postId = useParams().postId;

	useEffect(async () => {
		const postDocSnap = await getDoc(doc(postCollection, postId));
		setPostObject({
			id: postDocSnap.id,
			...postDocSnap.data(),
		});

		setIsPostDataReady(true);
	}, []);

	return isLoggedIn ? (
		isPostDataReady ? (
			<>
				<Header currentUserObject={currentUserObject} />
				<div className="post-page-container">
					<Post postObject={postObject} currentUserObject={currentUserObject} />
				</div>
			</>
		) : (
			'Loading...'
		)
	) : (
		<Redirect to="/" />
	);
}
