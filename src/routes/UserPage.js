import React, { useState, useEffect } from 'react';
import { databaseService, postCollection, userCollection } from 'fbase';
import { useParams, Redirect } from 'react-router-dom';
import { doc, getDoc, query, getDocs, where, orderBy, onSnapshot } from 'firebase/firestore';

// Import components
import UserPagePost from 'components/UserPagePost';
import Header from 'components/Header';
import UserInfo from 'components/UserInfo';

export default function UserPage({ isLoggedIn, currentUserObject }) {
	// States
	const [postObjects, setPostObjects] = useState([]);
	const [userObject, setUserObject] = useState({});
	const [isLoading, setIsLoading] = useState(true);

	// Constants
	const username = useParams().username;

	useEffect(async () => {
		const userId = await getUserId(username);

		// Get posts
		const q = query(postCollection, where('ownerUserId', '==', userId), orderBy('postedAt', 'desc'));
		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			const posts = querySnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));

			setPostObjects(posts);
		});

		// Get user data
		const userDocSnap = await getDoc(doc(userCollection, `${userId}`));

		setUserObject(userDocSnap.data());

		setIsLoading(false);

		// Clean up
		return () => {
			unsubscribe();
		};
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
						<UserInfo userObject={userObject} postObjects={postObjects} currentUserObject={currentUserObject} />
						<div className="content">
							<div className="nav-container-content">
								<div>
									<i className="material-icons">grid_on</i>
									<div>posts</div>
								</div>
								<div>
									<i className="material-icons">movie</i>
									<div>reels</div>
								</div>
								<div>
									<i className="material-icons">live_tv</i>
									<div>igtv</div>
								</div>
								<div>
									<i className="material-icons">assignment_ind</i>
									<div>tagged</div>
								</div>
							</div>
							<div className="content-container">
								{postObjects.map((postObject) => (
									<UserPagePost key={postObject.id} postObject={postObject} currentUserObject={currentUserObject} />
								))}
							</div>
						</div>
					</div>
				</>
			)}
		</>
	) : (
		<Redirect to="/" />
	);
}
