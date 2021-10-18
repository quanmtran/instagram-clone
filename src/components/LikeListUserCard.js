import React from 'react';
import { Link } from 'react-router-dom';

export default function LikeListUserCard({ userObject }) {
	return (
		<div className="like-list-user-card">
			<Link to={`/user/${userObject.username}`}>
				<div className="profile-pic" style={{ backgroundImage: `url(${userObject.profilePictureUrl})` }}></div>
			</Link>
			<div>
				<Link to={`/user/${userObject.username}`}>
					<span className="username">{userObject.username}</span>
				</Link>
				<span className="name">{userObject.name}</span>
			</div>
		</div>
	);
}
