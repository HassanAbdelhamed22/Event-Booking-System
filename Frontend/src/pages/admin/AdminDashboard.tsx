import { useEffect, useState } from "react";
import { getEvents } from "../../services/event";
import type { Event, EventFormValues } from "../../types";
import { CalendarClock, DollarSign, ListChecks, Users } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "../../layouts/Header";
import Footer from "../../layouts/Footer";
import AllEventsTable from "../../components/tables/EventsTable";
import { deleteEvent, updateEvent } from "../../services/eventAdmin";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const { data } = await getEvents();
        setEvents(data.events);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleEventsUpdated = async (event: EventFormValues) => {
    try {
      setLoading(true);
      const { data } = await updateEvent(event.id, event);
      console.log("Event updated successfully:", data);
      toast.success("Event updated successfully!");

      // Refresh the events list after updating
      const { data: refreshedEvents } = await getEvents();
      setEvents(refreshedEvents.events);
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error((error as any)?.response?.data?.message || "Failed to update event");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (event: Event) => {
    try {
      setLoading(true);
      await deleteEvent(event.id);
      toast.success("Event deleted successfully!");
      console.log("Event deleted successfully");

      // Refresh the events list after deletion
      const { data: refreshedEvents } = await getEvents();
      setEvents(refreshedEvents.events);
    } catch (error) {
      console.error("Error deleting event:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const totalEvents = events.length;
  // const totalCapacity = events.reduce((sum, event) => sum + event.capacity, 0);
  const totalRevenue = events.reduce(
    (sum, event) => sum + Number(event.ticket_price),
    0
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow bg-gray-50 py-12">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">Manage events and bookings</p>
            </div>
            <Link to="/admin/events/new">
              <button className="mt-4 md:mt-0 btn-primary">
                Create New Event
              </button>
            </Link>
          </div>

          {/* Dashboard stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="bg-white p-6 rounded-lg shadow-md flex items-start">
              <div className="bg-primary-100 p-3 rounded-lg mr-4">
                <CalendarClock className="h-6 w-6 text-primary-700" />
              </div>
              <div>
                <h3 className="text-lg font-bold">{totalEvents}</h3>
                <p className="text-sm text-gray-600">Total Events</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md flex items-start">
              <div className="bg-secondary-100 p-3 rounded-lg mr-4">
                <Users className="h-6 w-6 text-secondary-700" />
              </div>
              <div>
                {/* <h3 className="text-lg font-bold">{totalCapacity}</h3> */}
                <p className="text-sm text-gray-600">Total Capacity</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md flex items-start">
              <div className="bg-green-100 p-3 rounded-lg mr-4">
                <DollarSign className="h-6 w-6 text-green-700" />
              </div>
              <div>
                <h3 className="text-lg font-bold">
                  ${totalRevenue.toFixed(2)}
                </h3>
                <p className="text-sm text-gray-600">Potential Revenue</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md flex items-start">
              <div className="bg-purple-100 p-3 rounded-lg mr-4">
                <ListChecks className="h-6 w-6 text-purple-700" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Active</h3>
                <p className="text-sm text-gray-600">System Status</p>
              </div>
            </div>
          </div>

          {/* Events table */}
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : error ? (
            <div className="bg-error-50 text-error-700 p-4 rounded-md">
              {error}
            </div>
          ) : (
            <AllEventsTable
              events={events}
              onDelete={handleDeleteEvent}
              onEdit={handleEventsUpdated}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
