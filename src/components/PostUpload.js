import React, { useRef, useState } from 'react';
import { storageService, postCollection } from 'fbase';
import { addDoc } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

// Import components

export default function PostUpload({ currentUserObject }) {
	// States
	const [captionInput, setCaptionInput] = useState('');
	const [imgUrl, setImgUrl] = useState('');
	const dragAndDropAreaRef = useRef(null);

	// Handlers
	const handleCaptionInputChange = (e) => {
		setCaptionInput(e.target.value);
	};

	const handleFileChange = (e) => {
		setImgUrl(null);

		const file = e.target.files[0];
		if (file && file.type.split('/')[0] === 'image') {
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
				// Generate random ID
				const imgId = uuidv4();

				// Create a reference in Storage Service
				const userStorageRef = ref(storageService, `${currentUserObject.userId}`);
				const imgStorageRef = ref(userStorageRef, imgId);

				// Upload image to Storage
				await uploadString(imgStorageRef, imgUrl, 'data_url');

				// Get image URL in Storage Service
				const imgFirebaseUrl = await getDownloadURL(imgStorageRef);

				// Add post's data as an object to Post collection in Database Service
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

				// Clear inputs
				setCaptionInput('');
				setImgUrl('');

				// Scroll to the top of the page
				document.body.scrollTop = document.documentElement.scrollTop = 0;
			}
		} catch (error) {
			console.log(error);
		}
	};

	const handleDragEnter = () => {
		dragAndDropAreaRef.current.classList.add('dragover');
	};

	const handleDragLeave = () => {
		dragAndDropAreaRef.current.classList.remove('dragover');
	};

	const handleDrop = () => {
		dragAndDropAreaRef.current.classList.remove('dragover');
	};

	return (
		<form onSubmit={handlePostSubmit} className="post-upload-form">
			<div className="drag-and-drop-container">
				{imgUrl ? (
					<div className="image-preview" style={{ backgroundImage: `url(${imgUrl})` }}>
						<span className="material-icons" onClick={handleCancelImg}>
							cancel
						</span>
					</div>
				) : (
					<div ref={dragAndDropAreaRef} className="drag-and-drop-area">
						<span>Add a photo</span>
						<span>or drag and drop</span>
						<input
							type="file"
							accept="image/*"
							onChange={handleFileChange}
							onDragEnter={handleDragEnter}
							onDragLeave={handleDragLeave}
							onDrop={handleDrop}
						/>
					</div>
				)}
			</div>
			{imgUrl && <textarea placeholder="Write a caption..." value={captionInput} onChange={handleCaptionInputChange} />}
			<input type="submit" value="Post" className={imgUrl ? 'active' : ''} />
		</form>
	);
}
