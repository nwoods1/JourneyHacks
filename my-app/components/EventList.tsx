import EventCard from './EventCard';

const events = [
    {
      id: 1,
      title: "Snowboarding",
      description: "Hey all! Looking for someone to hit the slopes with me this weekend. I'm intermediate level but down to ride with anyone!",
      image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400",
      creator: "Grantley"
    },
    {
      id: 2,
      title: "Dinner Party",
      description: "Planning a cozy dinner at my place! I'm making pasta from scratch and would love some company. BYOB welcome 🍷",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400",
      creator: "Sarah"
    },
    {
      id: 3,
      title: "Rave",
      description: "Who's down for an absolute banger tonight? Got tickets to this sick underground show, need a crew!",
      image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400",
      creator: "Mike"
    },
    {
      id: 4,
      title: "Hiking",
      description: "Early morning hike at sunrise anyone? Beautiful trails, not too intense. Coffee stop afterwards!",
      image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400",
      creator: "Alex"
    },
    {
      id: 5,
      title: "Movie Night",
      description: "Movie marathon at mine! Thinking horror movies + tons of snacks. Who's in?",
      image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400",
      creator: "Emma"
    },
    {
      id: 6,
      title: "Game Night",
      description: "Board game night! I've got Catan, Codenames, and a bunch more. Competitive people welcome 😈",
      image: "https://plus.unsplash.com/premium_photo-1682126370744-c546139f9f5a?q=80&w=3400&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      creator: "Jordan"
    },
    {
      id: 7,
      title: "Brunch Spot",
      description: "Found this amazing brunch place! Anyone want to check it out with me Sunday morning? Their pancakes look insane 🥞",
      image: "https://images.unsplash.com/photo-1533777324565-a040eb52facd?w=400",
      creator: "Taylor"
    },
    {
      id: 8,
      title: "Beach Volleyball",
      description: "Beach volleyball this Saturday! We need 2 more people. Totally casual, just for fun and maybe some beers after?",
      image: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400",
      creator: "Chris"
    },
    {
      id: 9,
      title: "Coffee & Study",
      description: "Study buddy needed! Going to that new cafe downtown tomorrow. Let's grind together ☕📚",
      image: "https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=400",
      creator: "Maya"
    },
    {
      id: 10,
      title: "Bike Ride",
      description: "Casual bike ride along the waterfront trail! Easy pace, great views. Let's ride!",
      image: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400",
      creator: "Sam"
    },
    {
      id: 11,
      title: "Karaoke Night",
      description: "Karaoke tonight!! Don't need to be good, just need to be loud 🎤 Who's brave enough?",
      image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400",
      creator: "Riley"
    },
    {
      id: 12,
      title: "Rock Climbing",
      description: "Indoor climbing gym session! I'm a beginner so no pressure. Let's learn together and maybe grab food after?",
      image: "https://images.unsplash.com/photo-1522163182402-834f871fd851?w=400",
      creator: "Casey"
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