import React from 'react';

export default function PostMoreOptions({ handleEditToggle, handleDelete, handleMoreClick, isMoreOptionsDisplayed }) {
	return (
		<div>
			<span className="material-icons post-more-btn" onClick={handleMoreClick}>
				more_horiz
			</span>
			{isMoreOptionsDisplayed && (
				<div className="post-more-options">
					<button onClick={handleEditToggle}>Edit</button>
					<button onClick={handleDelete}>Delete</button>
				</div>
			)}
		</div>
	);
}
