import React from 'react';

export default function UserInfo({ userObject, postObjects, currentUserObject }) {
	const isCurrentUsersPage = Boolean(currentUserObject.userId === userObject.userId);

	return (
		<div className="user-info">
			<div className="profile-picture-container">
				<div className="profile-picture" style={{ backgroundImage: `url(${userObject.profilePictureUrl})` }}></div>
			</div>
			<div className="username-and-btns">
				<div className="username">{userObject.username}</div>
				<div className="account-interactive-btns">
					{isCurrentUsersPage ? <div className="edit-profile-btn">Edit Profile</div> : <div className="follow-btn">Follow</div>}
				</div>
			</div>
			<div className="bio">
				<div className="bio-name">{userObject.name}</div>
				<div className="bio-text">{userObject.bio}</div>
			</div>
			<div className="stats">
				<div>
					<div className="post-count">{postObjects.length}</div>
					<div>posts</div>
				</div>
				<div>
					<div className="follower-count">{userObject.followers.length}</div>
					<div>followers</div>
				</div>
				<div>
					<div className="following-count">{userObject.followings.length}</div>
					<div>following</div>
				</div>
			</div>
		</div>
	);
}
