import { Dispatch, SetStateAction } from "react";

export type SetData<T> = Dispatch<SetStateAction<T>>;

export type FetchError = {
  [key: string]: string;
} & {
  message: string;
   status: number;
};
