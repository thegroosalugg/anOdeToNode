import { Context } from '@oak/oak';
import { RouterContext } from '@oak/oak';
import Msg from '../models/Msg.ts';

const allMsgs = async ({ response }: Context) => {
  const messages = await Msg.getAll();
  response.body = messages;
};

const newMsg = async ({ request, response }: Context) => {
  const { text } = await request.body.json();
  const msg = await Msg.save(text);
  response.body = msg;
};

const editMsg = async ({
   request,
  response,
    params: { msgId },
}: RouterContext<'/edit/:msgId'>) => {
  const { text } = await request.body.json();
  const msg = await Msg.save(text, msgId);
  response.body = msg;
};

const deleteMsg = async ({
  response,
    params: { msgId },
}: RouterContext<'/delete/:msgId'>) => {
  const res = await Msg.delete(msgId);
  response.body = res;
};

export { allMsgs, newMsg, editMsg, deleteMsg };
