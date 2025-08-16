# SocMed - A Thread-like Social Media Web Application

This project is a social media web application, inspired by Thread, built with a MERN (MongoDB, Express.js, React, Node.js) stack.

## Project Structure

- `backend/`: Contains the Node.js/Express.js server with MongoDB for the API.
- `socmed/`: Contains the React.js frontend application.

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud-hosted)

### 1. Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create a `.env` file:**
    In the `backend/` directory, create a file named `.env` and add the following environment variables:
    ```
    MONGODB_URI=your_mongodb_connection_string_here
    JWT_SECRET=your_super_secret_jwt_key_here
    PORT=3000
    ```
    *Replace `your_mongodb_connection_string_here` with your MongoDB connection URI.* 
    *Replace `your_super_secret_jwt_key_here` with a strong, random string for JWT token signing.* 

4.  **Start the backend server:**
    ```bash
    node index.js
    ```
    The backend server should now be running on `http://localhost:3000` (or your specified `PORT`).

### 2. Frontend Setup

1.  **Open a new terminal and navigate to the frontend directory:**
    ```bash
    cd socmed
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the frontend development server:**
    ```bash
    npm run dev
    ```
    The frontend application should now be running on `http://localhost:5173` (or a similar port provided by Vite).

## Features Implemented

- **User Authentication**: Register, Login, and Logout functionality.
- **Post Management**: Create new posts with text and optional images.
- **Feed Display**: View all posts in a feed.
- **Replies**: Reply to existing posts, creating threaded conversations.
- **Post Deletion**: Users can delete their own posts.

## Future Improvements

- User profiles and editing.
- Liking/unliking posts.
- Following/unfollowing users.
- Real-time updates (e.g., with WebSockets).
- Enhanced UI/UX.
