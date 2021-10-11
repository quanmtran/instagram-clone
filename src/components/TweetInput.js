import React, { useState } from 'react';
import { storageService } from 'fbase';
import { addDoc } from 'firebase/firestore';
import { ref, uploadString } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

export default function TweetInput({ userObject, tweetCollection }) {
	const [tweetInput, setTweetInput] = useState('');
	const [imgUrl, setImgUrl] = useState('');

	const handleTweetInputChange = (e) => {
		setTweetInput(e.target.value);
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

	const handleTweetSubmit = async (e) => {
		e.preventDefault();

		if (tweetInput.trim() !== '' || imgUrl !== '') {
			let imgId = '';

			if (imgUrl) {
				imgId = uuidv4();

				const userStorageRef = ref(storageService, `${userObject.uid}`);
				const imgStorageRef = ref(userStorageRef, imgId);
				await uploadString(imgStorageRef, imgUrl, 'data_url');
			}

			const tweetObject = {
				text: tweetInput,
				tweetedAt: Date.now(),
				ownerId: userObject.uid,
				ownerUsername: userObject.displayName,
				ownerProfilePicURL: userObject.photoURL,
				imgId: imgId,
				likedByUserIds: [],
			};

			await addDoc(tweetCollection, tweetObject);
		}

		setTweetInput('');
		setImgUrl('');
	};

	return (
		<form onSubmit={handleTweetSubmit}>
			<div>
				<input type="text" placeholder="What's on your mind?" value={tweetInput} onChange={handleTweetInputChange} />
			</div>
			<div>
				<input type="file" accept="image/*" onChange={handleFileChange} />
				{imgUrl && <img src={imgUrl} height="100px" />}
			</div>
			<div>
				<input type="submit" value="Tweet" />
			</div>
		</form>
	);
}
