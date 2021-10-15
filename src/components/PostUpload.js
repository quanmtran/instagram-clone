import React, { useState } from 'react';
import { storageService, postCollection } from 'fbase';
import { addDoc } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

// Import components

export default function PostUpload({ currentUserObject }) {
	// States
	const [captionInput, setCaptionInput] = useState('');
	const [imgUrl, setImgUrl] = useState('');

	// Handlers
	const handleCaptionInputChange = (e) => {
		setCaptionInput(e.target.value);
	};

	const handleFileChange = (e) => {
		setImgUrl(null);

		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();

			reader.onload = () => {
				setImgUrl(reader.result);
			};

			reader.readAsDataURL(file);
		}
	};

	const handleCancelImg = () => {
		setImgUrl('');
	};

	const handlePostSubmit = async (e) => {
		e.preventDefault();

		try {
			if (imgUrl) {
				const imgId = uuidv4();
				const userStorageRef = ref(storageService, `${currentUserObject.userId}`);
				const imgStorageRef = ref(userStorageRef, imgId);
				await uploadString(imgStorageRef, imgUrl, 'data_url');
				const imgFirebaseUrl = await getDownloadURL(imgStorageRef);

				const postObject = {
					caption: captionInput,
					postedAt: Date.now(),
					ownerUserId: currentUserObject.userId,
					imgId: imgId,
					imgUrl: imgFirebaseUrl,
					likedBy: [],
					comments: [],
				};

				await addDoc(postCollection, postObject);
			}
		} catch (error) {
			console.log(error);
		}

		setCaptionInput('');
		setImgUrl('');
	};

	return (
		<form onSubmit={handlePostSubmit} className="post-upload-form">
			<div className="drag-and-drop-container">
				<label className="drag-and-drop-area" style={{ visibility: `${imgUrl ? 'hidden' : ''}` }}>
					<span>Add a photo</span>
					<span>or drag and drop</span>
					<input type="file" accept="image/*" onChange={handleFileChange} />
				</label>
				{imgUrl && (
					<div className="image-preview" style={{ backgroundImage: `url(${imgUrl})` }}>
						<span className="material-icons" onClick={handleCancelImg}>
							cancel
						</span>
					</div>
				)}
			</div>
			<textarea placeholder="Write a caption..." value={captionInput} onChange={handleCaptionInputChange} />
			<input type="submit" value="Post" />
		</form>
	);
}
