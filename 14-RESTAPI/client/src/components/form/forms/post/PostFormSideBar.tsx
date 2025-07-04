import SideBar from "@/components/ui/menu/SideBar";
import PostForm, { PostFormProps } from "./PostForm";
import PostFormHeader from "./PostFormHeader";

export default function PostFormSideBar({
       open,
      close,
  formProps,
}: {
       open: boolean;
      close: () => void;
  formProps: PostFormProps;
}) {
  return (
    <SideBar {...{ open, close }}>
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <PostFormHeader {...{ close }} />
        <PostForm {...formProps} />
      </div>
    </SideBar>
  );
}
