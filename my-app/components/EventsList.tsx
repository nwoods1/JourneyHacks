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

export default function EventList() {
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

    rows.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));

    setEvents(rows);
    setLoading(false);
  }

  useEffect(() => {
    load();

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
  }, []);

  return (
    <div className="w-1/3 bg-gray-50 p-6 overflow-y-auto border-r border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Your Events</h2>
      </div>

      {!userId && (
        <div className="p-3 border rounded bg-yellow-50 text-sm">
          Log in to see your events.
        </div>
      )}

      {loading && <div className="text-gray-500">Loading…</div>}

      {error && (
        <div className="p-3 border border-red-400 bg-red-50 rounded text-sm">
          {error}
        </div>
      )}

      {!loading && userId && events.length === 0 && (
        <div className="p-3 border rounded bg-gray-100 text-sm text-gray-600">
          No events yet. Click "Create Event" to get started!
        </div>
      )}

      <div className="space-y-3">
        {events.map((ev) => (
          <div key={ev.id} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="font-semibold text-lg mb-2">{ev.event_name}</div>
            <div className="text-sm text-gray-600 mb-3">
              {new Date(ev.created_at).toLocaleDateString()}
              {ev.min_members != null && (
                <span className="ml-2">• Min: {ev.min_members} members</span>
              )}
            </div>
            <Link 
              className="text-blue-500 hover:text-blue-700 text-sm font-medium" 
              href={`/events/${ev.id}`}
            >
              View Details →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}