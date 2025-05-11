import { Formik, Form, Field } from "formik";
import Input from "../UI/Input";
import Select from "../UI/Select";
import Button from "../UI/Button";
import type { Event, Category, EventFormValues } from "../../types";
import { EventValidationSchema } from "../../utils/validation";

interface EventFormProps {
  event?: Event;
  categories: Category[];
  onSave: (updatedEvent: EventFormValues) => Promise<void>;
  onCancel: () => void;
  isCreate?: boolean;
}

const EventForm = ({
  event,
  categories = [],
  onSave,
  onCancel,
  isCreate = false,
}: EventFormProps) => {
  const defaultInitialValues: EventFormValues = {
    name: "",
    description: "",
    date: "",
    start_time: "",
    end_time: "",
    location: "",
    venue_name: "",
    organizer: "",
    ticket_price: 0,
    category_id: categories[0]?.id || "",
  };

  const initialValues: EventFormValues = event
    ? {
        ...event,
        ticket_price: event.ticket_price || 0,
        category_id: event.category.id,
      }
    : defaultInitialValues;

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={EventValidationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        await onSave(values);
        setSubmitting(false);
      }}
    >
      {({ isSubmitting, errors, touched }) => (
        <Form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Event Name</label>
            <Field as={Input} name="name" error={touched.name && errors.name} />
            {touched.name && errors.name && (
              <div className="text-red-500 text-sm mt-1">{errors.name}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <Field
              as={Input}
              name="description"
              error={touched.description && errors.description}
            />
            {touched.description && errors.description && (
              <div className="text-red-500 text-sm mt-1">
                {errors.description}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <Field
                type="date"
                as={Input}
                name="date"
                error={touched.date && errors.date}
              />
              {touched.date && errors.date && (
                <div className="text-red-500 text-sm mt-1">{errors.date}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              {categories.length > 0 ? (
                <>
                  <Field
                    as={Select}
                    name="category_id"
                    options={categories.map((c) => ({
                      value: c.id,
                      label: c.name,
                    }))}
                  />
                  {touched.category_id && errors.category_id && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.category_id}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-red-500 text-sm">
                  No categories available
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Start Time
              </label>
              <Field
                type="time"
                as={Input}
                name="start_time"
                error={touched.start_time && errors.start_time}
              />
              {touched.start_time && errors.start_time && (
                <div className="text-red-500 text-sm mt-1">
                  {errors.start_time}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">End Time</label>
              <Field
                type="time"
                as={Input}
                name="end_time"
                error={touched.end_time && errors.end_time}
              />
              {touched.end_time && errors.end_time && (
                <div className="text-red-500 text-sm mt-1">
                  {errors.end_time}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <Field
                as={Input}
                name="location"
                error={touched.location && errors.location}
              />
              {touched.location && errors.location && (
                <div className="text-red-500 text-sm mt-1">
                  {errors.location}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Venue Name
              </label>
              <Field
                as={Input}
                name="venue_name"
                error={touched.venue_name && errors.venue_name}
              />
              {touched.venue_name && errors.venue_name && (
                <div className="text-red-500 text-sm mt-1">
                  {errors.venue_name}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Organizer
              </label>
              <Field
                as={Input}
                name="organizer"
                error={touched.organizer && errors.organizer}
              />
              {touched.organizer && errors.organizer && (
                <div className="text-red-500 text-sm mt-1">
                  {errors.organizer}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Ticket Price
              </label>
              <Field
                type="number"
                as={Input}
                name="ticket_price"
                step="0.01"
                min="0"
                error={touched.ticket_price && errors.ticket_price}
              />
              {touched.ticket_price && errors.ticket_price && (
                <div className="text-red-500 text-sm mt-1">
                  {errors.ticket_price}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" variant="default" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : isCreate
                ? "Create Event"
                : "Save Changes"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default EventForm;
