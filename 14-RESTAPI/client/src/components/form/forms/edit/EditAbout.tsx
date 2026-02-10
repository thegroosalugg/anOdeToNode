import { FormEvent, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAnimations } from "@/lib/hooks/useAnimations";
import { useFetch } from "@/lib/hooks/useFetch";
import { UserState } from "@/lib/types/interface";
import User from "@/models/User";
import Button from "@/components/ui/button/Button";
import Input from "../../primitives/Input";
import Spinner from "@/components/ui/boundary/loader/Spinner";
import { getEntry } from "@/lib/util/common";
import { api } from "@/lib/http/endpoints";
import css from "./EditAbout.module.css";

interface EditAbout extends UserState {
     isOpen: boolean;
  onSuccess: () => void;
}

export default function EditAbout({ user, setUser, isOpen, onSuccess: closeModal }: EditAbout) {
  const { reqData, isLoading, error: errors, setError } = useFetch<User["about"]>();
  const { scope, shake, shoot } = useAnimations();
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

    if (isLoading) return;
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

    reqData({ url: api.profile.info, method: "POST", data, onError, onSuccess });
  }

  return (
    <form className={css["edit-about"]} ref={scope} onSubmit={submitHandler}>
      <p className="fleeting-pop-up" style={{ top: 0, right: 0 }}>
        No changes
      </p>
      <Button disabled={isLoading} background={errors ? "danger" : "accent"}>
        {isLoading ? <Spinner size={20} color="page" /> : "Update"}
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
