type Query = 'signup' | 'token' | 'reset';
type LoginRoute = `/login${`/?${Query}=${string}` | ''}`;
type AdminRoute = `/admin${'/items' | `/form${`/${string}` | ''}` | ''}`;
type Routes = '/' | LoginRoute | AdminRoute | '/500';

export default class AppError {
  caller: string;

  constructor(
    public status:    number,
    public error:     unknown,
    public redirect:  Routes = '/',
  ) {

    if (this.status === 500) this.redirect = '/500';

    const stack = new Error().stack; // creates new stack of current calling function
    const line  = stack?.split('\n')[2]; // [0] is Error, [1] is AppError constructor
    this.caller = line?.match(/at\s+(\S+)/)?.[1] || 'unknown';
  }
}
