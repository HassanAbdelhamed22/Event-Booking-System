import { useEffect, useState } from "react";
import { getCategories, getEvents } from "../../services/event";
import type { Category, Event, EventFormValues } from "../../types";
import { CalendarClock, DollarSign, ListChecks, Users } from "lucide-react";
import Header from "../../layouts/Header";
import Footer from "../../layouts/Footer";
import AllEventsTable from "../../components/tables/EventsTable";
import {
  createEvent,
  deleteEvent,
  getEventsWithRevenue,
  updateEvent,
} from "../../services/eventAdmin";
import toast from "react-hot-toast";
import { getTotalBookings } from "../../services/bookingAdmin";
import Button from "../../components/UI/Button";
import Modal from "../../components/UI/Modal";
import EventForm from "../../components/forms/EventForm";

const AdminDashboard = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [revenue, setRevenue] = useState<number>(0);
  const [totalBookingsCount, setTotalBookingsCount] = useState<number>(0);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
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

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const { data } = await getEventsWithRevenue();
        const totalRevenue = data.events.reduce(
          (sum: number, event: { potential_revenue: string }) =>
            sum + Number(event.potential_revenue),
          0
        );

        setRevenue(totalRevenue);
      } catch (error) {
        console.error("Error fetching revenue:", error);
      }
    };

    fetchRevenue();
  }, []);

  useEffect(() => {
    const fetchTotalBookings = async () => {
      try {
        const { data } = await getTotalBookings();
        setTotalBookingsCount(data.total_bookings);
      } catch (error) {
        console.error("Error fetching total bookings:", error);
      }
    };

    fetchTotalBookings();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const { data } = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleEventsCreated = async (event: EventFormValues) => {
    try {
      setLoading(true);
      await createEvent(event);
      toast.success("Event created successfully!");
      setIsModelOpen(false);
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error(
        (error as any)?.response?.data?.message || "Failed to create event"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEventsUpdated = async (event: EventFormValues) => {
    try {
      if (!event.id) {
        throw new Error("Event ID is required to update the event.");
      }

      setLoading(true);
      await updateEvent(event.id, event);
      toast.success("Event updated successfully!");

      // Refresh the events list after updating
      const { data: refreshedEvents } = await getEvents();
      setEvents(refreshedEvents.events);
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error(
        (error as any)?.response?.data?.message || "Failed to update event"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (event: Event) => {
    try {
      setLoading(true);
      await deleteEvent(event.id);
      toast.success("Event deleted successfully!");

      // Refresh the events list after deletion
      const { data: refreshedEvents } = await getEvents();
      setEvents(refreshedEvents.events);
    } catch (error) {
      console.error("Error deleting event:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModelOpen(false);
  };

  // Calculate statistics
  const totalEvents = events.length;
  const totalBookings = Number(totalBookingsCount);
  const totalRevenue = Number(revenue);

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

            <Button
              className="mt-4 md:mt-0"
              variant="default"
              onClick={() => setIsModelOpen(true)}
            >
              Create New Event
            </Button>
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
                <h3 className="text-lg font-bold">{totalBookings}</h3>
                <p className="text-sm text-gray-600">Total Bookings</p>
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

      {loadingCategories ? (
        <div>Loading categories...</div>
      ) : (
        <Modal
          isOpen={isModelOpen}
          closeModal={() => setIsModelOpen(false)}
          title="Create New Event"
        >
          <EventForm
            categories={categories}
            onSave={handleEventsCreated}
            onCancel={handleCancel}
            isCreate={true}
          />
        </Modal>
      )}
    </div>
  );
};

export default AdminDashboard;
