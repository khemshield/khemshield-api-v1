import Joi from "joi";
import Contact from "../../models/contact";
import sendEmail from "../../emailService/sendEmail";
import { CustomError } from "../errors";
import { generateContactHTMLTemp } from "../../emailService/mail_templates/contact";

type ContactType = {
  fullName: string;
  email: string;
  phone: string;
  helpwith: string;
  message?: string;
};

type ContactArgsType = {
  contactInput: ContactType;
};

export const contactResolvers = {
  newContact: async (args: ContactArgsType) => {
    const { contactInput } = args;
    // Validate Inputs
    const validationObj = Joi.object({
      fullName: Joi.string().trim().min(5).required(),
      email: Joi.string().email(),
      phone: Joi.string()
        .pattern(/^(?:\+?[1-9]{1,5})?\d{10,14}$/)
        .required()
        .messages({
          "string.pattern.base":
            "Phone number must be a valid international phone number",
        }),
      helpwith: Joi.string().required(),
      message: Joi.string().required(),
    });

    const { value, error } = validationObj.validate({
      email: contactInput.email,
      phone: contactInput.phone,
      fullName: contactInput.fullName,
      helpwith: contactInput.helpwith,
      message: contactInput.message,
    });

    if (error) {
      const customError = new CustomError(error.message, { code: 403 });
      throw customError;
    }

    try {
      // create new contact
      const newContact = new Contact(value);

      await newContact.save();

      await sendEmail({
        email: contactInput.email,
        html: generateContactHTMLTemp({ name: contactInput.fullName }),
        subject: "Thank You for Contacting Us!",
      });

      return newContact;
    } catch (error) {
      const customError = new CustomError((error as Error).message, {
        code: 500,
      });

      throw customError;
    }
  },
};
