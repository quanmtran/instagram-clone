import React, { useState, useEffect } from 'react';
import AppRouter from './AppRouter';
import { authService, userCollection } from 'fbase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import 'App.css';

function App() {
	const [isFirebaseReady, setIsFirebaseReady] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [currentUserObject, setCurrentUserObject] = useState(null);

	const refreshCurrentUserObject = async (currentUserId) => {
		const userDocSnap = await getDoc(doc(userCollection, currentUserId));
		const userObjectFirestore = userDocSnap.data();
		setCurrentUserObject(userObjectFirestore);
	};

	useEffect(() => {
		onAuthStateChanged(authService, async (user) => {
			if (user) {
				await refreshCurrentUserObject(user.uid);

				setIsLoggedIn(true);
			} else {
				setIsLoggedIn(false);
			}

			setIsFirebaseReady(true);
		});
	}, []);

	return isFirebaseReady ? (
		<>
			<AppRouter isLoggedIn={isLoggedIn} currentUserObject={currentUserObject} refreshCurrentUserObject={refreshCurrentUserObject} />
		</>
	) : (
		'Loading...'
	);
}

export default App;
