import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function EventCard({ event }) {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState("");
  const { currentUser } = useSelector((state) => state.user);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const toggleDescription = () => {
    setShowFullDescription((prev) => !prev);
  };

  const handleJoin = async () => {
    try {
      const res = await fetch(`/api/event/join/${event.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error joining event");
      }

      setJoined(true);
      setMessage(data.message || "Successfully joined the event!");

      localStorage.setItem(`joined-event-${event.id}`, "true");
    } catch (err) {
      setMessage(err.message);
    }
  };

  useEffect(() => {
    const joinedStatus = localStorage.getItem(`joined-event-${event.id}`);
    if (joinedStatus === "true") {
      setJoined(true);
    }
  }, [event.id]);

  return (
    <div className="group relative m-7 w-full border border-teal-500 hover:border-2 min-h-[480px] overflow-hidden rounded-lg sm:w-[430px]">
      <img
        src={event.image_url}
        alt="event"
        className="h-[250px] w-full object-cover"
      />
      <div className="pt-2 flex flex-col px-4 pb-4">
        <h1 className="text-2xl text-center text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
          {event.title}
        </h1>

        <p className="text-center pb-1">
          {showFullDescription || event.description.length <= 100
            ? event.description
            : `${event.description.slice(0, 100)}...`}
        </p>

        {event.description.length > 100 && (
          <button
            onClick={toggleDescription}
            className="text-sm text-blue-500 hover:underline self-center mb-2"
          >
            {showFullDescription ? "Show less" : "Show more"}
          </button>
        )}

        <p className="text-center italic text-sm">
          Category: {event.category_name}
        </p>

        <p className="text-center italic text-sm">
          Location: {event.location_name}, Address: {event.address}, City:{" "}
          {event.city}, Country: {event.country}
        </p>

        <p className="text-center italic text-sm">
          Start Date: {formatDate(event.start_date)}
        </p>
        <p className="text-center italic text-sm">
          End Date: {formatDate(event.end_date)}
        </p>

        <button
          onClick={handleJoin}
          disabled={joined}
          className={`mt-3 p-2 rounded-lg w-full ${
            joined ? "bg-green-500" : "bg-teal-500 hover:bg-teal-600"
          } text-white`}
        >
          {joined ? "Joined" : "Join Event"}
        </button>

        {message && (
          <p className="text-center text-sm text-green-500 mt-1">{message}</p>
        )}
      </div>
    </div>
  );
}
