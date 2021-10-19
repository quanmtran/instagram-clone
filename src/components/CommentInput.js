import React, { useState } from 'react';
import { updateDoc, arrayUnion } from 'firebase/firestore';

export default function CommentInput({ postId, currentUserId, postDocRef }) {
	// States
	const [commentText, setCommentText] = useState('');

	// Handlers
	const handleCommentChange = (e) => {
		setCommentText(e.target.value);
	};

	const handleCommentSubmit = async (e) => {
		e.preventDefault();

		if (commentText.trim() === '') return;

		const comment = {
			id: `${postId}-${currentUserId}-${Date.now()}`,
			ownerUserId: currentUserId,
			postedAt: Date.now(),
			text: commentText,
		};

		await updateDoc(postDocRef, {
			comments: arrayUnion(comment),
		});

		setCommentText('');
	};

	return (
		<form className="comment-input-container" onSubmit={handleCommentSubmit}>
			<input placeholder="Add a comment..." value={commentText} onChange={handleCommentChange} />
			<input type="submit" value="Post" className={commentText.trim() ? 'active' : ''} />
		</form>
	);
}
