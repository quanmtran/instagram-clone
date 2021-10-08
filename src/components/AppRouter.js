import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';

// Import components
import AccountPage from 'routes/AccountPage';
import Auth from 'routes/Auth';
import Home from 'routes/Home';

export default function AppRouter({ isLoggedIn, userObject }) {
	return (
		<Router>
			<Switch>
				<Route exact path="/">
					<Auth isLoggedIn={isLoggedIn} />
				</Route>
				<Route exact path="/home">
					<Home isLoggedIn={isLoggedIn} userObject={userObject} />
				</Route>
				<Route path="/user/:username">
					<AccountPage isLoggedIn={isLoggedIn} userObject={userObject} />
				</Route>
			</Switch>
		</Router>
	);
}
