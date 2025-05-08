import { useEffect, useState } from "react";

function DashAttendees() {
  const [attendees, setAttendees] = useState([]);

  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        const res = await fetch("/api/event/attendees", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Optional if route is protected
          },
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch attendees");
        }

        const data = await res.json();
        setAttendees(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAttendees();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Event Attendees</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Username</th>
            <th className="border p-2">Email</th>
          </tr>
        </thead>
        <tbody>
          {attendees.map((attendee, index) => (
            <tr key={index}>
              <td className="border p-2">{attendee.username}</td>
              <td className="border p-2">{attendee.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DashAttendees;
