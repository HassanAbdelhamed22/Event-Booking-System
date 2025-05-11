import { useState } from "react";
import Modal from "./UI/Modal";
import Button from "./UI/Button";
import Input from "./UI/Input";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tickets: number) => Promise<void>;
  eventName: string;
  ticketPrice: number;
}

const BookingModal = ({
  isOpen,
  onClose,
  onSubmit,
  eventName,
  ticketPrice,
}: BookingModalProps) => {
  const [tickets, setTickets] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit(tickets);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPrice = (tickets * Number(ticketPrice)).toFixed(2);

  return (
    <Modal
      isOpen={isOpen}
      closeModal={onClose}
      title={`Book Tickets for ${eventName}`}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium">Number of Tickets</label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTickets((prev) => Math.max(1, prev - 1))}
              disabled={tickets <= 1}
            >
              -
            </Button>
            <Input
              type="number"
              min="1"
              value={tickets}
              onChange={(e) =>
                setTickets(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="w-20 text-center"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTickets((prev) => prev + 1)}
            >
              +
            </Button>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Price per ticket:</span>
            <span>${Number(ticketPrice).toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Total:</span>
            <span>${totalPrice}</span>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Confirm Booking"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default BookingModal;
