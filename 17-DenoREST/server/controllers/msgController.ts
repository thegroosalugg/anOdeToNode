import { Context } from '@oak/oak';
import { RouterContext } from '@oak/oak';
import Msg from '../models/Msg.ts';

const allMsgs = async ({ response }: Context) => {
  const msgs = await Msg.getAll();
  response.body = msgs;
};

const newMsg = async ({ request, response }: Context) => {
  const { text } = await request.body.json();
  const msg = new Msg(text);
  const res = await msg.save();
  response.body = res;
};

const editMsg = async ({
   request,
  response,
    params: { msgId },
}: RouterContext<'/edit/:msgId'>) => {
  const { text } = await request.body.json();
  const msg = new Msg(text, msgId);
  const res = await msg.save();
  response.body = res;
};

const deleteMsg = async ({
  response,
    params: { msgId },
}: RouterContext<'/delete/:msgId'>) => {
  const res = await Msg.delete(msgId);
  response.body = res;
};

export { allMsgs, newMsg, editMsg, deleteMsg };
