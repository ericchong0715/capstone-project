const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Create a post
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { content, parentPost } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

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