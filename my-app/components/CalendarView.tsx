"use client";


import { useMemo, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { DateSelectArg } from "@fullcalendar/core";
import { EventClickArg } from "@fullcalendar/core";
import { EventResizeDoneArg } from "@fullcalendar/interaction";
import { EventDropArg } from "@fullcalendar/core";
import { EventInput } from "@fullcalendar/core";

type CalEvent = EventInput & { id: string };

function makeId() {
  return crypto.randomUUID();
}

export default function Calendar() {
  const [events, setEvents] = useState<CalEvent[]>([]);

  const handleSelect = (info: DateSelectArg) => {
    info.view.calendar.unselect();

    const title = window.prompt("Event name?");
    if (!title) return;

    setEvents((prev) => [
      ...prev,
      {
        id: makeId(),
        title,
        start: info.start,
        end: info.end,
        allDay: info.allDay,
      },
    ]);
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const action = window.prompt(
      `Type a new name to rename.\nType DELETE to delete.\n(Current: "${clickInfo.event.title}")`
    );

    if (!action) return;

    if (action.trim().toUpperCase() === "DELETE") {
      setEvents((prev) => prev.filter((e) => e.id !== clickInfo.event.id));
      return;
    }

    setEvents((prev) =>
      prev.map((e) =>
        e.id === clickInfo.event.id ? { ...e, title: action.trim() } : e
      )
    );
  };

  const syncEvent = (ev: any) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === ev.id
          ? { ...e, start: ev.start!, end: ev.end ?? undefined, allDay: ev.allDay }
          : e
      )
    );
  };

  return (
    <div className="max-w-5xl mx-auto rounded-xl bg-white p-4">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        height="auto"
        nowIndicator
        selectable
        selectMirror
        editable
        events={events}
        select={handleSelect}
        eventClick={handleEventClick}
        eventDrop={(arg: EventDropArg) => syncEvent(arg.event)}
        eventResize={(arg: EventResizeDoneArg) => syncEvent(arg.event)}
      />
    </div>
  );
}
