import React, { useEffect, useState } from "react";
import { Comment, CommentBody, Tweet } from "../typings";
import Timeago from "react-timeago";

import {
	ChatBubbleLeftRightIcon,
	HeartIcon,
	ArrowDownTrayIcon,
	ArrowsRightLeftIcon
} from "@heroicons/react/24/outline";
import { fetchComments } from "../utils/fetchComments";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

interface Props {
	tweet: Tweet;
}

function Tweet({ tweet }: Props) {
	const [comments, setComments] = useState<Comment[]>([]);
	const [commentBoxVisible, setCommentBoxVisible] = useState<boolean>(false);
	const [input, setInput] = useState<string>("");

	const refreshComments = async () => {
		const comments: Comment[] = await fetchComments(tweet._id);
		setComments(comments);
	};

	const { data: session } = useSession();

	useEffect(() => {
		refreshComments();
	}, []);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const commentToast = toast.loading("Posting Comment...");

		const comment: CommentBody = {
			comment: input,
			tweetId: tweet._id,
			username: session?.user?.name || "Unknown User",
			profileImage: session?.user?.image || "./account.png"
		};
		const result = await fetch(`/api/addComment`, {
			body: JSON.stringify(comment),
			method: "POST"
		});

		console.log("WOOHOO we made it", result);
		toast.success("Comment Posted!", {
			id: commentToast
		});

		setInput("");
		setCommentBoxVisible(false);
		refreshComments();
	};

	return (
		<div className="flex flex-col space-x-3 border-y p-5 border-gray-300">
			<div className="flex space-x-3">
				<img
					src={tweet.profileImage}
					alt="aho"
					className="h-10 w-10 rounded-full object-cover"
				/>

				<div>
					<div className="flex items-center space-x-1">
						<p className="mr-1 font-bold">{tweet.username}</p>
						<p className="hidden text-sm text-gray-500 sm:inline">
							@{tweet.username.replace(/\s+/g, "").toLowerCase()}
						</p>

						<Timeago
							className="text-sm text-gray-500"
							date={tweet._createdAt}
						/>
					</div>

					<p className="pt-1">{tweet.text}</p>

					{tweet.image && (
						<img
							src={tweet.image}
							alt=""
							className="m-5 ml-0 mb-1 max-h-60 rounded-lg object-cover shadow-sm"
						/>
					)}
				</div>
			</div>

			<div className="mt-5 flex justify-between">
				<div className="flex cursor-pointer items-center space-x-3 text-gray-400">
					<ChatBubbleLeftRightIcon
						onClick={() =>
							session && setCommentBoxVisible(!commentBoxVisible)
						}
						className="h-5 w-5"
					/>
					<p>{comments.length}</p>
				</div>
				<div className="flex cursor-pointer items-center space-x-3 text-gray-400">
					<ArrowsRightLeftIcon className="h-5 w-5" />
				</div>
				<div className="flex cursor-pointer items-center space-x-3 text-gray-400">
					<HeartIcon className="h-5 w-5" />
				</div>
				<div className="flex cursor-pointer items-center space-x-3 text-gray-400">
					<ArrowDownTrayIcon className="h-5 w-5" />
				</div>
			</div>

			{commentBoxVisible && (
				<form onSubmit={handleSubmit} className="mt-3 flex space-x-3">
					<input
						value={input}
						onChange={(e) => setInput(e.target.value)}
						type="text"
						placeholder="Write a comment ..."
						className="flex-1 rounded-lg bg-gray-100 p-2 outline-none"
					/>
					<button
						disabled={!input}
						type="submit"
						className="text-twitter disabled:text-gray-200"
					>
						Post
					</button>
				</form>
			)}

			{comments?.length > 0 && (
				<div className="my-2 mt-5 max-h-44 space-y-5 overflow-y-scroll border-t border-gray-100 p-5">
					{comments.map((comment) => (
						<div
							key={comment._id}
							className="relative flex space-x-2"
						>
							<hr className="absolute left-5 top-8 h-8 border-x border-twitter/30" />
							<img
								src={comment.profileImage}
								className="h-7 w-7 rounded-full object-cover"
								alt=""
							/>
							<div>
								<div className="flex items-center space-x-1">
									<p className="mr-1 font-bold ">
										{comment.username}
									</p>
									<p className="hidden text-sm text-gray-500 lg:inline">
										@
										{comment.username
											.replace(/\s+/g, "")
											.toLowerCase()}
									</p>
									<Timeago
										className="text-sm text-gray-500"
										date={tweet._createdAt}
									/>
								</div>
								<p>{comment.comment}</p>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

export default Tweet;
