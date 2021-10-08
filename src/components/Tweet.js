import React, { useState, useEffect } from 'react';
import { doc, deleteDoc, setDoc } from 'firebase/firestore';
import { databaseService, storageService } from 'fbase';
import { ref, getDownloadURL, deleteObject } from 'firebase/storage';

export default function Tweet({ tweetObject, isOwner }) {
	const [firebaseImgUrl, setFirebaseImgUrl] = useState('');
	const [isEditting, setIsEditting] = useState(false);
	const [editText, setEditText] = useState(tweetObject.text);
	const userStorageRef = ref(storageService, `${tweetObject.ownerId}`);

	const imgId = tweetObject.imgId;

	const handleEditChange = (e) => {
		setEditText(e.target.value);
	};

	const handleEditSubmit = async (e) => {
		e.preventDefault();

		await setDoc(
			doc(databaseService, 'tweets', tweetObject.id),
			{
				text: editText,
			},
			{ merge: true }
		);

		setIsEditting(false);
	};

	const editToggle = () => {
		setIsEditting((prev) => !prev);
	};
	const handleDelete = async () => {
		try {
			await deleteDoc(doc(databaseService, 'tweets', `${tweetObject.id}`));

			if (imgId) {
				await deleteObject(ref(userStorageRef, imgId));
			}
		} catch (error) {
			console.log(error);
		}
	};

	const getFirebaseImgUrl = async () => {
		if (imgId) {
			try {
				const url = await getDownloadURL(ref(userStorageRef, imgId));
				setFirebaseImgUrl(url);
			} catch (error) {
				console.log(error);
			}
		}
	};

	useEffect(() => {
		getFirebaseImgUrl();
	}, []);

	const getTimeAgo = (tweetedAt) => {
		const SECONDS_MULTIPLIER = 1000;
		const MINUTES_MULTIPLIER = SECONDS_MULTIPLIER * 60;
		const HOURS_MULTIPLIER = MINUTES_MULTIPLIER * 60;
		const DAYS_MULTIPLIER = HOURS_MULTIPLIER * 24;

		const alphaTime = Date.now() - tweetedAt;
		let result;
		if (alphaTime / DAYS_MULTIPLIER >= 1) {
			result = `${Math.floor(alphaTime / DAYS_MULTIPLIER)}d`;
		} else if (alphaTime / HOURS_MULTIPLIER >= 1) {
			result = `${Math.floor(alphaTime / HOURS_MULTIPLIER)}h`;
		} else if (alphaTime / MINUTES_MULTIPLIER >= 1) {
			result = `${Math.floor(alphaTime / MINUTES_MULTIPLIER)}m`;
		} else {
			result = `${Math.floor(alphaTime / SECONDS_MULTIPLIER)}s`;
		}

		return `${result} ago`;
	};

	return (
		<div>
			{isEditting ? (
				<form onSubmit={handleEditSubmit}>
					<input type="text" value={editText} onChange={handleEditChange} />
					<input type="button" value="Cancel" onClick={editToggle} />
					<input type="submit" value="Save" />
				</form>
			) : (
				<>
					<br />
					<div>
						<img src={tweetObject.ownerProfilePicURL} height="20px" /> @{tweetObject.ownerUsername} - <span>{getTimeAgo(tweetObject.tweetedAt)}</span>
					</div>

					<div>{tweetObject.text}</div>
					{firebaseImgUrl && <img src={firebaseImgUrl} height="100px" />}
					{isOwner && (
						<div>
							<button onClick={editToggle}>Edit</button>
							<button onClick={handleDelete}>Delete</button>
						</div>
					)}
				</>
			)}
		</div>
	);
}
