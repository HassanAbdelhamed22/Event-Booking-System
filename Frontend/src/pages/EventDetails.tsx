import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { getEvent } from "../services/event";
import toast from "react-hot-toast";
import { createBooking } from "../services/booking";
import type { Event } from "../types";
import Header from "../layouts/Header";
import Loading from "../components/UI/Loading";
import Footer from "../layouts/Footer";
import Error from "../components/UI/Error";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  Users,
  Ticket,
} from "lucide-react";
import Card, { CardContent, CardFooter } from "../components/UI/Card";
import Badge from "../components/UI/Badge";
import Button from "../components/UI/Button";
import Modal from "../components/UI/Modal";
import img from "../assets/homePage1.webp";
import BookingSuccessModal from "../components/BookingSuccessModal";

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [ticketCount, setTicketCount] = useState<number>(1);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successModalData, setSuccessModalData] = useState<{
    eventName: string;
    ticketCount: number;
    totalPrice: number;
  } | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) {
        setError("Invalid event ID.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data } = await getEvent(id);
        setEvent(data);
      } catch (err) {
        console.error("Error fetching event:", err);
        setError("Failed to fetch event details. Please try again later.");
        toast.error("Failed to load event details.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleBook = async () => {
    if (!user) {
      toast.error("Please log in to book this event.");
      navigate("/login");
      return;
    }
    setIsBookingModalOpen(true);
  };

  const handleBookingSubmit = async () => {
    if (!event || !user) return;

    try {
      setLoading(true);
      await createBooking(event.id, ticketCount);
      const totalPrice = Number(event.ticket_price) * ticketCount;
      setSuccessModalData({ eventName: event.name, ticketCount, totalPrice });
      setIsBookingModalOpen(false);
      setIsSuccessModalOpen(true);
      setTicketCount(1);

      // Refresh event data to update bookings_count
      const { data } = await getEvent(event.id.toString());
      setEvent(data);
    } catch (err) {
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as any).response === "object" &&
        (err as any).response !== null &&
        "data" in (err as any).response &&
        typeof (err as any).response.data === "object" &&
        (err as any).response.data !== null &&
        "message" in (err as any).response.data
      ) {
        const errorMessage = (err as any).response.data.message;
        console.error("Error booking event:", errorMessage);
        toast.error(errorMessage);
      } else {
        console.error("Error booking event:", err);
        toast.error(
          typeof err === "object" && err !== null && "message" in err
            ? (err as any).message
            : "Failed to book event. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <Loading />
        <Footer />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex flex-col">
        <Error error={error || "Event not found."} />
      </div>
    );
  }

  const formattedDate = format(new Date(event.date), "MMMM dd, yyyy");
  const totalPrice = Number(event.ticket_price) * ticketCount;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <section className="py-12 bg-gray-50 flex-grow">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                {event.name}
              </h2>
              <p className="text-gray-600">
                Explore details for this exciting event
              </p>
            </div>
            <Calendar className="h-8 w-8 text-primary-600" />
          </div>

          <Card className="flex flex-col md:flex-row animate-fade-in max-w-5xl mx-auto">
            <div className="md:w-1/2">
              <div className="aspect-[16/12] relative overflow-hidden">
                {event.category.image ? (
                  <img
                    src={`http://127.0.0.1:8000/storage/${event.category.image}`}
                    alt={event.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <img
                    src={img}
                    alt="Placeholder"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                )}
                <div className="absolute top-3 right-3">
                  <Badge variant="primary">{event.category.name}</Badge>
                </div>
              </div>
            </div>

            <div className="md:w-1/2 flex flex-col">
              <CardContent className="flex-grow">
                <h3 className="text-xl font-semibold mb-2">{event.name}</h3>
                <p className="text-gray-600 mb-4">{event.description}</p>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{formattedDate}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    <span>
                      {event.start_time} - {event.end_time}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                    <span>
                      {event.venue_name}, {event.location}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                    <span>${Number(event.ticket_price).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{event.organizer}</span>
                  </div>
                  <div className="flex items-center">
                    <Ticket className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{event.bookings_count} Booking(s)</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-gray-100 pt-4">
                <div className="flex space-x-2 w-full">
                  <Button className="flex-1" onClick={handleBook}>
                    Book Now
                  </Button>
                </div>
              </CardFooter>
            </div>
          </Card>
        </div>
      </section>

      <Footer />

      <Modal
        isOpen={isBookingModalOpen}
        closeModal={() => setIsBookingModalOpen(false)}
        title={`Book Tickets for ${event.name}`}
        description="Select the number of tickets and confirm your booking."
      >
        <div className="mt-6 space-y-6">
          {/* Ticket Selection */}
          <div>
            <label
              htmlFor="ticketCount"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Number of Tickets
            </label>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                className="px-3 py-2"
                disabled={ticketCount <= 1}
              >
                -
              </Button>
              <input
                type="number"
                id="ticketCount"
                min="1"
                value={ticketCount}
                onChange={(e) =>
                  setTicketCount(Math.max(1, Number(e.target.value)))
                }
                className="flex-1 text-center text-lg font-semibold rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 py-3"
              />
              <Button
                variant="outline"
                onClick={() => setTicketCount(ticketCount + 1)}
                className="px-3 py-2"
              >
                +
              </Button>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg p-6 space-y-3">
            <h4 className="font-semibold text-gray-900 text-lg">
              Booking Summary
            </h4>
            <div className="flex justify-between text-gray-700">
              <span>Tickets ({ticketCount}x)</span>
              <span>
                ${(Number(event.ticket_price) * ticketCount).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Service Fee</span>
              <span>$0.00</span>
            </div>
            <div className="border-t border-primary-200 pt-3">
              <div className="flex justify-between text-xl font-bold text-gray-900">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              className="flex-1 py-3"
              onClick={() => setIsBookingModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              className="flex-1 py-3 shadow-lg hover:shadow-xl transition-all"
              onClick={handleBookingSubmit}
            >
              Confirm Booking
            </Button>
          </div>
        </div>
      </Modal>

      {successModalData && (
        <BookingSuccessModal
          isOpen={isSuccessModalOpen}
          onClose={() => {
            setIsSuccessModalOpen(false);
            setSuccessModalData(null);
          }}
          eventName={successModalData.eventName}
          ticketCount={successModalData.ticketCount}
          totalPrice={successModalData.totalPrice}
        />
      )}
    </div>
  );
};

export default EventDetails;
