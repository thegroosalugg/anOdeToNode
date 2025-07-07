import { FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAnimations } from "@/lib/hooks/useAnimations";
import { Auth } from "@/lib/types/auth";
import { FetchError } from "@/lib/types/common";
import { useFetch } from "@/lib/hooks/useFetch";
import { useDebounce } from "@/lib/hooks/useDebounce";
import Loader from "../../ui/boundary/loader/Loader";
import { Animations, createAnimations } from "@/lib/motion/animations";
import css from "./ChatBox.module.css";

export default function ChatBox({
         url,
     setUser,
        rows = 3,
  animations = {},
   ...props
}: {
          url: string;
      setUser: Auth["setUser"];
        rows?: number;
  animations?: Animations
}) {
  const { reqData, isLoading, error, setError } = useFetch();
  const { scope, animate, shake } = useAnimations();
  const { deferring, deferFn } = useDebounce();

  const onSuccess = () => {
    setError(null);
    animate(
      scope.current, // form must match textarea bg on success, and button bg on error
      { background: "var(--bg)", scale: [1, 1.05, 1] },
      {
        background: { duration: 0 }, // ensures animation instant
             scale: { duration: 0.4, delay: 0.3 },
      }
    );

    animate(
      "textarea",
      { opacity: [null, 0, 0, 1], y: [null, -10, 0, 0] },
      { duration: 1.2, times: [0, 0.2, 0.9, 1] }
    );
    animate(
      "button", // animate colors must be manually reset to default end of animation
      { background: [null, "var(--accent)", "var(--text)"] },
      { duration: 1, times: [0, 0.1, 0.85, 1] }
    );
    setTimeout(() => scope.current?.reset(), 800);
  };

  const onError = (err: FetchError) => {
    animate(scope.current, { background: "var(--error)" }, { duration: 0 });
    animate("button", { background: "var(--error)" });
    shake("button");
    if (err.status === 401) setUser(null);
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    const data = new FormData(e.currentTarget);
    await reqData({ url, method: "POST", data }, { onSuccess, onError });
  };

  return (
    <motion.form
            ref={scope}
      className={css["chat-box"]}
      {...createAnimations({...animations})}
      onSubmit={(e) => {
        e.preventDefault();
        deferFn(() => submitHandler(e), 1500);
      }}
      {...props}
    >
      <textarea name="content" {...{ rows }} />
      <motion.button disabled={deferring}>
        <AnimatePresence mode="wait">
          {isLoading ? (
            <Loader key="loader" size="xs" color="bg" />
          ) : (
            <motion.span {...createAnimations({ transition: { delay: 0.2 } })}>
              {/* content = 422 form errors, message = all other errors */}
              {error?.content ?? error?.message ?? "Send"}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.form>
  );
}
