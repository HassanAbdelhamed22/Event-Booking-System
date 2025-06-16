import { useEffect, useState } from "react";
import { Calendar, MapPin, DollarSign, Users } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import img from "../../assets/homePage1.webp";
import { useAuth } from "../../context/AuthContext";
import { getUserBookings } from "../../services/booking";
import Header from "../../layouts/Header";
import Loading from "../../components/UI/Loading";
import Error from "../../components/UI/Error";
import Card, { CardContent, CardFooter } from "../../components/UI/Card";
import Badge from "../../components/UI/Badge";
import Footer from "../../layouts/Footer";

type Booking = {
  id: number;
  user_id: number;
  event_id: number;
  number_of_tickets: number;
  total_price: string;
  created_at: string;
  updated_at: string;
  event: {
    id: number;
    name: string;
    description: string;
    date: string;
    start_time: string;
    end_time: string;
    location: string;
    organizer: string;
    ticket_price: string;
    venue_name: string;
    created_at: string;
    updated_at: string;
    category_id: number;
    category: {
      id: number;
      name: string;
      image: string;
    };
  };
};

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) {
        setError("Please log in to view your bookings.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getUserBookings();
        setBookings(response.bookings || []);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to fetch bookings. Please try again later.");
        toast.error("Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <section className="py-12 bg-gray-50 flex-grow">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                My Bookings
              </h2>
              <p className="text-gray-600">
                View all your booked events and tickets
              </p>
            </div>
            <Calendar className="h-8 w-8 text-primary-600" />
          </div>

          {loading ? (
            <Loading />
          ) : error ? (
            <Error error={error} />
          ) : bookings.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-600">
                No bookings found
              </h3>
              <p className="text-gray-500 mt-2">
                You haven't booked any events yet. Explore events to get
                started!
              </p>
              <a href="/" className="btn-primary inline-flex items-center mt-4">
                Explore Events
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {bookings.map((booking) => (
                <Card
                  key={booking.id}
                  className="flex flex-col h-full animate-fade-in"
                >
                  <div className="aspect-[16/9] relative overflow-hidden">
                    {booking.event.category?.image ? (
                      <img
                        src={`http://127.0.0.1:8000/storage/${booking.event.category.image}`}
                        alt={booking.event.category.name}
                        className="absolute inset-0 w-full h-full object-fill"
                        loading="lazy"
                      />
                    ) : (
                      <img
                        src={img}
                        alt="Placeholder"
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                      />
                    )}
                    <div className="absolute top-3 right-3">
                      <Badge variant="success">Booked</Badge>
                    </div>
                  </div>

                  <CardContent className="flex-grow">
                    <h3 className="text-xl font-semibold mb-2 line-clamp-1">
                      {booking.event.name}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {booking.event.description}
                    </p>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        <span>
                          {format(
                            new Date(booking.event.date),
                            "MMMM dd, yyyy"
                          )}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="line-clamp-1">
                          {booking.event.venue_name}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                        <span>${Number(booking.total_price).toFixed(2)}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{booking.number_of_tickets} Ticket(s)</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-semibold mr-2">Booked On:</span>
                        <span>
                          {format(
                            new Date(booking.created_at),
                            "MMMM dd, yyyy"
                          )}
                        </span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="border-t border-gray-100 pt-4">
                    <Badge
                      variant="primary"
                      className="w-full py-2 flex justify-center"
                    >
                      Booking ID: {booking.id}
                    </Badge>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MyBookings;
