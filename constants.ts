import { College, Listing } from './types';

export const API_KEY = import.meta.env?.VITE_API_KEY || 'AIzaSyCtNZ_IMALBaSFrYfRXbp4--6SEOprrRyY';
export const GOOGLE_API_KEY = import.meta.env?.VITE_GOOGLE_API_KEY || 'AIzaSyCtNZ_IMALBaSFrYfRXbp4--6SEOprrRyY';

export const COLLEGES: College[] = [
  { id: 'c1', name: 'Rajarambapu Institute of Technology (RIT)', location: 'Islampur' },
  { id: 'c2', name: 'Karmveer Bhaurao Patil College', location: 'Islampur' },
  { id: 'c3', name: 'Kusumtai Rajarambapu Patil College', location: 'Islampur' },
  { id: 'c4', name: 'Yashwantrao Chavan College', location: 'Islampur' },
  { id: 'c5', name: 'Annasaheb Dange College', location: 'Islampur' },
  { id: 'c6', name: 'Prakash Medical College', location: 'Islampur' },
  { id: 'c7', name: 'Nanasaheb Mahdik College', location: 'Islampur' },
];

export const MOCK_LISTINGS: Listing[] = [
  {
    id: 'l1',
    ownerId: 'owner1',
    ownerName: 'Ramesh Patil',
    title: 'Sunrise Student Hostel',
    collegeId: 'c1', // RIT
    distance: 0.5,
    rent: 3500,
    facilities: ['WiFi', 'Hot Water', 'Mess'],
    address: 'Near RIT Main Gate, Rajaramnagar, Islampur',
    contact: '9876543210',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=800&auto=format&fit=crop',
    createdAt: Date.now() - 500000
  },
  {
    id: 'l2',
    ownerId: 'owner2',
    ownerName: 'Suresh Deshmukh',
    title: 'Green View PG',
    collegeId: 'c5', // Annasaheb Dange
    distance: 1.2,
    rent: 4500,
    facilities: ['WiFi', 'Parking', 'CCTV'],
    address: 'Near Ashta Naka, Islampur',
    contact: '9988776655',
    image: 'https://images.unsplash.com/photo-1522771731470-ea457fbe51f5?q=80&w=800&auto=format&fit=crop',
    createdAt: Date.now() - 100000
  },
  {
    id: 'l3',
    ownerId: 'owner1',
    ownerName: 'Ramesh Patil',
    title: 'Budget Stay for Boys',
    collegeId: 'c2', // KBP
    distance: 0.8,
    rent: 2500,
    facilities: ['Power Backup'],
    address: 'Kacheri Road, Near KBP College, Islampur',
    contact: '9876543210',
    image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=800&auto=format&fit=crop',
    createdAt: Date.now() - 200000
  },
  {
    id: 'l4',
    ownerId: 'owner3',
    ownerName: 'Vikas Kadam',
    title: 'Elite Girls Residence',
    collegeId: 'c1', // RIT
    distance: 0.3,
    rent: 5500,
    facilities: ['WiFi', 'AC', 'Mess', 'CCTV', 'Security'],
    address: 'Opposite RIT Campus, Rajaramnagar, Islampur',
    contact: '9123456780',
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=800&auto=format&fit=crop',
    createdAt: Date.now() - 300000
  },
  {
    id: 'l5',
    ownerId: 'owner4',
    ownerName: 'Amit Shah',
    title: 'Prakash Medico Hostel',
    collegeId: 'c6', // Prakash Medical College
    distance: 0.1,
    rent: 6000,
    facilities: ['WiFi', 'Hot Water', 'Library', 'AC'],
    address: 'Uran Islampur, Near Prakash Medical College',
    contact: '9888123456',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop',
    createdAt: Date.now() - 400000
  },
  {
    id: 'l6',
    ownerId: 'owner2',
    ownerName: 'Suresh Deshmukh',
    title: 'Comfort Living PG',
    collegeId: 'c3', // Kusumtai
    distance: 1.5,
    rent: 3000,
    facilities: ['WiFi', 'Washing Machine'],
    address: 'Shivaji Chowk, Islampur',
    contact: '9988776655',
    image: 'https://images.unsplash.com/photo-1542889601-399c4f3a8402?q=80&w=800&auto=format&fit=crop',
    createdAt: Date.now() - 600000
  },
  {
    id: 'l7',
    ownerId: 'owner5',
    ownerName: 'Priya Joshi',
    title: 'Safe Haven Girls Hostel',
    collegeId: 'c2', // KBP
    distance: 0.5,
    rent: 4000,
    facilities: ['Security', 'CCTV', 'Mess', 'Hot Water'],
    address: 'Near S.T. Stand, Islampur',
    contact: '9000111222',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=800&auto=format&fit=crop',
    createdAt: Date.now() - 700000
  },
  {
    id: 'l8',
    ownerId: 'owner6',
    ownerName: 'Kishore Kumar',
    title: 'Yashwant Boys Hostel',
    collegeId: 'c4', // Yashwantrao Chavan College
    distance: 0.9,
    rent: 2800,
    facilities: ['Parking', 'Power Backup'],
    address: 'Bahe Road, Islampur',
    contact: '8888999900',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop',
    createdAt: Date.now() - 800000
  },
  {
    id: 'l9',
    ownerId: 'owner7',
    ownerName: 'Anil Jadhav',
    title: 'Dange Campus Stay',
    collegeId: 'c5', // Annasaheb Dange
    distance: 0.4,
    rent: 4200,
    facilities: ['WiFi', 'Mess', 'Laundry'],
    address: 'Ashta Road, Near ADCET',
    contact: '7777666655',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1de2d9d00c?q=80&w=800&auto=format&fit=crop',
    createdAt: Date.now() - 900000
  },
  {
    id: 'l10',
    ownerId: 'owner8',
    ownerName: 'Sunita Mane',
    title: 'Mahdik Residency',
    collegeId: 'c7', // Nanasaheb Mahdik
    distance: 0.7,
    rent: 3200,
    facilities: ['Hot Water', 'WiFi'],
    address: 'Peth Naka, Islampur',
    contact: '9999888877',
    image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?q=80&w=800&auto=format&fit=crop',
    createdAt: Date.now() - 1000000
  },
  {
    id: 'l11',
    ownerId: 'owner3',
    ownerName: 'Vikas Kadam',
    title: 'Premium PG For Students',
    collegeId: 'c1', // RIT
    distance: 1.0,
    rent: 4800,
    facilities: ['WiFi', 'AC', 'Parking', 'Power Backup'],
    address: 'Vidyanagar, Islampur',
    contact: '9123456780',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop',
    createdAt: Date.now() - 1100000
  },
  {
    id: 'l12',
    ownerId: 'owner9',
    ownerName: 'Rahul Pawar',
    title: 'Medicos Den',
    collegeId: 'c6', // Prakash Medical College
    distance: 0.3,
    rent: 5000,
    facilities: ['Mess', 'WiFi', 'CCTV'],
    address: 'Islampur-Sangli Road',
    contact: '8877665544',
    image: 'https://images.unsplash.com/photo-1522771930-78848d92fa24?q=80&w=800&auto=format&fit=crop',
    createdAt: Date.now() - 1200000
  },
  {
    id: 'l13',
    ownerId: 'owner10',
    ownerName: 'Meena Kulkarni',
    title: 'Kusumtai PG',
    collegeId: 'c3', // Kusumtai
    distance: 0.6,
    rent: 3500,
    facilities: ['Security', 'Hot Water'],
    address: 'Main Market Road, Islampur',
    contact: '7766554433',
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=800&auto=format&fit=crop',
    createdAt: Date.now() - 1300000
  },
  {
    id: 'l14',
    ownerId: 'owner11',
    ownerName: 'Vijay Shinde',
    title: 'Chavan Student Acco',
    collegeId: 'c4', // Yashwantrao Chavan
    distance: 1.1,
    rent: 2600,
    facilities: ['Parking', 'Mess'],
    address: 'Near Old Bus Stand, Islampur',
    contact: '9988112233',
    image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=800&auto=format&fit=crop',
    createdAt: Date.now() - 1400000
  },
  {
    id: 'l15',
    ownerId: 'owner1',
    ownerName: 'Ramesh Patil',
    title: 'RIT Scholars Home',
    collegeId: 'c1', // RIT
    distance: 0.2,
    rent: 3800,
    facilities: ['WiFi', 'Mess', 'Power Backup'],
    address: 'Rajaramnagar Gate 2, Islampur',
    contact: '9876543210',
    image: 'https://images.unsplash.com/photo-1502005097973-156128db6105?q=80&w=800&auto=format&fit=crop',
    createdAt: Date.now() - 1500000
  }
];

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Rahul Dilip Patil', email: 'rahul@student.com', role: 'student', contact: '8767613332', password: 'password123' },
  { id: 'u2', name: 'Sneha Deshmukh', email: 'sneha@student.com', role: 'student', contact: '9988776655', password: 'password123' },
  { id: 'u3', name: 'Ramesh Patil', email: 'owner1@gmail.com', role: 'owner', contact: '9876543210', isApproved: true, password: 'password123' },
  { id: 'u4', name: 'Suresh Deshmukh', email: 'owner2@gmail.com', role: 'owner', contact: '9988776655', isApproved: true, password: 'password123' },
  { id: 'u5', name: 'Priya Joshi', email: 'priya@student.com', role: 'student', contact: '9000111222', password: 'password123' },
  { id: 'u6', name: 'Vikas Kadam', email: 'owner3@gmail.com', role: 'owner', contact: '9123456780', isApproved: false, password: 'password123' },
  { id: 'u7', name: 'Arjun Singh', email: 'arjun@student.com', role: 'student', contact: '9011223344', password: 'password123' },
  { id: 'u8', name: 'Amit Shah', email: 'owner4@gmail.com', role: 'owner', contact: '9888123456', isApproved: true, password: 'password123' },
  { id: 'u9', name: 'Kiran More', email: 'kiran@student.com', role: 'student', contact: '9988112233', password: 'password123' },
  { id: 'u10', name: 'Pooja Sharma', email: 'pooja@student.com', role: 'student', contact: '8877665544', password: 'password123' },
  { id: 'u11', name: 'Ravi Teja', email: 'ravi@student.com', role: 'student', contact: '7766554433', password: 'password123' },
  { id: 'u12', name: 'Meena Kulkarni', email: 'owner5@gmail.com', role: 'owner', contact: '9123123123', isApproved: false, password: 'password123' },
  { id: 'u13', name: 'Vijay Shinde', email: 'owner6@gmail.com', role: 'owner', contact: '9876987654', isApproved: false, password: 'password123' },
  { id: 'u14', name: 'Neha Gupta', email: 'neha@student.com', role: 'student', contact: '9988114455', password: 'password123' },
  { id: 'u15', name: 'Rohit Sharma', email: 'rohit@student.com', role: 'student', contact: '8877223344', password: 'password123' },
  { id: 'u16', name: 'Anjali Verma', email: 'anjali@student.com', role: 'student', contact: '7766334455', password: 'password123' },
  { id: 'u17', name: 'Manish Kumar', email: 'manish@student.com', role: 'student', contact: '9000888777', password: 'password123' },
  { id: 'u18', name: 'Swati Patil', email: 'swati@student.com', role: 'student', contact: '9111222333', password: 'password123' },
  { id: 'u19', name: 'Rajendra Prasad', email: 'owner7@gmail.com', role: 'owner', contact: '9876112233', isApproved: true, password: 'password123' },
  { id: 'u20', name: 'Ashok Chavan', email: 'owner8@gmail.com', role: 'owner', contact: '9988223344', isApproved: false, password: 'password123' },
  { id: 'u21', name: 'Sunita Rao', email: 'owner9@gmail.com', role: 'owner', contact: '9000334455', isApproved: true, password: 'password123' },
  { id: 'u22', name: 'Pravin Desai', email: 'owner10@gmail.com', role: 'owner', contact: '9111445566', isApproved: false, password: 'password123' },
  { id: 'u23', name: 'Mahesh Jadhav', email: 'owner11@gmail.com', role: 'owner', contact: '9222556677', isApproved: true, password: 'password123' }
];