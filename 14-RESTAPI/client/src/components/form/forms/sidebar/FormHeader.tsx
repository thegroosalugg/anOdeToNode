import XButton from "@/components/ui/button/XButton";
import Heading from "@/components/ui/layout/Heading";
import css from "./FormHeader.module.css";

export default function FormHeader({ close, text }: { close: () => void, text: string }) {
  return (
    <header className={css["form-header"]}>
      <XButton onClick={close} light />
      <Heading>{text}</Heading>
    </header>
  );
}
