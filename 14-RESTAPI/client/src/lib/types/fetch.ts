import { ReqData } from "../hooks/useFetch";
import { FetchError, SetData } from "./common";

// constrains K to string so it can be used in template literals
export type FetchState<T, K extends string = "data"> = {
  [P in `${K}`]: T;
} & { // P is a mapped type key; this maps to a single computed key name
  [P in `set${Capitalize<K>}`]: SetData<T>;
} & {
  [P in `req${Capitalize<K>}`]: ReqData<T>;
} & {
  isLoading: boolean;
      error: FetchError | null;
   setError: SetData<FetchError | null>;
};
