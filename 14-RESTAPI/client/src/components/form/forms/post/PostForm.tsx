import { useEffect } from "react";
import { motion } from "motion/react";
import { useAnimations } from "@/lib/hooks/useAnimations";
import { useFetch } from "@/lib/hooks/useFetch";
import { api } from "@/lib/http/endpoints";
import Post from "@/models/Post";
import Input from "../../primitives/Input";
import ImagePicker from "../../primitives/ImagePicker";
import Button from "@/components/ui/button/Button";
import Error from "@/components/ui/boundary/error/Error";
import Spinner from "@/components/ui/boundary/loader/Spinner";
import { getEntry } from "@/lib/util/common";
import css from "./PostForm.module.css";

interface PostForm {
      isOpen: boolean;
  onSuccess?: () => void;
       post?: Post | null;
}

export default function PostForm({
      isOpen,
   onSuccess: closeModal = () => console.log("Posted!"),
        post,
}: PostForm) {
  const { isLoading, error, reqData, setError } = useFetch<Post | null>();
  const { scope, shake, shoot } = useAnimations();
  const { _id = "", title = "", content = "", imgURL = "" } = post || {};
  const url = _id ? api.post.edit(_id) : api.post.new;
  const method = _id ? "PUT" : "POST";

  useEffect(() => {
    if (isOpen) return;
    setTimeout(() => {
      setError(null);
      scope?.current.reset();
    }, 500);
  }, [isOpen, scope, setError]);

  const onError = () => {
    if (error && !error.message && scope.current) shake("p");
  };

  function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isLoading) return;
    const data = new FormData(scope.current);

    if (_id) {
      const titleEntry = getEntry(data, "title");
      const contentEntry = getEntry(data, "content");
      const file = data.get("image") as File | null;

      const isSame = titleEntry === title && contentEntry === content && (!file || file.size === 0);

      if (isSame) {
        shoot(".fleeting-pop-up", { dir: 1 });
        return;
      }
    }

    reqData({ url, method, data, onError, onSuccess: closeModal });
  }

  return (
    <motion.form ref={scope} className={css["post-form"]} onSubmit={submitHandler}>
      <p className="fleeting-pop-up" style={{ top: "2rem", right: "0.5rem" }}>
        No changes
      </p>
      <Error {...{ error }} />
      <section>
        <ImagePicker {...{ imgURL }} />
        <Button disabled={isLoading} background={error ? "danger" : "accent"}>
          {isLoading ? <Spinner size={20} color="page" /> : "Post"}
        </Button>
      </section>
      <Input control="title" errors={error} defaultValue={title}>
        Title
      </Input>
      <Input control="content" errors={error} defaultValue={content} rows={5}>
        Post
      </Input>
    </motion.form>
  );
}
