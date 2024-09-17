import EventSubscriber from "../../models/eventUsers";
import sendEmail from "../../emailService/sendEmail";
import Joi from "joi";
import { generateEventRegisterHTMLTemp } from "../../emailService/mail_templates/events";

type ErrorInfoType = {
  code: number;
};

export class CustomError extends Error {
  errorInfo: ErrorInfoType;

  constructor(message: string, errorInfo: ErrorInfoType) {
    super(message);
    this.errorInfo = errorInfo;

    // Ensure the name of the error is the same as the class name
    this.name = this.constructor.name;

    // Capture the stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

type EventRegistrationType = {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  event: string;
  address?: string;
  state?: string;
  city?: string;
};

type EventRegistrationArgsType = {
  regData: EventRegistrationType;
};

export const eventResolvers = {
  events: () => {
    return {
      title: "Love To Code",
      description: "Today we talk about coding in the context of passion",
    };
  },

  eventRegister: async (args: EventRegistrationArgsType) => {
    const { regData } = args;
    // Validate Inputs
    const validationObj = Joi.object({
      email: Joi.string().email(),
      phone: Joi.string()
        .pattern(/^(?:\+?[1-9]{1,5})?\d{10,14}$/)
        .required()
        .messages({
          "string.pattern.base":
            "Phone number must be a valid international phone number",
        }),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      address: Joi.string().optional(),
      // state: Joi.string().optional(),
      // city: Joi.string().optional(),
      event: Joi.string().required(),
    });

    const { value, error } = validationObj.validate({
      email: regData.email,
      phone: regData.phone,
      firstName: regData.firstName,
      lastName: regData.lastName,
      address: regData.address,
      // state: regData.state,
      // city: regData.city,
      event: "1",
    });

    if (error) {
      const customError = new CustomError(error.message, { code: 403 });
      throw customError;
    }

    const findUserEmail = await EventSubscriber.findOne({
      email: regData.email,
    });

    if (findUserEmail) {
      const error = new CustomError(
        `'${findUserEmail.email}' already registered for this event`,
        {
          code: 409,
        }
      );

      throw error;
    }

    try {
      // Create a new user
      const newUser = new EventSubscriber(value);

      await newUser.save();

      await sendEmail({
        email: regData.email,
        html: generateEventRegisterHTMLTemp({ name: regData.firstName }),
        subject: "Empowerment Series 2024 by Khemshield & Jidem Foundation",
        name: "Khemshield & Jidem Foundation",
      });

      return regData;
    } catch (error) {
      const customError = new CustomError((error as Error).message, {
        code: 500,
      });

      throw customError;
    }
  },
};
