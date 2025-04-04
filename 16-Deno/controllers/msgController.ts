import { Context } from '@oak/oak';

const allMsgs = ({ response }: Context) => {
  response.body = { message: 'Yo' };
};

const newMsg = async ({ response }: Context) => {
  response.body = { message: 'POSTED!!!' };
};

const editMsg = async ({}: Context) => {};

const deleteMsg = async ({}: Context) => {};

export { allMsgs, newMsg, editMsg, deleteMsg };
