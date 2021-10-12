import React, { useState, useEffect } from 'react';
import { doc, getDoc, deleteDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { storageService, postCollection, userCollection } from 'fbase';
import { ref, deleteObject } from 'firebase/storage';
import { Link } from 'react-router-dom';

export default function UserPagePost({ postObject, currentUserObject }) {
	// States
	const [isEditting, setIsEditting] = useState(false);
	const [editCaption, setEditCaption] = useState(postObject.caption);
	const [postOwnerObject, setPostOwnerObject] = useState({});
	const [isLikeListDisplayed, setIsLikeListDisplayed] = useState(false);
	const [likeList, setLikeList] = useState([]);

	// Firebase database references
	const postDocRef = doc(postCollection, postObject.id);

	// Firebase storage references
	const userStorageRef = ref(storageService, `${postObject.ownerUserId}`);

	// Constants
	const postLikedArray = postObject.likedBy;
	const likeCount = postLikedArray.length;
	const commentCount = postObject.comments.length;
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
	const handleEditCaptionChange = (e) => {
		setEditCaption(e.target.value);
	};

	const handleEditSubmit = async (e) => {
		e.preventDefault();

		await updateDoc(postDocRef, {
			caption: editCaption,
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

		const likersArray = await Promise.all(postObject.likedBy.map((userId) => getUsernameFromUserId(userId)));
		setLikeList(likersArray);
	};

	const handleLikeClick = async () => {
		try {
			if (hasCurrentUserLiked) {
				await updateDoc(postDocRef, {
					likedBy: arrayRemove(currentUserId),
				});
			} else {
				await updateDoc(postDocRef, {
					likedBy: arrayUnion(currentUserId),
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
		let timeDigit;
		let timeUnit;
		if (alphaTime / DAYS_MULTIPLIER >= 1) {
			timeDigit = `${Math.floor(alphaTime / DAYS_MULTIPLIER)}`;
			timeUnit = 'DAY';
		} else if (alphaTime / HOURS_MULTIPLIER >= 1) {
			timeDigit = `${Math.floor(alphaTime / HOURS_MULTIPLIER)}`;
			timeUnit = 'HOUR';
		} else if (alphaTime / MINUTES_MULTIPLIER >= 1) {
			timeDigit = `${Math.floor(alphaTime / MINUTES_MULTIPLIER)}`;
			timeUnit = 'MINUTE';
		} else {
			timeDigit = `${Math.floor(alphaTime / SECONDS_MULTIPLIER)}`;
			timeUnit = 'SECOND';
		}

		return `${timeDigit} ${timeUnit}${timeDigit > 1 ? 'S' : ''} AGO`;
	};

	return (
		<div className="user-page-pic-container">
			<img src={postObject.imgUrl} />
			<div className="pic-stats">
				<div className="pic-likes">
					<i className="material-icons">favorite</i>
					<div>{likeCount}</div>
				</div>
				<div className="pic-comments">
					<i className="material-icons">chat_bubble</i>
					<div>{commentCount}</div>
				</div>
			</div>
		</div>
	);
}
