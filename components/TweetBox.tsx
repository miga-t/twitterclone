import React, { useRef, useState } from "react";

import {
	MagnifyingGlassCircleIcon,
	PhotoIcon,
	FaceSmileIcon,
	CalendarDaysIcon,
	MapPinIcon
} from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { Tweet, TweetBody } from "../typings";
import { fetchTweets } from "../utils/fetchTweets";
import toast from "react-hot-toast";
interface Props {
	setTweets: React.Dispatch<React.SetStateAction<Tweet[]>>;
}

function TweetBox({ setTweets }: Props) {
	const [input, setInput] = useState<string>("");
	const [image, setImage] = useState<string>("");

	const imageInputRef = useRef<HTMLInputElement>(null);
	const { data: session } = useSession();
	const [imageUrlBoxIsOpen, setImageUrlBoxIsOpen] = useState<boolean>(false);

	const addImageToTweet = (
		e: React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
	) => {
		e.preventDefault();
		if (!imageInputRef.current?.value) return;
		setImage(imageInputRef.current.value);
		imageInputRef.current.value = "";
		setImageUrlBoxIsOpen(false);
	};

	const postTweet = async () => {
		const tweetInfo: TweetBody = {
			text: input,
			username: session?.user?.name || "Unknown User",
			profileImage: session?.user?.image || "./account.png",
			image: image
		};
		const result = await fetch(`/api/addTweet`, {
			body: JSON.stringify(tweetInfo),
			method: "post"
		});
		const json = await result.json();

		const newTweets = await fetchTweets();
		setTweets(newTweets);

		toast("Tweet Posted", {
			icon: "🚀"
		});
	};

	const handleSubmit = (
		e: React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
	) => {
		e.preventDefault();

		postTweet();

		setInput("");
		setImage("");
		setImageUrlBoxIsOpen(false);
	};

	return (
		<div className="flex space-x-2 p-5">
			<img
				src={session?.user?.image || "./account.png"}
				className="h-14 w-14 rounded-full object-cover mt-4"
			/>

			<div className="flex flex-1 items-center pl-2">
				<form className="flex flex-1 flex-col">
					<input
						value={input}
						onChange={(e) => setInput(e.target.value)}
						type="text"
						placeholder="What's Happening"
						className="h-24 w-full text-xl outline-none placeholder:text-xl"
					/>
					<div className="flex items-center">
						<div className="flex space-x-2 text-twitter flex-1">
							<PhotoIcon
								onClick={() =>
									setImageUrlBoxIsOpen(!imageUrlBoxIsOpen)
								}
								className="h-5 w-5 cursor-pointer transition-transform duration-150 ease-out hover:scale-150"
							/>
							<MagnifyingGlassCircleIcon className="h-5 w-5" />
							<FaceSmileIcon className="h-5 w-5" />
							<CalendarDaysIcon className="h-5 w-5" />
							<MapPinIcon className="h-5 w-5" />
						</div>

						<button
							onClick={handleSubmit}
							disabled={!input || !session}
							className="bg-twitter px-5 py-2 text-white rounded-full disabled:opacity-40"
						>
							Tweet
						</button>
					</div>

					{imageUrlBoxIsOpen && (
						<form className="mt-5 flex rounded-lg bg-twitter/80 py-2 px-4">
							<input
								ref={imageInputRef}
								className="flex-1 bg-transparent p-2 text-white outline-none placeholder:text-white"
								type="text"
								placeholder="Enter Image URL ..."
							/>
							<button
								type="submit"
								onClick={addImageToTweet}
								className="font-bold text-white"
							>
								Add Image
							</button>
						</form>
					)}
					{image && (
						<img
							className="mt-10 h-40 w-full rounded-xl object-contain shadow-lg"
							src={image}
							alt=""
						/>
					)}
				</form>
			</div>
		</div>
	);
}

export default TweetBox;
