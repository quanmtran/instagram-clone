import React from 'react';
import { Link } from 'react-router-dom';

export default function UserPagePost({ postObject }) {
	return (
		<Link to={`/post/${postObject.id}`}>
			<div className="user-page-pic-container">
				<img src={postObject.imgUrl} />
				<div className="pic-stats">
					<div className="pic-likes">
						<i className="material-icons">favorite</i>
						<div>{postObject.likedBy.length}</div>
					</div>
					<div className="pic-comments">
						<i className="material-icons">chat_bubble</i>
						<div>{postObject.comments.length}</div>
					</div>
				</div>
			</div>
		</Link>
	);
}
