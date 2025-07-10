import SideBar from "@/components/ui/menu/SideBar";
import FormHeader from "./FormHeader";
import { ReactNode } from "react";

export default function FormSideBar({
       open,
      close,
       text,
   children,
}: {
       open: boolean;
      close: () => void;
       text: string;
   children: ReactNode;
}) {
  return (
    <SideBar {...{ open, close }}>
      <div style={{ display: "flex", flexDirection: "column", height: "100dvh" }}>
        <FormHeader {...{ close, text }} />
        {children}
      </div>
    </SideBar>
  );
}
