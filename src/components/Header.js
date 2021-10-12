import React from 'react';
import { Link } from 'react-router-dom';
import { authService } from 'fbase';
import { signOut } from 'firebase/auth';

export default function Header({ currentUserObject }) {
	const handleSignOut = () => {
		signOut(authService);
	};

	return (
		<header>
			<div className="header-container">
				<Link to="/">
					<div className="insta-logo">Isn'tagram</div>
				</Link>
				<div className="nav-container-header">
					<i className="material-icons" onClick={handleSignOut}>
						home
					</i>
					<i className="material-icons">chat</i>
					<i className="material-icons">explore</i>
					<i className="material-icons">favorite</i>
					<Link to={`/user/${currentUserObject.username}`}>
						<div className="profile-picture" style={{ backgroundImage: `url(${currentUserObject.profilePictureUrl})` }} />
					</Link>
				</div>
			</div>
		</header>
	);
}
