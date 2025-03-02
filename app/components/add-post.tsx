"use client";

import { useState } from "react";
import { Image, X } from "lucide-react";
import { useUser } from "@/lib/contexts";
import { useRouter } from "next/navigation";
import { createPost } from "@/lib/actions/posts/posts.controller";
import { useImageUploader } from "@/lib/hooks";

export default function AddPost() {
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useUser();
    const router = useRouter();
    const { image, imagePreview, fileInputRef, handleFileChange, handleRemoveImage } = useImageUploader();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            // If user is not logged in, show login dialog
            const loginDialog = document.getElementById("login-dialog") as HTMLDialogElement;
            if (loginDialog) loginDialog.showModal();
            return;
        }
        if (!content.trim() && !image) {
            alert("Please enter a message or select an image");
            return;
        }
        
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("content", content);
            if (image) {
                formData.append("image", image);
            }
            
            const result = await createPost(formData);
            
            if (result.error) {
                alert(`Error: ${result.error}`);
                return;
            }
            setContent("");
            handleRemoveImage();
            router.refresh();
        } catch (error) {
            console.error("Error posting:", error);
            alert("Failed to submit post");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mb-8 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <form onSubmit={handleSubmit}>
                <div className="flex items-start space-x-4">
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                        <span className="font-medium text-indigo-800 dark:text-indigo-200">
                            {user ? (user.name ? user.name.charAt(0) : user.email.charAt(0).toUpperCase()) : "G"}
                        </span>
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="rounded-md border border-gray-300 dark:border-gray-600 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
                            <textarea
                                rows={3}
                                className="block w-full resize-none border-0 bg-transparent py-3 px-4 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-0 sm:text-sm"
                                placeholder={user ? "What's on your mind?" : "Sign in to post a message..."}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                disabled={!user || isSubmitting}
                            />
                        </div>

                        {/* Image Preview */}
                        {imagePreview && (
                            <div className="mt-3 relative">
                                <div className="relative rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                                    <img 
                                        src={imagePreview} 
                                        alt="Preview" 
                                        className="max-h-64 w-auto mx-auto object-contain"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="absolute top-2 right-2 p-1 bg-gray-800 bg-opacity-70 rounded-full text-white hover:bg-opacity-100 transition-all"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                        
                        <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center space-x-5">
                                {/* Hidden file input */}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="hidden"
                                    disabled={!user || isSubmitting}
                                />
                                
                                {/* Image upload button */}
                                <button 
                                    type="button" 
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={!user || isSubmitting}
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="sr-only">Attach image</span>
                                    <Image className="h-5 w-5" />
                                </button>
                            </div>
                            <button
                                type="submit"
                                disabled={(!content.trim() && !image) || !user || isSubmitting}
                                className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                                {isSubmitting ? "Posting..." : "Post"}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}