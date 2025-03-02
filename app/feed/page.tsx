import { MoreHorizontal } from "lucide-react";
import AddPost from "../components/add-post";
import { getPosts } from "@/lib/actions/posts/posts.controller";
import { PublicPost } from "@/lib/types";
import Link from "next/link";
import LoadingSpinner from "../components/loader";
import { Suspense } from "react";
 async function FeedPage() {
    const { data, error } = await getPosts();
    if (error) {
        console.error(error);
    }
    return (
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Discussion Feed</h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Join the conversation and share your thoughts.</p>
            </div>

            {/* New Comment Input */}
            <AddPost />

            {/* Posts List */}
            <div className="space-y-6">
                {data?.length === 0 && (
                    <div className="text-center py-10">
                        <p className="text-gray-500 dark:text-gray-400">No posts yet. Be the first to share something!</p>
                    </div>
                )}

                {data?.map((post: PublicPost) => {
                    // Format the timestamp
                    const formattedDate = new Date(post.created_at).toLocaleString();

                    // Get first letter of email for avatar
                    const avatarInitial = post.user_email ? post.user_email.charAt(0).toUpperCase() : "U";

                    return (
                        <div key={post.id} className="overflow-hidden rounded-lg bg-white shadow-sm dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                            <div className="px-6 py-5">
                                {/* User info and post header */}
                                <div className="flex items-start space-x-3">
                                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                                        <span className="font-medium text-white">{avatarInitial}</span>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-base font-medium text-gray-900 dark:text-white">
                                                    {post.user_email?.split('@')[0] || "Anonymous"}
                                                </h3>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{formattedDate}</p>
                                            </div>
                                            <Link
                                                href={`/feed/post/${post.id}`}
                                                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                <MoreHorizontal className="h-5 w-5" />
                                            </Link>
                                        </div>

                                        {/* Post content */}
                                        <div className="mt-3">
                                            <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap break-words">
                                                {post.content}
                                            </p>

                                            {/* Post image if available */}
                                            {post.image && (
                                                <div className="mt-3 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                                                    <div className="relative h-64 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                                                        <img
                                                            src={post.image}
                                                            alt="Post attachment"
                                                            className="max-h-64 max-w-full object-contain"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function FeedPageWrapper() {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <FeedPage />
        </Suspense>
    );
}