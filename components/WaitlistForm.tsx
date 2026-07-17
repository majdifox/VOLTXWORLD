"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "loading" | "success" | "error";

export default function WaitlistForm() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState(""); // honeypot — real users never see or fill this
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "loading" || status === "success") return;

    setStatus("loading");
    setErrorMessage(null);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, email, company }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setStatus("error");
        setErrorMessage(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <p
        className="text-[0.95rem] tracking-wide text-white opacity-90"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        You&apos;re in. Welcome to VOLTX™.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-[420px] flex-col items-center gap-3 px-4 sm:px-0"
    >
      <div className="flex w-full flex-col gap-3">
        {/* Honeypot — invisible to real visitors, tabIndex -1 and aria-hidden
            keep it out of tab order and screen readers. Bots that
            auto-fill every input tend to fill this too, which flags them. */}
        <input
          type="text"
          name="company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          style={{
            position: "absolute",
            width: 1,
            height: 1,
            opacity: 0,
            pointerEvents: "none",
          }}
        />

        <input
          type="text"
          required
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First name"
          disabled={status === "loading"}
          aria-label="First name"
          autoComplete="given-name"
          maxLength={80}
          className="w-full rounded-full border border-white/25 bg-white/5 px-5 py-2.5 text-[0.9rem] font-light tracking-wide text-white placeholder-white/40 outline-none backdrop-blur-sm transition-colors duration-300 focus:border-white/60 disabled:opacity-60"
          style={{ fontFamily: "inherit" }}
        />

        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          disabled={status === "loading"}
          aria-label="Email address"
          autoComplete="email"
          className="w-full flex-1 rounded-full border border-white/25 bg-white/5 px-5 py-2.5 text-[0.9rem] font-light tracking-wide text-white placeholder-white/40 outline-none backdrop-blur-sm transition-colors duration-300 focus:border-white/60 disabled:opacity-60"
          style={{ fontFamily: "inherit" }}
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-4 w-full shrink-0 whitespace-nowrap rounded-full border border-white/70 px-6 py-2.5 text-[0.8rem] uppercase tracking-[0.25em] text-white transition-colors duration-300 hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {status === "loading" ? "JOINING..." : "Join the Waitlist"}
      </button>

      {status === "error" && errorMessage && (
        <p className="w-full text-center text-[0.75rem] tracking-wide text-white/60">
          {errorMessage}
        </p>
      )}
    </form>
  );
}