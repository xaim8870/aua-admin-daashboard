import { Settings } from "../types";

export const mockSettings: Settings = {
  official_email: "contact@aua.com",
  whatsapp_target_number: "+1234567890",
  notification_preferences: {
    email_on_new_lead: true,
    email_on_new_chat: false,
    daily_digest: true,
  }
};
