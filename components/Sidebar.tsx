import React from "react";
import {
	BellIcon,
	HashtagIcon,
	HomeIcon,
	PaperAirplaneIcon,
	BookmarkIcon,
	InboxStackIcon,
	EllipsisHorizontalCircleIcon,
	UserCircleIcon
} from "@heroicons/react/24/outline";
import SidebarRow from "./SidebarRow";
import { signIn, signOut, useSession } from "next-auth/react";

function Sidebar() {
	const { data: session } = useSession();

	return (
		<div className="col-span-2 flex flex-col">
			<img className="h-10 w-10" src="./images3.png" />
			<SidebarRow Icon={HomeIcon} title="Home" />
			<SidebarRow Icon={HashtagIcon} title="Explore" />
			<SidebarRow Icon={BellIcon} title="Notifications" />
			<SidebarRow Icon={PaperAirplaneIcon} title="Message" />
			<SidebarRow Icon={BookmarkIcon} title="Bookmarks" />
			<SidebarRow Icon={InboxStackIcon} title="Lists" />
			<SidebarRow
				onClick={session ? signOut : signIn}
				Icon={UserCircleIcon}
				title={session ? "Sign Out" : "Sign In"}
			/>
			<SidebarRow Icon={EllipsisHorizontalCircleIcon} title="More" />
		</div>
	);
}

export default Sidebar;
