# Dashboard Project

## Overview
This project is a **React** dashboard built with **Vite** for visualizing processed data. It connects to the FastAPI backend and provides interactive charts and insights.

## Installation

### Using npm
```bash
npm install
```

### Using Yarn
```bash
yarn install
```

## Running the Dashboard

### Using npm
```bash
npm run dev
```

### Using Yarn
```bash
yarn dev
```

## Project Structure
```
dashboard/
├── public/               # Static assets
├── src/                  # Source code
│   ├── assets/           # Images and static assets
│   ├── components/       # Reusable UI components
│   ├── controllers/      # API request handlers
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions and helpers
│   ├── App.tsx           # Main React component
│   ├── index.css         # Global styles
│   ├── main.tsx          # Entry point
│   ├── vite-env.d.ts     # TypeScript environment types
├── .gitignore            # Git ignored files
├── components.json       # Component metadata
├── eslint.config.js      # ESLint configuration
├── index.html            # Main HTML file
├── package.json          # Package dependencies
├── package-lock.json     # Lock file for dependencies
├── vite.config.js        # Vite configuration file
```

## Building for Production

### Using npm
```bash
npm run build
```

### Using Yarn
```bash
yarn build
```

## Deploying
The built dashboard can be deployed on any static hosting service such as **Vercel**, **Netlify**, or **GitHub Pages**.
