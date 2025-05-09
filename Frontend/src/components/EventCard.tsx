import React from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Calendar, MapPin, DollarSign } from "lucide-react";
import type { Event } from "../types";
import Badge from "./UI/Badge";
import Card, { CardContent, CardFooter } from "./UI/Card";
import Button from "./UI/Button";

interface EventCardProps {
  event: Event;
  isBooked?: boolean;
  onBook?: () => void;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  isBooked = false,
  onBook,
}) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/events/${event.id}`);
  };

  const formattedDate = format(new Date(event.date), "MMMM dd, yyyy");

  return (
    <Card className="flex flex-col h-full animate-fade-in">
      <div className="aspect-[16/9] relative overflow-hidden">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <img
            src="https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="Placeholder"
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        )}
        <div className="absolute top-3 right-3">
          <Badge variant="primary">{event.category}</Badge>
        </div>
      </div>

      <CardContent className="flex-grow">
        <h3 className="text-xl font-semibold mb-2 line-clamp-1">
          {event.name}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
            <span className="line-clamp-1">{event.venue_name}</span>
          </div>
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
            <span>${Number(event.ticket_price).toFixed(2)}</span>
          </div>
          <div className="flex items-center">
            <span className="font-semibold mr-2">Organizer:</span>
            <span>{event.organizer}</span>
          </div>
          <div className="flex items-center">
            <span className="font-semibold mr-2">Time:</span>
            <span>
              {event.start_time} - {event.end_time}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t border-gray-100 pt-4">
        {isBooked ? (
          <div className="w-full">
            <Badge
              variant="success"
              className="w-full py-2 flex justify-center"
            >
              Already Booked
            </Badge>
          </div>
        ) : (
          <div className="flex space-x-2 w-full">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleViewDetails}
            >
              Details
            </Button>
            <Button className="flex-1" onClick={onBook}>
              Book Now
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default EventCard;
