import { Dependency } from "@/lib/hooks/useDepedencyTracker";
import { Fetch } from "@/lib/http/fetchData";
import { captainsLog } from "@/lib/util/captainsLog";

export type LogConfig = "feed" | "post" | "social" | "peer" | "user" | "chat" | "alerts";

export default class Logger {
  private name: string;
  private color: number;

  private static CONFIG = {
      zero: { emoji: "❔", color:  -1 },
      feed: { emoji: "🗞️", color: 100 },
      post: { emoji: "📬", color: 280 },
    social: { emoji: "👥", color: -10 },
      peer: { emoji: "👤", color: -80 },
      user: { emoji: "🐉", color:   0 },
      chat: { emoji: "💬", color: 200 },
    alerts: { emoji: "🔔", color:  30 },
  };

  constructor(key: LogConfig) {
    const config = Logger.CONFIG[key || "zero"];
    this.color = config.color;
    this.name = `${config.emoji}${key.toUpperCase()}`;
  }

  static getKeyFromUrl(url: string): LogConfig {
    const match = url.match(/^(feed|post|social|user|chat|alerts)/);
    const fallback = url.startsWith("profile") ? "user" : "peer";
    return (match?.[0] as LogConfig) || fallback;
  }

  private connection(config: 0 | 20 = 0) {
    const message = config > 0 ? "disconnect" : "connected";
    const color = this.color + config;
    captainsLog(color, { [this.name]: message });
  }

  connect() {
    this.connection();
  }

  disconnect() {
    this.connection(20);
  }

  event(message: string, data: unknown) {
    captainsLog(this.color, { [this.name]: message, data });
  }

  res(res: Response, resData: unknown, { method, url }: Fetch) {
    const [color, icon] = res.ok ? [this.color, "✓"] : [0, "✕"];
    captainsLog(color, { [this.name]: `${icon} ${method}:${res.status} ${url}`, resData });
  }

  track(changes: Dependency<{ _old: unknown; _new: unknown }>) {
    const data = Object.entries(changes)
      .map(([key, { _old, _new }], i) => `[${i + 1}] ${key}: ${_old} => ${_new}`)
      .join("\n");

    captainsLog(this.color, { [this.name]: data });
  }
}
