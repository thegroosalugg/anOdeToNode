import { useAnimate, stagger, AnimatePresence, motion } from "motion/react";
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

export interface PostFormProps {
  onSuccess?: () => void;
     setUser: Auth["setUser"];
       post?: Post | null;
}

export default function PostForm({
  onSuccess = () => console.log("Posted!"),
    setUser,
       post,
}: PostFormProps) {
  const { isLoading, error, reqData, setError } = useFetch<Post | null>();
  const [scope,       animate] = useAnimate();
  const { deferring, deferFn } = useDebounce();
  const { _id = "", title = "", content = "", imgURL = "" } = post || {};
  const    url = `post/${_id ? `edit/${_id}` : "new"}`;
  const method = _id ? "PUT" : "POST";
  const filter = `brightness(${deferring ? 0.8 : 1})`;

  const onError = (err: FetchError) => {
    if (error && !error.message) {
      animate(
        "p",
        { x: [null, 10, 0, 10, 0] },
        { repeat: 1, duration: 0.3, delay: stagger(0.1) }
      );
    }
    if (err.status === 401) setUser(null);
  };

  async function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    deferFn(async () => {
      const data = new FormData(e.currentTarget); // multipart/form-data
      await reqData(
        { url, method, data },
        {
          onError,
          onSuccess: () => {
            onSuccess();
            scope.current.reset();
            setError(null);
          },
        }
      );
    }, 1200);
  }

  return (
    <AnimatePresence mode="wait">
      {error?.message ? (
        <Error key="error" error={error} />
      ) : (
        <motion.form
                key="form"
                ref={scope}
          className={css["post-form"]}
           onSubmit={submitHandler}
               exit={{ opacity: 0, scale: 0.8 }}
        >
          <Button
              disabled={deferring}
              whileTap={{ scale: deferring ? 1 : 0.9 }} // overwrites default
            animations={{ filter }} // additional animate props without overwriting default
          >
            {isLoading ? <Loader size="xs" color="bg" /> : "Post"}
          </Button>
          <Input control="title"   errors={error} defaultValue={title} />
          <Input control="content" errors={error} defaultValue={content} rows={5} />
          <ImagePicker {...{ imgURL }} />
        </motion.form>
      )}
    </AnimatePresence>
  );
}
