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
  window_start: string;
  window_end: string;
  deadline: string | null;
  status: string;
  finalized_start_time: string | null;
  finalized_end_time: string | null;
};

export default function EventPage() {
  const supabase = createClient();
  const params = useParams();
  const eventId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [event, setEvent] = useState<EventRow | null>(null);

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

      // Load event with all fields
      const { data: ev, error: evErr } = await supabase
        .from("events")
        .select(
          "id,event_name,event_description,created_at,min_members,creator,window_start,window_end,deadline,status,finalized_start_time,finalized_end_time"
        )
        .eq("id", eventId)
        .single();

      if (evErr) {
        setError(evErr.message);
        setLoading(false);
        return;
      }

      setEvent(ev);
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
            <div className="text-gray-700">{event.event_description}</div>
          </div>
        )}

        <div>
          <div className="font-semibold">Minimum members</div>
          <div>{event.min_members ?? 0}</div>
        </div>

        <div>
          <div className="font-semibold">Availability window</div>
          <div>
            {new Date(event.window_start).toLocaleString()} →{" "}
            {new Date(event.window_end).toLocaleString()}
          </div>
        </div>

        <div>
          <div className="font-semibold">Deadline</div>
          <div>{event.deadline ? new Date(event.deadline).toLocaleString() : "—"}</div>
        </div>

        <div>
          <div className="font-semibold">Status</div>
          <div>{event.status}</div>
        </div>

        {event.finalized_start_time && (
          <div className="p-3 border rounded bg-green-50 mt-3">
            <div className="font-semibold text-green-800">Final time</div>
            <div className="text-green-700">
              {new Date(event.finalized_start_time).toLocaleString()} →{" "}
              {new Date(event.finalized_end_time!).toLocaleString()}
            </div>
          </div>
        )}
      </div>

      <Link 
        className="inline-block underline text-blue-600 hover:text-blue-800" 
        href={`/events/${event.id}/availability`}
      >
        Set your availability
      </Link>
    </div>
  );
}