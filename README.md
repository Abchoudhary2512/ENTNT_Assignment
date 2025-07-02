# ENTNT Dental Center Management System

A modern, responsive dental clinic management system built with React, Vite, and Material-UI.  
It supports both Admin and Patient roles, providing dashboards, appointment management, patient records, and secure authentication.

## Features

- **Role-based Dashboards:** Separate views for Admins and Patients.
- **Authentication:** Secure login with context-based state management.
- **Patient Management:** View, manage, and search patient records (Admin).
- **Appointment Management:** Schedule, view, and manage appointments (Admin).
- **Calendar Integration:** Visualize appointments in a calendar view (Admin).
- **Treatment History:** Patients can view their completed treatments, download, and preview attached files.
- **Responsive UI:** Fully responsive and modern design using Material-UI.
- **File Handling:** Download and preview treatment-related files (images, PDFs, etc.).

## Login Credentials (Demo)
### Use the following credentials to log in as an Admin or Patient for testing/demo purposes:
### Admin
   - Email: admin@entnt.in
   - Password: admin123
### Patient
   - Email: patient1@entnt.in
   - Password: patient123

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Abchoudhary2512/ENTNT_Assignment
   cd ENTNT_Assignment
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Visit [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal).

## Project Structure

```
src/
  assets/             # Images and static assets
  components/
    admin/            # Admin-specific components
    auth/             # Authentication (Login)
    dashboard/        # Dashboard components
    patient/          # Patient-specific components
  contexts/           # React Contexts (e.g., AuthContext)
  utils/              # Utility functions (e.g., dataService.js)
  App.jsx             # Main app component
  main.jsx            # Entry point
```

### Known Issues or Limitations
- Mock Data Only: The application currently uses mock data and does not connect to a real backend or database.
- No Real Authentication: Login is handled in-memory and is not secure for production use.
- File Handling: File preview and download rely on base64 data; large files or unsupported formats may not work as expected.
- No Email/Notification System: Appointment reminders and notifications are not implemented.
- No API Integration: All data operations are local; integration with real APIs will require additional work.

### Technical Decisions
 - React + Vite: Chosen for fast development, hot module replacement, and modern tooling.
 - Material-UI (MUI): Used for rapid UI development and consistent, responsive design.
 - Context API: Used for authentication state management to keep the app simple and avoid Redux.
 - Component Structure: Organized by feature (admin, patient, dashboard, auth) for scalability and clarity.
 - Mock Data Service: All data is served from src/utils/dataService.js to simplify development and testing.
