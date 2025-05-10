import { Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../UI/Table";
import Button from "../UI/Button";
import type { Event } from "../../types";

interface AllCoursesTableProps {
  events: Event[];
  onDelete: (event: Event) => void;
  onEdit: (event: Event) => void;
}

const AllCoursesTable: React.FC<AllCoursesTableProps> = ({ events, onDelete, onEdit }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-/12">ID</TableHead>
          <TableHead className="w-2/12">Event Name</TableHead>
          <TableHead className="w-3/12">Description</TableHead>
          <TableHead className="w-2/12">Date</TableHead>
          <TableHead className="w-2/12">Time</TableHead>
          <TableHead className="w-2/12">Location</TableHead>
          <TableHead className="w-2/12">Venue</TableHead>
          <TableHead className="w-2/12"></TableHead>
          <TableHead className="w-2/12">Category</TableHead>
          <TableHead className="w-/12">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events?.map((event) => (
          <TableRow key={event.id}>
            <TableCell>{event.id}</TableCell>
            <TableCell>{event.name}</TableCell>
            <TableCell>{event.description}</TableCell>
            <TableCell>{event.date}</TableCell>
            <TableCell>
              {event.start_time} - {event.end_time}
            </TableCell>
            <TableCell>{event.location}</TableCell>
            <TableCell>{event.venue_name}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    onEdit(event);
                  }}
                  title="Edit Event"
                >
                  <Pencil className="h-4 w-4 text-primary" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(event)}
                  title="Delete Event"
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AllCoursesTable;
