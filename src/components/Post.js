import React, { useState, useEffect } from 'react';
import { doc, getDoc, deleteDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { storageService, postCollection, userCollection } from 'fbase';
import { ref, deleteObject } from 'firebase/storage';
import { Link } from 'react-router-dom';

// Import functions
import { getUsername, getTimeAgo } from 'Functions';

// Import components
import Comment from './Comment';
import CommentInput from './CommentInput';
import PostHeader from './PostHeader';
import PostMoreOptions from './PostMoreOptions';

export default function Post({ postObject, currentUserObject }) {
	// States
	const [isEditting, setIsEditting] = useState(false);
	const [editCaption, setEditCaption] = useState(postObject.caption);
	const [postOwnerObject, setPostOwnerObject] = useState({});
	const [isMoreOptionsDisplayed, setIsMoreOptionsDisplayed] = useState(false);
	const [isLikeListDisplayed, setIsLikeListDisplayed] = useState(false);
	const [likeList, setLikeList] = useState([]);

	// Firebase database references
	const postDocRef = doc(postCollection, postObject.id);

	// Firebase storage references
	const userStorageRef = ref(storageService, `${postObject.ownerUserId}`);

	// Constants
	const postLikedArray = postObject.likedBy;
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
		setIsMoreOptionsDisplayed(false);
		setEditCaption(postObject.caption);
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

		const likersArray = await Promise.all(postObject.likedBy.map((userId) => getUsername(userId)));
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

	const handleMoreClick = () => {
		setIsMoreOptionsDisplayed((prev) => !prev);
	};

	// Other functions
	const toggleLikeListDisplayed = () => {
		setIsLikeListDisplayed((prev) => !prev);
	};

	return (
		<div className="post-container">
			<PostHeader
				postOwnerObject={postOwnerObject}
				currentUserObject={currentUserObject}
				postObject={postObject}
				handleEditToggle={handleEditToggle}
				handleDelete={handleDelete}
				handleMoreClick={handleMoreClick}
				isMoreOptionsDisplayed={isMoreOptionsDisplayed}
			/>

			<div className="post-pic">
				<img src={postObject.imgUrl} />
			</div>

			{isEditting ? (
				<form onSubmit={handleEditSubmit} className="post-edit-form">
					<input type="text" value={editCaption} placeholder="Edit caption..." onChange={handleEditCaptionChange} />
					<input type="button" value="Cancel" onClick={handleEditToggle} />
					<input type="submit" value="Save" />
				</form>
			) : (
				<>
					<div className="post-interactive-btns">
						<button onClick={handleLikeClick}>Like{hasCurrentUserLiked ? 'd' : ''}</button>
						{currentUserObject.userId === postObject.ownerUserId && (
							<PostMoreOptions
								handleEditToggle={handleEditToggle}
								handleDelete={handleDelete}
								handleMoreClick={handleMoreClick}
								isMoreOptionsDisplayed={isMoreOptionsDisplayed}
							/>
						)}
					</div>

					<div className="post-like-count">
						{likeCount}
						{` like${likeCount > 1 ? 's' : ''}`}
					</div>

					<div className="post-caption-and-comments">
						<div className="post-caption">
							<span className="username">
								<Link to={`/user/${postOwnerObject.username}`}>{postOwnerObject.username}</Link>
							</span>{' '}
							{postObject.caption}
						</div>

						{postObject.comments.map((comment) => (
							<Comment key={comment.id} postDocRef={postDocRef} postObject={postObject} comment={comment} currentUserObject={currentUserObject} />
						))}
					</div>

					<div className="posted-at">{getTimeAgo(postObject.postedAt)}</div>

					<CommentInput currentUserObject={currentUserObject} postDocRef={postDocRef} />
				</>
			)}
		</div>
	);
}
