export type UserRole = 'student' | 'owner' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  contact?: string;
  address?: string;
  role: UserRole;
  isApproved?: boolean;
  password?: string;
}

export interface College {
  id: string;
  name: string;
  location: string;
}

export interface Listing {
  id: string;
  ownerId: string;
  ownerName: string;
  title: string;
  collegeId: string;
  distance: number; // in km
  rent: number; // per month
  facilities: string[];
  address: string;
  contact: string;
  image?: string;
  createdAt: number;
}

export const FACILITIES_LIST = [
  "WiFi",
  "Food/Mess",
  "Laundry",
  "AC",
  "Hot Water",
  "CCTV",
  "Parking",
  "Power Backup"
];