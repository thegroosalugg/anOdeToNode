import { useState } from "react";
import FormSideBar from "@/components/form/forms/sidebar/FormSideBar";
import Button from "@/components/ui/button/Button";
import { UserState } from "@/lib/types/interface";
import EditImage from "@/components/form/forms/edit/EditImage";
import EditAbout from "@/components/form/forms/edit/EditAbout";
import css from "./ProfileActions.module.css";

export default function ProfileActions({ user, setUser }: UserState) {
  const [isOpen, setIsOpen] = useState(false);
  const  openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const props = { user, setUser, isOpen, onSuccess: closeModal };

  return (
    <>
      <FormSideBar open={isOpen} close={closeModal} text="Update profile">
        <div className={css["profile-actions"]}>
          <EditImage {...props} />
          <EditAbout {...props} />
        </div>
      </FormSideBar>
      <Button onClick={openModal} style={{ margin: "0.25rem 0 0 auto", display: "block" }}>
        Update profile
      </Button>
    </>
  );
}
