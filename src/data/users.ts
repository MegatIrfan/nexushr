export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  role: string;
}

export const users: User[] = [
  {
    id: "1",
    name: "Ahmad Farhan bin Zulkifli",
    username: "ahmad.farhan",
    email: "admin@company.com",
    avatar: "",
    role: "HR Administrator",
  },
  {
    id: "2",
    name: "Mohd Hafiz bin Razak",
    username: "hafiz.razak",
    email: "penyelia@company.com",
    avatar: "",
    role: "Team Supervisor",
  },
  {
    id: "3",
    name: "Nurul Izzah binti Hashim",
    username: "nurul.izzah",
    email: "staf@company.com",
    avatar: "",
    role: "Staff Employee",
  },
];

export const rootUser = users[0];
