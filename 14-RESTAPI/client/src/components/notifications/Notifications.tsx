import { useAlerts } from "./context/AlertsContext";
import SideBar from "../ui/menu/SideBar";
import IconButton from "../ui/button/IconButton";
import Counter from "../ui/counter/Counter";
import NotifsBody from "./layout/NotifsBody";

export default function Notifications() {
  const { count, isOpen, openMenu, closeMenu, deferring } = useAlerts();

  return (
    <>
      <SideBar open={isOpen} close={closeMenu}>
        <NotifsBody />
      </SideBar>
      <IconButton icon="bell" onClick={openMenu} {...{ deferring }}>
        <Counter {...{ count }} />
        Alerts
      </IconButton>
    </>
  );
}
