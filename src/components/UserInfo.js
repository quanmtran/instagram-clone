import React, { useState, useEffect } from 'react';
import { doc, updateDoc, arrayUnion, arrayRemove, onSnapshot } from 'firebase/firestore';
import { userCollection } from 'fbase';

export default function UserInfo({ userObject, postObjects, currentUserObject }) {
	// States
	const [pageOwner, setPageOwner] = useState(userObject);
	const [isCurrentUserFollowing, setIsCurrentUserFollowing] = useState(pageOwner.followers.includes(currentUserObject.userId));

	// Constant
	const isCurrentUserPageOwner = Boolean(currentUserObject.userId === pageOwner.userId);

	useEffect(() => {
		const unsubscribe = onSnapshot(doc(userCollection, pageOwner.userId), (doc) => {
			setPageOwner(doc.data());
		});

		return () => {
			unsubscribe();
		};
	}, []);

	const handleFollowClick = async () => {
		// Firestore references
		const userDocRef = doc(userCollection, pageOwner.userId);
		const currentUserDocRef = doc(userCollection, currentUserObject.userId);

		try {
			if (isCurrentUserFollowing) {
				// Remove current user's id from user's followers
				await updateDoc(userDocRef, {
					followers: arrayRemove(currentUserObject.userId),
				});

				// Remove user's id from current user's followings
				await updateDoc(currentUserDocRef, {
					followings: arrayRemove(pageOwner.userId),
				});
			} else {
				// Add current user's id to user's followers
				await updateDoc(userDocRef, {
					followers: arrayUnion(currentUserObject.userId),
				});

				// Add user's id to current user's followings
				await updateDoc(currentUserDocRef, {
					followings: arrayUnion(pageOwner.userId),
				});
			}

			setIsCurrentUserFollowing((prev) => !prev);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="user-info">
			<div className="profile-picture-container">
				<div className="profile-picture" style={{ backgroundImage: `url(${pageOwner.profilePictureUrl})` }}></div>
			</div>
			<div className="username-and-btns">
				<div className="username">{pageOwner.username}</div>
				<div className="account-interactive-btns">
					{isCurrentUserPageOwner ? (
						<div className="edit-profile-btn">Edit Profile</div>
					) : (
						<div onClick={handleFollowClick} className={`follow-btn ${isCurrentUserFollowing && 'following'}`}>
							Follow{isCurrentUserFollowing && 'ing'}
						</div>
					)}
				</div>
			</div>
			<div className="bio">
				<div className="bio-name">{pageOwner.name}</div>
				<div className="bio-text">{pageOwner.bio}</div>
			</div>
			<div className="stats">
				<div>
					<div className="post-count">{postObjects.length}</div>
					<div>post{postObjects.length > 1 && 's'}</div>
				</div>
				<div>
					<div className="follower-count">{pageOwner.followers.length}</div>
					<div>follower{pageOwner.followers.length > 1 && 's'}</div>
				</div>
				<div>
					<div className="following-count">{pageOwner.followings.length}</div>
					<div>following</div>
				</div>
			</div>
		</div>
	);
}
