"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

const DEFAULT_VALUES = {
  eventName: "",
  eventDescription: "",
  minMembers: 2,
  windowStart: "",
  windowEnd: "",
  durationMinutes: 60,
  slotIntervalMinutes: 30,
  countdownHours: 24,
  emailsText: "",
};

export default function CreateEventPage() {
  const supabase = createClient();
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);

  const [eventName, setEventName] = useState(DEFAULT_VALUES.eventName);
  const [eventDescription, setEventDescription] = useState(DEFAULT_VALUES.eventDescription);
  const [minMembers, setMinMembers] = useState<number>(DEFAULT_VALUES.minMembers);

  const [windowStart, setWindowStart] = useState(DEFAULT_VALUES.windowStart);
  const [windowEnd, setWindowEnd] = useState(DEFAULT_VALUES.windowEnd);

  const [durationMinutes, setDurationMinutes] = useState<number>(DEFAULT_VALUES.durationMinutes);
  const [slotIntervalMinutes, setSlotIntervalMinutes] = useState<number>(DEFAULT_VALUES.slotIntervalMinutes);

  const [countdownHours, setCountdownHours] = useState<number>(DEFAULT_VALUES.countdownHours);

  const [emailsText, setEmailsText] = useState(DEFAULT_VALUES.emailsText);
  const emails = useMemo(() => {
    const raw = emailsText.split(/[\n,]+/).map(normalizeEmail).filter(Boolean);
    return Array.from(new Set(raw));
  }, [emailsText]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toISO(dtLocal: string) {
    return new Date(dtLocal).toISOString();
  }

  function resetForm() {
    setEventName(DEFAULT_VALUES.eventName);
    setEventDescription(DEFAULT_VALUES.eventDescription);
    setMinMembers(DEFAULT_VALUES.minMembers);
    setWindowStart(DEFAULT_VALUES.windowStart);
    setWindowEnd(DEFAULT_VALUES.windowEnd);
    setDurationMinutes(DEFAULT_VALUES.durationMinutes);
    setSlotIntervalMinutes(DEFAULT_VALUES.slotIntervalMinutes);
    setCountdownHours(DEFAULT_VALUES.countdownHours);
    setEmailsText(DEFAULT_VALUES.emailsText);
    setError(null);
  }

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) return setError(error.message);
      setUserId(data.user?.id ?? null);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!userId) throw new Error("You must be logged in.");
      if (!windowStart || !windowEnd) throw new Error("Pick a window start and end.");

      const startISO = toISO(windowStart);
      const endISO = toISO(windowEnd);
      if (new Date(endISO) <= new Date(startISO)) throw new Error("Window end must be after start.");

      const deadlineISO = new Date(Date.now() + countdownHours * 60 * 60 * 1000).toISOString();

      // Lookup users by email
      let usersToAdd: { id: string; email: string }[] = [];
      if (emails.length > 0) {
        const { data: profiles, error: pe } = await supabase
          .from("profiles")
          .select("id,email")
          .in("email", emails);
        if (pe) throw pe;

        usersToAdd = (profiles ?? []).map((p: any) => ({ id: p.id, email: normalizeEmail(p.email) }));

        const found = new Set(usersToAdd.map((u) => u.email));
        const missing = emails.filter((em) => !found.has(normalizeEmail(em)));
        if (missing.length) throw new Error(`No account for: ${missing.join(", ")}`);
      }

      // 1) Create event (window lives here)
      const { data: eventRow, error: ee } = await supabase
        .from("events")
        .insert({
          event_name: eventName,
          event_description: eventDescription || null,
          window_start: startISO,
          window_end: endISO,
          duration_minutes: durationMinutes,
          slot_interval_minutes: slotIntervalMinutes,
          deadline: deadlineISO,
          expire_at: deadlineISO, // same for MVP
          status: "open",
          creator: userId,
          min_members: minMembers,
        })
        .select("id")
        .single();

      if (ee) throw ee;

      // 2) Add members
      const memberRows = [
        { event_id: eventRow.id, user_id: userId, role: "creator" },
        ...usersToAdd
          .filter((u) => u.id !== userId)
          .map((u) => ({ event_id: eventRow.id, user_id: u.id, role: "member" })),
      ];

      const { error: me } = await supabase.from("event_members").insert(memberRows);
      if (me) throw me;

      // 3) Generate slots from window
      const interval = slotIntervalMinutes;
      let cur = new Date(startISO);
      const end = new Date(endISO);

      const slotsToInsert: any[] = [];
      while (cur < end) {
        const next = new Date(cur.getTime() + interval * 60_000);
        if (next > end) break;
        slotsToInsert.push({
          event_id: eventRow.id,
          slot_start: cur.toISOString(),
          slot_end: next.toISOString(),
        });
        cur = next;
      }

      const { error: se } = await supabase.from("event_slots").insert(slotsToInsert);
      if (se) throw se;

      // Reset form after successful creation
      resetForm();
      
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Create Event</h1>

      <form onSubmit={handleCreate} className="space-y-4">
        <div className="space-y-1">
          <label className="font-semibold">Event Name</label>
          <input className="w-full border p-2 rounded" value={eventName} onChange={(e) => setEventName(e.target.value)} required />
        </div>

        <div className="space-y-1">
          <label className="font-semibold">Event Description</label>
          <textarea className="w-full border p-2 rounded" rows={3} value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} />
        </div>

        <div className="space-y-1">
          <label className="font-semibold">Minimum Members Needed</label>
          <input className="w-full border p-2 rounded" type="number" min={0} value={minMembers} onChange={(e) => setMinMembers(Number(e.target.value))} />
        </div>

        <div className="border rounded p-4 space-y-3">
          <div className="font-semibold">Availability Window</div>
          <div className="space-y-1">
            <label className="text-sm font-semibold">Window Start</label>
            <input className="w-full border p-2 rounded" type="datetime-local" value={windowStart} onChange={(e) => setWindowStart(e.target.value)} required />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold">Window End</label>
            <input className="w-full border p-2 rounded" type="datetime-local" value={windowEnd} onChange={(e) => setWindowEnd(e.target.value)} required />
          </div>
        </div>

        <div className="border rounded p-4 space-y-3">
          <div className="font-semibold">Timing</div>
          <div className="space-y-1">
            <label className="text-sm font-semibold">Event Duration (minutes)</label>
            <input className="w-full border p-2 rounded" type="number" min={1} value={durationMinutes} onChange={(e) => setDurationMinutes(Number(e.target.value))} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold">Slot Interval (minutes)</label>
            <input className="w-full border p-2 rounded" type="number" min={1} value={slotIntervalMinutes} onChange={(e) => setSlotIntervalMinutes(Number(e.target.value))} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold">Countdown (hours)</label>
            <input className="w-full border p-2 rounded" type="number" min={1} value={countdownHours} onChange={(e) => setCountdownHours(Number(e.target.value))} />
          </div>
        </div>

        <div className="border rounded p-4 space-y-2">
          <div className="font-semibold">Add Members (emails)</div>
          <textarea className="w-full border p-2 rounded" rows={4} value={emailsText} onChange={(e) => setEmailsText(e.target.value)} placeholder={"friend1@email.com\nfriend2@email.com"} />
        </div>

        <button disabled={!userId || loading} className="bg-black text-white px-4 py-2 rounded disabled:opacity-50">
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>

      {error && <div className="p-3 border border-red-400 bg-red-50 rounded">{error}</div>}
    </div>
  );
}