import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.send("Khemshield API v1");
});

export default router;
