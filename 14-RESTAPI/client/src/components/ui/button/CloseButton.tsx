import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "./Button";

export default function CloseButton({ ...props }) {
  return (
    <Button background="var(--text)" {...props}>
      <FontAwesomeIcon icon="x" />
    </Button>
  );
}
