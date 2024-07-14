import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

// Get multiple requests based on query parameters
export const getRequests = async (req, res) => {
  const query = req.query;

  try {
    const requests = await prisma.request.findMany({
      where: {
        approved: true,
        city: query.city || undefined,
        type: query.type || undefined,
        property: query.property || undefined,
        price: {
          gte: parseInt(query.minPrice) || undefined,
          lte: parseInt(query.maxPrice) || undefined,
        },
      },
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                username: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    res.status(200).json(requests);
  } catch (err) {
    console.error("Failed to get requests:", err);
    res.status(500).json({ message: err.message || "Failed to get requests" });
  }
};

// Get a single request by ID
export const getRequest = async (req, res) => {
  const id = req.params.id;
  try {
    const request = await prisma.request.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                username: true,
                avatar: true,
              },
            },
          },
        },
        savedPostRequests: {
          include: {
            post: true, // Include the post associated with the savedPostRequest
          },
        },
      },
    });

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json(request);
  } catch (err) {
    console.error("Failed to get request:", err);
    res.status(500).json({ message: err.message || "Failed to get request" });
  }
};


// Add a new request
export const addRequest = async (req, res) => {
  const body = req.body;
  const tokenUserId = req.userId;

  try {
    const newRequest = await prisma.request.create({
      data: {
        ...body,
      },
    });

    res.status(200).json(newRequest);
  } catch (err) {
    console.error("Failed to create request:", err);
    res.status(500).json({ message: err.message || "Failed to create request" });
  }
};

// Update a request
export const updateRequest = async (req, res) => {
  const id = req.params.id;
  const body = req.body;

  try {
    const updatedRequest = await prisma.request.update({
      where: { id },
      data: body,
    });

    res.status(200).json(updatedRequest);
  } catch (err) {
    console.error("Failed to update request:", err);
    res.status(500).json({ message: err.message || "Failed to update request" });
  }
};

// Delete a request
export const deleteRequest = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  try {
    const request = await prisma.request.findUnique({
      where: { id },
      include: {
        comments: true, // Include comments to delete related records
      },
    });

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.userId !== tokenUserId) {
      return res.status(403).json({ message: "Not Authorized!" });
    }

    // Check if there are any comments and delete them
    if (request.comments.length > 0) {
      console.log(`Deleting ${request.comments.length} comments for request ${id}`);
      await prisma.comment.deleteMany({
        where: { requestId: id },
      });
    } else {
      console.log(`No comments found for request ${id}`);
    }

    // Delete the Request entry
    await prisma.request.delete({
      where: { id },
    });

    res.status(200).json({ message: "Request deleted" });
  } catch (err) {
    console.error("Failed to delete request:", err);
    res.status(500).json({ message: err.message || "Failed to delete request" });
  }
};

export const addComment = async (req, res) => {
  const { text } = req.body;
  const requestId = req.params.id;
  const userId = req.userId;

  // Sanitize and validate text input (example, adjust as per your needs)
  const sanitizedText = text.replace(/<script.*?>.*?<\/script>/gi, ''); // Remove script tags

  try {
    const newComment = await prisma.comment.create({
      data: {
        text: sanitizedText,
        userId,
        requestId,
      },
      include: {
        user: true, // Include the user details
      },
    });

    res.status(200).json(newComment);
  } catch (err) {
    console.error("Failed to add comment:", err);
    res.status(500).json({ message: err.message || "Failed to add comment" });
  }
};
// Backend
export const addPostToRequest = async (req, res) => {
  const requestId = req.params.id;
  const { postId } = req.body;
  const userId = req.userId; // Assuming you have userId available in req.user

  try {
    // Create new saved post
    const newSavedPost = await prisma.savedPostRequest.create({
      data: {
        postId: postId,
        userId: userId,
        requestId: requestId,
      },
    });

    res.status(200).json(newSavedPost);
  } catch (err) {
    if (err.code === 'P2002' && err.meta.target === 'SavedPost_userId_postId_key') {
      // Handle unique constraint violation error
      return res.status(200).json({ message: "Post already saved by the user" });
    }
    
    console.error("Failed to add post to request:", err);
    res.status(500).json({ message: err.message || "Failed to add post to request" });
  }
};