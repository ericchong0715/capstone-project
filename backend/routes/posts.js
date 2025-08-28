const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const auth = require('../middleware/auth');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinaryStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'socmed_posts',
        format: async (req, file) => 'png', // Convert image to png
        public_id: (req, file) => `post-${Date.now()}-${file.originalname}`,
    },
});

const upload = multer({
    storage: cloudinaryStorage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Create a post
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { content, parentPost } = req.body;
    const image = req.file ? req.file.path : null; // Cloudinary path

    console.log('Received post creation request:');
    console.log('Content:', content);
    console.log('Image file:', req.file);
    console.log('Parent Post ID:', parentPost);

    console.log('Mongoose Post Schema - content required:', Post.schema.path('content').isRequired); // IMPORTANT: Check schema status

    // Validate that either content or an image is provided
    if (!content && !image) {
      return res.status(400).json({ error: 'Post must contain either text or an image.' });
    }

    const post = new Post({
      content: content,
      author: req.user._id,
      parentPost: parentPost || null,
      image: image,
    });

    console.log('Post object before saving:', post); // Log the post object being saved

    await post.save();

    if (post.parentPost) {
      await Post.findByIdAndUpdate(post.parentPost, {
        $push: { replies: post._id }
      });
    }

    await post.populate('author', 'name');
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find({ parentPost: null })
      .populate('author', 'name')
      .populate({
        path: 'replies',
        populate: {
          path: 'author',
          select: 'name'
        }
      })
      .sort('-createdAt');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a post
router.delete('/:id', auth, async (req, res) => {
  try {
    console.log('Delete request received for post ID:', req.params.id);
    console.log('Authenticated user ID (req.user._id):', req.user ? req.user._id : 'Not available');

    const post = await Post.findById(req.params.id);
    if (!post) {
      console.log('Post not found for ID:', req.params.id);
      return res.status(404).json({ error: 'Post not found' });
    }

    console.log('Post author ID:', post.author);

    if (post.author.toString() !== req.user._id.toString()) {
      console.log('Authorization failed: User trying to delete another user\'s post.');
      return res.status(403).json({ error: 'Not authorized' });
    }

    console.log('Post and user match. Proceeding with deletion.');
    await Post.deleteOne({ _id: req.params.id });
    res.json({ message: 'Post deleted' });
  } catch (error) {
    console.error('Error during post deletion:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;