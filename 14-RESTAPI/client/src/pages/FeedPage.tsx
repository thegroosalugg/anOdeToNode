import fetchData from "@/util/fetchData";
import { useEffect, useState } from "react";

export default function FeedPage() {
  const [data, setData] = useState();

  useEffect(() => {
    const getData = async () => {
      const posts = await fetchData({ url: 'feed/posts' })
      setData(posts)
    }

    getData();
  }, [])

  console.log(data)

  return (
    <div>
      <h1>header 1</h1>
      <h2>header 2</h2>
      <h3>header 3</h3>
      <h4>header 4</h4>
      <h5>header 5</h5>
      <h6>header 6</h6>
      <p>This is a paragraph.</p>
      <ul>
        <li>Unordered list item 1</li>
        <li>Unordered list item 2</li>
      </ul>
      <ol>
        <li>Ordered list item 1</li>
        <li>Ordered list item 2</li>
      </ol>
    </div>
  );
}
