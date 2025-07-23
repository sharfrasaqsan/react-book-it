import { isBefore } from "date-fns";

export const isEventClosed = (date, time) => {
  if (!date || !time) {
    return false;
  }

  const currentDateTime = new Date();
  const eventDateTime = new Date(`${date}T${time}`);
  return isBefore(eventDateTime, currentDateTime);
};
