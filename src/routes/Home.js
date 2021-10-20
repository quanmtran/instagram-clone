import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { postCollection } from 'fbase';
import { query, onSnapshot, where, orderBy } from 'firebase/firestore';

// Import components
import Post from 'components/Post';
import Header from 'components/Header';
import CurrentUserCard from 'components/CurrentUserCard';
import UserList from 'components/UserList';

export default function Home({ isLoggedIn, currentUserObject, userList, setUserList, isUserListDisplayed, toggleUserListDisplayed }) {
	const [postObjects, setPostObjects] = useState([]);
	const [isPageReady, setIsPageReady] = useState(false);

	// Array of user Ids that current user follows (includes his/her user Id)
	const followingArray = [currentUserObject.userId, ...currentUserObject.followings];

	// Get all posts on component mount
	useEffect(() => {
		let q;

		// Firestore's query limitation: 'in' query only supports array with length of 10 max
		if (followingArray.length > 10) {
			q = query(postCollection, orderBy('postedAt', 'desc'));
		} else {
			q = query(postCollection, where('ownerUserId', 'in', followingArray), orderBy('postedAt', 'desc'));
		}
		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			const posts = querySnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));

			setPostObjects(posts);
			setIsPageReady(true);
		});

		return () => {
			unsubscribe();
		};
	}, []);

	return isLoggedIn ? (
		<>
			{isPageReady ? (
				<>
					<Header currentUserObject={currentUserObject} />
					<div className="homepage-container">
						<CurrentUserCard currentUserObject={currentUserObject} />
						<div className="homepage-content">
							{postObjects.map((postObject) => (
								<Post
									key={postObject.id}
									postObject={postObject}
									currentUserObject={currentUserObject}
									toggleUserListDisplayed={toggleUserListDisplayed}
									setUserList={setUserList}
								/>
							))}
						</div>
					</div>
					{isUserListDisplayed && <UserList toggleUserListDisplayed={toggleUserListDisplayed} userList={userList} />}
				</>
			) : (
				'Loading...'
			)}
		</>
	) : (
		<Redirect to="/" />
	);
}
