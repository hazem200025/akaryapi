import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  addRequest,
  deleteRequest,
  getRequest,
  getRequests,
  updateRequest,
  addComment,
  addPostToRequest
} from "../controllers/request.controller.js";

const router = express.Router();

router.get("/", getRequests);
router.get("/:id", getRequest);
router.post("/", verifyToken, addRequest);
router.put("/:id", verifyToken, updateRequest);
router.delete("/:id", verifyToken, deleteRequest);
router.post("/:id/comments", verifyToken, addComment);
router.post("/:id/savedPosts",verifyToken,addPostToRequest);

export default router;
