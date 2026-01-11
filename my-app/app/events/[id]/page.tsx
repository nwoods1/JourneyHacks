"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type EventRow = {
  id: string;
  event_name: string;
  event_description: string | null;
  creator: string | null;
  min_members: number | null;
  created_at: string;
};

type AvailabilityRow = {
  start_time: string;
  end_time: string;
};

export default function EventPage() {
  const supabase = createClient();
  const params = useParams();
  const eventId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [event, setEvent] = useState<EventRow | null>(null);
  const [window, setWindow] = useState<AvailabilityRow | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);

      // (optional) ensure logged in
      const { data: userRes, error: userErr } = await supabase.auth.getUser();
      if (userErr) {
        setError(userErr.message);
        setLoading(false);
        return;
      }
      if (!userRes.user) {
        setError("Not logged in.");
        setLoading(false);
        return;
      }

    // 1) Load event (includes window_start/window_end now)
    const { data: ev, error: evErr } = await supabase
    .from("events")
    .select(
        "id,event_name,event_description,created_at,min_members,creator,window_start,window_end"
    )
    .eq("id", eventId)
    .single();

    if (evErr) {
    setError(evErr.message);
    setLoading(false);
    return;
    }

    // Set event row
    setEvent(ev);

    // Set "window" from events table (so you can keep your UI code the same)
    setWindow({
    start_time: ev.window_start,
    end_time: ev.window_end,
    });



      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  if (loading) {
    return <div className="max-w-2xl mx-auto p-6">Loading…</div>;
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-4">
        <div className="p-3 border border-red-400 bg-red-50 rounded">{error}</div>
        <Link className="underline" href="/dashboard">
          Back to dashboard
        </Link>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        Event not found.{" "}
        <Link className="underline" href="/dashboard">
          Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{event.event_name}</h1>
        <Link className="underline" href="/dashboard">
          Back
        </Link>
      </div>

      <div className="border rounded p-4 space-y-2">
        <div className="text-sm text-gray-500">
          Created: {new Date(event.created_at).toLocaleString()}
        </div>

        {event.event_description && (
          <div>
            <div className="font-semibold">Description</div>
            <div className="text-gray-200">{event.event_description}</div>
          </div>
        )}

        <div>
          <div className="font-semibold">Minimum members</div>
          <div>{event.min_members ?? 0}</div>
        </div>

        <div>
          <div className="font-semibold">Availability window</div>
          {window ? (
            <div>
              {new Date(window.start_time).toLocaleString()} →{" "}
              {new Date(window.end_time).toLocaleString()}
            </div>
          ) : (
            <div className="text-gray-500">No window saved yet.</div>
          )}
        </div>
      </div>


    </div>
  );
}
