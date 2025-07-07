import { FormEvent, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAnimations } from "@/lib/hooks/useAnimations";
import { useFetch } from "@/lib/hooks/useFetch";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { FetchError } from "@/lib/types/common";
import { UserState } from "@/lib/types/auth";
import User from "@/models/User";
import Button from "@/components/ui/button/Button";
import Input from "../../layout/Input";
import css from "./EditAbout.module.css";

interface EditAbout extends UserState {
     isOpen: boolean;
  onSuccess: () => void;
}

export default function EditAbout({ user, setUser, isOpen, onSuccess: closeModal }: EditAbout) {
  const { reqData, error: errors, setError } = useFetch<User["about"]>();
  const { scope,       shake } = useAnimations();
  const { deferring, deferFn } = useDebounce();
  const { about } = user;
  const { home, work, study, bio } = about ?? {};

  useEffect(() => {
    if (isOpen) return;
    setTimeout(() => {
      setError(null); // clear error when sidebar closed
      scope?.current.reset();
    }, 500);
  }, [isOpen, scope, setError]);

  const onError = (err: FetchError) => {
    // uses state to animate: avoids trigger on first submit before component renders
    if (errors) shake("p");
    // uses reqData immediate return value for user logout
    if (err.status === 401) {
      setTimeout(() => {
        setUser(null);
      }, 2000);
    }
  };

  function submitHandler(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const request = async () => {
      const data = new FormData(scope.current);

      await reqData(
        { url: "profile/info", method: "POST", data },
        {
          onError,
          onSuccess: (about) => {
            setUser((prev) => ({ ...prev!, about }));
            closeModal(); // triggers effect cleanup
          },
        }
      );
    };
    deferFn(request, 1000);
  }

  return (
    <form className={css["edit-about"]} ref={scope} onSubmit={submitHandler}>
      <Button disabled={deferring} background={errors ? "var(--error)" : "var(--accent)"}>
        Update
      </Button>
      <Input control="home" {...{ errors }} defaultValue={home}>
        <FontAwesomeIcon icon="house" /> Home
      </Input>
      <Input control="work" {...{ errors }} defaultValue={work}>
        <FontAwesomeIcon icon="briefcase" /> Work
      </Input>
      <Input control="study" {...{ errors }} defaultValue={study}>
        <FontAwesomeIcon icon="book" /> Place of study
      </Input>
      <Input control="bio" {...{ errors }} defaultValue={bio} rows={3}>
        <FontAwesomeIcon icon="comment-dots" /> About me
      </Input>
    </form>
  );
}
