import React, { useState } from 'react';
import { authService, userCollection } from 'fbase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Redirect } from 'react-router-dom';

export default function Auth({ isLoggedIn }) {
	// States
	const [isLoginState, setIsLoginState] = useState(true);
	const [emailInput, setEmailInput] = useState('');
	const [passwordInput, setPasswordInput] = useState('');
	const [usernameInput, setUsernameInput] = useState('');
	const [errorMessage, setErrorMessage] = useState('');

	const newAccountToggle = () => {
		setIsLoginState((prev) => !prev);
	};

	const handleInputChange = (e) => {
		const {
			target: { name, value },
		} = e;

		switch (name) {
			case 'email':
				setEmailInput(value);
				break;
			case 'password':
				setPasswordInput(value);
				break;
			case 'username':
				setUsernameInput(value);
				break;
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			if (isLoginState) {
				await signInWithEmailAndPassword(authService, emailInput, passwordInput);
			} else {
				const userCredential = await createUserWithEmailAndPassword(authService, emailInput, passwordInput);

				const userId = userCredential.user.uid;
				const userObject = {
					userId: userId,
					username: usernameInput,
					profilePictureUrl: '',
				};

				await setDoc(doc(userCollection, userId), userObject);
			}
		} catch (error) {
			setErrorMessage(error.message);
		}
	};

	return isLoggedIn ? (
		<Redirect to="/home" />
	) : (
		<div>
			<form onSubmit={handleSubmit}>
				<div>
					<label>
						Email
						<input name="email" type="text" value={emailInput} placeholder="Email" onChange={handleInputChange} required />
					</label>
				</div>
				<div>
					<label>
						Password
						<input name="password" type="password" value={passwordInput} placeholder="Password" onChange={handleInputChange} required />
					</label>
				</div>
				{!isLoginState && (
					<div>
						<label>
							Username
							<input name="username" type="text" value={usernameInput} placeholder="Username" onChange={handleInputChange} required />
						</label>
					</div>
				)}

				<div>
					<input type="submit" value={isLoginState ? 'Log in' : 'Sign up'} />
					{errorMessage}
				</div>
			</form>
			<button onClick={newAccountToggle}>{isLoginState ? 'I am new here' : 'I already have an account'}</button>
		</div>
	);
}
