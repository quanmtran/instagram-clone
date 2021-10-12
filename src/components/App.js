import React, { useState, useEffect } from 'react';
import AppRouter from './AppRouter';
import { authService, userCollection } from 'fbase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import 'App.css'

function App() {
	const [isFirebaseReady, setIsFirebaseReady] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [currentUserObject, setCurrentUserObject] = useState(null);

	const getUserObjectFromFirestore = async (userId) => {
		const userRef = doc(userCollection, userId);
		const userDocSnap = await getDoc(userRef);

		return userDocSnap.data();
	};

	useEffect(() => {
		onAuthStateChanged(authService, async (user) => {
			if (user) {
				const userObjectFirestore = await getUserObjectFromFirestore(user.uid);
				setCurrentUserObject(userObjectFirestore);

				setIsLoggedIn(true);
			} else {
				setIsLoggedIn(false);
			}

			setIsFirebaseReady(true);
		});
	}, []);

	return isFirebaseReady ? (
		<>
			<AppRouter isLoggedIn={isLoggedIn} currentUserObject={currentUserObject} />
		</>
	) : (
		'Loading...'
	);
}

export default App;
