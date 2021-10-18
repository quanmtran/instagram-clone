import React from 'react';
import LikeListUserCard from './LikeListUserCard';

export default function LikeList({ toggleLikeListDisplayed, likeList }) {
	return (
		<div className="like-list-page">
			<div className="like-list-container">
				<div>
					Likes
					<span className="material-icons" onClick={toggleLikeListDisplayed}>
						close
					</span>
				</div>
				<div>
					{likeList.map((userObject) => (
						<LikeListUserCard key={userObject.userId} userObject={userObject} />
					))}
				</div>
			</div>
		</div>
	);
}
