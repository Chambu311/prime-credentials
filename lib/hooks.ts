import { useState, useRef } from "react";

// Default max file size: 500 KB
const MAX_FILE_SIZE = 500 * 1024;

export function useImageUploader() {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > MAX_FILE_SIZE) {
      alert(`Image size exceeds ${MAX_FILE_SIZE / 1024} KB. Please select a smaller image.`);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }
    
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function handleRemoveImage() {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    
    // Revoke object URL to prevent memory leaks
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
  }

  return {
    image,
    imagePreview,
    fileInputRef,
    handleFileChange,
    handleRemoveImage,
  };
}
