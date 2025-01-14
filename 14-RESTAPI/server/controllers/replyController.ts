import { RequestHandler } from "express";
import Post from "../models/Post";
import Reply from "../models/Reply";
import { getErrors, hasErrors } from "../validation/validators";
import captainsLog from "../util/captainsLog";

const getReplies: RequestHandler = async (req, res, next) => {

}

const postReply: RequestHandler = async (req, res, next) => {
  try {
    const errors = getErrors(req);
    if (hasErrors(errors)) {
      res.status(422).json(errors);
      return;
    }

    const {  postId } = req.params;
    const { content } = req.body;
    const   creator   = req.user;

    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    const reply = new Reply({ post: post._id, content, creator });
    await reply.save();
    res.status(201).json(reply);

  } catch (error) {
    captainsLog(5, 'postReply Catch', error);
    res.status(500).json({ message: "Message couldn't be posted" });
  }
}

export { getReplies, postReply };
