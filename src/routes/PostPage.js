import React, { useState, useEffect } from 'react';
import { Redirect, useParams } from 'react-router';
import { postCollection } from 'fbase';
import { doc, onSnapshot } from 'firebase/firestore';

// Import components
import Post from 'components/Post';
import Header from 'components/Header';
import UserList from 'components/UserList';

export default function PostPage({ isLoggedIn, currentUserObject, userList, setUserList, isUserListDisplayed, toggleUserListDisplayed }) {
	// States
	const [isPostDataReady, setIsPostDataReady] = useState(false);
	const [postObject, setPostObject] = useState({});

	// Constants
	const postId = useParams().postId;

	useEffect(() => {
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

	return isLoggedIn ? (
		isPostDataReady ? (
			<>
				<Header currentUserObject={currentUserObject} />
				<div className="post-page-container">
					<Post
						postObject={postObject}
						currentUserObject={currentUserObject}
						toggleUserListDisplayed={toggleUserListDisplayed}
						setUserList={setUserList}
					/>
				</div>
				{isUserListDisplayed && <UserList toggleUserListDisplayed={toggleUserListDisplayed} userList={userList} />}
			</>
		) : (
			'Loading...'
		)
	) : (
		<Redirect to="/" />
	);
}
