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

export default function Home() {
  const events = [
    {
      id: 1,
      title: "Snowboarding",
      description: "Hit the slopes for an epic day of snowboarding with friends",
      image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400",
      creator: "Grantley"
    },
    {
      id: 2,
      title: "Dinner Party",
      description: "Fine dining experience with a curated 5-course meal",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400",
      creator: "Sarah"
    },
    {
      id: 3,
      title: "Rave",
      description: "Dance the night away at the hottest underground venue",
      image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400",
      creator: "Mike"
    },
    {
      id: 4,
      title: "Hiking",
      description: "Morning hike through scenic mountain trails",
      image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400",
      creator: "Alex"
    },
    {
      id: 5,
      title: "Movie Night",
      description: "Cozy movie screening with popcorn and friends",
      image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400",
      creator: "Emma"
    },
    {
      id: 6,
      title: "Game Night",
      description: "Board games, card games, and friendly competition",
      image: "https://plus.unsplash.com/premium_photo-1682126370744-c546139f9f5a?q=80&w=3400&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      creator: "Jordan"
    }
  ];

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and App Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">L</span>
            </div>
            <h1 className="text-2xl font-bold">In The Loop</h1>
          </div>

          {/* Right side - Create Event Button and User Profile */}
          <div className="flex items-center gap-4">
            {/* Create Event Button */}
            <button className="btn btn-primary rounded-full px-6 py-2 bg-blue-300 hover:bg-blue-400 transition-colors">
              + Create Event
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">G</span>
              </div>
              <span className="font-medium">Grantley</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex flex-row flex-grow">
        {/* Left side - Events List (1/3 width) */}
        <div className="w-1/3 overflow-y-auto p-6 border-r border-gray-200">
          <h2 className="text-3xl font-bold mb-6">Upcoming Events</h2>
          
          <div className="flex flex-col gap-4">
            {events.map((event) => (
              <div key={event.id} className="card bg-white shadow-xl hover:scale-105 transition-transform duration-200 cursor-pointer">
                <div className="flex flex-row items-center p-4 gap-4">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="rounded-xl w-24 h-24 object-cover flex-shrink-0"
                  />
                  <div className="flex flex-col text-left">
                    <h3 className="text-xl font-bold mb-1">{event.title}</h3>
                    <p className="text-sm mb-1">{event.description}</p>
                    <p className="text-xs text-gray-600">Created by: {event.creator}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Right side - Calendar (2/3 width) */}
        <div className="w-2/3 p-6 bg-gray-50">
          <h2 className="text-3xl font-bold mb-6">Calendar</h2>
          {/* Calendar component will go here */}
          <div className="flex items-center justify-center h-full text-gray-400">
            Calendar coming soon...
          </div>
        </div>
      </div>
    </div>
  );
}