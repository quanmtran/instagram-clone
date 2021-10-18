import React from 'react';
import { authService } from 'fbase';
import { signOut } from 'firebase/auth';
import { Link } from 'react-router-dom';

export default function ProfileOptions({ currentUserObject }) {
	const handleLogOut = () => {
		signOut(authService);
	};

	return (
		<div className="profile-options">
			<Link to={`/user/${currentUserObject.username}`}>
				<div>
					<span className="material-icons">account_circle</span>Profile
				</div>
			</Link>
			<Link to={`/account/edit`}>
				<div>
					<span className="material-icons">settings</span>Settings
				</div>
			</Link>
			<div className="log-out-btn" onClick={handleLogOut}>
				Log Out
			</div>
		</div>
	);
}
