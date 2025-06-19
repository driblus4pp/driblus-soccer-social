
interface CalendarEvent {
  id: string;
  summary: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  location?: string;
  description?: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
  price: number;
}

class GoogleCalendarService {
  private accessToken: string | null = null;
  private calendarId: string = 'primary';

  constructor() {
    // In a real app, this would be managed through OAuth flow
    this.accessToken = localStorage.getItem('google_access_token');
  }

  async authenticate(): Promise<boolean> {
    try {
      // Simulate OAuth2 flow
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${process.env.GOOGLE_CLIENT_ID}&` +
        `redirect_uri=${window.location.origin}/auth/callback&` +
        `response_type=code&` +
        `scope=https://www.googleapis.com/auth/calendar&` +
        `access_type=offline`;

      // Open popup for authentication
      const popup = window.open(authUrl, 'google-auth', 'width=500,height=600');
      
      return new Promise((resolve) => {
        const checkClosed = setInterval(() => {
          if (popup?.closed) {
            clearInterval(checkClosed);
            // Check if token was received
            const token = localStorage.getItem('google_access_token');
            this.accessToken = token;
            resolve(!!token);
          }
        }, 1000);
      });
    } catch (error) {
      console.error('Authentication error:', error);
      return false;
    }
  }

  async getAvailableSlots(date: Date, courtId: string): Promise<TimeSlot[]> {
    if (!this.accessToken) {
      // Return mock data if not authenticated
      return this.getMockTimeSlots();
    }

    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${this.calendarId}/events?` +
        `timeMin=${startOfDay.toISOString()}&` +
        `timeMax=${endOfDay.toISOString()}&` +
        `singleEvents=true&` +
        `orderBy=startTime`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch calendar events');
      }

      const data = await response.json();
      return this.processEventsToTimeSlots(data.items || [], date);
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      return this.getMockTimeSlots();
    }
  }

  async createBookingEvent(
    date: Date,
    time: string,
    court: any,
    userDetails: any
  ): Promise<boolean> {
    if (!this.accessToken) {
      console.log('Not authenticated with Google Calendar');
      return false;
    }

    try {
      const [hours, minutes] = time.split(':').map(Number);
      const startTime = new Date(date);
      startTime.setHours(hours, minutes, 0, 0);
      
      const endTime = new Date(startTime);
      endTime.setHours(hours + 1, minutes, 0, 0); // 1 hour duration

      const event: CalendarEvent = {
        id: '',
        summary: `Reserva - ${court.name}`,
        start: {
          dateTime: startTime.toISOString(),
          timeZone: 'America/Sao_Paulo',
        },
        end: {
          dateTime: endTime.toISOString(),
          timeZone: 'America/Sao_Paulo',
        },
        location: court.location,
        description: `Reserva feita por ${userDetails.name}\n` +
                    `Email: ${userDetails.email}\n` +
                    `Quadra: ${court.name}\n` +
                    `Endereço: ${court.location}`,
      };

      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${this.calendarId}/events`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event),
        }
      );

      return response.ok;
    } catch (error) {
      console.error('Error creating calendar event:', error);
      return false;
    }
  }

  private processEventsToTimeSlots(events: any[], date: Date): TimeSlot[] {
    const slots: TimeSlot[] = [];
    const basePrice = 50; // Base price per hour

    // Generate all possible time slots (7:00 to 22:00)
    for (let hour = 7; hour <= 22; hour++) {
      const timeString = `${hour.toString().padStart(2, '0')}:00`;
      const slotStart = new Date(date);
      slotStart.setHours(hour, 0, 0, 0);
      
      const slotEnd = new Date(date);
      slotEnd.setHours(hour + 1, 0, 0, 0);

      // Check if this slot conflicts with any existing events
      const isConflict = events.some(event => {
        const eventStart = new Date(event.start.dateTime || event.start.date);
        const eventEnd = new Date(event.end.dateTime || event.end.date);
        
        return (
          (slotStart >= eventStart && slotStart < eventEnd) ||
          (slotEnd > eventStart && slotEnd <= eventEnd) ||
          (slotStart <= eventStart && slotEnd >= eventEnd)
        );
      });

      slots.push({
        time: timeString,
        available: !isConflict,
        price: basePrice,
      });
    }

    return slots;
  }

  private getMockTimeSlots(): TimeSlot[] {
    const slots: TimeSlot[] = [];
    const basePrice = 50;
    
    for (let hour = 7; hour <= 22; hour++) {
      const timeString = `${hour.toString().padStart(2, '0')}:00`;
      
      // Simulate some unavailable slots
      const isAvailable = Math.random() > 0.2; // 80% availability
      
      slots.push({
        time: timeString,
        available: isAvailable,
        price: basePrice,
      });
    }
    
    return slots;
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  disconnect(): void {
    this.accessToken = null;
    localStorage.removeItem('google_access_token');
  }
}

export const googleCalendarService = new GoogleCalendarService();
export default GoogleCalendarService;
