import type { User } from '../types';

let users: User[] = [
  { id: 1, email: 'admin@ratemylandlord.com', password: 'password123', isAdmin: true, createdAt: '2023-01-01' },
  { id: 2, email: 'admin2@ratemylandlord.com', password: 'admin456', isAdmin: true, createdAt: '2023-01-01' },
];

let nextUserId = 3;

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const registerUser = async (email: string, password: string): Promise<User | null> => {
  await delay(500);
  
  // Check if user already exists
  if (users.some(u => u.email === email)) {
    throw new Error('User with this email already exists');
  }

  const newUser: User = {
    id: nextUserId++,
    email,
    password, // In production, hash this!
    isAdmin: false,
    createdAt: new Date().toISOString().split('T')[0],
  };

  users.push(newUser);
  return newUser;
};

export const loginUser = async (email: string, password: string): Promise<User | null> => {
  await delay(500);
  const user = users.find(u => u.email === email && u.password === password);
  return user || null;
};

export const getUserById = async (id: number): Promise<User | null> => {
  await delay(300);
  return users.find(u => u.id === id) || null;
};
