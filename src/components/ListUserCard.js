import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userCollection } from 'fbase';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

export default function ListUserCard({ userId, toggleUserListDisplayed, currentUserObject }) {
	const [userObject, setUserObject] = useState({});
	const [isUserDataReady, setIsUserDataReady] = useState(false);
	const [isCurrentUser, setIsCurrentUser] = useState(null);
	const [isCurrentUserFollowing, setIsCurrentUserFollowing] = useState(null);

	useEffect(async () => {
		const docSnap = await getDoc(doc(userCollection, userId));
		const userObj = docSnap.data();
		setUserObject(userObj);
		setIsCurrentUser(userObj.userId === currentUserObject.userId);
		setIsCurrentUserFollowing(userObj.followers.includes(currentUserObject.userId));
		setIsUserDataReady(true);
	}, []);

	// Handlers
	const handleFollowClick = async () => {
		const userDocRef = doc(userCollection, userObject.userId);
		const currentUserDocRef = doc(userCollection, currentUserObject.userId);

		try {
			if (isCurrentUserFollowing) {
				// Remove current user's id from user's followers
				await updateDoc(userDocRef, {
					followers: arrayRemove(currentUserObject.userId),
				});

				// Remove user's id from current user's followings
				await updateDoc(currentUserDocRef, {
					followings: arrayRemove(userObject.userId),
				});
			} else {
				// Add current user's id to user's followers
				await updateDoc(userDocRef, {
					followers: arrayUnion(currentUserObject.userId),
				});

				// Add user's id to current user's followings
				await updateDoc(currentUserDocRef, {
					followings: arrayUnion(userObject.userId),
				});
			}

			setIsCurrentUserFollowing((prev) => !prev);
		} catch (error) {
			console.log(error);
		}
	};

	return isUserDataReady ? (
		<div className="user-card">
			<div className="user-card-profile-img-and-name">
				<Link to={`/user/${userObject.username}`} onClick={toggleUserListDisplayed}>
					<div className="profile-img" style={{ backgroundImage: `url(${userObject.profileImgUrl})` }}></div>
				</Link>
				<div>
					<Link to={`/user/${userObject.username}`} onClick={toggleUserListDisplayed}>
						<span className="username">{userObject.username}</span>
					</Link>
					<span className="name">{userObject.name}</span>
				</div>
			</div>
			{!isCurrentUser && (
				<div className={`follow-btn ${isCurrentUserFollowing ? 'following' : ''}`} onClick={handleFollowClick}>
					Follow{isCurrentUserFollowing ? 'ing' : ''}
				</div>
			)}
		</div>
	) : null;
}
