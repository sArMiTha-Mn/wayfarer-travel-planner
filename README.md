# Wayfarer — AI Travel Itinerary Planner ✈️

A clean, modern, and responsive web application for planning personalized travel itineraries in minutes. Designed with an elegant aesthetic (warm linen sand & deep ocean teal palette), Wayfarer generates day-by-day itineraries tailored to your chosen destination, travel dates, budget style, group size, and travel pace.

---

## ✨ Features

- **Personalized Itinerary Generator**: Chronological day-by-day schedule with morning, lunch, afternoon, and evening slots.
- **Smart Destination Search**: Autocomplete search supporting curated world destinations as well as custom global cities.
- **Budget & Pace Customization**:
  - **4 Budget Tiers**: Budget, Balanced, Comfort, Luxury.
  - **3 Travel Paces**: Relaxed (2–3 stops), Balanced (3–4 stops), Packed (5–6 stops).
  - **Multi-Currency Support**: Instant conversion across USD ($), EUR (€), GBP (£), JPY (¥), INR (₹), AUD (A$), CAD (C$), SGD (S$), and CHF (CHF).
- **Curated Stays & Dining**: Tailored hotel recommendations (boutique, hotel, luxury, hostel) and authentic regional culinary spots with signature dishes.
- **Trip Expense Breakdown**: Visual breakdown for Accommodation, Food & Dining, Sights & Activities, Transport, and Buffer.
- **Saved Trips Dashboard**: Local and backend persistence to browse, duplicate, edit, and manage planned itineraries.
- **Print & PDF Export**: Clean `@media print` styling to print or save your itinerary as an offline travel booklet.
- **Interactive Checklist**: Mark activities as visited/completed in real time on mobile or desktop.
- **Zero Secrets / API Keys Required**: Built-in intelligent generation engine creates realistic plans offline without requiring paid third-party API subscriptions.

---

## 🛠️ Architecture & Tech Stack

- **Frontend**:
  - [React 19](https://react.dev/) — Declarative user interface components.
  - [Vite](https://vitejs.dev/) — Ultra-fast frontend development and build tooling.
  - [Tailwind CSS v4](https://tailwindcss.com/) — Modern, responsive utility-first design.
  - [Lucide React](https://lucide.dev/) — Clean travel, navigation, and UI iconography.
- **Backend**:
  - [Node.js](https://nodejs.org/) & [Express 5](https://expressjs.com/) — RESTful API for destinations, itinerary generation, and persistent trip storage.
  - [CORS](https://github.com/expressjs/cors) & [Dotenv](https://github.com/motdotla/dotenv) — Cross-origin requests and safe environment variable handling.
  - **JSON Storage**: `server/data/trips.json` persists your trips locally without complex database setups.

---

## 🚀 Running the Project Locally

### 1. Prerequisites
- **Node.js** (v18 or higher recommended, verified on v24)
- **Git**

### 2. Install Dependencies
If not already installed, open your terminal (PowerShell or Command Prompt) in the project root folder:
```powershell
npm.cmd install
```
*(On macOS or Linux, run `npm install`)*

### 3. Start the Development Server
Run the unified development command:
```powershell
npm.cmd run dev
```

This starts:
- 📡 **Backend API Server**: `http://localhost:5000`
- 💻 **Frontend Web App**: `http://localhost:5173`

Open your browser and navigate to:
```
http://localhost:5173
```

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm.cmd run dev` | Runs both the Express API and Vite frontend concurrently |
| `npm.cmd run client` | Runs only the Vite frontend development server |
| `npm.cmd run server` | Runs only the Node.js Express backend server |
| `npm.cmd run build` | Builds the optimized production frontend bundle to `dist/` |
| `npm.cmd run preview`| Previews the production build locally |

---

## 🔐 Environment Variables & Security

A `.env.example` file is included in the repository.

1. Create your local `.env` file (never commit this to GitHub):
   ```powershell
   Copy-Item .env.example .env
   ```
2. The `.env` file is already listed in `.gitignore` to ensure your sensitive variables and environment configs remain strictly private on your computer.

---

## 🐙 Step-by-Step: Uploading to Your Own GitHub Repository

When you are ready to upload this project to your GitHub account:

### Step 1: Create a New Repository on GitHub
1. Go to [github.com/new](https://github.com/new).
2. Repository name: `wayfarer-travel-planner` (or any name you prefer).
3. Visibility: Choose **Public** or **Private**.
4. **Leave unchecked**: "Add a README file", "Add .gitignore", and "Choose a license" (we already created these for you).
5. Click **Create repository**.
6. Copy the repository URL (e.g., `https://github.com/your-username/wayfarer-travel-planner.git`).

### Step 2: Initialize Git and Commit
Open PowerShell in `C:\Users\asus\Downloads\Wayfarer` and run:

```powershell
# 1. Initialize git
git init

# 2. Add all project files
git add .

# 3. Create your initial commit
git commit -m "feat: initial release of Wayfarer AI Travel Planner"

# 4. Set default branch to main
git branch -M main

# 5. Link your GitHub repository (replace with your actual GitHub URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git

# 6. Push to GitHub
git push -u origin main
```

---

## 📄 License
MIT License. Built for seamless travel planning.
