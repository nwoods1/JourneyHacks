"use client";


import { DeployButton } from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { Hero } from "@/components/hero";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { ConnectSupabaseSteps } from "@/components/tutorial/connect-supabase-steps";
import { SignUpUserSteps } from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";
import Navbar from '@/components/Navbar';
import EventList from '@/components/EventList';
import CalendarContainer from "@/components/CalendarContainer";





import { EventInput } from "@fullcalendar/core";

type CalEvent = EventInput & { id: string };



export default function Home() {
  return (
    <main className="h-screen bg-white text-black flex flex-col overflow-hidden">
      <Navbar />

      <div className="flex flex-row flex-1 overflow-hidden">
        <EventList />
        
        <CalendarContainer />
      </div>
    </main>
  );
}

