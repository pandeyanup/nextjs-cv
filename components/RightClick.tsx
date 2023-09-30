import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useRouter } from "next/navigation";

type Props = {
  children: React.ReactNode;
};

const RightClick = (props: Props) => {
  const router = useRouter();
  return (
    <ContextMenu>
      <ContextMenuTrigger>{props.children}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          onClick={() => {
            router.push("/education");
          }}
        >
          Education
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => {
            router.push("/experience");
          }}
        >
          Experience
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => {
            router.push("/skill");
          }}
        >
          Sills
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => {
            router.push("/project");
          }}
        >
          Projects
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default RightClick;
