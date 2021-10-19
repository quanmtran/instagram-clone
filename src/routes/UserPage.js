import React, { useState, useEffect } from 'react';
import { postCollection, userCollection } from 'fbase';
import { useParams, Redirect } from 'react-router-dom';
import { doc, getDoc, query, getDocs, where, orderBy } from 'firebase/firestore';

// Import components
import UserPagePost from 'components/UserPagePost';
import Header from 'components/Header';
import UserInfo from 'components/UserInfo';
import UserPageContentNav from 'components/UserPageContentNav';
import UserList from 'components/UserList';

export default function UserPage({ isLoggedIn, currentUserObject, userList, setUserList, isUserListDisplayed, toggleUserListDisplayed }) {
	// States
	const [postObjects, setPostObjects] = useState([]);
	const [userObject, setUserObject] = useState({});
	const [isLoading, setIsLoading] = useState(true);

	// Constants
	const username = useParams().username;

	useEffect(async () => {
		setIsLoading(true);

		const userId = await getUserId(username);

		// Get user posts
		const q = query(postCollection, where('ownerUserId', '==', userId), orderBy('postedAt', 'desc'));
		const querySnapshot = await getDocs(q);
		const posts = querySnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));

		setPostObjects(posts);

		// Get user data
		const userDocSnap = await getDoc(doc(userCollection, `${userId}`));
		setUserObject(userDocSnap.data());

		setIsLoading(false);
	}, [username]);

	const getUserId = async (username) => {
		try {
			const q = query(userCollection, where('username', '==', username));
			const querySnapshot = await getDocs(q);

			return querySnapshot.docs[0].data().userId;
		} catch (error) {
			console.log(error);
			return '';
		}
	};

	return isLoggedIn ? (
		<>
			{isLoading ? (
				'Loading...'
			) : (
				<>
					<Header currentUserObject={currentUserObject} />
					<div className="user-page-container">
						<UserInfo
							userObject={userObject}
							postObjects={postObjects}
							currentUserObject={currentUserObject}
							setUserList={setUserList}
							toggleUserListDisplayed={toggleUserListDisplayed}
						/>
						<div className="content">
							<UserPageContentNav />
							<div className="content-container">
								{postObjects.map((postObject) => (
									<UserPagePost key={postObject.id} postObject={postObject} currentUserObject={currentUserObject} />
								))}
							</div>
						</div>
					</div>
					{isUserListDisplayed && <UserList toggleUserListDisplayed={toggleUserListDisplayed} userList={userList} />}
				</>
			)}
		</>
	) : (
		<Redirect to="/" />
	);
}
