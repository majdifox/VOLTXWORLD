import { NextRequest, NextResponse } from "next/server";

// ─── Config ────────────────────────────────────────────────────────────────
// Never expose this to the client. It is only ever read here, server-side.
const LOOPS_API_KEY = process.env.LOOPS_API_KEY;
const LOOPS_ENDPOINT = "https://app.loops.so/api/v1/transactional";
const LOOPS_TRANSACTIONAL_ID = "cmrmzy9dj00om0j0m07azdx4z";

// Simple, reliable email validation (RFC-5322-lite, good enough for signup forms)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Basic size guard so we never try to JSON.parse a huge/malicious body
const MAX_BODY_BYTES = 2_500; // email + first name, still nowhere near a real limit

// ─── Naive in-memory rate limiter ───────────────────────────────────────────
// Caps each IP to a handful of attempts per minute. This resets if the server
// restarts and isn't shared across multiple serverless instances, but it
// stops the common case: a script or bot hammering the endpoint from one IP.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (hits.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );
  timestamps.push(now);
  hits.set(ip, timestamps);

  // Prevent unbounded memory growth from many distinct IPs over a long uptime
  if (hits.size > 5_000) {
    const oldestKey = hits.keys().next().value;
    if (oldestKey) hits.delete(oldestKey);
  }

  return timestamps.length > RATE_LIMIT_MAX_REQUESTS;
}

function getClientIp(req: NextRequest): string {
  // Vercel/most proxies set this; fall back to a constant bucket if absent
  // (e.g. local dev) so rate limiting still works during testing.
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

export async function POST(req: NextRequest) {
  // ── 1. Confirm the server is configured before doing any work ───────────
  if (!LOOPS_API_KEY) {
    console.error("[waitlist] Missing LOOPS_API_KEY environment variable.");
    return NextResponse.json(
      { success: false, error: "Server is not configured." },
      { status: 500 }
    );
  }

  // ── 2. Rate limit ────────────────────────────────────────────────────
  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { success: false, error: "Too many attempts. Please try again shortly." },
      { status: 429 }
    );
  }

  // ── 3. Enforce content type + size before touching the body ─────────────
  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json(
      { success: false, error: "Invalid request." },
      { status: 415 }
    );
  }

  const contentLength = req.headers.get("content-length");
  if (contentLength && Number(contentLength) > MAX_BODY_BYTES) {
    return NextResponse.json(
      { success: false, error: "Request too large." },
      { status: 413 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  // ── 4. Honeypot check ─────────────────────────────────────────────────
  // A hidden field real users never see or fill. If it has a value, it was
  // filled by an automated bot — silently pretend success so the bot moves
  // on, without ever calling Loops or wasting a send.
  const honeypot =
    typeof body === "object" && body !== null && "company" in body
      ? String((body as { company: unknown }).company ?? "")
      : "";
  if (honeypot.trim().length > 0) {
    return NextResponse.json({ success: true }, { status: 200 });
  }

  const email =
    typeof body === "object" && body !== null && "email" in body
      ? String((body as { email: unknown }).email ?? "").trim().toLowerCase()
      : "";

  const firstNameRaw =
    typeof body === "object" && body !== null && "firstName" in body
      ? String((body as { firstName: unknown }).firstName ?? "").trim()
      : "";
  // Strip anything that isn't a letter, space, hyphen, or apostrophe, and cap length
  const firstName = firstNameRaw.replace(/[^\p{L}\s'-]/gu, "").slice(0, 80);

  // ── 5. Validate email + first name ───────────────────────────────────
  if (!email || email.length > 254 || !EMAIL_REGEX.test(email)) {
    return NextResponse.json(
      { success: false, error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  if (!firstName) {
    return NextResponse.json(
      { success: false, error: "Please enter your first name." },
      { status: 400 }
    );
  }

  // ── 6. Call Loops (server-to-server, key never leaves this function) ────
  try {
    const loopsRes = await fetch(LOOPS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOOPS_API_KEY}`,
      },
      body: JSON.stringify({
        transactionalId: LOOPS_TRANSACTIONAL_ID,
        email,
        dataVariables: {
          firstName,
        },
      }),
    });

    if (!loopsRes.ok) {
      // Log the real reason for our own debugging, but never leak
      // Loops' raw response back to the public client.
      const detail = await loopsRes.text().catch(() => "");
      console.error("[waitlist] Loops API error:", loopsRes.status, detail);

      return NextResponse.json(
        { success: false, error: "Could not join the waitlist. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[waitlist] Network/unexpected error:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

// Reject any method other than POST with a clean 405 instead of Next's default
export async function GET() {
  return NextResponse.json(
    { success: false, error: "Method not allowed." },
    { status: 405 }
  );
}