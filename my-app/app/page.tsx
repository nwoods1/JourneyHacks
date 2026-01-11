"use client";

import { useState } from "react";
import Navbar from '@/components/Navbar';
import EventList from '@/components/EventList';
import CalendarContainer from "@/components/CalendarContainer";

import { EventInput } from "@fullcalendar/core";

type CalEvent = EventInput & { id: string };


import CreateEventForm from '@/components/CreateEventForm';

export default function Home() {
  const [showCreateEvent, setShowCreateEvent] = useState(false);

  return (
    <main className="h-screen bg-white text-black flex flex-col">
      <Navbar onCreateEventClick={() => setShowCreateEvent(true)} />

      <div className="flex flex-row flex-1">
        {showCreateEvent ? (
          <CreateEventForm onClose={() => setShowCreateEvent(false)} />
        ) : (
          <EventList />
        )}
        <CalendarContainer />
      </div>
    </main>
  );
}