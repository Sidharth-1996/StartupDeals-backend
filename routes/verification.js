import express from "express";
import User from "../models/user.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.post("/request-verification", protect, async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.verificationStatus === "verified") {
      return res.status(400).json({ message: "Already verified" });
    }

    if (user.verificationStatus === "pending") {
      return res.status(400).json({ message: "Verification already pending" });
    }

    user.verificationStatus = "pending";
    user.verificationRequestedAt = new Date();
    await user.save();

    res.json({
      message: "Verification request submitted",
      verificationStatus: user.verificationStatus,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/approve/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { adminSecret } = req.body;

    if (adminSecret !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.verificationStatus === "verified") {
      return res.status(400).json({ message: "User already verified" });
    }

    user.verificationStatus = "verified";
    await user.save();

    res.json({
      message: "User verified successfully",
      user: {
        id: user._id,
        email: user.email,
        verificationStatus: user.verificationStatus,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/status", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      verificationStatus: user.verificationStatus,
      verificationRequestedAt: user.verificationRequestedAt,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
