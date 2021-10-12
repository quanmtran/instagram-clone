import React, { useState, useEffect } from 'react';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { userCollection } from 'fbase';

export default function UserInfo({ userObject, postObjects, currentUserObject }) {
	// Constants
	const userId = userObject.userId;
	const currentUserId = currentUserObject.userId;
	const postCount = postObjects.length;
	const followingCount = userObject.followings.length;
	const isCurrentUsersPage = Boolean(currentUserId === userId);

	// States
	const [isCurrentUserFollowing, setIsCurrentUserFollowing] = useState(undefined);
	const [followerCount, setFollowerCount] = useState(userObject.followers.length);

	useEffect(() => {
		if (!isCurrentUsersPage) {
			setIsCurrentUserFollowing(currentUserObject.followings.includes(userId));
		}
	}, []);

	const handleFollowClick = async () => {
		// Firestore references
		const userDocRef = doc(userCollection, userId);
		const currentUserDocRef = doc(userCollection, currentUserId);

		try {
			if (isCurrentUserFollowing) {
				// Remove current user's id from user's followers
				await updateDoc(userDocRef, {
					followers: arrayRemove(currentUserId),
				});

				// Remove user's id from current user's followings
				await updateDoc(currentUserDocRef, {
					followings: arrayRemove(userId),
				});

				setFollowerCount((prev) => prev - 1);
			} else {
				// Add current user's id to user's followers
				await updateDoc(userDocRef, {
					followers: arrayUnion(currentUserId),
				});

				// Add user's id to current user's followings
				await updateDoc(currentUserDocRef, {
					followings: arrayUnion(userId),
				});

				setFollowerCount((prev) => prev + 1);
			}

			setIsCurrentUserFollowing((prev) => !prev);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="user-info">
			<div className="profile-picture-container">
				<div className="profile-picture" style={{ backgroundImage: `url(${userObject.profilePictureUrl})` }}></div>
			</div>
			<div className="username-and-btns">
				<div className="username">{userObject.username}</div>
				<div className="account-interactive-btns">
					{isCurrentUsersPage ? (
						<div className="edit-profile-btn">Edit Profile</div>
					) : (
						<div onClick={handleFollowClick} className={`follow-btn ${isCurrentUserFollowing && 'following'}`}>
							Follow{isCurrentUserFollowing && 'ing'}
						</div>
					)}
				</div>
			</div>
			<div className="bio">
				<div className="bio-name">{userObject.name}</div>
				<div className="bio-text">{userObject.bio}</div>
			</div>
			<div className="stats">
				<div>
					<div className="post-count">{postCount}</div>
					<div>post{postCount > 1 && 's'}</div>
				</div>
				<div>
					<div className="follower-count">{followerCount}</div>
					<div>follower{followerCount > 1 && 's'}</div>
				</div>
				<div>
					<div className="following-count">{followingCount}</div>
					<div>following</div>
				</div>
			</div>
		</div>
	);
}
