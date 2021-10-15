import React from 'react';

// Import components
import PostHeader from './PostHeader';

export default function CurrentUserCard({ currentUserObject, handlePostUploadToggle }) {
	return (
		<div className="current-user-card">
			<PostHeader postOwnerObject={currentUserObject} />
			<div onClick={handlePostUploadToggle} className="post-click">
				Create post
			</div>
		</div>
	);
}
