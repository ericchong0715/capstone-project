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
    setPosts((prevPosts) =>
      prevPosts.filter((post) => post._id !== deletedPostId)
    );
  };

  const handleReplyCreated = (newReply) => {
    setPosts((prevPosts) => {
      return prevPosts.map((post) => {
        if (post._id === newReply.parentPost) {
          return {
            ...post,
            replies: [newReply, ...(post.replies || [])],
          };
        }
        return post;
      });
    });
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
    <div className="container mt-4">
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
