import { RequestHandler } from "express";
import captainsLog from "../util/captainsLog";

const markAsRead: RequestHandler = async (req, res, next) => {
  const user = req.user;
  if (!user) {
    res.status(403).json({ message: 'Access denied: missing authentication' });
    return;
  }
  try {
    await user.populate({
        path: 'friends.user', // Populate the user field of each friend
      select: '-email -password -friends', // remove unwanted fields
       match: { 'friends.meta.show': true }, // Only populate friends whose meta.show is true
    });

    user.friends.forEach(({ meta }) => meta!.read = true); // meta is created by schema
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    captainsLog(5, 'markAsRead Catch', error);
    res.status(500).json({ message: 'unable to update notifications' });
  }
};

export { markAsRead };
