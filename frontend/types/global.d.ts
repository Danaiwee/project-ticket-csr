declare global {
  interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: string;
    role: string;
  }

  interface LocationData {
    id: string;
    item: number;
    name: string;
    typeNumber: number;
    typeName: string;
    subdistrict: string | null;
    district: string | null;
    province: string | null;
    region: string | null;
    latitude: number;
    longitude: number;
    importance: string | null;
    details: string | null;
    limitBooking: number;
  }

  interface LocationSummary {
    id: string;
    name: string;
    typeName: string;
    imageUrl: string;
  }

  interface Booking {
    id: string;
    numOfPeople: number;
    bookingDate: string | Date;
    totalPrice: number;
    remarks?: string | null;
    locationId: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    location: LocationSummary;
  }

  interface ActionResponse<T = null> {
    success: boolean;
    data?: T;
    error?: {
      message?: string;
      details?: Record<string, string[]>;
    };
    status?: number;
  }

}

export {};
