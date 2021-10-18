import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { userCollection } from 'fbase';

// Import components
import Header from 'components/Header';

export default function AccountEdit({ isLoggedIn, currentUserObject, refreshCurrentUserObject }) {
	const currentUserDocRef = doc(userCollection, currentUserObject.userId);

	// States
	const [nameEdit, setNameEdit] = useState(currentUserObject.name);
	const [bioEdit, setBioEdit] = useState(currentUserObject.bio);
	const [isEditting, setIsEditting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

	// Handlers
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
						<div className="profile-pic-container">
							<div className="profile-pic" style={{ backgroundImage: `url(${currentUserObject.profilePictureUrl})` }} />
						</div>
						<span className="username">{currentUserObject.username}</span>
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
		</>
	) : (
		<Redirect to="/" />
	);
}
