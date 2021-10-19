import React from 'react';
import { Link } from 'react-router-dom';

export default function PostHeader({ postOwnerObject }) {
	return (
		<div className="post-header">
			<Link to={`/user/${postOwnerObject.username}`}>
				<div className="profile-img" style={{ backgroundImage: `url(${postOwnerObject.profileImgUrl})` }} />
			</Link>

			<Link to={`/user/${postOwnerObject.username}`}>
				<div className="username">{postOwnerObject.username}</div>
			</Link>
		</div>
	);
}
