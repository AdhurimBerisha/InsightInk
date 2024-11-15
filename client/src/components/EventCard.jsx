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
    <div className="group relative m-7 w-full border border-teal-500 hover:border-2 h-[425px] overflow-hidden rounded-lg sm:w-[430px]">
      <img
        src={event.image_url}
        alt="post cover"
        className="h-[250px] w-full object-cover"
      />
      <div className="pt-2 flex flex-col">
        <h1 className="text-2xl text-center text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
          {event.title}
        </h1>
        <p className="text-center pb-1">{event.description}</p>

        <p className="text-center italic text-sm">
          Category: {event.category_name}
        </p>

        <p className="text-center italic text-sm">
          Location: {event.location_name}, Adress: {event.address}, City:{" "}
          {event.city}, Country: {event.country}
        </p>

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
