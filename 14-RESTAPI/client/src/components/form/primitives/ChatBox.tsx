import { FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAnimations } from "@/lib/hooks/useAnimations";
import { useFetch } from "@/lib/hooks/useFetch";
import { Animations, createAnimations } from "@/lib/motion/animations";
import { ApiUrl } from "@/lib/http/fetchData";
import BouncingDots from "@/components/ui/boundary/loader/BouncingDots";
import css from "./ChatBox.module.css";

export default function ChatBox({
         url,
        rows = 3,
  animations = {},
   ...props
}: {
          url: ApiUrl;
        rows?: number;
  animations?: Animations
}) {
  const { reqData, isLoading, error, setError } = useFetch();
  const { scope, animate, shake } = useAnimations();

  const onSuccess = () => {
    setError(null);
    animate(
      scope.current, // form must match textarea bg on success, and button bg on error
      { background: "var(--page)", scale: [1, 1.01, 1] },
      {
        background: { duration: 0 }, // ensures animation instant
             scale: { duration: 0.2, delay: 0.2 },
      }
    );
    animate(
      "textarea",
      { opacity: [null, 0, 0, 1], y: [null, -10, 0, 0] },
      { duration: 0.8, times: [0, 0.2, 0.5, 1] }
    );
    animate(
      "button", // animate colors must be manually reset to default end of animation
      { background: [null, "var(--success)", "var(--text-alt)"] },
      { duration: 1, times: [0, 0.1, 0.85, 1] }
    );
    setTimeout(() => scope.current?.reset(), 100);
  };

  const onError = () => {
    if (!scope.current) return;
    animate(scope.current, { background: "var(--danger)" }, { duration: 0 });
    animate("button", { background: "var(--danger)" });
    shake("button");
  };

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;
    const data = new FormData(e.currentTarget);
    reqData({ url, method: "POST", data, onSuccess, onError });
  };

  return (
    <motion.form
            ref={scope}
      className={css["chat-box"]}
      {...createAnimations({...animations})}
      onSubmit={submitHandler}
      {...props}
    >
      <textarea name="content" aria-label="Chat message" {...{ rows }} />
      <motion.button disabled={isLoading}>
        <AnimatePresence mode="wait">
          {isLoading ? (
            <BouncingDots key="loader" size={5} color="page" />
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
