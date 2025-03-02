"use client";

import { createComment } from "@/lib/actions/comments/comments.controller";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useImageUploader } from "@/lib/hooks";
import { Image as ImageIcon, X } from "lucide-react";

export default function AddComment(props: { userEmail: string, postId: string}) {
    const avatarInitial = props.userEmail ? props.userEmail.charAt(0).toUpperCase() : "U";
    const { image, imagePreview, fileInputRef, handleFileChange, handleRemoveImage, } = useImageUploader();
    const [content, setContent] = useState("");
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (content.trim() === "" && !image) {
            alert("Please enter a comment or add an image");
            return;
        }
        setLoading(true);
        try {
            // Create FormData to handle both text and image
            const formData = new FormData();
            formData.append("content", content);
            if (image) {
                formData.append("image", image);
            }
            
            await createComment(formData, props.postId);
            setContent("");
            handleRemoveImage();
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Failed to post comment");
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
                        disabled={loading}
                    />
                </div>
                
                {/* Image Preview */}
                {imagePreview && (
                    <div className="mt-2 relative">
                        <div className="relative rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                            <img 
                                src={imagePreview} 
                                alt="Preview" 
                                className="max-h-40 w-auto mx-auto object-contain"
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
                
                <div className="mt-2 flex justify-between items-center">
                    <div>
                        {/* Hidden file input */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                            disabled={loading}
                        />
                        
                        {/* Image upload button */}
                        <button 
                            type="button" 
                            onClick={() => fileInputRef.current?.click()}
                            disabled={loading}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed p-1"
                        >
                            <span className="sr-only">Attach image</span>
                            <ImageIcon className="h-5 w-5" />
                        </button>
                    </div>
                    
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="inline-flex cursor-pointer items-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        {loading ? "Posting..." : "Post Comment"}
                    </button>
                </div>
            </div>
        </div>
    )
}