import * as Yup from "yup";

export const registerValidationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
  password_confirmation: Yup.string().required(
    "Password confirmation is required"
  ),
});

export const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export const EventValidationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required").max(255),
  description: Yup.string().required("Description is required"),
  date: Yup.date().required("Date is required"),
  start_time: Yup.string().required("Start time is required"),
  end_time: Yup.string().required("End time is required"),
  location: Yup.string().required("Location is required").max(255),
  venue_name: Yup.string().required("Venue name is required"),
  organizer: Yup.string().required("Organizer is required").max(255),
  ticket_price: Yup.number()
    .required("Ticket price is required")
    .min(0, "Price must be positive"),
  category_id: Yup.number().required("Category is required"),
});
