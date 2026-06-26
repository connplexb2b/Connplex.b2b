import * as Yup from "yup";

const REGEX = {
  EMAIL: /^(?:(?!\.)(?![0-9])(?:\w+\.)*(?:\w+\+)*(?:\w+\!)*(?:\w+\$)*(?:\w+\&)*(?:\w+\%)*(?:\w+\-)*\w+@[\w-]+\.\w{2,3}(?:\.[a-z]{2,3})?)$/,
  MOBILE_NUMBER: /^(?!.*(\d)\1{6,})[6-9][0-9]{9}$/,
  NAME: /^[A-Za-z]+( [A-Za-z]+)*$/,
};

export const franchiseAdsSchema = Yup.object().shape({
  name: Yup.string()
    .required("Please enter full name")
    .matches(REGEX.NAME, "Please enter valid full name")
    .max(50, "Full name must be at most 50 characters")
    .min(2, "Full name must be at least 2 characters"),
  email: Yup.string()
    .required("Please enter email address")
    .max(100, "Email address cannot exceed 100 characters")
    .matches(REGEX.EMAIL, "Please enter valid email address"),
  phone: Yup.string()
    .required("Please enter phone number")
    .matches(REGEX.MOBILE_NUMBER, "Please enter valid phone number"),
  state: Yup.string()
    .required("Please enter state")
    .matches(REGEX.NAME, "Please enter valid state")
    .max(50, "State must be at most 50 characters"),
  city: Yup.string()
    .required("Please enter city")
    .matches(REGEX.NAME, "Please enter valid city")
    .max(50, "City must be at most 50 characters"),
  investmentRange: Yup.string()
    .required("Please select preferred investment range"),
  preferredCity: Yup.string()
    .required("Please enter preferred city")
    .max(100, "Preferred city must be at most 100 characters"),
  hasProperty: Yup.string()
    .required("Please specify if you have a property or location"),
  timeline: Yup.string()
    .required("Please select timeline"),
  message: Yup.string()
    .max(500, "Message must not exceed 500 characters")
    .optional(),
});
