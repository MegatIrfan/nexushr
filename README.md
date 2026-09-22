# NexusHR — Enterprise Workforce & Human Resource Management System

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.0-61dafb?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8?style=for-the-badge&logo=tailwindcss)
![Shadcn UI](https://img.shields.io/badge/Shadcn_UI-Radix_Nova-black?style=for-the-badge&logo=shadcnui)

**A modern, corporate-grade enterprise HRMS designed for agility, seamless workforce operations, and role-driven experiences.**

[Key Features](#key-features) • [Role-Based Access](#role-based-access-control-rbac) • [Quick Start](#getting-started) • [Tech Stack](#tech-stack)

</div>

---

## 🌟 Overview

**NexusHR** is a comprehensive workforce operations platform built with **Next.js 16 (Turbopack)**, **React 19**, **Tailwind CSS v4**, and **shadcn/ui**. Designed for enterprise organizations, it streamlines everyday personnel administration, recruitment pipelines, employee evaluations, and self-service requests into a fast, intuitive, and responsive interface.

---

## ✨ Key Features

### 👔 1. Role-Adaptive Dashboards
- **HR Executive Overview**: Headcount statistics, departmental distribution, urgent leave approvals, recruitment funnel metrics, and company-wide OKRs.
- **Supervisor Portal**: Direct report attendance, pending team leaves, quarterly appraisal reviews, and team member directory.
- **Employee Self-Service**: One-click clock-in/out, personal leave balance counters, upcoming milestone alerts, and self-document vault.

### 👥 2. Employee Directory & Profiles
- Detailed personnel profiles with authentic enterprise records, designation tags, department assignments, and contact channels.
- High-contrast, dynamic avatar initial badges for clean visual consistency.

### ⏱️ 3. Time & Attendance Management
- Real-time time clock with automatic timestamp logging and punch state management.
- Punctuality indicators, monthly attendance logs, and hours-worked summaries.

### 🌴 4. Leave Management & Approvals
- Multi-category balance tracking: Annual Leave (*Cuti Tahunan*), Sick Leave (*Cuti Sakit*), Emergency Leave (*Cuti Kecemasan*), and Maternity Leave (*Cuti Bersalin*).
- Multi-tier approval workflow allowing managers to approve or decline time-off applications in real-time with rejection feedback.

### 💼 5. Recruitment & ATS Pipeline
- Complete Applicant Tracking System (ATS) covering candidate stages:
  - *Application Review*
  - *Screening & Interview*
  - *Technical Assessment*
  - *Offer Stage* & *Hired*
- Candidate profiles with portfolio links, ratings, interview scheduling notes, and salary expectations.

### 🎯 6. Performance & Company OKRs
- Strategic objective & key results (OKRs) progress tracking with owners and target deadlines.
- Performance review cycles (Q1/Q2/Q3/Q4) with 5-star rating scores and progress distributions.

### 📁 7. HR Document Vault
- Centralized storage for offer letters, employment contracts, performance appraisal reports, and course certificates.
- Categorized download links and preview status tags.

---

## 🔐 Role-Based Access Control (RBAC)

NexusHR includes a persistent client-side authentication store with instant demo persona switching:

| Role | Email | Access Scope |
| :--- | :--- | :--- |
| **HR Administrator** | `admin@company.com` | Full platform control, workforce oversight, recruitment, OKRs, directory |
| **Supervisor / Lead** | `penyelia@company.com` | Team overview, leave approvals, direct reports, attendance monitoring |
| **Staff Member** | `staf@company.com` | Personal workspace, clock-in, leave application, personal documents |

> **Quick Login**: Use password `password` or the instant one-click login badges on `/auth/hr/login`.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (Radix Nova Primitives)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) with LocalStorage Persistence
- **Linter & Formatter**: [Biome](https://biomejs.dev/)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20.x or later
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/MegatIrfan/nexushr.git
cd nexushr
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The default root route automatically directs you straight to **NexusHR**.

### 4. Code Quality & Formatting
Run Biome to verify code formatting and linting:
```bash
npx @biomejs/biome check --write
```

---

## 📂 Project Structure

```text
src/
├── app/
│   ├── (main)/
│   │   ├── auth/hr/login/         # Dedicated HR portal login with quick persona switcher
│   │   └── dashboard/
│   │       ├── hr/                # NexusHR Module Root
│   │       │   ├── cuti/          # Leave management view
│   │       │   ├── dokumen/       # Digital document repository
│   │       │   ├── kakitangan/    # Employee directory
│   │       │   ├── kehadiran/     # Attendance & clocking view
│   │       │   ├── kelulusan/     # Leave approval manager
│   │       │   ├── performance/   # OKRs & appraisal reviews
│   │       │   ├── recruitment/   # Applicant tracking system (ATS)
│   │       │   └── _components/   # HR widgets, guards, and role dashboards
├── data/
│   └── hr-data.ts                 # Master mock datasets for personnel, leave, ATS, OKRs
├── navigation/
│   └── sidebar/sidebar-items.ts   # Dynamic role-filtered navigation config
└── stores/
    └── hr/                        # Zustand stores for HR authentication & workflows
```

---

## 📄 License

This project is created for enterprise HR management demonstrations and production dashboard deployments.
