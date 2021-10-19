import React, { useState } from 'react';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { userCollection } from 'fbase';
import { Link } from 'react-router-dom';

export default function UserInfo({ userObject, postObjects, currentUserObject, setUserList, toggleUserListDisplayed }) {
	// States
	const [isCurrentUserFollowing, setIsCurrentUserFollowing] = useState(userObject.followers.includes(currentUserObject.userId));
	const [followerCount, setFollowerCount] = useState(userObject.followers.length);

	// Constant
	const isCurrentUserPageOwner = Boolean(currentUserObject.userId === userObject.userId);

	// Handlers
	const handleFollowClick = async () => {
		// Firestore references
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

				setFollowerCount((prev) => prev - 1);
			} else {
				// Add current user's id to user's followers
				await updateDoc(userDocRef, {
					followers: arrayUnion(currentUserObject.userId),
				});

				// Add user's id to current user's followings
				await updateDoc(currentUserDocRef, {
					followings: arrayUnion(userObject.userId),
				});

				setFollowerCount((prev) => prev + 1);
			}

			setIsCurrentUserFollowing((prev) => !prev);
		} catch (error) {
			console.log(error);
		}
	};

	const handleFollowerCountClick = () => {
		setUserList({
			listName: 'Followers',
			users: userObject.followers,
		});
		toggleUserListDisplayed();
	};

	const handleFollowingCountClick = () => {
		setUserList({
			listName: 'Following',
			users: userObject.followings,
		});
		toggleUserListDisplayed();
	};

	return (
		<div className="user-info">
			<div className="profile-img-container">
				<div className="profile-img" style={{ backgroundImage: `url(${userObject.profileImgUrl})` }}></div>
			</div>
			<div className="username-and-btns">
				<div className="username">{userObject.username}</div>
				{isCurrentUserPageOwner ? (
					<Link to={`/account/edit`}>
						<div className="account-interactive-btn edit-profile-btn">Edit Profile</div>
					</Link>
				) : (
					<div onClick={handleFollowClick} className={`account-interactive-btn follow-btn ${isCurrentUserFollowing && 'following'}`}>
						Follow{isCurrentUserFollowing && 'ing'}
					</div>
				)}
			</div>
			<div className="bio">
				<div className="bio-name">{userObject.name}</div>
				<div className="bio-text">{userObject.bio}</div>
			</div>
			<div className="stats">
				<div>
					<span>{postObjects.length}</span>
					post{postObjects.length > 1 && 's'}
				</div>
				<div onClick={handleFollowerCountClick}>
					<span>{followerCount}</span>
					follower{userObject.followers.length > 1 && 's'}
				</div>
				<div onClick={handleFollowingCountClick}>
					<span>{userObject.followings.length}</span>
					following
				</div>
			</div>
		</div>
	);
}
