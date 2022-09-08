import React from "react";
import { TwitterTimelineEmbed } from "react-twitter-embed";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
function Widgets() {
	return (
		<div className="mt-2 px-2 hidden lg:inline col-span-2">
			<div className="flex items-center space-x-2 rounded-full bg-gray-100 p-3">
				<MagnifyingGlassIcon className="h-5 w-5" />
				<input
					type="text"
					placeholder="Search Tweets"
					className="flex-1 bg-transparent outline-none"
				/>
			</div>
			<TwitterTimelineEmbed
				sourceType="profile"
				screenName="hanshintigersjp"
				options={{ height: 1000 }}
			/>
		</div>
	);
}

export default Widgets;
