import express from "express";
import { currentUser } from "@tikity/common";
import { requireAuth } from "@tikity/common";

const router = express.Router();

router.get("/api/users/currentuser", currentUser, (req, res) => {
  return res.send({ currentUser: req.currentUser || null })
})

export { router as currentUserRouter };