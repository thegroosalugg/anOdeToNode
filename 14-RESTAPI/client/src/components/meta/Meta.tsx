import { Helmet } from "react-helmet-async";

export default function Meta({
  description,
     children,
}: {
  description: string;
     children: string;
}) {
  return (
    <Helmet>
      <title>{children}</title>
      <meta name="description" content={description} />
    </Helmet>
  );
}
