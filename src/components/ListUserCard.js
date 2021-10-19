import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userCollection } from 'fbase';
import { doc, getDoc } from 'firebase/firestore';

export default function ListUserCard({ userId }) {
	const [userObject, setUserObject] = useState({});
	const [isUserDataReady, setIsUserDataReady] = useState(false);

	useEffect(async () => {
		const docSnap = await getDoc(doc(userCollection, userId));
		setUserObject(docSnap.data());
		setIsUserDataReady(true);
	}, []);

	return isUserDataReady ? (
		<div className="user-list-user-card">
			<Link to={`/user/${userObject.username}`}>
				<div className="profile-img" style={{ backgroundImage: `url(${userObject.profileImgUrl})` }}></div>
			</Link>
			<div>
				<Link to={`/user/${userObject.username}`}>
					<span className="username">{userObject.username}</span>
				</Link>
				<span className="name">{userObject.name}</span>
			</div>
		</div>
	) : (
		''
	);
}
