import express from "express";
import Claim from "../models/Claim.js";
import Deal from "../models/Deal.js";
import protect from "../middleware/auth.js";
import User from "../models/user.js";

const router = express.Router();

router.post("/:dealId", protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const { dealId } = req.params;

    const deal = await Deal.findById(dealId);
    if (!deal) {
      return res.status(404).json({ message: "Deal not found" });
    }

    const user = await User.findById(userId);

    if (deal.isLocked && user.verificationStatus !== "verified") {
      if (user.verificationStatus === "pending") {
        return res.status(403).json({ 
          message: "Verification pending",
          verificationStatus: "pending"
        });
      }
      return res.status(403).json({ 
        message: "Verification required for locked deals",
        verificationStatus: "unverified"
      });
    }

    const existing = await Claim.findOne({
      user: userId,
      deal: dealId,
    });

    if (existing) {
      return res.status(400).json({ message: "Deal already claimed" });
    }

    const claim = await Claim.create({
      user: userId,
      deal: dealId,
      status: "pending",
    });

    res.status(201).json(claim);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/me", protect, async (req, res) => {
  try {
    const claims = await Claim.find({ user: req.user.id })
      .populate("deal");

    res.json(claims);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;