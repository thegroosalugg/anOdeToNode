import { useFetch } from "@/lib/hooks/useFetch";
import { stagger, useAnimate } from "motion/react";
import { FetchError } from "@/lib/types/common";
import { useEffect, useState } from "react";
import { UserState } from "@/lib/types/auth";
import ImagePicker from "../../layout/ImagePicker";
import Button from "@/components/ui/button/Button";
import ErrorPopUp from "@/components/ui/boundary/error/ErrorPopUp";
import css from "./EditImage.module.css";

interface EditImage extends UserState {
     isOpen: boolean;
  onSuccess: () => void;
}

export default function EditImage({ user, setUser, isOpen, onSuccess: closeModal }: EditImage) {
  const { imgURL } = user;
  const [displayPic,  setDisplayPic] = useState(imgURL);
  const [scope,             animate] = useAnimate();
  const { reqData, error, setError } = useFetch<{ imgURL: string }>();

  useEffect(() => {
    if (isOpen) return;
    setTimeout(() => {
      setError(null); // clear error images when sidebar closed
    }, 500);
  }, [isOpen, imgURL, setError]);

  const onError = (err: FetchError) => {
    // checks state to prevent animation running on initial submit
    if (error) {
      animate(
        "p",
        { x: [null, 10, 0, 10, 0] },
        { repeat: 1, duration: 0.3, delay: stagger(0.1) }
      );
    }
    // checks immediate value from catch block to logout
    if (err.status === 401) {
      setTimeout(() => {
        setUser(null);
      }, 2000);
    }
  };

  const onSuccess = ({ imgURL }: { imgURL: string }) => {
    setDisplayPic(imgURL);
    // user cannot be null - component tree collapses on !user and returns to <AuthPage>
    setUser((user) => ({ ...user!, imgURL }));
    setError(null);
    closeModal();
  };

  async function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    await reqData({ url: "profile/set-pic", method: "POST", data }, { onError, onSuccess });
  }

  return (
    <form className={css["edit-image"]} ref={scope} onSubmit={submitHandler}>
      <div>
        <Button>Upload</Button> {/* overwrite default no-wrap */}
        {error && <ErrorPopUp error={error.message} style={{ textWrap: "wrap" }} />}
      </div>
      <ImagePicker key={displayPic} imgURL={displayPic} label="Upload a profile picture" />
    </form>
  );
}
