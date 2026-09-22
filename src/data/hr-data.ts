// ─── NexusHR Core Data & Enterprise Entities ────────────────────────────────

export type HrRole = "admin" | "ketua" | "staf";

export interface HrAuthUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: HrRole;
  avatar: string;
  jawatan: string;
  bahagian: string;
}

export const hrAuthUsers: HrAuthUser[] = [
  {
    id: "auth-1",
    name: "Ahmad Farhan bin Zulkifli",
    email: "admin@company.com",
    password: "admin123",
    role: "admin",
    avatar: "",
    jawatan: "Head of People & Culture",
    bahagian: "People Operations",
  },
  {
    id: "auth-2",
    name: "Mohd Hafiz bin Razak",
    email: "penyelia@company.com",
    password: "penyelia123",
    role: "ketua",
    avatar: "",
    jawatan: "Engineering Director",
    bahagian: "Software Engineering",
  },
  {
    id: "auth-2b",
    name: "Mohd Hafiz bin Razak",
    email: "supervisor@company.com",
    password: "supervisor123",
    role: "ketua",
    avatar: "",
    jawatan: "Engineering Director",
    bahagian: "Software Engineering",
  },
  {
    id: "auth-3",
    name: "Nurul Izzah binti Hashim",
    email: "staf@company.com",
    password: "staf123",
    role: "staf",
    avatar: "",
    jawatan: "Senior Financial Analyst",
    bahagian: "Global Finance",
  },
  {
    id: "auth-3b",
    name: "Nurul Izzah binti Hashim",
    email: "employee@company.com",
    password: "employee123",
    role: "staf",
    avatar: "",
    jawatan: "Senior Financial Analyst",
    bahagian: "Global Finance",
  },
];

// ─── Staff Data ────────────────────────────────────────────────────────────────

export type StatusPerkhidmatan = "Aktif" | "Bersara" | "Tamat Kontrak" | "Cuti Tanpa Gaji";

export interface Staf {
  id: string;
  noStaf: string;
  nama: string;
  email: string;
  telefon: string;
  jawatan: string;
  gred: string;
  bahagian: string;
  unit: string;
  tarikhMula: string;
  statusPerkhidmatan: StatusPerkhidmatan;
  avatar: string;
  pengurus: string; // id of manager
}

export const staffData: Staf[] = [
  {
    id: "s-001",
    noStaf: "NX-0101",
    nama: "Ahmad Farhan bin Zulkifli",
    email: "ahmad.farhan@company.com",
    telefon: "+60 12-345 6789",
    jawatan: "Head of People & Culture",
    gred: "L8 - Executive",
    bahagian: "People Operations",
    unit: "Executive Leadership",
    tarikhMula: "2018-03-01",
    statusPerkhidmatan: "Aktif",
    avatar: "",
    pengurus: "s-002",
  },
  {
    id: "s-002",
    noStaf: "NX-0102",
    nama: "Mohd Hafiz bin Razak",
    email: "hafiz.razak@company.com",
    telefon: "+60 13-456 7890",
    jawatan: "Engineering Director",
    gred: "L7 - Director",
    bahagian: "Software Engineering",
    unit: "Cloud Architecture",
    tarikhMula: "2015-06-15",
    statusPerkhidmatan: "Aktif",
    avatar: "",
    pengurus: "",
  },
  {
    id: "s-003",
    noStaf: "NX-0103",
    nama: "Nurul Izzah binti Hashim",
    email: "nurul.izzah@company.com",
    telefon: "+60 14-567 8901",
    jawatan: "Senior Financial Analyst",
    gred: "L5 - Senior",
    bahagian: "Global Finance",
    unit: "Corporate FP&A",
    tarikhMula: "2020-01-13",
    statusPerkhidmatan: "Aktif",
    avatar: "",
    pengurus: "s-002",
  },
  {
    id: "s-004",
    noStaf: "NX-0104",
    nama: "Khairul Anuar bin Mansor",
    email: "khairul.anuar@company.com",
    telefon: "+60 16-678 9012",
    jawatan: "Director of Global Operations",
    gred: "L7 - Director",
    bahagian: "Global Operations",
    unit: "Operations Delivery",
    tarikhMula: "2019-04-22",
    statusPerkhidmatan: "Aktif",
    avatar: "",
    pengurus: "s-002",
  },
  {
    id: "s-005",
    noStaf: "NX-0105",
    nama: "Siti Aishah binti Radzi",
    email: "siti.aishah@company.com",
    telefon: "+60 17-789 0123",
    jawatan: "Principal Product Designer",
    gred: "L6 - Staff",
    bahagian: "Product & Design",
    unit: "Design Systems",
    tarikhMula: "2021-07-05",
    statusPerkhidmatan: "Aktif",
    avatar: "",
    pengurus: "s-001",
  },
  {
    id: "s-006",
    noStaf: "NX-0106",
    nama: "Muhammad Danial bin Azman",
    email: "danial.azman@company.com",
    telefon: "+60 18-890 1234",
    jawatan: "Lead DevOps & Cloud Engineer",
    gred: "L6 - Senior",
    bahagian: "Software Engineering",
    unit: "SRE & Platform",
    tarikhMula: "2016-11-01",
    statusPerkhidmatan: "Aktif",
    avatar: "",
    pengurus: "s-002",
  },
  {
    id: "s-007",
    noStaf: "NX-0107",
    nama: "Nur Fatihah binti Kamaruddin",
    email: "fatihah.kamaruddin@company.com",
    telefon: "+60 19-901 2345",
    jawatan: "Talent Acquisition Lead",
    gred: "L5 - Senior",
    bahagian: "People Operations",
    unit: "Technical Recruiting",
    tarikhMula: "2022-02-28",
    statusPerkhidmatan: "Aktif",
    avatar: "",
    pengurus: "s-001",
  },
  {
    id: "s-008",
    noStaf: "NX-0108",
    nama: "Zulhilmi bin Shamsuddin",
    email: "zulhilmi@company.com",
    telefon: "+60 11-123 4567",
    jawatan: "Enterprise Client Lead",
    gred: "L5 - Senior",
    bahagian: "Customer Success",
    unit: "Enterprise Accounts",
    tarikhMula: "2017-09-10",
    statusPerkhidmatan: "Cuti Tanpa Gaji",
    avatar: "",
    pengurus: "s-004",
  },
];

// ─── Attendance Data ───────────────────────────────────────────────────────────

export type StatusKehadiran = "Hadir" | "Lewat" | "Tidak Hadir" | "WFH" | "Keluar Pejabat" | "Cuti";

export interface RekorKehadiran {
  id: string;
  stafId: string;
  tarikh: string;
  waktuMasuk: string | null;
  waktuKeluar: string | null;
  status: StatusKehadiran;
  sebab: string;
  lokasi?: string;
}

export const kehadiranData: RekorKehadiran[] = [
  // Today 2026-09-22
  {
    id: "k-001",
    stafId: "s-001",
    tarikh: "2026-09-22",
    waktuMasuk: "07:58",
    waktuKeluar: null,
    status: "Hadir",
    sebab: "",
    lokasi: "Headquarters Office",
  },
  {
    id: "k-002",
    stafId: "s-002",
    tarikh: "2026-09-22",
    waktuMasuk: "08:00",
    waktuKeluar: null,
    status: "Hadir",
    sebab: "",
    lokasi: "Headquarters Office",
  },
  {
    id: "k-003",
    stafId: "s-003",
    tarikh: "2026-09-22",
    waktuMasuk: "08:32",
    waktuKeluar: null,
    status: "Lewat",
    sebab: "LRT transit delay during morning commute",
    lokasi: "Headquarters Office",
  },
  {
    id: "k-004",
    stafId: "s-004",
    tarikh: "2026-09-22",
    waktuMasuk: null,
    waktuKeluar: null,
    status: "Cuti",
    sebab: "Approved annual PTO",
  },
  {
    id: "k-005",
    stafId: "s-005",
    tarikh: "2026-09-22",
    waktuMasuk: "08:05",
    waktuKeluar: null,
    status: "Hadir",
    sebab: "",
    lokasi: "Design Studio",
  },
  {
    id: "k-006",
    stafId: "s-006",
    tarikh: "2026-09-22",
    waktuMasuk: "08:00",
    waktuKeluar: null,
    status: "WFH",
    sebab: "Scheduled remote deep-focus sprint",
    lokasi: "Remote / Home Office",
  },
  {
    id: "k-007",
    stafId: "s-007",
    tarikh: "2026-09-22",
    waktuMasuk: "08:10",
    waktuKeluar: null,
    status: "Hadir",
    sebab: "",
    lokasi: "Headquarters Office",
  },
  {
    id: "k-008",
    stafId: "s-008",
    tarikh: "2026-09-22",
    waktuMasuk: null,
    waktuKeluar: null,
    status: "Tidak Hadir",
    sebab: "Unpaid sabbatical leave",
  },
  // Yesterday 2026-09-21
  {
    id: "k-009",
    stafId: "s-001",
    tarikh: "2026-09-21",
    waktuMasuk: "08:00",
    waktuKeluar: "17:02",
    status: "Hadir",
    sebab: "",
    lokasi: "Headquarters Office",
  },
  {
    id: "k-010",
    stafId: "s-002",
    tarikh: "2026-09-21",
    waktuMasuk: "07:55",
    waktuKeluar: "17:15",
    status: "Hadir",
    sebab: "",
    lokasi: "Headquarters Office",
  },
  {
    id: "k-011",
    stafId: "s-003",
    tarikh: "2026-09-21",
    waktuMasuk: "08:00",
    waktuKeluar: "17:00",
    status: "Hadir",
    sebab: "",
    lokasi: "Headquarters Office",
  },
  {
    id: "k-012",
    stafId: "s-004",
    tarikh: "2026-09-21",
    waktuMasuk: "10:30",
    waktuKeluar: "14:00",
    status: "Keluar Pejabat",
    sebab: "Enterprise client presentation on-site",
    lokasi: "Client Site",
  },
  {
    id: "k-013",
    stafId: "s-005",
    tarikh: "2026-09-21",
    waktuMasuk: "08:00",
    waktuKeluar: "17:00",
    status: "Hadir",
    sebab: "",
    lokasi: "Design Studio",
  },
  {
    id: "k-014",
    stafId: "s-006",
    tarikh: "2026-09-21",
    waktuMasuk: "08:00",
    waktuKeluar: "17:00",
    status: "Hadir",
    sebab: "",
    lokasi: "Headquarters Office",
  },
  {
    id: "k-015",
    stafId: "s-007",
    tarikh: "2026-09-21",
    waktuMasuk: "08:45",
    waktuKeluar: "17:00",
    status: "Lewat",
    sebab: "Doctor appointment before shift",
    lokasi: "Headquarters Office",
  },
  {
    id: "k-016",
    stafId: "s-008",
    tarikh: "2026-09-21",
    waktuMasuk: null,
    waktuKeluar: null,
    status: "Tidak Hadir",
    sebab: "Unpaid sabbatical leave",
  },
];

// ─── Leave Data ────────────────────────────────────────────────────────────────

export type JenisCuti =
  | "Cuti Tahunan"
  | "Cuti Sakit"
  | "Cuti Kecemasan"
  | "Cuti Separuh Gaji"
  | "Cuti Tanpa Rekod"
  | "Cuti Bersalin";
export type StatusCuti = "Menunggu" | "Diluluskan" | "Ditolak" | "Dibatalkan";

export interface PermohonanCuti {
  id: string;
  stafId: string;
  jenisCuti: JenisCuti;
  tarikhMula: string;
  tarikhAkhir: string;
  bilanganHari: number;
  sebab: string;
  status: StatusCuti;
  tarikhPermohonan: string;
  catatanPelulus: string;
  pelulusId: string;
}

export const permohonanCutiData: PermohonanCuti[] = [
  {
    id: "c-001",
    stafId: "s-003",
    jenisCuti: "Cuti Tahunan",
    tarikhMula: "2026-09-22",
    tarikhAkhir: "2026-09-24",
    bilanganHari: 3,
    sebab: "Annual Family Vacation & Out-of-State Travel",
    status: "Menunggu",
    tarikhPermohonan: "2026-09-20",
    catatanPelulus: "",
    pelulusId: "s-002",
  },
  {
    id: "c-002",
    stafId: "s-004",
    jenisCuti: "Cuti Tahunan",
    tarikhMula: "2026-09-22",
    tarikhAkhir: "2026-09-22",
    bilanganHari: 1,
    sebab: "Medical consultation & routine wellness screening",
    status: "Diluluskan",
    tarikhPermohonan: "2026-09-18",
    catatanPelulus: "Approved, coverage confirmed by Mohd Hafiz",
    pelulusId: "s-002",
  },
  {
    id: "c-003",
    stafId: "s-005",
    jenisCuti: "Cuti Tanpa Rekod",
    tarikhMula: "2026-09-28",
    tarikhAkhir: "2026-09-30",
    bilanganHari: 3,
    sebab: "Speaker at Global Design Systems Summit in Kuala Lumpur",
    status: "Menunggu",
    tarikhPermohonan: "2026-09-15",
    catatanPelulus: "",
    pelulusId: "s-001",
  },
  {
    id: "c-004",
    stafId: "s-006",
    jenisCuti: "Cuti Sakit",
    tarikhMula: "2026-09-15",
    tarikhAkhir: "2026-09-16",
    bilanganHari: 2,
    sebab: "Viral influenza - Doctor medical certificate submitted",
    status: "Diluluskan",
    tarikhPermohonan: "2026-09-15",
    catatanPelulus: "MC verified and logged into system",
    pelulusId: "s-002",
  },
  {
    id: "c-005",
    stafId: "s-007",
    jenisCuti: "Cuti Kecemasan",
    tarikhMula: "2026-09-10",
    tarikhAkhir: "2026-09-10",
    bilanganHari: 1,
    sebab: "Residential plumbing burst emergency",
    status: "Diluluskan",
    tarikhPermohonan: "2026-09-10",
    catatanPelulus: "Approved as emergency time-off quota",
    pelulusId: "s-001",
  },
  {
    id: "c-006",
    stafId: "s-003",
    jenisCuti: "Cuti Bersalin",
    tarikhMula: "2026-11-01",
    tarikhAkhir: "2027-01-30",
    bilanganHari: 90,
    sebab: "Paid Maternity / Parental Leave Application",
    status: "Menunggu",
    tarikhPermohonan: "2026-09-19",
    catatanPelulus: "",
    pelulusId: "s-001",
  },
];

// ─── Leave Balance Data ────────────────────────────────────────────────────────

export interface BakiCuti {
  stafId: string;
  cutiTahunan: { hak: number; diambil: number };
  cutiSakit: { hak: number; diambil: number };
  cutiKecemasan: { hak: number; diambil: number };
  cutiBersalin: { hak: number; diambil: number };
}

export const bakiCutiData: BakiCuti[] = [
  {
    stafId: "s-001",
    cutiTahunan: { hak: 30, diambil: 6 },
    cutiSakit: { hak: 15, diambil: 0 },
    cutiKecemasan: { hak: 5, diambil: 0 },
    cutiBersalin: { hak: 90, diambil: 0 },
  },
  {
    stafId: "s-002",
    cutiTahunan: { hak: 25, diambil: 5 },
    cutiSakit: { hak: 15, diambil: 1 },
    cutiKecemasan: { hak: 5, diambil: 0 },
    cutiBersalin: { hak: 90, diambil: 0 },
  },
  {
    stafId: "s-003",
    cutiTahunan: { hak: 20, diambil: 4 },
    cutiSakit: { hak: 15, diambil: 2 },
    cutiKecemasan: { hak: 5, diambil: 1 },
    cutiBersalin: { hak: 90, diambil: 0 },
  },
  {
    stafId: "s-004",
    cutiTahunan: { hak: 22, diambil: 3 },
    cutiSakit: { hak: 15, diambil: 0 },
    cutiKecemasan: { hak: 5, diambil: 0 },
    cutiBersalin: { hak: 90, diambil: 0 },
  },
  {
    stafId: "s-005",
    cutiTahunan: { hak: 22, diambil: 2 },
    cutiSakit: { hak: 15, diambil: 0 },
    cutiKecemasan: { hak: 5, diambil: 1 },
    cutiBersalin: { hak: 90, diambil: 0 },
  },
  {
    stafId: "s-006",
    cutiTahunan: { hak: 25, diambil: 5 },
    cutiSakit: { hak: 15, diambil: 2 },
    cutiKecemasan: { hak: 5, diambil: 0 },
    cutiBersalin: { hak: 90, diambil: 0 },
  },
  {
    stafId: "s-007",
    cutiTahunan: { hak: 18, diambil: 2 },
    cutiSakit: { hak: 15, diambil: 1 },
    cutiKecemasan: { hak: 5, diambil: 1 },
    cutiBersalin: { hak: 90, diambil: 0 },
  },
  {
    stafId: "s-008",
    cutiTahunan: { hak: 20, diambil: 0 },
    cutiSakit: { hak: 15, diambil: 0 },
    cutiKecemasan: { hak: 5, diambil: 0 },
    cutiBersalin: { hak: 90, diambil: 0 },
  },
];

// ─── Documents Data ────────────────────────────────────────────────────────────

export type JenisDokumen =
  | "Surat Lantikan"
  | "Surat Pengesahan"
  | "Penilaian Prestasi"
  | "Sijil Kursus"
  | "Dokumen Peribadi"
  | "Surat Perkhidmatan"
  | "Lain-lain";

export interface DokumenHR {
  id: string;
  stafId: string;
  tajuk: string;
  jenis: JenisDokumen;
  tarikhDimuat: string;
  saizFail: string;
  formatFail: string;
}

export const dokumenData: DokumenHR[] = [
  {
    id: "d-001",
    stafId: "s-001",
    tajuk: "Executive Employment Agreement - Ahmad Farhan",
    jenis: "Surat Lantikan",
    tarikhDimuat: "2018-03-01",
    saizFail: "342 KB",
    formatFail: "PDF",
  },
  {
    id: "d-002",
    stafId: "s-001",
    tajuk: "Executive Leadership Package 2026 - Ahmad Farhan",
    jenis: "Surat Pengesahan",
    tarikhDimuat: "2026-01-10",
    saizFail: "512 KB",
    formatFail: "PDF",
  },
  {
    id: "d-003",
    stafId: "s-002",
    tajuk: "Engineering Directorship Appointment - Mohd Hafiz",
    jenis: "Surat Lantikan",
    tarikhDimuat: "2015-06-15",
    saizFail: "318 KB",
    formatFail: "PDF",
  },
  {
    id: "d-004",
    stafId: "s-003",
    tajuk: "Senior Financial Analyst Offer Letter - Nurul Izzah",
    jenis: "Surat Lantikan",
    tarikhDimuat: "2020-01-13",
    saizFail: "278 KB",
    formatFail: "PDF",
  },
  {
    id: "d-005",
    stafId: "s-003",
    tajuk: "Annual Performance Appraisal Review 2025 - Nurul Izzah",
    jenis: "Penilaian Prestasi",
    tarikhDimuat: "2025-12-18",
    saizFail: "450 KB",
    formatFail: "PDF",
  },
  {
    id: "d-006",
    stafId: "s-004",
    tajuk: "Global Operations Management Letter - Khairul Anuar",
    jenis: "Surat Lantikan",
    tarikhDimuat: "2019-04-22",
    saizFail: "265 KB",
    formatFail: "PDF",
  },
  {
    id: "d-007",
    stafId: "s-005",
    tajuk: "Principal Design Systems Contract - Siti Aishah",
    jenis: "Surat Lantikan",
    tarikhDimuat: "2021-07-05",
    saizFail: "289 KB",
    formatFail: "PDF",
  },
  {
    id: "d-008",
    stafId: "s-006",
    tajuk: "AWS Certified Solutions Architect Certificate - Muhammad Danial",
    jenis: "Sijil Kursus",
    tarikhDimuat: "2024-05-12",
    saizFail: "1.4 MB",
    formatFail: "PDF",
  },
  {
    id: "d-009",
    stafId: "s-007",
    tajuk: "Talent Acquisition Lead Engagement - Nur Fatihah",
    jenis: "Surat Lantikan",
    tarikhDimuat: "2022-02-28",
    saizFail: "234 KB",
    formatFail: "PDF",
  },
];

// ─── Recruitment & ATS Data ───────────────────────────────────────────────────

export interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: "Full-Time" | "Contract" | "Remote";
  salaryRange: string;
  openings: number;
  applicantsCount: number;
  status: "Active" | "Draft" | "Closed";
  postedDate: string;
}

export const jobOpeningsData: JobOpening[] = [
  {
    id: "job-1",
    title: "Senior Full Stack Engineer (Next.js & Node)",
    department: "Software Engineering",
    location: "Kuala Lumpur (Hybrid)",
    type: "Full-Time",
    salaryRange: "RM 9,000 - RM 14,000",
    openings: 2,
    applicantsCount: 38,
    status: "Active",
    postedDate: "2026-09-01",
  },
  {
    id: "job-2",
    title: "People Operations & HR Generalist",
    department: "People Operations",
    location: "Kuala Lumpur (Onsite)",
    type: "Full-Time",
    salaryRange: "RM 5,500 - RM 7,500",
    openings: 1,
    applicantsCount: 24,
    status: "Active",
    postedDate: "2026-09-08",
  },
  {
    id: "job-3",
    title: "Staff Product Designer",
    department: "Product & Design",
    location: "Remote (Malaysia)",
    type: "Remote",
    salaryRange: "RM 10,000 - RM 13,500",
    openings: 1,
    applicantsCount: 19,
    status: "Active",
    postedDate: "2026-09-12",
  },
  {
    id: "job-4",
    title: "Corporate Financial Controller",
    department: "Global Finance",
    location: "Kuala Lumpur (Onsite)",
    type: "Full-Time",
    salaryRange: "RM 9,500 - RM 12,000",
    openings: 1,
    applicantsCount: 12,
    status: "Active",
    postedDate: "2026-09-15",
  },
];

export interface Candidate {
  id: string;
  name: string;
  email: string;
  appliedRole: string;
  jobId: string;
  currentCompany: string;
  experienceYears: number;
  stage: "Applied" | "Screening" | "Interview" | "Offer" | "Hired";
  rating: number; // 1 to 5
  avatar: string;
  appliedDate: string;
}

export const candidatesData: Candidate[] = [
  {
    id: "cand-1",
    name: "Amirul Hakim bin Roslan",
    email: "amirul.hakim@email.com",
    appliedRole: "Senior Full Stack Engineer",
    jobId: "job-1",
    currentCompany: "Grab Malaysia",
    experienceYears: 7,
    stage: "Offer",
    rating: 4.9,
    avatar: "",
    appliedDate: "2026-09-04",
  },
  {
    id: "cand-2",
    name: "Nur Syahirah binti Bakar",
    email: "syahirah.b@email.com",
    appliedRole: "Staff Product Designer",
    jobId: "job-3",
    currentCompany: "Touch 'n Go Digital",
    experienceYears: 8,
    stage: "Interview",
    rating: 4.8,
    avatar: "",
    appliedDate: "2026-09-14",
  },
  {
    id: "cand-3",
    name: "Muhammad Harith bin Ismail",
    email: "harith.i@email.com",
    appliedRole: "Senior Full Stack Engineer",
    jobId: "job-1",
    currentCompany: "Shopee Malaysia",
    experienceYears: 6,
    stage: "Interview",
    rating: 4.7,
    avatar: "",
    appliedDate: "2026-09-08",
  },
  {
    id: "cand-4",
    name: "Noraini binti Yusof",
    email: "noraini.y@email.com",
    appliedRole: "People Operations & HR Generalist",
    jobId: "job-2",
    currentCompany: "Carsome",
    experienceYears: 5,
    stage: "Screening",
    rating: 4.6,
    avatar: "",
    appliedDate: "2026-09-16",
  },
  {
    id: "cand-5",
    name: "Faizul bin Zakaria",
    email: "faizul.z@email.com",
    appliedRole: "Corporate Financial Controller",
    jobId: "job-4",
    currentCompany: "PwC Malaysia",
    experienceYears: 8,
    stage: "Screening",
    rating: 4.5,
    avatar: "",
    appliedDate: "2026-09-18",
  },
  {
    id: "cand-6",
    name: "Siti Sarah binti Idris",
    email: "sarah.idris@email.com",
    appliedRole: "Senior Full Stack Engineer",
    jobId: "job-1",
    currentCompany: "Petronas Digital",
    experienceYears: 5,
    stage: "Applied",
    rating: 4.4,
    avatar: "",
    appliedDate: "2026-09-21",
  },
];

// ─── Performance & OKRs Data ───────────────────────────────────────────────────

export interface CompanyOkr {
  id: string;
  objective: string;
  department: string;
  owner: string;
  progressPercent: number;
  status: "On Track" | "At Risk" | "Ahead";
  dueDate: string;
}

export const companyOkrsData: CompanyOkr[] = [
  {
    id: "okr-1",
    objective: "Scale Global Tech Talent Pipeline & Reduce Time-to-Hire below 21 days",
    department: "People Operations",
    owner: "Ahmad Farhan",
    progressPercent: 82,
    status: "On Track",
    dueDate: "2026-12-31",
  },
  {
    id: "okr-2",
    objective: "Achieve 99.99% Cloud Infrastructure Uptime & Zero High-Severity Outages",
    department: "Software Engineering",
    owner: "Mohd Hafiz",
    progressPercent: 94,
    status: "Ahead",
    dueDate: "2026-12-31",
  },
  {
    id: "okr-3",
    objective: "Standardize Enterprise Financial Auditing & Automated Monthly Close",
    department: "Global Finance",
    owner: "Nurul Izzah",
    progressPercent: 68,
    status: "At Risk",
    dueDate: "2026-11-15",
  },
  {
    id: "okr-4",
    objective: "Ship Nexus Design System v3 with full WCAG AAA Accessibility standards",
    department: "Product & Design",
    owner: "Siti Aishah",
    progressPercent: 88,
    status: "Ahead",
    dueDate: "2026-10-31",
  },
];

export interface PerformanceAppraisal {
  id: string;
  stafId: string;
  reviewerId: string;
  cycle: string;
  rating: number; // 1 to 5
  performanceBand: "Top Performer" | "Exceeds Expectations" | "Meets Expectations" | "Needs Improvement";
  status: "Completed" | "Pending Review" | "Self-Evaluation";
  feedbackSummary: string;
}

export const performanceAppraisalsData: PerformanceAppraisal[] = [
  {
    id: "appr-1",
    stafId: "s-003",
    reviewerId: "s-002",
    cycle: "Q3 2026",
    rating: 4.8,
    performanceBand: "Top Performer",
    status: "Completed",
    feedbackSummary:
      "Exceptional rigor in corporate financial forecast models. Streamlined quarterly budget cycle across 5 departments.",
  },
  {
    id: "appr-2",
    stafId: "s-005",
    reviewerId: "s-001",
    cycle: "Q3 2026",
    rating: 4.9,
    performanceBand: "Top Performer",
    status: "Completed",
    feedbackSummary:
      "World-class design leadership. Elevated brand standards and improved team component velocity by 40%.",
  },
  {
    id: "appr-3",
    stafId: "s-006",
    reviewerId: "s-002",
    cycle: "Q3 2026",
    rating: 4.6,
    performanceBand: "Exceeds Expectations",
    status: "Completed",
    feedbackSummary:
      "Led Kubernetes cluster migration with zero downtime. Mentored junior engineers on container security.",
  },
  {
    id: "appr-4",
    stafId: "s-004",
    reviewerId: "s-002",
    cycle: "Q3 2026",
    rating: 4.4,
    performanceBand: "Exceeds Expectations",
    status: "Pending Review",
    feedbackSummary: "Excellent operations leadership. Evaluating final vendor contract negotiation metrics for Q4.",
  },
];

// ─── Company Notice Board & Announcements ─────────────────────────────────────

export interface Announcement {
  id: string;
  title: string;
  category: "Policy" | "Event" | "Benefits" | "Celebration";
  date: string;
  summary: string;
  priority: "high" | "normal";
}

export const announcementsData: Announcement[] = [
  {
    id: "ann-1",
    title: "Annual Open Benefits Enrollment Period 2027",
    category: "Benefits",
    date: "2026-09-20",
    summary: "Review and update your healthcare, dental, vision, and retirement matching elections by October 15.",
    priority: "high",
  },
  {
    id: "ann-2",
    title: "Global All-Hands Town Hall & Q3 Product Showcase",
    category: "Event",
    date: "2026-09-24",
    summary: "Join CEO and executive leadership this Thursday at 10:00 AM for our quarterly company-wide update.",
    priority: "normal",
  },
  {
    id: "ann-3",
    title: "Updated Global Flexible Work & Travel Policy",
    category: "Policy",
    date: "2026-09-12",
    summary: "NexusHR now supports up to 30 days of remote work per calendar year. Check guidelines in HR Documents.",
    priority: "normal",
  },
];

// ─── Monthly Attendance Stats (for charts) ────────────────────────────────────

export const statistikKehadiran = [
  { bulan: "Apr", hadir: 92, cuti: 5, lewat: 3 },
  { bulan: "Mei", hadir: 88, cuti: 8, lewat: 4 },
  { bulan: "Jun", hadir: 85, cuti: 10, lewat: 5 },
  { bulan: "Jul", hadir: 90, cuti: 7, lewat: 3 },
  { bulan: "Ogos", hadir: 87, cuti: 9, lewat: 4 },
  { bulan: "Sep", hadir: 89, cuti: 6, lewat: 5 },
];
