import { Dependency } from "@/hooks/useDepedencyTracker";
import { captainsLog } from "@/util/captainsLog";
import { Fetch } from "@/util/fetchData";

export type LogConfig = 'zero';

export default class Logger {
  private  name: string;
  private color: number;

  private static CONFIG = {
    'zero': { emoji: '❔', color:  -1 },
  };

  constructor(key: LogConfig) {
    const config = Logger.CONFIG[key || 'zero'];
      this.color = config.color;
      this.name  = `${config.emoji}${key.toUpperCase()}`;
  }

  // tbd
  static getKeyFromUrl(url: string): LogConfig {
    const    match = url.match(/^(feed|post|social|user|chat|alerts)/);
    const fallback = url.startsWith('profile') ? 'user' : 'peer';
    return (match?.[0] as LogConfig) || fallback;
  }

  event(message: string, data: unknown) {
    captainsLog(this.color, [`${this.name} :${message}`, data]);
  }

  res(res: Response, resData: unknown, { method, url }: Fetch) {
    const [col, icon] = res.ok ? [this.color, '✓'] : [0, '✕'];
    captainsLog(col, [`${icon} ${method}:${res.status} ${this.name}\n▧${url}`, resData]);
  }

  track(changes: Dependency<{ _old: unknown; _new: unknown }>) {
    const formatted = Object.entries(changes)
      .map(([key, { _old, _new }], i) => `[${i}]${key}: ${_old} => ${_new}`)
      .join('\n');

    captainsLog(this.color, [`${this.name} [dependencies]\n${formatted}`]);
  }
}
