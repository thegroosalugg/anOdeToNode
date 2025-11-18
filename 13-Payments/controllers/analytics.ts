import { RequestHandler } from "express";
import Analytics from "../models/Analytics";

export const postAnalytics: RequestHandler = async (req, res, next) => {
  const { path, ua, screen } = req.body;
  if (!ua) return;
  try {
    await Analytics.create({ path, ua, screen });
    res.status(200).json({ ok: true });
  } catch {}
};
