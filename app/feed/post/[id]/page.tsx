import { MoreHorizontal, ArrowLeft } from "lucide-react";
import { getPostById } from "@/lib/actions/posts/posts.controller";
import Link from "next/link";
import { getUser } from "@/lib/supabase/server";
import AddComment from "@/app/components/add-comment";
import { PublicComment } from "@/lib/types";
export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: post, error } = await getPostById(id);
  const user = await getUser();

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Error Loading Post</h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            We couldn&apos;t load this post. Please try again later.
          </p>
          <Link
            href="/feed"
            className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to feed
          </Link>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Post Not Found</h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            The post you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link
            href="/feed"
            className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to feed
          </Link>
        </div>
      </div>
    );
  }

  // Format the timestamp
  const formattedDate = new Date(post.created_at).toLocaleString();

  // Get first letter of email for avatar
  const avatarInitial = post.user_email ? post.user_email.charAt(0).toUpperCase() : "U";
  const username = post.user_email?.split('@')[0] || "Anonymous";

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/feed"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to feed
        </Link>
      </div>

      {/* Post card */}
      <div className="overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        {/* Post header */}
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 flex-shrink-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="font-medium text-white text-lg">{avatarInitial}</span>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {username}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{formattedDate}</p>
            </div>
            <div className="ml-auto">
              <button className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Post content */}
        <div className="px-6 py-5">
          {/* Text content */}
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap break-words text-base leading-relaxed">
              {post.content}
            </p>
          </div>

          {/* Post image if available */}
          {post.image && (
            <div className="mt-4 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="relative h-80 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <img
                  src={post.image}
                  alt="Post attachment"
                  className="max-h-80 max-w-full object-contain"
                />
              </div>
            </div>
          )}


          {/* Comments section */}
          <div className="bg-gray-50 dark:bg-gray-900 px-6 py-5 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Comments</h3>
            {/* Comment input */}
            {user ? (
              <AddComment userEmail={user.email || ""} postId={post.id} />
            ) : (
              <div className="text-center py-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400">Please login to comment</p>
              </div>
            )}

            {/* Comments list */}
            {post.comment && post.comment.length > 0 ? (
              <div className="space-y-4 mb-6">
                {post.comment.map((comment: PublicComment) => {
                  const commentAvatarInitial = comment.user_email ? comment.user_email.charAt(0).toUpperCase() : "U";
                  // Format comment timestamp
                  const commentDate = new Date(comment.created_at || Date.now()).toLocaleString();

                  return (
                    <div key={comment.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                      <div className="flex items-start space-x-3">
                        <div className="h-8 w-8 flex-shrink-0 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center">
                          <span className="font-medium text-white text-sm">{commentAvatarInitial}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{comment.user_email} • {commentDate}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap break-words">
                              {comment.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 mb-6">
                <p className="text-gray-500 dark:text-gray-400">No comments yet. Be the first to share your thoughts!</p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
