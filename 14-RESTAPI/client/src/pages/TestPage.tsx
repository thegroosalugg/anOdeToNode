import AsyncAwait from "@/components/ui/boundary/AsyncAwait";
import { useFetch } from "@/lib/hooks/useFetch";
import { api } from "@/lib/http/endpoints";
import { useEffect } from "react";

export default function TestPage() {
  const { reqData, isInitial } = useFetch();

  useEffect(() => {
    reqData({ url: api.feed.posts });
  }, [reqData]);

  return <AsyncAwait {...{ isInitial }}>"Content"</AsyncAwait>;
}
