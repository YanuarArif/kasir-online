import { Service, ServiceStatus, DeviceType } from "./types";

// Generate a random service number
const generateServiceNumber = () => {
  const prefix = "SRV";
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}${randomNum}`;
};

// Generate a random date within the last 30 days
const generateRecentDate = (daysAgo = 30) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date.toISOString();
};

// Generate a future date within the next 14 days
const generateFutureDate = (daysAhead = 14) => {
  const date = new Date();
  date.setDate(date.getDate() + Math.floor(Math.random() * daysAhead) + 1);
  return date.toISOString();
};

// Mock service data
export const mockServices: Service[] = [
  {
    id: "1",
    serviceNumber: generateServiceNumber(),
    customerName: "Ahmad Fauzi",
    customerPhone: "081234567890",
    customerEmail: "ahmad@example.com",
    deviceType: DeviceType.LAPTOP,
    deviceBrand: "Lenovo",
    deviceModel: "ThinkPad X1 Carbon",
    deviceSerialNumber: "LNV123456789",
    problemDescription: "Laptop tidak bisa menyala dan baterai cepat habis",
    status: ServiceStatus.PENDING,
    receivedDate: generateRecentDate(5),
    estimatedCompletionDate: generateFutureDate(7),
    createdAt: generateRecentDate(5),
    updatedAt: generateRecentDate(5),
    userId: "user1",
  },
  {
    id: "2",
    serviceNumber: generateServiceNumber(),
    customerName: "Budi Santoso",
    customerPhone: "082345678901",
    deviceType: DeviceType.DESKTOP,
    deviceBrand: "Custom PC",
    deviceModel: "Gaming PC",
    problemDescription: "PC restart sendiri saat bermain game",
    diagnosisNotes: "Kemungkinan masalah pada power supply atau overheating",
    status: ServiceStatus.IN_PROGRESS,
    receivedDate: generateRecentDate(10),
    estimatedCompletionDate: generateFutureDate(3),
    createdAt: generateRecentDate(10),
    updatedAt: generateRecentDate(8),
    userId: "user1",
  },
  {
    id: "3",
    serviceNumber: generateServiceNumber(),
    customerName: "Citra Dewi",
    customerPhone: "083456789012",
    customerEmail: "citra@example.com",
    deviceType: DeviceType.PHONE,
    deviceBrand: "Samsung",
    deviceModel: "Galaxy S21",
    deviceSerialNumber: "SM-G991UZKAXAA",
    problemDescription: "Layar retak dan baterai cepat habis",
    diagnosisNotes: "Perlu penggantian layar dan baterai",
    repairNotes: "Menunggu sparepart layar dari supplier",
    estimatedCost: 1500000,
    status: ServiceStatus.WAITING_FOR_PARTS,
    receivedDate: generateRecentDate(15),
    estimatedCompletionDate: generateFutureDate(10),
    createdAt: generateRecentDate(15),
    updatedAt: generateRecentDate(12),
    userId: "user1",
  },
  {
    id: "4",
    serviceNumber: generateServiceNumber(),
    customerName: "Dewi Anggraini",
    customerPhone: "084567890123",
    deviceType: DeviceType.PRINTER,
    deviceBrand: "Epson",
    deviceModel: "L3150",
    problemDescription: "Printer tidak bisa mencetak, hasil cetakan bergaris",
    diagnosisNotes: "Head printer kotor, perlu cleaning mendalam",
    repairNotes: "Sudah dilakukan cleaning dan penggantian tinta",
    estimatedCost: 350000,
    finalCost: 350000,
    status: ServiceStatus.COMPLETED,
    receivedDate: generateRecentDate(20),
    estimatedCompletionDate: generateRecentDate(18),
    completedDate: generateRecentDate(18),
    createdAt: generateRecentDate(20),
    updatedAt: generateRecentDate(18),
    userId: "user1",
  },
  {
    id: "5",
    serviceNumber: generateServiceNumber(),
    customerName: "Eko Prasetyo",
    customerPhone: "085678901234",
    customerEmail: "eko@example.com",
    deviceType: DeviceType.LAPTOP,
    deviceBrand: "Asus",
    deviceModel: "ROG Strix G15",
    deviceSerialNumber: "ASU987654321",
    problemDescription: "Laptop overheat dan fan berisik",
    diagnosisNotes: "Fan kotor dan thermal paste perlu diganti",
    repairNotes: "Sudah dibersihkan dan diganti thermal paste",
    estimatedCost: 450000,
    finalCost: 450000,
    status: ServiceStatus.DELIVERED,
    receivedDate: generateRecentDate(25),
    estimatedCompletionDate: generateRecentDate(22),
    completedDate: generateRecentDate(22),
    deliveredDate: generateRecentDate(20),
    createdAt: generateRecentDate(25),
    updatedAt: generateRecentDate(20),
    userId: "user1",
  },
  {
    id: "6",
    serviceNumber: generateServiceNumber(),
    customerName: "Faisal Rahman",
    customerPhone: "086789012345",
    deviceType: DeviceType.PHONE,
    deviceBrand: "iPhone",
    deviceModel: "iPhone 13",
    problemDescription: "Tidak bisa mengisi daya",
    status: ServiceStatus.PENDING,
    receivedDate: generateRecentDate(2),
    estimatedCompletionDate: generateFutureDate(5),
    createdAt: generateRecentDate(2),
    updatedAt: generateRecentDate(2),
    userId: "user1",
  },
  {
    id: "7",
    serviceNumber: generateServiceNumber(),
    customerName: "Gita Nirmala",
    customerPhone: "087890123456",
    customerEmail: "gita@example.com",
    deviceType: DeviceType.TABLET,
    deviceBrand: "iPad",
    deviceModel: "iPad Pro 11",
    deviceSerialNumber: "IPAD12345678",
    problemDescription: "Layar berkedip dan tidak responsif",
    diagnosisNotes: "Kemungkinan masalah pada kabel fleksibel layar",
    status: ServiceStatus.IN_PROGRESS,
    receivedDate: generateRecentDate(7),
    estimatedCompletionDate: generateFutureDate(4),
    createdAt: generateRecentDate(7),
    updatedAt: generateRecentDate(5),
    userId: "user1",
  },
  {
    id: "8",
    serviceNumber: generateServiceNumber(),
    customerName: "Hadi Sutrisno",
    customerPhone: "088901234567",
    deviceType: DeviceType.PRINTER,
    deviceBrand: "HP",
    deviceModel: "LaserJet Pro",
    problemDescription: "Paper jam dan hasil cetakan pudar",
    diagnosisNotes: "Roller pickup rusak dan toner hampir habis",
    repairNotes: "Menunggu sparepart roller dari supplier",
    estimatedCost: 750000,
    status: ServiceStatus.WAITING_FOR_PARTS,
    receivedDate: generateRecentDate(12),
    estimatedCompletionDate: generateFutureDate(8),
    createdAt: generateRecentDate(12),
    updatedAt: generateRecentDate(10),
    userId: "user1",
  },
];

// Service counts
export const mockServiceCounts = {
  pending: mockServices.filter(s => s.status === ServiceStatus.PENDING).length,
  inProgress: mockServices.filter(s => s.status === ServiceStatus.IN_PROGRESS).length,
  waitingForParts: mockServices.filter(s => s.status === ServiceStatus.WAITING_FOR_PARTS).length,
  completed: mockServices.filter(s => 
    s.status === ServiceStatus.COMPLETED || s.status === ServiceStatus.DELIVERED
  ).length,
  total: mockServices.length,
};
