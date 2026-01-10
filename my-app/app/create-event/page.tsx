"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export default function CreateEventPage() {
  const supabase = createClient();
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);

  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [minMembers, setMinMembers] = useState<number>(2);

  const [windowStart, setWindowStart] = useState("");
  const [windowEnd, setWindowEnd] = useState("");

  const [emailsText, setEmailsText] = useState("");

  const [durationMinutes, setDurationMinutes] = useState<number>(30);
  const [slotIntervalMinutes, setSlotIntervalMinutes] = useState<number>(30);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debug, setDebug] = useState<string[]>([]);

  function addDebug(line: string) {
    setDebug((prev) => [line, ...prev]);
  }

  function resetForm() {
    setEventName("");
    setEventDescription("");
    setMinMembers(2);
    setWindowStart("");
    setWindowEnd("");
    setEmailsText("");
    setDurationMinutes(30);
    setSlotIntervalMinutes(30);
    setDebug([]);
    setError(null);
  }

  useEffect(() => {
    resetForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const emails = useMemo(() => {
    const raw = emailsText
      .split(/[\n,]+/)
      .map(normalizeEmail)
      .filter(Boolean);
    return Array.from(new Set(raw));
  }, [emailsText]);

  // Load current user
  useEffect(() => {
    (async () => {
      addDebug("Fetching current user…");
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        setError(error.message);
        addDebug("auth.getUser error: " + error.message);
        return;
      }

      const uid = data.user?.id ?? null;
      setUserId(uid);
      addDebug(uid ? `Logged in as ${uid}` : "Not logged in (userId is null)");
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toISO(dtLocal: string) {
    return new Date(dtLocal).toISOString();
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      addDebug("Submit clicked");

      if (!userId) throw new Error("You are not logged in. (userId is null)");

      if (!eventName.trim()) throw new Error("Event name is required.");

      if (!windowStart || !windowEnd) {
        throw new Error("Pick a window start and window end.");
      }

      const startISO = toISO(windowStart);
      const endISO = toISO(windowEnd);

      if (new Date(endISO) <= new Date(startISO)) {
        throw new Error("Window end must be after window start.");
      }

      addDebug(`Window ISO: ${startISO} → ${endISO}`);

      // 1) Look up user ids by email from profiles
      let usersToAdd: { id: string; email: string }[] = [];

      if (emails.length > 0) {
        addDebug(`Looking up ${emails.length} emails in profiles…`);
        const { data: profiles, error: profErr } = await supabase
          .from("profiles")
          .select("id,email")
          .in("email", emails);

        if (profErr) throw profErr;

        usersToAdd = (profiles ?? []).map((p: any) => ({
          id: p.id,
          email: normalizeEmail(p.email),
        }));

        const found = new Set(usersToAdd.map((u) => u.email));
        const missing = emails.filter((em) => !found.has(normalizeEmail(em)));
        if (missing.length > 0) {
          throw new Error(
            `These emails don't match any existing user: ${missing.join(", ")}`
          );
        }

        addDebug(`Email lookup success. Found ${usersToAdd.length} users.`);
      }

      // 2) Create the event (includes window_start/window_end now)
      addDebug("Inserting event…");
      const { data: eventRow, error: eventErr } = await supabase
        .from("events")
        .insert({
          event_name: eventName,
          event_description: eventDescription || null,

          window_start: startISO,
          window_end: endISO,

          // Required in your schema (NOT NULL)
          expire_at: endISO,


          duration_minutes: durationMinutes,
          slot_interval_minutes: slotIntervalMinutes,

          creator: userId,
          min_members: minMembers,
        })
        .select("id,event_name,created_at")
        .single();

      if (eventErr) throw eventErr;

      addDebug(`Event inserted with id: ${eventRow.id}`);

      // 3) Add creator + all found users to event_members
      const memberRows = [
        { event_id: eventRow.id, user_id: userId, role: "creator" },
        ...usersToAdd
          .filter((u) => u.id !== userId)
          .map((u) => ({ event_id: eventRow.id, user_id: u.id, role: "member" })),
      ];

      addDebug(`Inserting ${memberRows.length} event_members…`);
      const { error: memErr } = await supabase
        .from("event_members")
        .insert(memberRows);

      if (memErr) throw memErr;

      addDebug("Members inserted. Redirecting to dashboard…");

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      const msg = err?.message ?? "Something went wrong";
      setError(msg);
      addDebug("ERROR: " + msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Create Event</h1>

      <div className="p-3 border rounded bg-gray-50 space-y-1">
        <div className="font-semibold">Auth</div>
        <div className="font-mono text-sm break-all">
          userId: {userId ?? "null"}
        </div>
        {!userId && (
          <div className="text-sm text-red-600">
            You’re not logged in, so the button will be disabled.
          </div>
        )}
      </div>

      <form onSubmit={handleCreate} className="space-y-4">
        <div className="space-y-1">
          <label className="font-semibold">Event Name</label>
          <input
            className="w-full border p-2 rounded"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1">
          <label className="font-semibold">Event Description</label>
          <textarea
            className="w-full border p-2 rounded"
            rows={3}
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="font-semibold">Minimum Members Needed</label>
          <input
            className="w-full border p-2 rounded"
            type="number"
            min={0}
            value={minMembers}
            onChange={(e) => setMinMembers(Number(e.target.value))}
          />
        </div>

        <div className="border rounded p-4 space-y-3">
          <div className="font-semibold">Availability Window</div>

          <div className="space-y-1">
            <label className="text-sm font-semibold">Window Start</label>
            <input
              className="w-full border p-2 rounded"
              type="datetime-local"
              value={windowStart}
              onChange={(e) => setWindowStart(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold">Window End</label>
            <input
              className="w-full border p-2 rounded"
              type="datetime-local"
              value={windowEnd}
              onChange={(e) => setWindowEnd(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="border rounded p-4 space-y-3">
          <div className="font-semibold">Timing Settings</div>

          <div className="space-y-1">
            <label className="text-sm font-semibold">Event Duration (minutes)</label>
            <input
              className="w-full border p-2 rounded"
              type="number"
              min={1}
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold">Slot Interval (minutes)</label>
            <input
              className="w-full border p-2 rounded"
              type="number"
              min={1}
              value={slotIntervalMinutes}
              onChange={(e) => setSlotIntervalMinutes(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="border rounded p-4 space-y-2">
          <div className="font-semibold">Add Members (emails)</div>
          <textarea
            className="w-full border p-2 rounded"
            rows={4}
            value={emailsText}
            onChange={(e) => setEmailsText(e.target.value)}
            placeholder={"friend1@email.com\nfriend2@email.com"}
          />
        </div>

        <button
          type="submit"
          disabled={!userId || loading}
          className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>

      {error && (
        <div className="p-3 border border-red-400 bg-red-50 rounded">
          {error}
        </div>
      )}

      <div className="p-3 border rounded bg-gray-50">
        <div className="font-semibold mb-2">Debug</div>
        <ul className="text-sm list-disc ml-5 space-y-1">
          {debug.map((line, idx) => (
            <li key={idx} className="font-mono break-all">
              {line}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
