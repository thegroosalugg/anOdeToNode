export default class Msg {
   _id: string;
  text: string;

  constructor(text: string) {
    this._id  = new Date().toISOString();
    this.text = text;
  }

  private static async saveFile(msgs: Msg[] = []) {
    await Deno.writeTextFile('./data/msgs.json', JSON.stringify(msgs));
    return msgs;
  }

  static async getAll() {
    try {
      const msgs = await Deno.readTextFile('./data/msgs.json');
      return JSON.parse(msgs) as Msg[];
    } catch (err) {
      if (err instanceof Deno.errors.NotFound) return await Msg.saveFile()
      throw err;
    }
  }

  static async save(text: string, msgId?: string) {
    const msgs = await Msg.getAll();
    const index = msgs.findIndex(({ _id }) => _id === msgId);
    let msg;
    if (index < 0) {
      msg = new Msg(text);
      msgs.push(msg);
    } else {
      msg = msgs[index];
      msg.text = text;
    };
    await Msg.saveFile(msgs);
    return msgs;
  }

  static async delete(msgId: string) {
    const msgs = await Msg.getAll();
    const updated = msgs.filter(({ _id }) => _id !== msgId);
    await Msg.saveFile(updated);
    return updated;
  }
};
