import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured, type Rsvp } from "../lib/supabase";
import { wedding } from "../content/weddingContent";
import { Ornament } from "./decor/FloralAccents";

/**
 * The couple's private view of the replies, at /dashboard.
 *
 * The gate on this screen is cosmetic, and that is fine — the real one is in
 * the database. `rsvps` grants `anon` no select at all, and the select it
 * does grant is conditional on public.is_admin(), so someone who skips this
 * screen entirely and calls the API with the anon key out of the bundle
 * still reads nothing. See supabase/dashboard.sql.
 */
export function Dashboard() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setReady(true);
      return;
    }
    void supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!isSupabaseConfigured) {
    return (
      <Shell>
        <p className="mx-auto max-w-md text-center text-lg text-cream/85">
          Supabase is not connected, so there are no replies to show. Set
          VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.
        </p>
      </Shell>
    );
  }

  if (!ready) {
    return (
      <Shell>
        <p className="text-center text-lg text-cream/70">Checking&hellip;</p>
      </Shell>
    );
  }

  return <Shell>{session ? <Replies session={session} /> : <SignIn />}</Shell>;
}

/* ---------------- shell ---------------- */

function Shell({ children }: { children: ReactNode }) {
  return (
    <main className="letter-desk min-h-screen px-4 py-10 sm:px-8 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 text-center">
          <p className="font-script text-4xl text-gold-soft sm:text-5xl">
            {wedding.monogram}
          </p>
          <h1 className="mt-1 font-display text-2xl uppercase tracking-[0.24em] text-cream sm:text-3xl">
            RSVP Dashboard
          </h1>
          <Ornament tone="light" className="mx-auto mt-5 opacity-80" />
        </header>
        {children}
      </div>
    </main>
  );
}

/* ---------------- sign in ---------------- */

function SignIn() {
  const [status, setStatus] = useState<"idle" | "working" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || status === "working") return;
    const form = new FormData(event.currentTarget);
    setStatus("working");
    setError(null);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: String(form.get("email") ?? "").trim(),
      password: String(form.get("password") ?? ""),
    });
    if (signInError) {
      // Deliberately not echoing the server's wording, which separates "no
      // such user" from "wrong password" and so confirms which addresses
      // have accounts.
      setError("That email and password did not match.");
      setStatus("error");
      return;
    }
    setStatus("idle");
  }

  const field =
    "mt-2 w-full border border-gold-deep/50 bg-cream px-4 py-3 font-body text-lg text-ink focus:border-maroon";
  const label =
    "block font-display text-sm uppercase tracking-[0.16em] text-gold-deep";

  return (
    <form
      onSubmit={handleSubmit}
      className="painted-panel mx-auto max-w-md px-7 py-9 sm:px-9"
    >
      <p className="text-center text-lg text-ink/85">
        This page is for {wedding.partnerOne.first} and {wedding.partnerTwo.first}.
      </p>
      <div className="mt-7 space-y-5">
        <div>
          <label htmlFor="email" className={label}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="username"
            className={field}
          />
        </div>
        <div>
          <label htmlFor="password" className={label}>
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className={field}
          />
        </div>
      </div>
      {error && (
        <p role="alert" className="mt-5 text-center text-base text-maroon">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={status === "working"}
        className="painted-edge mt-7 w-full border border-gold bg-maroon px-6 py-3.5 font-display text-sm uppercase tracking-[0.2em] text-cream transition-colors hover:bg-maroon-600 disabled:opacity-60"
      >
        {status === "working" ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

/* ---------------- the replies ---------------- */

function Replies({ session }: { session: Session }) {
  const [rows, setRows] = useState<Rsvp[] | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "yes" | "no">("all");

  const load = useCallback(async () => {
    if (!supabase) return;
    // Ask outright rather than inferring from an empty list: with no rows
    // visible, "not an admin" and "nobody has replied yet" look identical.
    const { data: admin, error: adminError } = await supabase.rpc("is_admin");
    if (adminError) {
      setError(
        "Could not check access. Has supabase/dashboard.sql been run on this project?",
      );
      setIsAdmin(false);
      return;
    }
    setIsAdmin(Boolean(admin));
    if (!admin) return;

    const { data, error: readError } = await supabase
      .from("rsvps")
      .select("*")
      .order("created_at", { ascending: false });
    if (readError) setError(readError.message);
    else setRows((data ?? []) as Rsvp[]);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const stats = useMemo(() => {
    const list = rows ?? [];
    const yes = list.filter((r) => r.attending);
    return {
      replies: list.length,
      attending: yes.length,
      declined: list.length - yes.length,
      guests: yes.reduce((sum, r) => sum + (r.party_size || 0), 0),
    };
  }, [rows]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return (rows ?? []).filter((r) => {
      if (filter === "yes" && !r.attending) return false;
      if (filter === "no" && r.attending) return false;
      if (!needle) return true;
      return [r.full_name, r.email, r.phone, r.guest_names, r.message]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(needle));
    });
  }, [rows, query, filter]);

  async function signOut() {
    await supabase?.auth.signOut();
  }

  async function remove(row: Rsvp) {
    if (!supabase) return;
    const ok = window.confirm(
      `Delete the reply from ${row.full_name}? This cannot be undone.`,
    );
    if (!ok) return;
    const { error: deleteError } = await supabase
      .from("rsvps")
      .delete()
      .eq("id", row.id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    setRows((current) => (current ?? []).filter((r) => r.id !== row.id));
  }

  function exportCsv() {
    const header = [
      "full_name",
      "email",
      "phone",
      "attending",
      "party_size",
      "guest_names",
      "dietary_notes",
      "message",
      "created_at",
    ] as const;
    // A cell starting =, +, - or @ is run as a formula by Excel and Sheets,
    // and every one of these values was typed by a stranger. Prefixing a
    // quote forces the spreadsheet to treat it as text.
    const cell = (value: unknown) => {
      const raw = value === null || value === undefined ? "" : String(value);
      const safe = /^[=+\-@\t\r]/.test(raw) ? `'${raw}` : raw;
      return `"${safe.replace(/"/g, '""')}"`;
    };
    const csv = [
      header.join(","),
      ...(rows ?? []).map((r) =>
        header.map((key) => cell(r[key as keyof Rsvp])).join(","),
      ),
    ].join("\r\n");
    // The BOM is what makes Excel read it as UTF-8 rather than mangling any
    // accented name.
    const blob = new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `rsvps-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  if (isAdmin === false) {
    return (
      <div className="painted-panel mx-auto max-w-md px-8 py-9 text-center">
        <p className="text-lg text-ink/90">
          {session.user.email} is signed in, but is not on the list of people
          who can see the replies.
        </p>
        {error && <p className="mt-3 text-base text-maroon">{error}</p>}
        <p className="mt-3 text-base text-ink/70">
          Add that address to the admins table in Supabase.
        </p>
        <button
          onClick={signOut}
          className="painted-edge mt-6 border border-maroon/50 px-6 py-3 font-display text-sm uppercase tracking-[0.18em] text-maroon transition-colors hover:bg-maroon hover:text-cream"
        >
          Sign out
        </button>
      </div>
    );
  }

  if (isAdmin === null || rows === null) {
    return <p className="text-center text-lg text-cream/70">Loading replies&hellip;</p>;
  }

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <p className="font-body text-base text-cream/75">
          Signed in as {session.user.email}
        </p>
        <div className="flex gap-2">
          <button
            onClick={exportCsv}
            className="painted-edge border border-gold/60 px-5 py-2.5 font-display text-xs uppercase tracking-[0.16em] text-gold-soft transition-colors hover:bg-gold hover:text-maroon-950"
          >
            Export CSV
          </button>
          <button
            onClick={signOut}
            className="painted-edge border border-cream/40 px-5 py-2.5 font-display text-xs uppercase tracking-[0.16em] text-cream/85 transition-colors hover:bg-cream/15"
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Stat label="Replies" value={stats.replies} />
        <Stat label="Attending" value={stats.attending} />
        <Stat label="Total guests" value={stats.guests} accent />
        <Stat label="Cannot come" value={stats.declined} />
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search name, email, message&hellip;"
          aria-label="Search replies"
          className="min-w-0 flex-1 border border-gold/40 bg-cream/95 px-4 py-2.5 font-body text-base text-ink placeholder:text-ink/50"
        />
        <div className="flex gap-1">
          {(["all", "yes", "no"] as const).map((key) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              aria-pressed={filter === key}
              className={`painted-edge border px-4 py-2.5 font-display text-xs uppercase tracking-[0.14em] transition-colors ${
                filter === key
                  ? "border-gold bg-gold text-maroon-950"
                  : "border-cream/35 text-cream/80 hover:bg-cream/10"
              }`}
            >
              {key === "all" ? "All" : key === "yes" ? "Coming" : "Not coming"}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="mb-5 border border-gold/50 bg-cream/10 px-4 py-3 text-base text-gold-soft"
        >
          {error}
        </p>
      )}

      {visible.length === 0 ? (
        <p className="py-16 text-center text-lg italic text-cream/70">
          {stats.replies === 0 ? "No replies yet." : "No replies match that search."}
        </p>
      ) : (
        <div className="overflow-x-auto border border-gold/25">
          <table className="w-full min-w-[52rem] border-collapse bg-cream/[0.04] text-left">
            <thead>
              <tr className="bg-maroon-950/60 font-display text-xs uppercase tracking-[0.14em] text-gold-soft">
                <Th>Name</Th>
                <Th>Reply</Th>
                <Th>Party</Th>
                <Th>Contact</Th>
                <Th>Notes</Th>
                <Th>Received</Th>
                <Th>
                  <span className="sr-only">Actions</span>
                </Th>
              </tr>
            </thead>
            <tbody className="font-body text-base text-cream/90">
              {visible.map((row) => (
                <tr key={row.id} className="border-t border-gold/15 align-top">
                  <Td>
                    <span className="font-medium text-cream">{row.full_name}</span>
                    {row.guest_names && (
                      <span className="mt-1 block text-sm text-cream/65">
                        with {row.guest_names}
                      </span>
                    )}
                  </Td>
                  <Td>
                    <span
                      className={`inline-block whitespace-nowrap px-2.5 py-1 text-sm ${
                        row.attending
                          ? "bg-gold/25 text-gold-soft"
                          : "bg-cream/10 text-cream/60"
                      }`}
                    >
                      {row.attending ? "Coming" : "Cannot come"}
                    </span>
                  </Td>
                  <Td>{row.attending ? row.party_size : "—"}</Td>
                  <Td>
                    {row.email && (
                      <a
                        href={`mailto:${row.email}`}
                        className="block underline decoration-gold/40 hover:text-gold-soft"
                      >
                        {row.email}
                      </a>
                    )}
                    {row.phone && <span className="block text-cream/70">{row.phone}</span>}
                    {!row.email && !row.phone && (
                      <span className="text-cream/40">{"—"}</span>
                    )}
                  </Td>
                  <Td>
                    {row.dietary_notes && (
                      <span className="block text-gold-soft/90">{row.dietary_notes}</span>
                    )}
                    {row.message && (
                      <span className="mt-1 block max-w-md italic text-cream/75">
                        &ldquo;{row.message}&rdquo;
                      </span>
                    )}
                    {!row.dietary_notes && !row.message && (
                      <span className="text-cream/40">{"—"}</span>
                    )}
                  </Td>
                  <Td>
                    <span className="whitespace-nowrap text-sm text-cream/65">
                      {new Date(row.created_at).toLocaleDateString(undefined, {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </Td>
                  <Td>
                    <button
                      onClick={() => remove(row)}
                      aria-label={`Delete the reply from ${row.full_name}`}
                      className="whitespace-nowrap px-2 py-1 text-sm text-cream/50 transition-colors hover:text-maroon-600"
                    >
                      Delete
                    </button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-6 text-center text-sm text-cream/50">
        Showing {visible.length} of {stats.replies}
      </p>
    </>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div
      className={`painted-edge border px-5 py-5 text-center ${
        accent ? "border-gold bg-gold/15" : "border-gold/35 bg-cream/[0.06]"
      }`}
    >
      <p className="foil-light font-script text-4xl leading-none sm:text-5xl">{value}</p>
      <p className="mt-2 font-display text-xs uppercase tracking-[0.16em] text-cream/75">
        {label}
      </p>
    </div>
  );
}

function Th({ children }: { children: ReactNode }) {
  return (
    <th scope="col" className="px-4 py-3 font-normal">
      {children}
    </th>
  );
}

function Td({ children }: { children: ReactNode }) {
  return <td className="px-4 py-4">{children}</td>;
}
