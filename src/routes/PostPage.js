import React, { useState, useEffect } from 'react';
import { Redirect, useParams } from 'react-router';
import { postCollection } from 'fbase';
import { doc, onSnapshot } from 'firebase/firestore';

// Import components
import Post from 'components/Post';
import Header from 'components/Header';
import LikeList from 'components/LikeList';

export default function PostPage({ isLoggedIn, currentUserObject }) {
	// States
	const [isPostDataReady, setIsPostDataReady] = useState(false);
	const [postObject, setPostObject] = useState({});
	const [isLikeListDisplayed, setIsLikeListDisplayed] = useState(false);
	const [likeList, setLikeList] = useState([]);

	// Constants
	const postId = useParams().postId;

	useEffect(async () => {
		const unsubscribe = onSnapshot(doc(postCollection, postId), (doc) => {
			const post = {
				id: doc.id,
				...doc.data(),
			};

			setPostObject(post);
			setIsPostDataReady(true);
		});

		return () => {
			unsubscribe();
		};
	}, []);

	// Other functions
	const toggleLikeListDisplayed = () => {
		setIsLikeListDisplayed((prev) => !prev);
		document.body.classList.toggle('scroll-locked');
	};

	return isLoggedIn ? (
		isPostDataReady ? (
			<>
				<Header currentUserObject={currentUserObject} />
				<div className="post-page-container">
					<Post
						postObject={postObject}
						currentUserObject={currentUserObject}
						toggleLikeListDisplayed={toggleLikeListDisplayed}
						setLikeList={setLikeList}
					/>
					{isLikeListDisplayed && <LikeList toggleLikeListDisplayed={toggleLikeListDisplayed} likeList={likeList} />}
				</div>
			</>
		) : (
			'Loading...'
		)
	) : (
		<Redirect to="/" />
	);
}
