import React from 'react';
import ListUserCard from './ListUserCard';

export default function UserList({ toggleUserListDisplayed, userList, currentUserObject }) {
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
						<ListUserCard key={userId} userId={userId} toggleUserListDisplayed={toggleUserListDisplayed} currentUserObject={currentUserObject} />
					))}
				</div>
			</div>
		</div>
	);
}
