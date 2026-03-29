import { Loader2, FilePlus, FilePen, FileSearch, Trash2, FolderInput, Wrench } from "lucide-react";

interface ToolCallBadgeProps {
  toolName: string;
  args: Record<string, unknown>;
  state: "call" | "partial-call" | "result";
}

function getLabel(toolName: string, args: Record<string, unknown>): { icon: React.ReactNode; text: string } {
  const path = typeof args.path === "string" ? args.path : "";
  const basename = path.split("/").filter(Boolean).pop() ?? path;

  if (toolName === "str_replace_editor") {
    switch (args.command) {
      case "create":
        return { icon: <FilePlus className="w-3 h-3" />, text: `Creating ${basename}` };
      case "str_replace":
      case "insert":
        return { icon: <FilePen className="w-3 h-3" />, text: `Editing ${basename}` };
      case "view":
        return { icon: <FileSearch className="w-3 h-3" />, text: `Reading ${basename}` };
      case "undo_edit":
        return { icon: <FilePen className="w-3 h-3" />, text: `Reverting ${basename}` };
      default:
        return { icon: <FilePen className="w-3 h-3" />, text: "Updating files" };
    }
  }

  if (toolName === "file_manager") {
    const newPath = typeof args.new_path === "string" ? args.new_path : "";
    const newBasename = newPath.split("/").filter(Boolean).pop() ?? newPath;
    switch (args.command) {
      case "rename":
        return { icon: <FolderInput className="w-3 h-3" />, text: `Renaming ${basename} → ${newBasename}` };
      case "delete":
        return { icon: <Trash2 className="w-3 h-3" />, text: `Deleting ${basename}` };
    }
  }

  return { icon: <Wrench className="w-3 h-3" />, text: toolName };
}

export function ToolCallBadge({ toolName, args, state }: ToolCallBadgeProps) {
  const { icon, text } = getLabel(toolName, args);
  const done = state === "result";

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs border border-neutral-200">
      {done ? (
        <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600 flex-shrink-0" />
      )}
      <span className="text-neutral-600">{icon}</span>
      <span className="text-neutral-700">{text}</span>
    </div>
  );
}
