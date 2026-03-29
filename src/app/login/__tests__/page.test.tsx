import { test, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "../page";

vi.mock("@/hooks/use-auth", () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from "@/hooks/use-auth";

const mockSignIn = vi.fn();

const defaultAuth = {
  signIn: mockSignIn,
  isLoading: false,
};

beforeEach(() => {
  vi.clearAllMocks();
  (useAuth as ReturnType<typeof vi.fn>).mockReturnValue(defaultAuth);
});

afterEach(() => {
  cleanup();
});

// --- Static content ---

test("renders the heading and subheading", () => {
  render(<LoginPage />);
  expect(screen.getByText("Welcome back")).toBeDefined();
  expect(screen.getByText("Sign in to your UIGen account")).toBeDefined();
});

test("renders email and password labels", () => {
  render(<LoginPage />);
  expect(screen.getByText("Email")).toBeDefined();
  expect(screen.getByText("Password")).toBeDefined();
});

test("renders email input with correct type and placeholder", () => {
  render(<LoginPage />);
  const emailInput = screen.getByPlaceholderText("you@example.com");
  expect(emailInput).toBeDefined();
  expect((emailInput as HTMLInputElement).type).toBe("email");
});

test("renders password input with correct type", () => {
  render(<LoginPage />);
  const passwordInput = document.getElementById("password") as HTMLInputElement;
  expect(passwordInput).not.toBeNull();
  expect(passwordInput.type).toBe("password");
});

test("renders Login submit button", () => {
  render(<LoginPage />);
  const btn = screen.getByRole("button", { name: "Login" });
  expect(btn).toBeDefined();
  expect((btn as HTMLButtonElement).type).toBe("submit");
});

test("renders Forgot password? link", () => {
  render(<LoginPage />);
  expect(screen.getByText("Forgot password?")).toBeDefined();
});

test("renders 'Get started free' link pointing to /", () => {
  render(<LoginPage />);
  const link = screen.getByText("Get started free").closest("a")!;
  expect(link.getAttribute("href")).toBe("/");
});

test("renders Terms and Privacy Policy links", () => {
  render(<LoginPage />);
  expect(screen.getByText("Terms")).toBeDefined();
  expect(screen.getByText("Privacy Policy")).toBeDefined();
});

// --- Field interaction ---

test("updates email field as user types", async () => {
  const user = userEvent.setup();
  render(<LoginPage />);
  const emailInput = screen.getByPlaceholderText("you@example.com");
  await user.type(emailInput, "test@example.com");
  expect((emailInput as HTMLInputElement).value).toBe("test@example.com");
});

test("updates password field as user types", async () => {
  const user = userEvent.setup();
  render(<LoginPage />);
  const passwordInput = document.getElementById("password") as HTMLInputElement;
  await user.type(passwordInput, "secret123");
  expect(passwordInput.value).toBe("secret123");
});

// --- Form submission ---

test("calls signIn with entered email and password on submit", async () => {
  mockSignIn.mockResolvedValue({ success: true });
  const user = userEvent.setup();
  render(<LoginPage />);

  await user.type(screen.getByPlaceholderText("you@example.com"), "user@test.com");
  await user.type(document.getElementById("password")!, "mypassword");
  await user.click(screen.getByRole("button", { name: "Login" }));

  expect(mockSignIn).toHaveBeenCalledOnce();
  expect(mockSignIn).toHaveBeenCalledWith("user@test.com", "mypassword");
});

test("does not show error banner on successful sign-in", async () => {
  mockSignIn.mockResolvedValue({ success: true });
  const user = userEvent.setup();
  render(<LoginPage />);

  await user.type(screen.getByPlaceholderText("you@example.com"), "user@test.com");
  await user.type(document.getElementById("password")!, "mypassword");
  await user.click(screen.getByRole("button", { name: "Login" }));

  await waitFor(() => {
    expect(screen.queryByText("Invalid email or password.")).toBeNull();
  });
});

// --- Error state ---

test("displays server error message when signIn returns an error", async () => {
  mockSignIn.mockResolvedValue({ success: false, error: "Wrong credentials" });
  const user = userEvent.setup();
  render(<LoginPage />);

  await user.type(screen.getByPlaceholderText("you@example.com"), "bad@test.com");
  await user.type(document.getElementById("password")!, "wrongpass");
  await user.click(screen.getByRole("button", { name: "Login" }));

  await waitFor(() => {
    expect(screen.getByText("Wrong credentials")).toBeDefined();
  });
});

test("falls back to default error message when signIn returns no error string", async () => {
  mockSignIn.mockResolvedValue({ success: false });
  const user = userEvent.setup();
  render(<LoginPage />);

  await user.type(screen.getByPlaceholderText("you@example.com"), "a@b.com");
  await user.type(document.getElementById("password")!, "pass");
  await user.click(screen.getByRole("button", { name: "Login" }));

  await waitFor(() => {
    expect(screen.getByText("Invalid email or password.")).toBeDefined();
  });
});

test("clears previous error on new submission attempt", async () => {
  mockSignIn
    .mockResolvedValueOnce({ success: false, error: "First error" })
    .mockResolvedValueOnce({ success: true });

  const user = userEvent.setup();
  render(<LoginPage />);

  const emailInput = screen.getByPlaceholderText("you@example.com");
  const passwordInput = document.getElementById("password")!;
  const loginBtn = screen.getByRole("button", { name: "Login" });

  await user.type(emailInput, "a@b.com");
  await user.type(passwordInput, "pass");
  await user.click(loginBtn);

  await waitFor(() => {
    expect(screen.getByText("First error")).toBeDefined();
  });

  await user.click(loginBtn);

  await waitFor(() => {
    expect(screen.queryByText("First error")).toBeNull();
  });
});

// --- Loading state ---

test("disables inputs and button while loading", () => {
  (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
    signIn: mockSignIn,
    isLoading: true,
  });

  render(<LoginPage />);

  expect((screen.getByPlaceholderText("you@example.com") as HTMLInputElement).disabled).toBe(true);
  expect((document.getElementById("password") as HTMLInputElement).disabled).toBe(true);
  expect((screen.getByRole("button") as HTMLButtonElement).disabled).toBe(true);
});

test("shows spinner and 'Signing in…' text while loading", () => {
  (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
    signIn: mockSignIn,
    isLoading: true,
  });

  const { container } = render(<LoginPage />);

  expect(screen.getByText("Signing in…")).toBeDefined();
  expect(container.querySelector(".animate-spin")).not.toBeNull();
});

test("shows 'Login' text and no spinner when not loading", () => {
  render(<LoginPage />);

  expect(screen.getByRole("button", { name: "Login" })).toBeDefined();
  expect(screen.queryByText("Signing in…")).toBeNull();
  const { container } = render(<LoginPage />);
  expect(container.querySelector(".animate-spin")).toBeNull();
});

// --- Layout / gradient background ---

test("renders a main element with gradient background class", () => {
  const { container } = render(<LoginPage />);
  const main = container.querySelector("main");
  expect(main).not.toBeNull();
  expect(main!.className).toContain("bg-gradient-to-br");
});
