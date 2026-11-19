import { z } from "zod";

const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
const phoneRegex = /^\+?[0-9]{7,15}$/;

export const changeRequestSchema = z.object({
  requestTitle: z.string().min(1, "Request title is required"),
  requesterNameOrTeam: z.string().min(1, "Requester name/team is required"),
  contactEmailOrPhone: z.string().min(1, "Contact is required").refine((val) => {
    const isEmail = z.string().email().safeParse(val).success;
    const isPhone = phoneRegex.test(val);
    return isEmail || isPhone;
  }, {
    message: "Must be a valid email or phone number",
  }),
  dateOfRequest: z.string().min(1, "Date of request is required"),
  changeRequestTicketId: z.string().min(1, "Ticket ID is required"),
  plannedGoLiveDate: z.string().min(1, "Planned go-live date is required"),
  applicationServiceName: z.string().min(1, "Application service name is required"),
  changeSummary: z.string().min(1, "Change summary is required"),
  environmentToBeTested: z.string().min(1, "Environment is required"),
  testUrlOrIp: z.string().min(1, "Test URL or IP is required").refine((val) => {
    const isUrl = z.string().url().safeParse(val).success;
    const isIp = ipRegex.test(val);
    return isUrl || isIp;
  }, {
    message: "Must be a valid URL or IP address",
  }),
  authenticationType: z.string().min(1, "Authentication type is required"),
  testCredentials: z.string().min(1, "Test credentials are required"),
  apiDocsOrSwaggerUrl: z.string().min(1, "API Docs URL is required").url("Must be a valid URL"),
  techStackFrameworks: z.string().min(1, "Tech stack is required"),
  thirdPartyIntegrations: z.string().min(1, "Third party integrations are required"),
  deadlineForReport: z.string().min(1, "Deadline is required"),
  priorityLevel: z.string().min(1, "Priority level is required"),
});
