import type { AdminBooking } from "../../types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../UI/Table";

interface BookingsTableProps {
  bookings: AdminBooking[];
}

const BookingsTable = ({ bookings }: BookingsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Event</TableHead>
          <TableHead>Tickets</TableHead>
          <TableHead>Total Price</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bookings.map((booking) => (
          <TableRow key={booking.id} striped>
            <TableCell>{booking.id}</TableCell>
            <TableCell>
              {booking.user.name} ({booking.user.email})
            </TableCell>
            <TableCell>{booking.event.name}</TableCell>
            <TableCell>{booking.number_of_tickets}</TableCell>
            <TableCell>${booking.total_price}</TableCell>
            <TableCell>
              {new Date(booking.created_at).toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default BookingsTable;
