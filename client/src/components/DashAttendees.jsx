import { Table } from "flowbite-react";
import { useEffect, useState } from "react";

function DashAttendees() {
  const [attendees, setAttendees] = useState([]);

  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        const res = await fetch("/api/event/attendees", {
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
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {attendees.length > 0 ? (
        <Table hoverable className="shadow-md">
          <Table.Head>
            <Table.HeadCell>Username</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Event</Table.HeadCell>
          </Table.Head>
          {attendees.map((attendee, index) => (
            <Table.Body key={index} className="divide-y">
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>{attendee.username}</Table.Cell>
                <Table.Cell>{attendee.email}</Table.Cell>
                <Table.Cell>{attendee.event_title}</Table.Cell>
              </Table.Row>
            </Table.Body>
          ))}
        </Table>
      ) : (
        <p>No attendees found!</p>
      )}
    </div>
  );
}

export default DashAttendees;
