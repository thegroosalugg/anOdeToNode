import { captainsLog } from "@/util/captainsLog";

type LogConfig = 'feed' | 'post' | 'social' | 'chat' | 'menu' | 'nav';

export default class Logger {
  private prefix: string;
  private  color: number;

  private static CONFIG = {
      'feed': { emoji: '🗞️', color:  80 },
      'post': { emoji: '📬', color: 324 },
    'social': { emoji: '👤', color: -60 },
      'chat': { emoji: '💬', color: 170 },
      'menu': { emoji: '🗨️', color: 200 },
       'nav': { emoji: '🔔', color: -35 },
  };

  constructor(key: LogConfig) {
    const config = Logger.CONFIG[key] || { emoji: '❔', color: -1 };
      this.color = config.color;
     this.prefix = `SOCKET: ${config.emoji}${key.toUpperCase()}`;
  }

  private connection(off?: 'off') {
    const [color, msg] = off ? [20, 'disconnect'] : [this.color, 'connected'];
    captainsLog(color, [`${this.prefix} [${msg}]`]);
  }

  connect() {
    this.connection();
  }

  disconnect() {
    this.connection('off');
  }

  event(message: string, data: unknown) {
    captainsLog(this.color, [`${this.prefix} :${message}`, data]);
  }
}
