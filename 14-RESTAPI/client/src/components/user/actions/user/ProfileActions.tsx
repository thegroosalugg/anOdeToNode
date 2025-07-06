import { useState } from "react";
import FormSideBar from "@/components/form/forms/sidebar/FormSideBar";
import Button from "@/components/ui/button/Button";
import { UserState } from "@/lib/types/auth";
import EditImage from "@/components/form/forms/edit/EditImage";

export default function ProfileActions({ user, setUser }: UserState) {
  const [showModal, setShowModal] = useState(false);
  const  openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <>
      <FormSideBar open={showModal} close={closeModal} text="Update profile">
        <div style={{ overflowY: "scroll" }}>
          <EditImage {...{ user, setUser, isOpen: showModal, onSuccess: closeModal }} />
        </div>
      </FormSideBar>
      <Button onClick={openModal} style={{ margin: "0.25rem 0 0 auto", display: "block" }}>
        Update profile
      </Button>
    </>
  );
}
