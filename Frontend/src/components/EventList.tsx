import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import type { Booking, Event } from "../types";
import toast from "react-hot-toast";
import {
  checkUserBookedEvent,
  createBooking,
  getUserBookings,
} from "../services/booking";
import EventCard from "./EventCard";
import BookingModal from "./BookingModal";
import BookingSuccessModal from "./BookingSuccessModal";

interface EventListProps {
  events: Event[];
  userBookings?: Booking[];
  onBookingCreated?: () => void;
}

const EventList: React.FC<EventListProps> = ({
  events,
  userBookings = [],
  onBookingCreated,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(events);
  const [bookedEventIds, setBookedEventIds] = useState<Set<string>>(new Set());
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [ticketCount, setTicketCount] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  // Fetch user's bookings from the backend
  const fetchUserBookings = async () => {
    if (!user) {
      setBookedEventIds(new Set());
      return;
    }
    try {
      const data = await getUserBookings();
      // Access data.bookings, ensure it's an array
      const bookings = Array.isArray(data.bookings) ? data.bookings : [];
      const bookedIds = new Set<string>(
        bookings.map((booking: Booking) => booking.event_id)
      );
      setBookedEventIds(bookedIds);
    } catch (error) {
      console.error("Error fetching user bookings:", error);
      toast.error("Failed to load booked events.");
    }
  };

  // Initialize bookedEventIds from userBookings prop and fetch from backend
  useEffect(() => {
    if (userBookings.length > 0) {
      const bookedIds = new Set<string>(
        userBookings.map((booking) => booking.event_id)
      );
      setBookedEventIds(bookedIds);
    }
    if (user) {
      fetchUserBookings();
    }
  }, [userBookings, user]);

  // Filter events based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredEvents(events);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered = events.filter(
        (event) =>
          event.name.toLowerCase().includes(lowercasedSearch) ||
          event.description.toLowerCase().includes(lowercasedSearch) ||
          event.category.name.toLowerCase().includes(lowercasedSearch) ||
          event.location.toLowerCase().includes(lowercasedSearch)
      );
      setFilteredEvents(filtered);
    }
  }, [searchTerm, events]);

  const handleBook = (event: Event) => {
    if (!user) {
      navigate("/login");
      return;
    }
    setSelectedEvent(event);
    setIsBookingModalOpen(true);
  };

  const handleBookingSubmit = async (tickets: number) => {
    if (!selectedEvent || !user) return;

    try {
      // Check if already booked
      const { data, status } = await checkUserBookedEvent(selectedEvent.id);
      if (status === 401) {
        toast.error("Please log in to book this event.");
        navigate("/login");
        return;
      }
      if (data.has_booked) {
        toast.error("You have already booked this event!");
        setIsBookingModalOpen(false);
        return;
      }

      // Create a new booking
      await createBooking(selectedEvent.id, tickets);
      setTicketCount(tickets);
      setTotalPrice(tickets * Number(selectedEvent.ticket_price || 0));
      setBookedEventIds((prev) => new Set(prev).add(selectedEvent.id));

      if (onBookingCreated) {
        onBookingCreated();
      }

      setIsBookingModalOpen(false);
      setIsSuccessModalOpen(true);

      // Refresh booked events after successful booking
      await fetchUserBookings();
    } catch (error) {
      console.error("Error booking event:", error);
      toast.error("Failed to book event. Please try again.");
    }
  };

  return (
    <div>
      <div className="relative max-w-xl mx-auto mb-8">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="form-input pl-10"
          placeholder="Search for events by title, category, or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              isBooked={bookedEventIds.has(event.id)}
              onBook={() => handleBook(event)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-600">No events found</h3>
          <p className="text-gray-500 mt-2">
            Try adjusting your search or check back later for new events.
          </p>
        </div>
      )}

      {selectedEvent && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          onSubmit={handleBookingSubmit}
          eventName={selectedEvent.name}
          ticketPrice={Number(selectedEvent.ticket_price || 0)}
        />
      )}

      {selectedEvent && (
        <BookingSuccessModal
          isOpen={isSuccessModalOpen}
          onClose={() => {
            setIsSuccessModalOpen(false);
          }}
          eventName={selectedEvent.name}
          ticketCount={ticketCount}
          totalPrice={totalPrice}
        />
      )}
    </div>
  );
};

export default EventList;
