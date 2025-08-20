import { useState, useEffect } from "react";
import { api } from "../api";
import CreatePost from "../components/CreatePost";
import Post from "../components/Post";
import { useAuth } from "../state/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchPosts();
  }, [user, navigate]);

  const fetchPosts = async () => {
    try {
      const response = await api.get("/api/posts");
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  const handleDeletePost = (deletedPostId) => {
    const removePostOrReply = (postsArr) => {
      return postsArr.filter(post => {
        if (post._id === deletedPostId) {
          return false; // This is the post/reply to delete
        } else if (post.replies && post.replies.length > 0) {
          // Recursively filter replies
          post.replies = removePostOrReply(post.replies);
        }
        return true; // Keep this post/reply
      });
    };
    setPosts(prevPosts => removePostOrReply(prevPosts));
  };

  const handleReplyCreated = (newReply) => {
    const updateReplies = (postsArr) => {
      return postsArr.map((post) => {
        if (post._id === newReply.parentPost) {
          return {
            ...post,
            replies: [newReply, ...(post.replies || [])],
          };
        } else if (post.replies && post.replies.length > 0) {
          return {
            ...post,
            replies: updateReplies(post.replies), // Recursively update nested replies
          };
        }
        return post;
      });
    };
    setPosts((prevPosts) => updateReplies(prevPosts));
  };

  if (isLoading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4 mb-5">
      <CreatePost onPostCreated={handlePostCreated} />
      {posts.map((post) => (
        <Post
          key={post._id}
          post={post}
          onReplyCreated={handleReplyCreated}
          onDeletePost={handleDeletePost}
        />
      ))}
    </div>
  );
}
