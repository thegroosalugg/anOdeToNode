export default function List<T>({
  items,
  children,
}: {
  items: T[];
  children: (item: T) => React.ReactNode;
}) {
  return (
    <ul
      style={{
              display: 'flex',
        flexDirection: 'column',
                  gap: 2.5,
               border: '1px solid #000',
              padding: '0.25rem',
      }}
    >
      {items.reverse().map((item) => children(item))}
    </ul>
  );
}
