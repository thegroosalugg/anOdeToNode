import { useFetch } from "@/lib/hooks/useFetch";
import { FetchError } from "@/lib/types/common";
import { useEffect, useState } from "react";
import { UserState } from "@/lib/types/auth";
import ImagePicker from "../../layout/ImagePicker";
import Button from "@/components/ui/button/Button";
import css from "./EditImage.module.css";
import { useAnimations } from "@/lib/hooks/useAnimations";

interface EditImage extends UserState {
     isOpen: boolean;
  onSuccess: () => void;
}

export default function EditImage({ user, setUser, isOpen, onSuccess: closeModal }: EditImage) {
  const { imgURL } = user;
  const [displayPic,  setDisplayPic] = useState(imgURL);
  const { scope,             shake } = useAnimations();
  const { reqData, error, setError } = useFetch<{ imgURL: string }>();

  useEffect(() => {
    if (isOpen) return;
    setTimeout(() => {
      setError(null); // clear error when sidebar closed
      scope?.current.reset();
    }, 500);
  }, [isOpen, imgURL, scope, setError]);

  const onError = (err: FetchError) => {
    // uses state to animate: avoids trigger on first submit before component renders
    if (error) shake("button");
    // uses reqData immediate return value for user logout
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
    closeModal(); // triggers effect cleanup
  };

  async function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    await reqData({ url: "profile/set-pic", method: "POST", data }, { onError, onSuccess });
  }

  return (
    <form className={css["edit-image"]} ref={scope} onSubmit={submitHandler}>
      <ImagePicker imgURL={displayPic} label="Upload a profile picture" />
      <Button background={`var(--${error ? "error" : "accent"})`}>
        {error ? error.message : "Upload"}
      </Button>
    </form>
  );
}
