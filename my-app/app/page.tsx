"use client";

import { useState } from "react";
import Navbar from '@/components/Navbar';
import EventList from '@/components/EventList';
import CalendarView from '@/components/CalendarView';
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
        <CalendarView />
      </div>
    </main>
  );
}