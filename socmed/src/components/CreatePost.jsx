import React, { useState } from "react";
import { api } from "../api";

export default function CreatePost({ onPostCreated, parentPostId = null }) {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("content", content || ""); // Ensure content is always a string
    if (image) formData.append("image", image);
    if (parentPostId) formData.append("parentPost", parentPostId);

    try {
      const response = await api.post(
        "/api/posts",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      onPostCreated(response.data);
      setContent("");
      setImage(null);
    } catch (error) {
      console.error("Error creating post:", error);
      alert(`Failed to create post: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 p-3 border rounded">
      <textarea
        className="form-control mb-2"
        placeholder={
          parentPostId ? "Write a reply..." : "What's on your mind?"
        }
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={isLoading}
      />
      <input
        type="file"
        className="form-control mb-2"
        onChange={(e) => setImage(e.target.files[0])}
        accept="image/*"
        disabled={isLoading}
      />
      <button
        type="submit"
        className="btn btn-primary w-100"
        disabled={isLoading || (!content.trim() && !image)}
      >
        {isLoading ? "Posting..." : parentPostId ? "Reply" : "Post"}
      </button>
    </form>
  );
}
