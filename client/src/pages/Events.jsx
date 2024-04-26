import React, { useEffect, useState } from "react";
import EventCard from "../components/EventCard";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetch("/api/event/getevents")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        return response.json();
      })
      .then((data) => {
        setEvents(data);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  }, []);

  const visibleEvents = showAll ? events : events.slice(0, 6);

  return (
    <div className="flex flex-col justify-center items-center pb-[10.5rem]">
      {events.length === 0 && (
        <h1 className="text-3xl font font-semibold text-center my-7">
          No events yet...
        </h1>
      )}
      {visibleEvents.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {visibleEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
      {events.length > 6 && !showAll && (
        <button
          className="text-teal-500 text-lg hover:underline p-7 w-full justify-center"
          onClick={() => setShowAll(true)}
        >
          Show More
        </button>
      )}
    </div>
  );
}
