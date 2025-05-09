import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { type Category, type Booking, type Event } from "../types";
import { getCategories, getEvents } from "../services/event";
import { getUserBookings } from "../services/booking";
import Header from "../layouts/Header";
import { Calendar, ChevronRight } from "lucide-react";
import EventList from "../components/EventList";
import Loading from "../components/UI/Loading";
import Error from "../components/UI/Error";
import categoryImage from "../assets/fireworks.jpg";
import Footer from "../layouts/Footer";

const HomePage = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [category, setCategory] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data } = await getEvents();
      setEvents(data.events);

      const { data: categories } = await getCategories();
      setCategory(categories);

      if (user) {
        const bookingsResponse = await getUserBookings();
        setUserBookings(bookingsResponse.data);
      }
    } catch (err) {
      setError("Failed to fetch data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero section */}
      <section className="bg-gradient-to-r from-primary-900 to-primary-700 text-white">
        <div className="container-custom py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Discover Amazing Events Near You
              </h1>
              <p className="text-lg md:text-xl text-primary-100 mb-8">
                Browse and book tickets for the most exciting conferences,
                concerts, workshops, and more.
              </p>
              <a
                href="#events"
                className="btn-secondary inline-flex items-center"
              >
                Explore Events
                <ChevronRight className="ml-1 h-5 w-5" />
              </a>
            </div>
            <div className="hidden md:block relative">
              <div className="absolute -top-6 -left-6 w-20 h-20 bg-secondary-500 rounded-full opacity-20"></div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-secondary-500 rounded-full opacity-20"></div>
              <div className="relative z-10 bg-white p-3 rounded-lg shadow-xl rotate-3 transform transition-transform hover:rotate-0">
                <img
                  src="https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  alt="Event"
                  loading="lazy"
                  className="rounded-lg w-full h-64 object-cover"
                />
              </div>
              <div className="absolute top-1/4 -right-4 z-20 bg-white p-2 rounded-lg shadow-lg -rotate-6 transform transition-transform hover:rotate-0">
                <img
                  src="https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  alt="Event"
                  loading="lazy"
                  className="rounded-lg w-48 h-32 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events section */}
      <section id="events" className="py-12 bg-gray-50">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Upcoming Events
              </h2>
              <p className="text-gray-600">
                Discover and book your next experience
              </p>
            </div>
            <Calendar className="h-8 w-8 text-primary-600" />
          </div>

          {loading ? (
            <Loading />
          ) : error ? (
            <Error error={error} />
          ) : (
            <EventList
              events={events}
              userBookings={userBookings}
              onBookingCreated={fetchData}
            />
          )}
        </div>
      </section>

      {/* Featured categories */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Browse by Category
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {category.map((category) => (
              <div
                key={category.id}
                className="relative overflow-hidden rounded-lg h-40 group shadow-md transition-transform hover:scale-[1.05] cursor-pointer duration-300"
              >
                <img
                  src={category.image || categoryImage}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-70 transition-opacity"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-bold text-xl md:text-2xl text-center px-2">
                    {category.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Host Your Own Event?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Create an account and start managing your own events today. It's
            easy and free to get started!
          </p>
          <a href="/register" className="btn-primary inline-flex items-center">
            Get Started
            <ChevronRight className="ml-1 h-5 w-5" />
          </a>
        </div>
      </section>

      {/* <Footer /> */}
      <Footer />
    </div>
  );
};

export default HomePage;
