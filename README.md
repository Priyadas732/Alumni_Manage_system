# LegacyBridge

Welcome to LegacyBridge! The project has been restructured into a monorepo containing distinct directories for frontend and backend logic.

## Directory Structure

```text
legacybridge/
├── backend/            # Express.js backend & Prisma schema/database configuration
├── frontend/           # React + Vite frontend application & assets
├── package.json        # Root package.json defining npm workspaces
└── README.md           # Project documentation (this file)
```

---

## Getting Started

### 1. Installation

To install dependencies for both the frontend and backend, run npm install at the root level:

```bash
npm install
```

### 2. Running the Applications

You can start the applications either from the root directory using the root workspaces scripts, or by navigating into the respective folders.

#### Starting from the Root Directory

- **Run Frontend (Vite dev server):**
  ```bash
  npm run dev
  # or: npm run dev:frontend
  ```
- **Run Backend (Express server):**
  ```bash
  npm run start:backend
  ```

#### Starting from Respective Folders

- **Frontend:**
  ```bash
  cd frontend
  npm run dev
  ```
- **Backend:**
  ```bash
  cd backend
  npm start
  ```

---

## Technologies Used

- **Frontend:** React, Vite, TailwindCSS, ESLint
- **Backend:** Express.js, Prisma (PostgreSQL database ORM)
