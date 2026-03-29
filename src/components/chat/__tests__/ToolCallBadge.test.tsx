import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolCallBadge } from "../ToolCallBadge";

afterEach(() => {
  cleanup();
});

// str_replace_editor: create
test("shows 'Creating <filename>' for str_replace_editor create command", () => {
  render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "/App.jsx" }}
      state="call"
    />
  );
  expect(screen.getByText("Creating App.jsx")).toBeDefined();
});

// str_replace_editor: str_replace
test("shows 'Editing <filename>' for str_replace_editor str_replace command", () => {
  render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "str_replace", path: "/components/Card.tsx" }}
      state="call"
    />
  );
  expect(screen.getByText("Editing Card.tsx")).toBeDefined();
});

// str_replace_editor: insert
test("shows 'Editing <filename>' for str_replace_editor insert command", () => {
  render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "insert", path: "/components/Button.tsx" }}
      state="result"
    />
  );
  expect(screen.getByText("Editing Button.tsx")).toBeDefined();
});

// str_replace_editor: view
test("shows 'Reading <filename>' for str_replace_editor view command", () => {
  render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "view", path: "/utils/helpers.ts" }}
      state="call"
    />
  );
  expect(screen.getByText("Reading helpers.ts")).toBeDefined();
});

// str_replace_editor: undo_edit
test("shows 'Reverting <filename>' for str_replace_editor undo_edit command", () => {
  render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "undo_edit", path: "/App.jsx" }}
      state="call"
    />
  );
  expect(screen.getByText("Reverting App.jsx")).toBeDefined();
});

// file_manager: rename
test("shows 'Renaming <old> → <new>' for file_manager rename command", () => {
  render(
    <ToolCallBadge
      toolName="file_manager"
      args={{ command: "rename", path: "/OldName.tsx", new_path: "/NewName.tsx" }}
      state="call"
    />
  );
  expect(screen.getByText("Renaming OldName.tsx → NewName.tsx")).toBeDefined();
});

// file_manager: delete
test("shows 'Deleting <filename>' for file_manager delete command", () => {
  render(
    <ToolCallBadge
      toolName="file_manager"
      args={{ command: "delete", path: "/components/Unused.tsx" }}
      state="result"
    />
  );
  expect(screen.getByText("Deleting Unused.tsx")).toBeDefined();
});

// Unknown tool falls back to tool name
test("falls back to tool name for unknown tools", () => {
  render(
    <ToolCallBadge
      toolName="some_unknown_tool"
      args={{}}
      state="call"
    />
  );
  expect(screen.getByText("some_unknown_tool")).toBeDefined();
});

// Spinner shown when not done
test("shows spinner when state is call", () => {
  const { container } = render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "/App.jsx" }}
      state="call"
    />
  );
  expect(container.querySelector(".animate-spin")).toBeDefined();
  expect(container.querySelector(".bg-emerald-500")).toBeNull();
});

// Green dot shown when done
test("shows green dot when state is result", () => {
  const { container } = render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "/App.jsx" }}
      state="result"
    />
  );
  expect(container.querySelector(".bg-emerald-500")).toBeDefined();
  expect(container.querySelector(".animate-spin")).toBeNull();
});

// Nested path shows only the basename
test("shows only the basename for deeply nested paths", () => {
  render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "/src/components/ui/Badge.tsx" }}
      state="call"
    />
  );
  expect(screen.getByText("Creating Badge.tsx")).toBeDefined();
});
