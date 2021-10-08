import React, { useState, useEffect } from 'react';
import AppRouter from './AppRouter';
import { authService } from 'fbase';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [userObject, setUserObject] = useState(null);
	const [isFirebaseReady, setIsFirebaseReady] = useState(false);

	useEffect(() => {
		onAuthStateChanged(authService, (user) => {
			if (user) {
				setUserObject(user);
				setIsLoggedIn(true);
			} else {
				setIsLoggedIn(false);
			}

			setIsFirebaseReady(true);
		});
	}, []);

	return isFirebaseReady ? (
		<>
			<AppRouter isLoggedIn={isLoggedIn} userObject={userObject} />
		</>
	) : (
		'Loading...'
	);
}

export default App;
