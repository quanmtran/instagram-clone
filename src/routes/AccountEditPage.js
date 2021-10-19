import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { userCollection } from 'fbase';

// Import components
import Header from 'components/Header';
import ProfileImgOptions from 'components/ProfileImgOptions';

export default function AccountEdit({ isLoggedIn, currentUserObject, refreshCurrentUserObject }) {
	const currentUserDocRef = doc(userCollection, currentUserObject.userId);

	// States
	const [nameEdit, setNameEdit] = useState(currentUserObject.name);
	const [bioEdit, setBioEdit] = useState(currentUserObject.bio);
	const [isEditting, setIsEditting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [isProfileImgOptionsDisplayed, setIsProfileImgOptionsDisplayed] = useState(false);

	// Handlers
	const handleChangeProfileImgToggle = () => {
		document.body.classList.toggle('scroll-locked');
		setIsProfileImgOptionsDisplayed((prev) => !prev);
	};

	const handleEditChange = (e) => {
		const {
			target: { name, value },
		} = e;

		setIsEditting(true);
		setIsSubmitted(false);

		switch (name) {
			case 'name':
				setNameEdit(value);
				break;
			case 'bio':
				setBioEdit(value);
				break;
		}
	};

	const handleEditSubmit = async (e) => {
		e.preventDefault();

		if (isEditting) {
			await updateDoc(currentUserDocRef, {
				name: nameEdit.trim(),
				bio: bioEdit.trim(),
			});

			await refreshCurrentUserObject(currentUserObject.userId);

			setIsEditting(false);
			setIsSubmitted(true);
		}
	};

	return isLoggedIn ? (
		<>
			<Header currentUserObject={currentUserObject} />
			<div className="account-edit-container">
				<form onSubmit={handleEditSubmit} className="account-edit-form">
					<div className="form-header">
						<div>
							<div className="profile-img" style={{ backgroundImage: `url(${currentUserObject.profileImgUrl})` }} />
						</div>
						<div>
							<span className="username">{currentUserObject.username}</span>
							<span className="change-profile-img-btn" onClick={handleChangeProfileImgToggle}>
								Change Profile Photo
							</span>
						</div>
					</div>
					<div className="form-control">
						<label htmlFor="name">Name</label>
						<input type="text" name="name" placeholder="Name" className="form-input" value={nameEdit} onChange={handleEditChange} />
					</div>
					<div className="form-control">
						<label htmlFor="bio">Bio</label>
						<textarea name="bio" placeholder="Bio" className="form-input" value={bioEdit} onChange={handleEditChange} />
					</div>
					<div className="submit-btn-container">
						<input type="submit" className={`submit-btn ${isEditting ? 'active' : ''}`} value="Submit" />
						{isSubmitted && <div>Profile saved!</div>}
					</div>
				</form>
			</div>
			{isProfileImgOptionsDisplayed && (
				<ProfileImgOptions
					handleChangeProfileImgToggle={handleChangeProfileImgToggle}
					currentUserDocRef={currentUserDocRef}
					refreshCurrentUserObject={refreshCurrentUserObject}
					currentUserObject={currentUserObject}
				/>
			)}
		</>
	) : (
		<Redirect to="/" />
	);
}
