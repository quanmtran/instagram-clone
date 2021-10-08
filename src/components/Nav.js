import React from 'react';
import { Link } from 'react-router-dom';
import { authService } from 'fbase';
import { signOut } from 'firebase/auth';

export default function Nav({ userObject }) {
	const handleSignOut = () => {
		signOut(authService);
	};

	return (
		<div>
			<ul>
				<li>
					<Link to="/">Home</Link>
				</li>
				<li>
					<Link to={`/user/${userObject.displayName}`}>Profile</Link>
				</li>
			</ul>
			<button onClick={handleSignOut}>Log Out</button>
		</div>
	);
}
