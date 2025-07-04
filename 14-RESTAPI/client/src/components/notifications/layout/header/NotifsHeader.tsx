import { ReactNode } from "react";
import { useAlerts } from "../../context/AlertsContext";
import Counter from "@/components/ui/counter/Counter";
import CloseButton from "@/components/ui/button/CloseButton";
import IconButton from "@/components/ui/button/IconButton";
import css from "./NotifsHeader.module.css";

const Label = ({ children }: { children: ReactNode }) => (
  <span className={css["label"]}>{children}</span>
);

export default function NotifsHeader() {
  const { alerts, activeTab, changeTab, closeMenu } = useAlerts();
  const labels = ["Friend requests",          "Sent requests", "Post replies"];
  const  icons = [      "user-plus",  "envelope-circle-check",        "reply"] as const;

  return (
    <header className={css["header"]}>
      <CloseButton onClick={closeMenu} />
      <nav className="floating-box no-scrollbar-x">
        {alerts.map((count, i) => {
          const [line1, line2] = labels[i].split(" ");
          return (
            <IconButton
                   key={i}
                  icon={icons[i]}
                  size="2xl"
               onClick={() => changeTab(i)}
              isActive={i === activeTab}
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
