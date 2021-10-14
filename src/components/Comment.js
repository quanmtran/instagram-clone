import React, { useState, useEffect } from 'react';
import { updateDoc, arrayRemove } from 'firebase/firestore';
import { getUsername } from 'Functions';
import { Link } from 'react-router-dom';

export default function Comment({ postDocRef, postObject, comment, currentUserObject }) {
	const [username, setUsername] = useState('');
	const [isLoading, setIsLoading] = useState(true);

	useEffect(async () => {
		const name = await getUsername(comment.ownerUserId);
		setUsername(name);
		setIsLoading(false);
	}, []);

	const handleDeleteClick = async () => {
		await updateDoc(postDocRef, {
			comments: arrayRemove(comment),
		});
	};

	return isLoading ? (
		<div></div>
	) : (
		<div className="comment">
			<div className="username-and-text">
				<span className="username">
					<Link to={`/user/${username}`}>{username}</Link>
				</span>{' '}
				<span>{comment.text}</span>
			</div>
			{(currentUserObject.userId === comment.ownerUserId || currentUserObject.userId === postObject.ownerUserId) && (
				<span className="material-icons delete-comment-btn" onClick={handleDeleteClick}>
					clear
				</span>
			)}
		</div>
	);
}
