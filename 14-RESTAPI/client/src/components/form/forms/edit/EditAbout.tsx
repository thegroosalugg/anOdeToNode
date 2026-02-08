import { FormEvent, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAnimations } from "@/lib/hooks/useAnimations";
import { useFetch } from "@/lib/hooks/useFetch";
import { useDefer } from "@/lib/hooks/useDefer";
import { UserState } from "@/lib/types/interface";
import User from "@/models/User";
import Button from "@/components/ui/button/Button";
import Input from "../../layout/Input";
import Loader from "@/components/ui/boundary/loader/Loader";
import { getEntry } from "@/lib/util/common";
import css from "./EditAbout.module.css";
import { api } from "@/lib/http/endpoints";

interface EditAbout extends UserState {
     isOpen: boolean;
  onSuccess: () => void;
}

export default function EditAbout({ user, setUser, isOpen, onSuccess: closeModal }: EditAbout) {
  const { reqData, error: errors, setError } = useFetch<User["about"]>();
  const { scope, shake, shoot } = useAnimations();
  const { deferring,    defer } = useDefer();
  const { about } = user;
  const { home, work, study, bio } = about ?? {};

  useEffect(() => {
    if (isOpen) return;
    setTimeout(() => {
      setError(null); // clear error when sidebar closed
      scope?.current.reset();
    }, 500);
  }, [isOpen, scope, setError]);

  const onError = () => {
    if (errors && scope.current) shake("p");
  };

  const onSuccess = (about: User["about"]) => {
    setUser((prev) => (prev ? { ...prev, about } : prev));
    closeModal();
  }

  function submitHandler(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const request = async () => {
      const data = new FormData(scope.current);

      const entries = {
         home: getEntry(data, "home"),
         work: getEntry(data, "work"),
        study: getEntry(data, "study"),
          bio: getEntry(data, "bio"),
      };

      const isSame = Object.entries(entries).every(([key, val]) => val === (about?.[key as keyof typeof about] ?? ""));
      if (isSame) {
        shoot(".fleeting-pop-up");
        return;
      }

      await reqData({ url: api.profile.info, method: "POST", data, onError, onSuccess });
    };

    defer(request, 1000);
  }

  return (
    <form className={css["edit-about"]} ref={scope} onSubmit={submitHandler}>
      <p className="fleeting-pop-up" style={{ top: "1rem", left: "0.5rem" }}>
        No changes
      </p>
      <Button disabled={deferring} background={errors ? "danger" : "accent"}>
        {deferring ? <Loader size="xs" color="page" /> : "Update"}
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
