/* eslint-disable react-hooks/rules-of-hooks */
import { Dispatch, SetStateAction } from "react";

export async function api(
  path: string,
  method: string,
  type: string,
  setListErros: Dispatch<SetStateAction<any[]>>,
  body?: any
) {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const apiPrefix = "/1";
  const url = new URL(apiPrefix.concat(path), baseURL);
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  const params = {
    headers,
    method,
    body: body ? JSON.stringify(body) : null,
  };
  try {
    const response = await fetch(url, params);
    return response;
  } catch (err) {
    setListErros((prev: any) => {
      const copyList = prev;
      copyList.push({ type });
      return copyList;
    });
    return null;
  }
}
