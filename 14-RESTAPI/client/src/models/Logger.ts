import { Dependency } from "@/lib/hooks/useDependencyTracker";
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

  private connection(on: boolean = true) {
    const message = `🔌socket ${on ? '' : 'dis'}connected`;
    const color = on ? this.color : 10;
    captainsLog(color, { [this.name]: message });
  }

  connect() {
    this.connection();
  }

  disconnect() {
    this.connection(false);
  }

  event(message: string, data: unknown) {
    captainsLog(this.color, { [this.name]: message, data });
  }

  res({ response, resData, method, url }: Pick<Fetch, "url" | "method"> & { response: Response, resData: unknown }) {
    const { ok, status } = response;
    const [color, icon] = ok ? [this.color, '✔️'] : [5, '✖️'];
    captainsLog(color, { [this.name]: `${icon} ${method}:${status}`, url, resData });
  }

  private summarize(value: unknown) {
    if (Array.isArray(value))               return `Array(${value.length})`;
    if (value && typeof value === "object") return `Object(${Object.keys(value).length})`;
    return value;
  }

  track(changes: Dependency<{ prev: unknown; next: unknown }>) {
    const formatted: Record<string, unknown> = {};
    let i = 0;

    for (const key in changes) {
      i++;
      const { prev, next } = changes[key];
      formatted[`[${i}] ${key}`] = `${this.summarize(prev)} => ${this.summarize(next)}`;
    }

    captainsLog(this.color, { [this.name]: "📦dependencies", ...formatted });
  }
}
