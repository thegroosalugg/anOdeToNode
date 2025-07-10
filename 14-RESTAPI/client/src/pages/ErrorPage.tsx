export default function ErrorPage() {
  return (
    <>
      <h1
        style={{
              margin: "1rem auto",
            fontSize: "var(--text-3xl)",
          fontFamily: "var(--font-minor)",
          fontWeight: 300,
           textAlign: "center",
        }}
      >
        Page not found.
      </h1>
      <img
          src="/skeleton.png"
          alt="Skeleton"
        style={{ width: "100%", maxWidth: "200px", alignSelf: "center" }}
      />
    </>
  );
}
