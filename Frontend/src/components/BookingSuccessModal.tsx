import { CircleCheck } from 'lucide-react';
import Modal from './UI/Modal';
import Button from './UI/Button';

interface BookingSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventName: string;
  ticketCount: number;
  totalPrice: number;
}

const BookingSuccessModal = ({
  isOpen,
  onClose,
  eventName,
  ticketCount,
  totalPrice
}: BookingSuccessModalProps) => {
  return (
    <Modal isOpen={isOpen} closeModal={onClose} title="Booking Confirmed!">
      <div className="space-y-6">
        <div className="flex flex-col items-center gap-3 p-4">
          <CircleCheck className="w-20 h-20 text-green-600" />
          <p className="text-lg font-semibold text-green-600">
            Your booking was successful!
          </p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Event:</span>
            <span className="font-medium">{eventName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tickets:</span>
            <span className="font-medium">{ticketCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total:</span>
            <span className="font-medium">${totalPrice.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default BookingSuccessModal;