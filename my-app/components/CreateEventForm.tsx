"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export default function CreateEventForm({ onClose }: { onClose: () => void }) {
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
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        setError(error.message);
        return;
      }

      const uid = data.user?.id ?? null;
      setUserId(uid);
    })();
  }, []);

  function toISO(dtLocal: string) {
    return new Date(dtLocal).toISOString();
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!userId) throw new Error("You are not logged in.");

      if (!eventName.trim()) throw new Error("Event name is required.");

      if (!windowStart || !windowEnd) {
        throw new Error("Pick a window start and window end.");
      }

      const startISO = toISO(windowStart);
      const endISO = toISO(windowEnd);

      if (new Date(endISO) <= new Date(startISO)) {
        throw new Error("Window end must be after window start.");
      }

      // 1) Look up user ids by email from profiles
      let usersToAdd: { id: string; email: string }[] = [];

      if (emails.length > 0) {
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
      }

      // 2) Create the event
      const { data: eventRow, error: eventErr } = await supabase
        .from("events")
        .insert({
          event_name: eventName,
          event_description: eventDescription || null,

          window_start: startISO,
          window_end: endISO,

          expire_at: endISO,

          duration_minutes: durationMinutes,
          slot_interval_minutes: slotIntervalMinutes,

          creator: userId,
          min_members: minMembers,
        })
        .select("id,event_name,created_at")
        .single();

      if (eventErr) throw eventErr;

      // 3) Add creator + all found users to event_members
      const memberRows = [
        { event_id: eventRow.id, user_id: userId, role: "creator" },
        ...usersToAdd
          .filter((u) => u.id !== userId)
          .map((u) => ({ event_id: eventRow.id, user_id: u.id, role: "member" })),
      ];

      const { error: memErr } = await supabase
        .from("event_members")
        .insert(memberRows);

      if (memErr) throw memErr;

      // Close form and refresh
      onClose();
      router.refresh();
    } catch (err: any) {
      const msg = err?.message ?? "Something went wrong";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-1/3 bg-white p-6 overflow-y-auto border-r border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Create Event</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-2xl"
        >
          ×
        </button>
      </div>

      <form onSubmit={handleCreate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Event Name *</label>
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="Weekend Hangout"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="What's the plan?"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Minimum Members Needed</label>
          <input
            type="number"
            min={0}
            value={minMembers}
            onChange={(e) => setMinMembers(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        <div className="border rounded-lg p-4 space-y-3 bg-gray-50">
          <div className="font-semibold text-sm">Availability Window</div>

          <div>
            <label className="block text-xs font-medium mb-1">Window Start</label>
            <input
              type="datetime-local"
              value={windowStart}
              onChange={(e) => setWindowStart(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Window End</label>
            <input
              type="datetime-local"
              value={windowEnd}
              onChange={(e) => setWindowEnd(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        </div>

        <div className="border rounded-lg p-4 space-y-3 bg-gray-50">
          <div className="font-semibold text-sm">Timing Settings</div>

          <div>
            <label className="block text-xs font-medium mb-1">Event Duration (minutes)</label>
            <input
              type="number"
              min={1}
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Slot Interval (minutes)</label>
            <input
              type="number"
              min={1}
              value={slotIntervalMinutes}
              onChange={(e) => setSlotIntervalMinutes(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Add Members (emails)</label>
          <textarea
            value={emailsText}
            onChange={(e) => setEmailsText(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="friend1@email.com&#10;friend2@email.com"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={!userId || loading}
            className="flex-1 bg-blue-300 hover:bg-blue-400 text-black font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Event"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}