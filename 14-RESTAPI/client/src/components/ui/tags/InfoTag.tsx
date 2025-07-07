import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode } from "react";
import css from "./InfoTag.module.css";

export default function InfoTag({
      icon,
      text,
  children,
}: {
      icon: IconProp;
     text?: string;
  children: ReactNode;
}) {
  if (!children) return null;

  return (
    children && (
      <p className={css["info-tag"]}>
        <FontAwesomeIcon {...{ icon }} />
        {text && `${text} `}
        <strong>{children}</strong>
      </p>
    )
  );
};
