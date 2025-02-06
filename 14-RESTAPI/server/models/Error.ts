type ClientRes = { message: string } | Record<string, string | boolean> | null;
export default class AppError {
   status: number;
   client: ClientRes
      dev: unknown;
    where: string;

  constructor(status: number, client: string | ClientRes, dev?: unknown) {
    this.status = status;
    this.client = typeof client === 'string' ? { message: client } : client;
    this.dev    = dev || "<<Server Error>> ";

    const stack = new Error().stack; // creates new stack of current calling function
    const  line = stack?.split('\n')[2]; // [0] is Error, [1] is AppError constructor
    this.where  =  line?.match(/at\s+(\S+)/)?.[1] || "<<Unknown Location>>";
  }
}
