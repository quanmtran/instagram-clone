import React from 'react';
import { DEFAULT_PROFILE_PIC_URL, storageService } from 'fbase';
import { updateDoc } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';

export default function ProfilePicOptions({ handleChangeProfilePicToggle, currentUserDocRef, refreshCurrentUserObject, currentUserObject }) {
	// Constants
	const userStorageRef = ref(storageService, `${currentUserObject.userId}`);
	const profilePicStorageRef = ref(userStorageRef, 'profile_pic');

	// Handlers
	const handleUploadProfilePic = async (e) => {
		handleChangeProfilePicToggle();

		const file = e.target.files[0];

		if (file) {
			const reader = new FileReader();

			reader.onload = async () => {
				const picUrl = reader.result;

				// Upload pic to Storage Service
				await uploadString(profilePicStorageRef, picUrl, 'data_url');

				// Get pic URL from Storage Service
				const picFirebaseUrl = await getDownloadURL(profilePicStorageRef);

				// Update User object in Database Service
				await updateDoc(currentUserDocRef, {
					profilePictureUrl: picFirebaseUrl,
				});

				await refreshCurrentUserObject(currentUserObject.userId);
			};

			reader.readAsDataURL(file);
		}
	};

	const handleRemoveCurrentProfilePic = async () => {
		handleChangeProfilePicToggle();

		// Update User object in Database Service
		await updateDoc(currentUserDocRef, {
			profilePictureUrl: DEFAULT_PROFILE_PIC_URL,
		});

		await refreshCurrentUserObject(currentUserObject.userId);
	};

	return (
		<div className="profile-pic-options-page">
			<div className="profile-pic-options-container">
				<div>Change Profile Photo</div>
				<div className="upload-pic-btn">
					<label className="color-blue text-bold clickable">
						Upload Photo
						<input type="file" accept="image/*" onChange={handleUploadProfilePic} />
					</label>
				</div>
				<div className="color-red text-bold clickable" onClick={handleRemoveCurrentProfilePic}>
					Remove Current Photo
				</div>
				<div className="clickable" onClick={handleChangeProfilePicToggle}>
					Cancel
				</div>
			</div>
		</div>
	);
}
