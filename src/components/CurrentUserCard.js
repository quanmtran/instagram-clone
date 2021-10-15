import React from 'react';

// Import components
import PostHeader from './PostHeader';
import PostUpload from './PostUpload';

export default function CurrentUserCard({ currentUserObject }) {
	return (
		<div className="current-user-card">
			<PostHeader postOwnerObject={currentUserObject} />
			<PostUpload currentUserObject={currentUserObject} />
		</div>
	);
}
