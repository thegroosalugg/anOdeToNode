export default class AppError {
   status: number;
  message: string;
      dev: string;
    error: unknown;

  constructor(status: number, [message, dev]: [string, string], error?: unknown) {
    this.status  = status  || 500;
    this.error   = error   || "An Error! ";
    this.message = message || "Something wen't wrong";
    this.dev     = dev     || "No Dev message ";
  }
}
