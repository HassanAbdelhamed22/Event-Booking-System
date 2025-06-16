import Header from "../../layouts/Header";
import Footer from "../../layouts/Footer";
import { useEffect, useState } from "react";
import type { AdminBooking } from "../../types";
import { getBookings } from "../../services/bookingAdmin";
import Loading from "../../components/UI/Loading";
import { CalendarClock, DollarSign, Users } from "lucide-react";
import BookingsTable from "../../components/tables/BookingsTable";

const Booking = () => {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const { data } = await getBookings();
        setBookings(data.bookings);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Calculate statistics
  const totalBookings = bookings.length;
  const totalTickets = bookings.reduce(
    (sum, booking) => sum + booking.number_of_tickets,
    0
  );
  const totalRevenue = bookings.reduce(
    (sum, booking) => sum + Number(booking.total_price),
    0
  );

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Bookings Management</h1>
              <p className="text-gray-600">View and manage all bookings</p>
            </div>
          </div>

          {/* Dashboard stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-6 rounded-lg shadow-md flex items-start">
              <div className="bg-primary-100 p-3 rounded-lg mr-4">
                <CalendarClock className="h-6 w-6 text-primary-700" />
              </div>
              <div>
                <h3 className="text-lg font-bold">{totalBookings}</h3>
                <p className="text-sm text-gray-600">Total Bookings</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md flex items-start">
              <div className="bg-red-100 p-3 rounded-lg mr-4">
                <Users className="h-6 w-6 text-red-700" />
              </div>
              <div>
                <h3 className="text-lg font-bold">{totalTickets}</h3>
                <p className="text-sm text-gray-600">Total Tickets</p>
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
                <p className="text-sm text-gray-600">Total Revenue</p>
              </div>
            </div>
          </div>

          {/* Bookings Table */}
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
            <BookingsTable bookings={bookings} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Booking;
