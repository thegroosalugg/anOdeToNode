import { ReactNode } from "react";
import { useAlerts } from "../../context/AlertsContext";
import Counter from "@/components/ui/tags/Counter";
import XButton from "@/components/ui/button/XButton";
import IconButton from "@/components/ui/button/IconButton";
import css from "./NotifsHeader.module.css";

const Label = ({ children }: { children: ReactNode }) => (
  <span className={css["label"]}>{children}</span>
);

export default function NotifsHeader() {
  const { alerts, activeTab, changeTab, closeMenu } = useAlerts();
  const labels = ["Friend-requests",          "Sent-requests", "Post-replies"];
  const  icons = [      "user-plus",  "envelope-circle-check",        "reply"] as const;

  return (
    <header className={css["header"]}>
      <XButton onClick={closeMenu} />
      <nav className="floating-box no-scrollbar-x">
        {alerts.map((count, i) => {
          const [line1, line2] = labels[i].split("-");
          return (
            <IconButton
                     key={i}
                    icon={icons[i]}
                    size="2xl"
                 onClick={() => changeTab(i)}
                isActive={i === activeTab}
              aria-label={labels[i]}
            >
              <Counter {...{ count }} />
              <Label>{line1}</Label>
              <Label>{line2}</Label>
            </IconButton>
          );
        })}
      </nav>
    </header>
  );
}
