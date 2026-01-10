import EventCard from './EventCard';

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

export default function EventList() {
  return (
    <div className="w-1/3 h-screen border-r border-gray-200 flex flex-col">
      <h2 className="text-3xl font-bold p-6 pb-4">Proposed Hangouts</h2>
      
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="flex flex-col gap-4">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
}