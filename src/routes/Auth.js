import React, { useState } from 'react';
import { authService, storageService } from 'fbase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref, getDownloadURL } from 'firebase/storage';
import { Redirect } from 'react-router-dom';

export default function Auth({ isLoggedIn }) {
	const [loginState, setLoginState] = useState(true);
	const [emailInput, setEmailInput] = useState('');
	const [passwordInput, setPasswordInput] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [usernameInput, setUsernameInput] = useState('');

	const newAccountToggle = () => {
		setLoginState((prev) => !prev);
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
			if (loginState) {
				await signInWithEmailAndPassword(authService, emailInput, passwordInput);
			} else {
				const userCredential = await createUserWithEmailAndPassword(authService, emailInput, passwordInput);
				const DEFAULT_PROFILE_PIC_URL = await getDownloadURL(ref(storageService, 'default-profile-pic.jpg'));
				await updateProfile(userCredential.user, {
					displayName: usernameInput,
					photoURL: DEFAULT_PROFILE_PIC_URL,
				});
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
				{!loginState && (
					<div>
						<label>
							Username
							<input name="username" type="text" value={usernameInput} placeholder="Username" onChange={handleInputChange} required />
						</label>
					</div>
				)}

				<div>
					<input type="submit" value={loginState ? 'Log in' : 'Sign up'} />
					{errorMessage}
				</div>
			</form>
			<button onClick={newAccountToggle}>{loginState ? 'I am new here' : 'I already have an account'}</button>
		</div>
	);
}
