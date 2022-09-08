import React from "react";

interface Props {
	Icon: (props: React.ComponentProps<"svg">) => JSX.Element;
	title: string;
	onClick?: () => {};
}

function SidebarRow({ Icon, title, onClick }: Props) {
	return (
		<div
			onClick={() => onClick?.()}
			className="flex cursor-pointer max-w-fit  items-center space-x-1 rounded-full px-4 py-3  hover:bg-gray-100 transition-all duration-200 group  "
		>
			<Icon className="h-6 w-6" />
			<p className="group-hover:text-twitter">{title}</p>
		</div>
	);
}

export default SidebarRow;
