# SPC I4.0 - Manufacturing Statistical Process Control System

## Overview
SPC I4.0 is a modern, database-agnostic Statistical Process Control (SPC) system designed for manufacturing environments. It provides a robust platform for connecting to existing manufacturing databases (MSSQL 2008 R2+, PostgreSQL), analyzing process data, and visualizing statistical control charts (Cp, Cpk, etc.) in real-time.

## Project Goals
-   **Database Agnostic**: Seamlessly connect to legacy MSSQL and modern PostgreSQL/TimescaleDB data sources without altering the underlying manufacturing systems.
-   **Statistical rigor**: Perform server-side statistical calculations (Mean, StdDev, Cpk, Ppk) using the powerful Python scientific stack (`pandas`, `numpy`, `scipy`).
-   **Modern User Experience**: Provide a responsive, high-performance Single Page Application (SPA) using React and Vite, replacing legacy desktop-based SPC tools.
-   **Security & Audit**: detailed role-based access control (RBAC) and comprehensive audit logging for all configuration changes.
-   **Industry 4.0 Ready**: Built with API-first design (Django REST Framework) to integrate with other I4.0 systems.

## Tech Stack

### Backend
-   **Framework**: Django 5.x + Django REST Framework (DRF)
-   **Language**: Python 3.12+
-   **Data Processing**: Pandas, NumPy
-   **Database Drivers**: `pyodbc` (MSSQL), `psycopg2` (PostgreSQL)
-   **Authentication**: Token-based Auth

### Frontend
-   **Framework**: React 18 + Vite
-   **Language**: TypeScript
-   **Styling**: CSS Modules (Vanilla CSS variables)
-   **Icons**: Lucide React
-   **Networking**: Axios

## Getting Started

### Prerequisites
-   Python 3.10+
-   Node.js 18+
-   MSSQL ODBC Driver 17 (for MSSQL connections)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/soitgoes511/SPC_project.git
    cd SPC_project
    ```

2.  **Backend Setup**
    ```bash
    cd server
    python -m venv venv
    ./venv/Scripts/activate  # or source venv/bin/activate on Linux
    pip install -r requirements.txt
    python manage.py migrate
    python manage.py runserver 0.0.0.0:8000
    ```

3.  **Frontend Setup**
    ```bash
    cd client
    npm install
    npm run dev
    ```

## Usage
1.  Access the frontend at `http://localhost:5173`.
2.  Register a new account (default role: Read Only).
3.  Access the Django Admin at `http://localhost:8000/admin` (Superuser required) to manage users.
4.  Navigate to **Data Sources** on the frontend to connect your manufacturing database.
5.  Create **SPC Charts** to visualize your process data.
