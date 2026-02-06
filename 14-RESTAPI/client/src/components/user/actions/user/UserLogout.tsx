import Button from "@/components/ui/button/Button";
import ConfirmDialog from "@/components/ui/modal/ConfirmDialog";
import { Auth } from "@/lib/types/interface";
import { useState } from "react";
import { removeRefreshToken } from "@/lib/http/token";
import css from "./UserLogout.module.css";

export default function UserLogout({ setUser }: { setUser: Auth["setUser"] }) {
  const [showModal, setShowModal] = useState(false);
  const closeModal = () => setShowModal(false);

  function logout() {
    closeModal();
    setUser(null);
    removeRefreshToken();
  }

  return (
    <>
      <ConfirmDialog open={showModal} onConfirm={logout} onCancel={closeModal} />
      <p className={css["user-logout"]}>
        <Button
          onClick={() => setShowModal(true)}
          background="danger"
          animations={{ transition: { opacity: { delay: 1.8 } } }}
        >
          Logout
        </Button>
      </p>
    </>
  );
}
