import { Dispatch, SetStateAction } from "react";

export type SetData<T> = Dispatch<SetStateAction<T>>;

export type Dict<T> = Record<string, T>;

export type Direction = -1 | 1;

export type Meta = { read: boolean; show: boolean };

export type  Align = "start" | "center" | "end";

export type FetchError = {
  [key: string]: string;
} & {
  message: string;
   status: number;
};
