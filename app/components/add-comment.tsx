"use client";

import { createComment } from "@/lib/actions/comments/comments.controller";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function AddComment(props: { userEmail: string,  postId: string}) {
    const avatarInitial = props.userEmail ? props.userEmail.charAt(0).toUpperCase() : "U";
    const [content, setContent] = useState("");
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (content.trim() === "") {
            alert("Please enter a comment");
            return;
        }
        setLoading(true);
        try {
            await createComment(content, props.postId);
            setContent("");
            alert("Comment posted successfully");
            router.refresh();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="flex items-start space-x-3 mb-6">
            <div className="h-8 w-8 flex-shrink-0 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                <span className="font-medium text-indigo-800 dark:text-indigo-200 text-sm">{avatarInitial}</span>
            </div>
            <div className="flex-1">
                <div className="rounded-md border border-gray-300 dark:border-gray-600 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 overflow-hidden">
                    <textarea
                        rows={2}
                        className="block w-full resize-none border-0 bg-transparent py-2 px-3 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-0 sm:text-sm"
                        placeholder="Write a comment..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>
                <div className="mt-2 flex justify-end">
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="inline-flex cursor-pointer items-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        disabled={loading}
                    >
                        {loading ? "Posting..." : "Post Comment"}
                    </button>
                </div>
            </div>
        </div>
    )
}