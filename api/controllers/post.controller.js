import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

// Get multiple posts based on query parameters
export const getPosts = async (req, res) => {
  const query = req.query;

  try {
    const posts = await prisma.post.findMany({
      where: {
        approved: true,
        city: query.city || undefined,
        type: query.type || undefined,
        property: query.property || undefined,
        bedroom: parseInt(query.bedroom) || undefined,
        price: {
          gte: parseInt(query.minPrice) || undefined,
          lte: parseInt(query.maxPrice) || undefined,
        },
      },
    });

    res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get posts" });
  }
};

// Get a single post by ID and check if it is saved
export const getPost = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        postDetail: true,
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const token = req.cookies?.token;

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if (err) {
          return res.status(200).json({ ...post, isSaved: false });
        }

        const saved = await prisma.savedPost.findUnique({
          where: {
            userId_postId: {
              postId: id,
              userId: payload.id,
            },
          },
        });

        return res.status(200).json({ ...post, isSaved: !!saved });
      });
    } else {
      return res.status(200).json({ ...post, isSaved: false });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get post" });
  }
};

// Add a new post
export const addPost = async (req, res) => {
  const body = req.body;
  const tokenUserId = req.userId;

  try {
    const newPost = await prisma.post.create({
      data: {
        ...body.postData,
        userId: tokenUserId,
        postDetail: {
          create: body.postDetail,
        },
      },
    });

    res.status(200).json(newPost);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to create post" });
  }
};

export const updatePost = async (req, res) => {
  const id = req.params.id;
  const body = req.body;

  try {
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title: body.title,
        price: parseInt(body.price),
        address: body.address,
        city: body.city,
        bedroom: parseInt(body.bedroom),
        bathroom: parseInt(body.bathroom),
        type: body.type,
        property: body.property,
        latitude: body.latitude,
        longitude: body.longitude,
        images: body.images,
        postDetail: {
          update: {
            desc: body.desc,
            utilities: body.utilities,
            pet: body.pet,
            income: body.income,
            size: parseInt(body.size),
            school: parseInt(body.school),
            bus: parseInt(body.bus),
            restaurant: parseInt(body.restaurant),
          },
        },
      },
    });

    res.status(200).json(updatedPost);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to update post" });
  }
};


// Delete a post
export const deletePost = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        postDetail: true, // Include postDetail to check if it exists
        savedPosts: true, // Include savedPosts to delete related records
        savedPostRequests : true,
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.userId !== tokenUserId) {
      return res.status(403).json({ message: "Not Authorized!" });
    }

    // Check if PostDetail exists and delete it if it does
    if (post.postDetail) {
      console.log(`Deleting PostDetail for post ${id}`);
      await prisma.postDetail.delete({
        where: { postId: id },
      });
    } else {
      console.log(`No PostDetail found for post ${id}`);
    }

    // Check if there are any saved posts and delete them
    if (post.savedPosts.length > 0) {
      console.log(`Deleting ${post.savedPosts.length} SavedPosts for post ${id}`);
      await prisma.savedPost.deleteMany({
        where: { postId: id },
      });
    } else {
      console.log(`No SavedPosts found for post ${id}`);
    }
     // Check if there are any savedpostrequest and delete them
     if (post.savedPostRequests.length > 0) {
      console.log(`Deleting ${post.savedPostRequests.length} SavedPosts for post ${id}`);
      await prisma.savedPostRequest.deleteMany({
        where: { postId: id },
      });
    } else {
      console.log(`No SavedPosts found for post ${id}`);
    }

    // Delete the Post entry
    await prisma.post.delete({
      where: { id },
    });

    res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    console.error("Failed to delete post:", err);
    res.status(500).json({ message: "Failed to delete post" });
  }
};

