import { AnimatePresence, motion } from "motion/react";
import { useAnimations } from "@/lib/hooks/useAnimations";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { useFetch } from "@/lib/hooks/useFetch";
import { Auth } from "@/lib/types/auth";
import { FetchError } from "@/lib/types/common";
import Post from "@/models/Post";
import Input from "../../layout/Input";
import ImagePicker from "../../layout/ImagePicker";
import Button from "@/components/ui/button/Button";
import Error from "@/components/ui/boundary/error/Error";
import Loader from "@/components/ui/boundary/loader/Loader";
import css from "./PostForm.module.css";

interface PostForm {
  onSuccess?: () => void;
     setUser: Auth["setUser"];
       post?: Post | null;
}

export default function PostForm({
   onSuccess: closeModal = () => console.log("Posted!"),
     setUser,
        post,
}: PostForm) {
  const { isLoading, error, reqData, setError } = useFetch<Post | null>();
  const { scope,       shake } = useAnimations();
  const { deferring, deferFn } = useDebounce();
  const { _id = "", title = "", content = "", imgURL = "" } = post || {};
  const    url = `post/${_id ? `edit/${_id}` : "new"}`;
  const method = _id ? "PUT" : "POST";

  const onError = (err: FetchError) => {
    if (error && !error.message) shake("p");
    if (err.status === 401) setUser(null);
  };

  const onSuccess = () => {
    closeModal();
    scope.current.reset();
    setError(null);
  };

  async function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    deferFn(async () => {
      const data = new FormData(e.currentTarget); // multipart/form-data
      await reqData({ url, method, data }, { onError, onSuccess });
    }, 1200);
  }

  return (
    <AnimatePresence mode="wait">
      {error?.message ? (
        <Error key="error" {...{ error }} />
      ) : (
        <motion.form
                key="form"
                ref={scope}
          className={css["post-form"]}
           onSubmit={submitHandler}
               exit={{ opacity: 0, scale: 0.8 }}
        >
          <section>
            <ImagePicker {...{ imgURL }} />
            <Button disabled={deferring} whileTap={{ scale: deferring ? 1 : 0.9 }}>
              {isLoading ? <Loader size="xs" color="bg" /> : "Post"}
            </Button>
          </section>
          <Input control="title"   errors={error} defaultValue={title}>Title</Input>
          <Input control="content" errors={error} defaultValue={content} rows={5}>Post</Input>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
