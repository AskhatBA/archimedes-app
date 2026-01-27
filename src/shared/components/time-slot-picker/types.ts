export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface DaySlots {
  date: string;
  slots: TimeSlot[];
}
