import { redirect } from 'next/navigation';
// import { createClient } from '@/utils/supabase/server';
import Navbar from '@/components/Navbar';
import EventList from '@/components/EventList';
import CalendarView from '@/components/CalendarView';

export default async function Home() {



  return (
    <div className="h-screen bg-white text-black flex flex-col overflow-hidden">
      <Navbar />
      <div className="flex flex-row flex-1 overflow-hidden">
        <EventList />
        <CalendarView />
      </div>
    </div>
  );
}