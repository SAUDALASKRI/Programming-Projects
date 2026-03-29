import { test, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button, buttonVariants } from "../button";

afterEach(() => {
  cleanup();
});

// Rendering

test("renders a <button> element by default", () => {
  const { container } = render(<Button>Click me</Button>);
  expect(container.querySelector("button")).not.toBeNull();
});

test("renders children", () => {
  render(<Button>Submit</Button>);
  expect(screen.getByText("Submit")).toBeDefined();
});

test("has data-slot='button' attribute", () => {
  const { container } = render(<Button>X</Button>);
  expect(container.querySelector("[data-slot='button']")).not.toBeNull();
});

// Variants

test("applies default variant classes when no variant is specified", () => {
  const { container } = render(<Button>Default</Button>);
  const btn = container.querySelector("button")!;
  expect(btn.className).toContain("bg-primary");
  expect(btn.className).toContain("text-primary-foreground");
});

test("applies destructive variant classes", () => {
  const { container } = render(<Button variant="destructive">Delete</Button>);
  const btn = container.querySelector("button")!;
  expect(btn.className).toContain("bg-destructive");
});

test("applies outline variant classes", () => {
  const { container } = render(<Button variant="outline">Outline</Button>);
  const btn = container.querySelector("button")!;
  expect(btn.className).toContain("border");
  expect(btn.className).toContain("bg-background");
});

test("applies secondary variant classes", () => {
  const { container } = render(<Button variant="secondary">Secondary</Button>);
  const btn = container.querySelector("button")!;
  expect(btn.className).toContain("bg-secondary");
  expect(btn.className).toContain("text-secondary-foreground");
});

test("applies ghost variant classes", () => {
  const { container } = render(<Button variant="ghost">Ghost</Button>);
  const btn = container.querySelector("button")!;
  expect(btn.className).toContain("hover:bg-accent");
});

test("applies link variant classes", () => {
  const { container } = render(<Button variant="link">Link</Button>);
  const btn = container.querySelector("button")!;
  expect(btn.className).toContain("text-primary");
  expect(btn.className).toContain("underline-offset-4");
});

// Sizes

test("applies default size classes when no size is specified", () => {
  const { container } = render(<Button>Default size</Button>);
  const btn = container.querySelector("button")!;
  expect(btn.className).toContain("h-9");
  expect(btn.className).toContain("px-4");
});

test("applies sm size classes", () => {
  const { container } = render(<Button size="sm">Small</Button>);
  const btn = container.querySelector("button")!;
  expect(btn.className).toContain("h-8");
  expect(btn.className).toContain("px-3");
});

test("applies lg size classes", () => {
  const { container } = render(<Button size="lg">Large</Button>);
  const btn = container.querySelector("button")!;
  expect(btn.className).toContain("h-10");
  expect(btn.className).toContain("px-6");
});

test("applies icon size classes", () => {
  const { container } = render(<Button size="icon">+</Button>);
  const btn = container.querySelector("button")!;
  expect(btn.className).toContain("size-9");
});

// className merging

test("merges custom className with variant classes", () => {
  const { container } = render(<Button className="my-custom-class">X</Button>);
  const btn = container.querySelector("button")!;
  expect(btn.className).toContain("my-custom-class");
  expect(btn.className).toContain("bg-primary");
});

// Disabled state

test("applies disabled attribute when disabled prop is passed", () => {
  render(<Button disabled>Disabled</Button>);
  const btn = screen.getByText("Disabled").closest("button")!;
  expect(btn.disabled).toBe(true);
});

test("applies disabled:opacity-50 class when disabled", () => {
  const { container } = render(<Button disabled>Disabled</Button>);
  const btn = container.querySelector("button")!;
  expect(btn.className).toContain("disabled:opacity-50");
});

// Click handler

test("calls onClick when clicked", async () => {
  const user = userEvent.setup();
  const handleClick = vi.fn();
  render(<Button onClick={handleClick}>Click me</Button>);
  await user.click(screen.getByText("Click me"));
  expect(handleClick).toHaveBeenCalledTimes(1);
});

test("does not call onClick when disabled", async () => {
  const user = userEvent.setup();
  const handleClick = vi.fn();
  render(<Button disabled onClick={handleClick}>Click me</Button>);
  await user.click(screen.getByText("Click me"));
  expect(handleClick).not.toHaveBeenCalled();
});

// HTML attribute passthrough

test("passes through type attribute", () => {
  render(<Button type="submit">Submit</Button>);
  const btn = screen.getByText("Submit").closest("button")!;
  expect(btn.type).toBe("submit");
});

test("passes through aria-label attribute", () => {
  render(<Button aria-label="close dialog">X</Button>);
  expect(screen.getByLabelText("close dialog")).not.toBeNull();
});

test("passes through id attribute", () => {
  render(<Button id="my-btn">X</Button>);
  expect(document.getElementById("my-btn")).not.toBeNull();
});

// asChild

test("renders as child element when asChild is true", () => {
  const { container } = render(
    <Button asChild>
      <a href="/home">Home</a>
    </Button>
  );
  const anchor = container.querySelector("a");
  expect(anchor).not.toBeNull();
  expect(container.querySelector("button")).toBeNull();
});

test("applies variant classes to child element when asChild is true", () => {
  const { container } = render(
    <Button asChild variant="destructive">
      <a href="/delete">Delete</a>
    </Button>
  );
  const anchor = container.querySelector("a")!;
  expect(anchor.className).toContain("bg-destructive");
});

// buttonVariants export

test("buttonVariants returns expected class string for given variant and size", () => {
  const classes = buttonVariants({ variant: "outline", size: "sm" });
  expect(classes).toContain("border");
  expect(classes).toContain("h-8");
});

test("buttonVariants uses defaults when no args provided", () => {
  const classes = buttonVariants();
  expect(classes).toContain("bg-primary");
  expect(classes).toContain("h-9");
});
