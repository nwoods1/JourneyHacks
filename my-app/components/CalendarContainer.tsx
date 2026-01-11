"use client";

import { useEffect, useState } from "react";
import CalendarView from "@/components/CalendarView";
import type { CalEvent } from "@/lib/calendar/mapper";

function iso(msFromNow: number) {
  return new Date(Date.now() + msFromNow).toISOString();
}

export default function CalendarContainer() {

  const [events, setEvents] = useState<CalEvent[]>([]);

  // Load events on first render (mock for now)
  useEffect(() => {
  // Start of this week (Monday) in local time
  const startOfWeek = new Date();
  startOfWeek.setHours(0, 0, 0, 0);
  const day = startOfWeek.getDay(); // 0 = Sun
  const diffToMonday = (day === 0 ? -6 : 1) - day;
  startOfWeek.setDate(startOfWeek.getDate() + diffToMonday);

  // Helper: ISO timestamp for (dayOffset, hour, minute)
  const at = (dayOffset: number, hour: number, minute = 0) => {
    const dt = new Date(startOfWeek.getTime() + dayOffset * 24 * 60 * 60 * 1000);
    dt.setHours(hour, minute, 0, 0);
    return dt.toISOString();
  };

  // One helper to create a colored "availability event" block
  const block = (
    person: string,
    color: string,
    dayOffset: number,
    startH: number,
    startM: number,
    endH: number,
    endM: number
  ): CalEvent => ({
    id: crypto.randomUUID(),
    title: `${person} available`,
    start: at(dayOffset, startH, startM),
    end: at(dayOffset, endH, endM),
    backgroundColor: color,
    borderColor: color,
    textColor: "#ffffff",
  });

  const GRANT = "#2563eb"; // blue
  const SAM = "#16a34a";   // green
  const HARRY = "#dc2626"; // red
  const NAT = "#905f75";   // purple

  // Day offsets: Mon=0 Tue=1 Wed=2 Thu=3 Fri=4 Sat=5 Sun=6
  const initial: CalEvent[] = [
  // GRANT: Monday 1-7pm + rest of schedule
  block("Grant", GRANT, 0, 13, 0, 19, 0), // Monday 1-7pm
  block("Grant", GRANT, 0, 9, 0, 12, 0),
  block("Grant", GRANT, 1, 9, 30, 12, 30),
  block("Grant", GRANT, 1, 14, 0, 17, 0),
  block("Grant", GRANT, 2, 10, 0, 12, 0),
  block("Grant", GRANT, 2, 13, 30, 15, 30),
  block("Grant", GRANT, 4, 18, 0, 21, 0),
  block("Grant", GRANT, 5, 17, 0, 20, 0),

  // SAM: Monday 1-7pm + rest of schedule
  block("Sam", SAM, 0, 13, 0, 19, 0), // Monday 1-7pm
  block("Sam", SAM, 0, 11, 0, 14, 0),
  block("Sam", SAM, 1, 18, 0, 22, 0),
  block("Sam", SAM, 2, 18, 30, 21, 30),
  block("Sam", SAM, 4, 8, 0, 11, 0),

  // HARRY: Monday 1-7pm + rest of schedule
  block("Harry", HARRY, 0, 13, 0, 19, 0), // Monday 1-7pm
  block("Harry", HARRY, 1, 12, 0, 16, 0),
  block("Harry", HARRY, 3, 9, 0, 12, 0),
  block("Harry", HARRY, 4, 14, 0, 18, 0),
  block("Harry", HARRY, 5, 10, 0, 13, 0),

  // NAT: Monday 1-7pm + rest of schedule
  block("Nat", NAT, 0, 13, 0, 19, 0), // Monday 1-7pm
  block("Nat", NAT, 1, 10, 30, 12, 30),
  block("Nat", NAT, 2, 11, 0, 13, 0),
  block("Nat", NAT, 4, 12, 0, 15, 0),
  block("Nat", NAT, 5, 12, 30, 16, 0),
  ];

  setEvents(initial);
  }, []);


  // Wire up create/update/delete locally (no backend yet)
  const onCreate = (ev: CalEvent) => setEvents((prev) => [...prev, ev]);

  const onUpdate = (ev: CalEvent) =>
    setEvents((prev) => prev.map((e) => (e.id === ev.id ? { ...e, ...ev } : e)));

  const onDelete = (id: string) =>
    setEvents((prev) => prev.filter((e) => e.id !== id));

  return (

<div className="h-full min-h-0 p-6">
    <CalendarView
      events={events}
      mode="edit"
      onCreate={onCreate}
      onUpdate={onUpdate}
      onDelete={onDelete}
    />
    </div>
  );
}
