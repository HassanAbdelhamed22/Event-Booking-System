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
import type { Category, Event, EventFormValues } from "../../types";
import { formatTime } from "../../utils/helpers";
import { useEffect, useState } from "react";
import Modal from "../UI/Modal";
import { getCategories } from "../../services/event";
import EditEventForm from "../forms/EditEventForm";

interface AllEventsTableProps {
  events: Event[];
  onDelete: (event: Event) => void;
  onEdit: (event: EventFormValues) => void;
}

const AllEventsTable: React.FC<AllEventsTableProps> = ({
  events,
  onDelete,
  onEdit,
}) => {
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [actionType, setActionType] = useState<"edit" | "delete" | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

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

  const handleDelete = (event: Event) => {
    setSelectedEvent(event);
    setActionType("delete");
    setIsModelOpen(true);
  };

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setActionType("edit");
    setIsModelOpen(true);
  };

  const handleConfirm = async (formValues?: EventFormValues) => {
    if (!selectedEvent || !actionType) return;

    try {
      if (actionType === "delete") {
        await onDelete(selectedEvent);
      } else if (actionType === "edit" && formValues) {
        await onEdit(formValues as EventFormValues);
      }
      setIsModelOpen(false);
    } catch (error) {
      console.error("Error confirming action:", error);
    } finally {
      setIsModelOpen(false);
      setSelectedEvent(null);
      setActionType(null);
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/12">ID</TableHead>
            <TableHead className="w-2/12">Event Name</TableHead>
            <TableHead className="w-2/12">Description</TableHead>
            <TableHead className="w-2/12">Date</TableHead>
            <TableHead className="w-2/12">Time</TableHead>
            <TableHead className="w-2/12">Location</TableHead>
            <TableHead className="w-1/12">Venue</TableHead>
            <TableHead className="w-1/12">Category</TableHead>
            <TableHead className="w-1/12">Ticket Price</TableHead>
            <TableHead className="w-1/12">Actions</TableHead>
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
                {formatTime(event.start_time)} - {formatTime(event.end_time)}
              </TableCell>
              <TableCell>{event.location}</TableCell>
              <TableCell>{event.venue_name}</TableCell>
              <TableCell>{event.category.name}</TableCell>
              <TableCell>{event.ticket_price}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      handleEdit(event);
                    }}
                    title="Edit Event"
                  >
                    <Pencil className="h-4 w-4 text-primary" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      handleDelete(event);
                    }}
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

      <Modal
        isOpen={isModelOpen}
        closeModal={() => setIsModelOpen(false)}
        title={actionType === "edit" ? "Edit Event" : "Delete Event"}
        description={
          actionType === "delete"
            ? "Are you sure you want to delete this event? This action cannot be undone."
            : undefined
        }
      >
        {actionType === "edit" && selectedEvent ? (
          loadingCategories ? (
            <div>Loading categories...</div>
          ) : (
            <EditEventForm
              event={selectedEvent}
              onSave={(updatedEvent) => handleConfirm(updatedEvent)}
              categories={categories}
              onCancel={() => setIsModelOpen(false)}
            />
          )
        ) : (
          <div className="flex justify-end gap-4 mt-4">
            <Button variant="outline" onClick={() => setIsModelOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => handleConfirm()}>
              Delete
            </Button>
          </div>
        )}
      </Modal>
    </>
  );
};

export default AllEventsTable;
