import React from 'react';
import { DEFAULT_PROFILE_IMG_URL, storageService } from 'fbase';
import { updateDoc } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';

export default function ProfileImgOptions({ handleChangeProfileImgToggle, currentUserDocRef, refreshCurrentUserObject, currentUserObject }) {
	// Constants
	const userStorageRef = ref(storageService, `${currentUserObject.userId}`);
	const profileImgStorageRef = ref(userStorageRef, 'profile_img');

	// Handlers
	const handleUploadProfileImg = async (e) => {
		handleChangeProfileImgToggle();

		const file = e.target.files[0];

		if (file) {
			const reader = new FileReader();

			reader.onload = async () => {
				const imgUrl = reader.result;

				// Upload img to Storage Service
				await uploadString(profileImgStorageRef, imgUrl, 'data_url');

				// Get img URL from Storage Service
				const imgFirebaseUrl = await getDownloadURL(profileImgStorageRef);

				// Update User object in Database Service
				await updateDoc(currentUserDocRef, {
					profileImgUrl: imgFirebaseUrl,
				});

				await refreshCurrentUserObject(currentUserObject.userId);
			};

			reader.readAsDataURL(file);
		}
	};

	const handleRemoveCurrentProfileImg = async () => {
		handleChangeProfileImgToggle();

		// Update User object in Database Service
		await updateDoc(currentUserDocRef, {
			profileImgUrl: DEFAULT_PROFILE_IMG_URL,
		});

		await refreshCurrentUserObject(currentUserObject.userId);
	};

	return (
		<div className="profile-img-options-page">
			<div className="profile-img-options-container">
				<div>Change Profile Photo</div>
				<div className="upload-img-btn">
					<label className="color-blue text-bold clickable">
						Upload Photo
						<input type="file" accept="image/*" onChange={handleUploadProfileImg} />
					</label>
				</div>
				<div className="color-red text-bold clickable" onClick={handleRemoveCurrentProfileImg}>
					Remove Current Photo
				</div>
				<div className="clickable" onClick={handleChangeProfileImgToggle}>
					Cancel
				</div>
			</div>
		</div>
	);
}
