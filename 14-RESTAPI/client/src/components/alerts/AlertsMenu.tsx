import { useAlerts } from "./context/AlertsContext";
import { useAlertSocket } from "./context/useAlertSocket";
import SideBar from "../ui/menu/SideBar";
import AlertsBody from "./layout/AlertsBody";
import NavButton from "../layout/header/NavButton";
import Counter from "../ui/tags/Counter";

export default function AlertsMenu() {
  useAlertSocket();
  const { count, isOpen, openMenu, closeMenu, deferring } = useAlerts();

  return (
    <>
      <SideBar open={isOpen} close={closeMenu}>
        <AlertsBody />
      </SideBar>
      <NavButton icon="bell" onClick={openMenu} disabled={deferring}>
        <Counter {...{ count }} />
        Alerts
      </NavButton>
    </>
  );
}
