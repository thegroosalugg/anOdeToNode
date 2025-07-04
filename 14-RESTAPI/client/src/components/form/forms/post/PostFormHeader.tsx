import CloseButton from "@/components/ui/button/CloseButton";
import Heading from "@/components/ui/layout/Heading";
import css from "./PostFormHeader.module.css";

export default function PostFormHeader({ close }: { close: () => void }) {
  return (
    <header className={css["post-form-header"]}>
      <CloseButton onClick={close} background="var(--bg)" color="var(--fg)" />
      <Heading>Make a Post!</Heading>
    </header>
  );
}
