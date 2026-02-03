type ClientRes = { message: string } | Record<string, string | boolean> | null

export default class AppError {
    status: number
  response: ClientRes
       log: unknown
    caller: string

  constructor(status: number, response: string | ClientRes, log?: unknown) {
    this.status   = status
    this.response = typeof response === 'string' ? { message: response } : response
    this.log      = log || ''

    const stack = new Error().stack // creates new stack of current calling function
    const line  = stack?.split('\n')[2] // [0] is Error, [1] is AppError constructor
    this.caller = line?.match(/at\s+(\S+)/)?.[1] || 'unknown'
  }

  static devErr() {
    return new AppError(500, 'Something went wrong', 'Do not use without AuthJWT')
  }
}

