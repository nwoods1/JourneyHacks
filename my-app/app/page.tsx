import Navbar from '@/components/Navbar';
import EventList from '@/components/EventList';
import CalendarView from '@/components/CalendarView';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <Navbar />
      <div className="flex flex-row flex-grow">
        <EventList />
        <CalendarView />
      </div>
    </div>
  );
}