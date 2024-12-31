import Post from "@/models/Post";

export default function Feed({ feed }: { feed: Post[] }) {
  return <section>
    <h1>Feed</h1>
    <ul>
      {feed.map(({ _id, title, content }) => (
        <li key={_id}>
          <h2>{title}</h2>
          <p>{content}</p>
        </li>
      ))}
    </ul>
  </section>
}
