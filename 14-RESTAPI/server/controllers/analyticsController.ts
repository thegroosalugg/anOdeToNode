import { RequestHandler } from "express";
import Analytics from "../models/Analytics";
import AppError from "../models/Error";

export const postAnalytics: RequestHandler = async (req, res, next) => {
  const { path, ua, screen } = req.body;

  if (!ua) return next(new AppError(400, "No user agent data"));
  try {
    await Analytics.create({ path, ua, screen });
    res.status(200).json({ ok: true });
  } catch (error) {
    next(new AppError(500, "Analytics failed", error));
  }
};
