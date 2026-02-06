import Meta from "@/components/meta/Meta";
import Heading from "@/components/ui/layout/Heading";

export default function ErrorPage() {
  return (
    <>
      <Meta description="Page not found.">Not Found!</Meta>
      <Heading style={{ fontSize: "var(--text-4xl)", textAlign: "center", margin: "1rem auto" }}>
        Page Not Found!
      </Heading>
    </>
  );
}
