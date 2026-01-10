"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { DateSelectArg, EventClickArg, EventDropArg } from "@fullcalendar/core";
import type { EventResizeDoneArg } from "@fullcalendar/interaction";
import type { CalEvent } from "@/lib/calendar/mapper.ts";

function makeId() {
  return crypto.randomUUID();
}

type CalendarMode = "read" | "edit";

export default function CalendarView({
  events,
  mode = "edit",
  onCreate,
  onUpdate,
  onDelete,
}: {
  events: CalEvent[];
  mode?: CalendarMode;
  onCreate?: (ev: CalEvent) => void;
  onUpdate?: (ev: CalEvent) => void;
  onDelete?: (id: string) => void;
}) {
  const canEdit = mode === "edit" && !!onUpdate;
  const canCreate = mode === "edit" && !!onCreate;
  const canDelete = mode === "edit" && !!onDelete;

  const handleSelect = (info: DateSelectArg) => {
    if (!canCreate) return;

    info.view.calendar.unselect();
    const title = window.prompt("Event name?");
    if (!title) return;

    onCreate?.({
      id: makeId(),
      title: title.trim(),
      start: info.start,
      end: info.end,
      allDay: info.allDay,
    });
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    if (mode !== "edit") return;

    const action = window.prompt(
      `Type a new name to rename.\nType DELETE to delete.\n(Current: "${clickInfo.event.title}")`
    );
    if (!action) return;

    if (action.trim().toUpperCase() === "DELETE") {
      if (!canDelete) return;
      onDelete?.(String(clickInfo.event.id));
      return;
    }

    if (!canEdit) return;

    onUpdate?.({
      id: String(clickInfo.event.id),
      title: action.trim(),
      start: clickInfo.event.start ?? undefined,
      end: clickInfo.event.end ?? undefined,
      allDay: clickInfo.event.allDay,
    });
  };

  const syncEvent = (ev: any) => {
    if (!canEdit) return;

    onUpdate?.({
      id: String(ev.id),
      title: ev.title,
      start: ev.start ?? undefined,
      end: ev.end ?? undefined,
      allDay: ev.allDay,
    });
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
        contentHeight={900} 
        expandRows={false} 
        
        scrollTime="08:00:00"     
        nowIndicator
        selectable={canCreate}
        selectMirror={canCreate}
        editable={canEdit}
        events={events}
        select={canCreate ? handleSelect : undefined}
        eventClick={mode === "edit" ? handleEventClick : undefined}
        eventDrop={(arg: EventDropArg) => syncEvent(arg.event)}
        eventResize={(arg: EventResizeDoneArg) => syncEvent(arg.event)}
        slotMinTime="00:00:00"
        slotMaxTime="24:00:00"
      />
    </div>
  );
}
