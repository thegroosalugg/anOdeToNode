import CloseButton from "@/components/ui/button/CloseButton";
import Heading from "@/components/ui/layout/Heading";
import css from "./FormHeader.module.css";

export default function FormHeader({ close, text }: { close: () => void, text: string }) {
  return (
    <header className={css["form-header"]}>
      <CloseButton onClick={close} background="var(--bg)" color="var(--fg)" />
      <Heading>{text}</Heading>
    </header>
  );
}
