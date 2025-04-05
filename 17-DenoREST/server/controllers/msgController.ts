import { Context } from '@oak/oak';
import { RouterContext } from '@oak/oak';
import Msg from '../models/Msg.ts';

const allMsgs = async ({ response }: Context) => {
  const msgs = await Msg.getAll();
  response.body = msgs;
};

const newMsg = async ({ request, response }: Context) => {
  const { text } = await request.body.json();
  const msgs = await Msg.save(text);
  response.body = msgs;
};

const editMsg = async ({
   request,
  response,
    params: { msgId },
}: RouterContext<'/edit/:msgId'>) => {
  const { text } = await request.body.json();
  const msgs = await Msg.save(text, msgId);
  response.body = msgs;
};

const deleteMsg = async ({
  response,
    params: { msgId },
}: RouterContext<'/delete/:msgId'>) => {
  const msgs = await Msg.delete(msgId);
  response.body = msgs;
};

export { allMsgs, newMsg, editMsg, deleteMsg };
