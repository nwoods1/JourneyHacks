interface EventCardProps {
    event: {
      id: number;
      title: string;
      description: string;
      image: string;
      creator: string;
    };
  }
  
  export default function EventCard({ event }: EventCardProps) {
    return (
      <div className="card bg-white shadow-xl hover:scale-105 transition-transform duration-200 cursor-pointer">
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
    );
  }