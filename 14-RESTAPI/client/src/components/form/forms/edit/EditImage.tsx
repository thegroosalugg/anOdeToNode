import { useFetch } from "@/lib/hooks/useFetch";
import { useEffect, useState } from "react";
import { useAnimations } from "@/lib/hooks/useAnimations";
import { api } from "@/lib/http/endpoints";
import { UserState } from "@/lib/types/interface";
import ImagePicker from "../../layout/ImagePicker";
import Button from "@/components/ui/button/Button";
import css from "./EditImage.module.css";

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

  const onError = () => {
    if (error && scope.current) shake("button");
  };

  const onSuccess = ({ imgURL }: { imgURL: string }) => {
    setDisplayPic(imgURL);
    setUser((user) => (user ? { ...user, imgURL } : user));
    closeModal(); // triggers effect cleanup
  };

  async function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    await reqData({ url: api.profile.setPic, method: "POST", data, onError, onSuccess });
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
