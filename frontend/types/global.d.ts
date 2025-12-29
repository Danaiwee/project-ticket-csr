declare global {
  interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: string;
    role: string
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
}

export {};
