import { useState } from 'react';
import CreatePost from './CreatePost';
import { api } from "../api";
import { useAuth } from "../state/AuthContext";

export default function Post({ post, onReplyCreated, onDeletePost }) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const { user } = useAuth();

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await api.delete(`/api/posts/${post._id}`);
        onDeletePost(post._id); // Notify parent component to remove the post
      } catch (error) {
        console.error("Error deleting post:", error);
        alert("Failed to delete post.");
      }
    }
  };

  return (
    <div className="card mb-3">
      <div className="card-body">
        <h6 className="card-subtitle mb-2 text-muted">
          {post.author.name} · {new Date(post.createdAt).toLocaleString()}
        </h6>
        <p className="card-text">{post.content}</p>
        {post.image && (
          <img 
            src={`http://localhost:3000${post.image}`} 
            alt="Post attachment" 
            className="img-fluid mb-2 rounded"
            style={{ maxHeight: '300px', objectFit: 'contain' }}
          />
        )}
        <div className="mt-2">
          <button
            className="btn btn-sm btn-outline-primary me-2"
            onClick={() => setShowReplyForm(!showReplyForm)}
          >
            {showReplyForm ? 'Cancel Reply' : 'Reply'}
          </button>
          {user && user.id === post.author._id && (
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={handleDelete}
            >
              Delete
            </button>
          )}
        </div>
        {showReplyForm && (
          <div className="mt-3">
            <CreatePost
              parentPostId={post._id}
              onPostCreated={(newPost) => {
                onReplyCreated(newPost);
                setShowReplyForm(false);
              }}
            />
          </div>
        )}
        {post.replies?.length > 0 && (
          <div className="ms-4 mt-3 border-start ps-3">
            {post.replies.map(reply => (
              <Post
                key={reply._id}
                post={reply}
                onReplyCreated={onReplyCreated}
                onDeletePost={onDeletePost}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}