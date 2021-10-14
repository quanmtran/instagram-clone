import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ProfileOptions from './ProfileOptions';

export default function Header({ currentUserObject }) {
	const [isProfileOptionsDisplayed, setIsProfileOptionsDisplayed] = useState(false);

	const handleToggleProfileOptions = () => {
		setIsProfileOptionsDisplayed((prev) => !prev);
	};

	return (
		<header>
			<div className="header-container">
				<Link to="/">
					<div className="insta-logo">Isn'tagram</div>
				</Link>
				<div className="nav-container-header">
					<i className="material-icons">home</i>
					<i className="material-icons">chat</i>
					<i className="material-icons">explore</i>
					<i className="material-icons">favorite</i>
					<div
						className="profile-picture"
						onClick={handleToggleProfileOptions}
						style={{ backgroundImage: `url(${currentUserObject.profilePictureUrl})` }}
					>
						{isProfileOptionsDisplayed && <ProfileOptions currentUserObject={currentUserObject} />}
					</div>
				</div>
			</div>
		</header>
	);
}
