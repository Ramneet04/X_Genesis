import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { setDocumentUrl, setPlagiarismInfo } from "@/slices/nft";

interface PlagiarismResult {
  isPlagiarised: boolean;
  plagiarismScore: number;
  matches: any[];
}

interface UploadPDFProps {
  category: string;
  onUpload: (url: string, plagiarism: PlagiarismResult) => void;
}

export default function UploadPDF({ category, onUpload }: UploadPDFProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Only PDF files are accepted.");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError("File must be under 20 MB.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("pdf", file);
      formData.append("category", category);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/upload/upload-pdf`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error ?? `Server error ${response.status}`);
      }

      const data = await response.json();

      const { url, isPlagiarised, plagiarismScore, matches } = data;

      dispatch(setDocumentUrl(url));
      dispatch(setPlagiarismInfo({ isPlagiarised, plagiarismScore, matches }));

      onUpload(url, { isPlagiarised, plagiarismScore, matches });
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message ?? "Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="block text-sm font-medium text-gray-200 mb-1">
        Upload PDF Document
      </label>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        className="block w-full text-sm text-gray-300
          file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0
          file:text-sm file:font-semibold file:bg-cyan-700/80 file:text-white
          hover:file:bg-cyan-800/90 transition disabled:opacity-50"
        onChange={handleFileChange}
        disabled={uploading}
      />

      {uploading && (
        <div className="flex items-center gap-2 text-cyan-400 text-xs">
          <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          Uploading & checking plagiarism…
        </div>
      )}

      {error && (
        <span className="text-red-400 text-xs">{error}</span>
      )}
    </div>
  );
}