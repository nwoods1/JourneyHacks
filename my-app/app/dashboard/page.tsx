"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type EventRow = {
  id: string;
  event_name: string;
  created_at: string;
  min_members: number | null;
};

export default function DashboardPage() {
  const supabase = createClient();

  const [userId, setUserId] = useState<string | null>(null);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);

    const { data: userRes, error: userErr } = await supabase.auth.getUser();
    if (userErr) {
      setError(userErr.message);
      setLoading(false);
      return;
    }
    const uid = userRes.user?.id ?? null;
    setUserId(uid);

    if (!uid) {
      setEvents([]);
      setLoading(false);
      return;
    }

    // Fetch events where I'm a member:
    // event_members -> events
    const { data, error } = await supabase
      .from("event_members")
      .select("events ( id, event_name, created_at, min_members )")
      .eq("user_id", uid);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    const rows =
      (data ?? [])
        .map((r: any) => r.events)
        .filter(Boolean) as EventRow[];

    // Sort newest first
    rows.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));

    setEvents(rows);
    setLoading(false);
  }

  useEffect(() => {
    load();

    // optional: realtime updates so events appear instantly without refresh
    const channel = supabase
      .channel("dashboard-events")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "event_members" },
        () => load()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link
          href="/create-event"
          className="bg-black text-white px-4 py-2 rounded"
        >
          + Create Event
        </Link>
      </div>

      {!userId && (
        <div className="p-3 border rounded bg-yellow-50">
          Log in to see your events.
        </div>
      )}

      {loading && <div>Loading…</div>}

      {error && (
        <div className="p-3 border border-red-400 bg-red-50 rounded">
          {error}
        </div>
      )}

      {!loading && userId && events.length === 0 && (
        <div className="p-3 border rounded bg-gray-50">
          No events yet. Create one!
        </div>
      )}

      <div className="space-y-3">
        {events.map((ev) => (
          <div key={ev.id} className="border rounded p-4">
            <div className="font-semibold">{ev.event_name}</div>
            <div className="text-sm text-gray-600">
              Created: {new Date(ev.created_at).toLocaleString()}
              {ev.min_members != null ? ` • Min members: ${ev.min_members}` : ""}
            </div>

            {/* Link for later: event details page */}
            <div className="mt-2">
              <Link className="underline" href={`/events/${ev.id}`}>
                View event
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
