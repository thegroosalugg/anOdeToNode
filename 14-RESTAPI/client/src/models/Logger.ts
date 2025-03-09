import { captainsLog } from "@/util/captainsLog";
import { Fetch } from "@/util/fetchData";

export type LogConfig = 'feed' | 'post' | 'social' | 'user' | 'chat' | 'menu' | 'alerts';

export default class Logger {
  private  name: string;
  private color: number;

  private static CONFIG = {
      'feed': { emoji: '🗞️', color:  80 },
      'post': { emoji: '📬', color: 324 },
    'social': { emoji: '👥', color: -60 },
      'user': { emoji: '👤', color: -31 },
      'chat': { emoji: '💬', color: 170 },
      'menu': { emoji: '🗨️', color: 200 },
    'alerts': { emoji: '🔔', color:  50 },
  };

  constructor(key: LogConfig) {
    const config = Logger.CONFIG[key || 'user'];
      this.color = config.color;
      this.name  = `${config.emoji}${key.toUpperCase()}`;
  }

  private connection(config: 0 | 15 | 30 = 0) {
    const   msg = { 0: 'connected', 15: 'depedencies changed', 30: 'disconnect' }[config];
    const color = this.color + config;
    captainsLog(color, [`SOCKET: ${this.name} [${msg}]`]);
  }

  static getKeyFromUrl(url: string): LogConfig {
    const match = url.match(/^(feed|post|social|user|chat|alerts)/);
    return (match?.[0] as LogConfig) || 'user';
  }

  connect() {
    this.connection();
  }

  off() {
    this.connection(15);
  }

  disconnect() {
    this.connection(30);
  }

  event(message: string, data: unknown) {
    captainsLog(this.color, [`SOCKET: ${this.name} :${message}`, data]);
  }

  res(res: Response, resData: unknown, { method, url }: Fetch) {
    const [col, icon] = res.ok ? [this.color, '✓'] : [0, '✕'];
    captainsLog(col, [`${icon} ${method}:${res.status} ${this.name}\n▧${url}`, resData]);
  }
}
