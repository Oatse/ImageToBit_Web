"use client";

import { useRef, ChangeEvent } from "react";
import { validateImageFile } from "@/utils/imageUtils";

interface ImageUploaderProps {
  onFileSelect: (file: File) => void;
}

export default function ImageUploader({ onFileSelect }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateImageFile(file, 50);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    onFileSelect(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-xl">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={handleClick}
          className="w-full px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-colors duration-200 flex items-center justify-center gap-3"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          Pilih Gambar
        </button>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
          Mendukung JPG, PNG (Maksimal 50MB)
        </p>
      </div>
    </div>
  );
}
