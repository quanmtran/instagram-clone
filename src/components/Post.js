import React, { useState, useEffect } from 'react';
import { doc, getDoc, deleteDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { storageService, postCollection, userCollection } from 'fbase';
import { ref, getDownloadURL, deleteObject } from 'firebase/storage';
import { Link } from 'react-router-dom';

export default function Post({ postObject, currentUserObject }) {
	// States
	const [isEditting, setIsEditting] = useState(false);
	const [editText, setEditText] = useState(postObject.text);
	const [postOwnerObject, setPostOwnerObject] = useState({});
	const [isLikeListDisplayed, setIsLikeListDisplayed] = useState(false);
	const [likeList, setLikeList] = useState([]);

	// Firebase database references
	const postDocRef = doc(postCollection, postObject.id);
	
	// Firebase storage references
	const userStorageRef = ref(storageService, `${postObject.ownerUserId}`);

	// Constants
	const postLikedArray = postObject.likedByUserIds;
	const likeCount = postLikedArray.length;
	const currentUserId = currentUserObject.userId;
	const hasCurrentUserLiked = postLikedArray.includes(currentUserId);
	const imgId = postObject.imgId;

	useEffect(() => {
		getPostOwnerData();
	}, []);

	const getPostOwnerData = async () => {
		const postOwnerUserRef = doc(userCollection, postObject.ownerUserId);
		const userDocSnap = await getDoc(postOwnerUserRef);

		setPostOwnerObject(userDocSnap.data());
	};

	// Handlers
	const handleEditChange = (e) => {
		setEditText(e.target.value);
	};

	const handleEditSubmit = async (e) => {
		e.preventDefault();

		await updateDoc(postDocRef, {
			text: editText,
		});

		setIsEditting(false);
	};

	const handleEditToggle = () => {
		setIsEditting((prev) => !prev);
	};

	const handleDelete = async () => {
		try {
			await deleteDoc(doc(postCollection, `${postObject.id}`));

			if (imgId) {
				await deleteObject(ref(userStorageRef, imgId));
			}
		} catch (error) {
			console.log(error);
		}
	};

	const handleLikeCountClick = async () => {
		toggleLikeListDisplayed();

		const likersArray = await Promise.all(postObject.likedByUserIds.map((userId) => getUsernameFromUserId(userId)));
		setLikeList(likersArray);
	};

	const handleLikeClick = async () => {
		try {
			if (hasCurrentUserLiked) {
				await updateDoc(postDocRef, {
					likedByUserIds: arrayRemove(currentUserId),
				});
			} else {
				await updateDoc(postDocRef, {
					likedByUserIds: arrayUnion(currentUserId),
				});
			}
		} catch (error) {
			console.log(error);
		}
	};

	// Other functions
	const toggleLikeListDisplayed = () => {
		setIsLikeListDisplayed((prev) => !prev);
	};

	const getUsernameFromUserId = async (userId) => {
		const docSnap = await getDoc(doc(userCollection, userId));
		return docSnap.data().username;
	};

	const getTimeAgo = (postedAt) => {
		const SECONDS_MULTIPLIER = 1000;
		const MINUTES_MULTIPLIER = SECONDS_MULTIPLIER * 60;
		const HOURS_MULTIPLIER = MINUTES_MULTIPLIER * 60;
		const DAYS_MULTIPLIER = HOURS_MULTIPLIER * 24;

		const alphaTime = Date.now() - postedAt;
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
					<input type="button" value="Cancel" onClick={handleEditToggle} />
					<input type="submit" value="Save" />
				</form>
			) : (
				<>
					<br />
					<div>
						<img src={postObject.ownerProfilePicURL} height="20px" />
						<Link to={`/user/${postOwnerObject.username}`}>{postOwnerObject.username}</Link> - <span>{getTimeAgo(postObject.postedAt)}</span>
					</div>

					{currentUserObject.userId === postObject.ownerUserId && (
						<div>
							<button onClick={handleEditToggle}>Edit</button>
							<button onClick={handleDelete}>Delete</button>
						</div>
					)}

					<div>{postObject.caption}</div>
					<img src={postObject.imgUrl} height="100px" />

					<div>
						<span onClick={handleLikeCountClick}>{likeCount}</span>
						{` like${likeCount > 1 ? 's' : ''}`}
						<button onClick={handleLikeClick}>Like{hasCurrentUserLiked ? 'd' : ''}</button>
					</div>

					{isLikeListDisplayed && <div>Liked by {likeList.join(', ')}</div>}
				</>
			)}
		</div>
	);
}
