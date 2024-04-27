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
    <div className="max-w-full mx-auto p-3 flex flex-col gap-8 py-7 m-7 ">
      {visibleEvents.length > 0 && (
        <div className="flex flex-col gap-6">
          <h2 className="text-2xl font-semibold text-center">Upcoming Events</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {visibleEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          {events.length > 6 && !showAll && (
            <button
              className="text-lg text-teal-500 hover:underline text-center"
              onClick={() => setShowAll(true)}
            >
              Show More
            </button>
          )}
        </div>
      )}
      {events.length === 0 && (
        <h1 className="text-3xl font-semibold text-center">No events yet...</h1>
      )}
    </div>
  );
}
