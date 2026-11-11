export function pacificISO(ms: number): string;
export function arrivalWindow(startISO: string): string;
export function appointmentWindow(startISO: string, minutes: number): { startTime: string; endTime: string } | null;
