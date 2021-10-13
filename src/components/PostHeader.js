import React from 'react';
import { Link } from 'react-router-dom';

export default function PostHeader({ postOwnerObject }) {
	return (
		<div className="post-header">
			<Link to={`/user/${postOwnerObject.username}`}>
				<div className="profile-pic" style={{ backgroundImage: `url(${postOwnerObject.profilePictureUrl})` }} />
			</Link>

			<Link to={`/user/${postOwnerObject.username}`}>
				<div className="username">{postOwnerObject.username}</div>
			</Link>
		</div>
	);
}
