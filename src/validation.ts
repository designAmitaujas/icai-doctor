import { z } from "zod";
import { EventType } from "./entities/Event.js";

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6),
});

export const updateNameSchema = z.object({
  name: z.string().min(2),
});

export const bankDetailSchema = z.object({
  mrn: z.string().min(1),
  counsellorName: z.string().min(1),
  bankAccountNo: z.string().min(5),
  bankName: z.string().min(1),
  branchName: z.string().min(1),
  payeeName: z.string().min(1),
  ifscCode: z.string().min(1),
});

export const eventSchema = z.object({
  eventType: z.nativeEnum(EventType),
  eventName: z.string().min(1),
  branch: z.string().min(1),
  membershipNoCounsellor: z.string().min(1),
  counsellorName: z.string().min(1),
  eventDate: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  schoolCollegeName: z.string().min(1),
  address: z.string().min(1),
  streetAddress: z.string().min(1),
  locality: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  country: z.string().min(1),
  pinCode: z.string().min(1),
  expectedParticipants: z.number().int().min(1),
  contactPersonName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(10),
  modeOfEvent: z.string().min(1),
  principalCoordinatorName: z.string().min(1),
  principalCoordinatorMobile: z.string().min(10),
  principalCoordinatorEmail: z.string().email(),
  additionalComments: z.string().optional(),
});

export const yearParamSchema = z.object({
  year: z
    .string()
    .length(4)
    .refine((val) => !isNaN(Number(val)), {
      message: "Year must be a valid number",
    }),
});

export const fileUploadSchema = z.object({
  file: z.any().refine((file) => file !== undefined, "File is required"),
});

export const videoCreateSchema = z.object({
  eventId: z.string().min(1),
  filenames: z
    .array(z.string().min(1))
    .nonempty("At least one filename is required"),
});

export const videoUpdateSchema = z.object({
  videoPath: z.string().min(1),
});

export const eventAttachmentSchema = z.object({
  eventId: z.string().min(1),
  attendanceSheetPath: z.string().min(1),
  annexurePath: z.string().min(1),
  eventImagePath: z.string().min(1),
});
