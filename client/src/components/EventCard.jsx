// EventCard.jsx
import React, { useState } from "react";

export default function EventCard({ event }) {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  return (
    <div className="group relative m-7 w-full border border-teal-500 hover:border-2 h-[370px] overflow-hidden rounded-lg sm:w-[430px] ">
      <img
        src={event.image_url}
        alt="post cover"
        className="h-[250px] w-full  object-cover"
      />
      <div className="p-3 flex flex-col ">
        <p className="text-xl font-semibold line-clamp-2 text-center ">
          {event.title}
        </p>
        <p className="text-center">{event.description}</p>
        <p className="text-center italic text-sm">
          Start Date: {formatDate(event.start_date)}
        </p>
        <p className="text-center italic text-sm">
          End Date: {formatDate(event.end_date)}
        </p>
      </div>
    </div>
  );
}
