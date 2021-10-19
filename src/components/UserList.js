import React from 'react';
import ListUserCard from './ListUserCard';

export default function LikeList({ toggleUserListDisplayed, userList }) {
	return (
		<div className="user-list-page">
			<div className="user-list-container">
				<div>
					{userList.listName}
					<span className="material-icons" onClick={toggleUserListDisplayed}>
						close
					</span>
				</div>
				<div>
					{userList.users.map((userId) => (
						<ListUserCard key={userId} userId={userId} />
					))}
				</div>
			</div>
		</div>
	);
}
