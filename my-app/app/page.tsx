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





import { EventInput } from "@fullcalendar/core";

type CalEvent = EventInput & { id: string };



import Calendar from "@/components/calendar/Calendar";

export default function Home() {
  return (
    <main className="p-6">
      <Calendar />
    </main>
  );}