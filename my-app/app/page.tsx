"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from '@/components/Navbar';
import EventList from '@/components/EventList';
import CalendarContainer from "@/components/CalendarContainer";

import { EventInput } from "@fullcalendar/core";

type CalEvent = EventInput & { id: string };

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-white text-black flex flex-col">
      <Navbar onCreateEventClick={() => router.push('/create-event')} />

      <div className="flex flex-row flex-1">
        <EventList />
        <CalendarContainer />
      </div>
    </main>
  );
}