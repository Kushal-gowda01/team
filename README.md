# AIR - Air Intelligence & Response

> Transform complex air quality data into clear, visual, and actionable insights

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat&logo=redis&logoColor=white)](https://redis.io/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)

## 📋 Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Docker Setup](#docker-setup)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

## 🌍 Overview

**AIR (Air Intelligence & Response)** is a comprehensive environmental intelligence web platform designed to transform complex climate and environmental data into clear, visual, and actionable insights for citizens. The platform prioritizes accessibility and simplicity, enabling non-technical users to understand environmental conditions and make informed daily decisions.

The system provides multi-dimensional environmental monitoring:
- **Air Quality Index (AQI)** - Primary air pollution indicator
- **Temperature trends** - Climate comfort and heat risk
- **Pollution levels** - Detailed pollutant tracking (PM2.5, PM10, O3, NO2, SO2, CO)
- **Rainfall patterns** - Weather context and impact
- **Health risk assessments** - Personalized health insights

## ❓ Problem Statement

Climate and environmental data such as air quality, temperature trends, pollution levels, rainfall patterns, and health risks are publicly available but difficult for common citizens to understand. Data is often presented in raw numerical or scientific formats, preventing communities from interpreting risks and taking informed actions.

**AIR bridges the gap between raw environmental data and public understanding** by providing:

- Simple interpretation of environmental conditions
- Clear health impact explanations
- Actionable preventive recommendations
- Visual understanding instead of technical data tables
- City-level environmental monitoring
- Community awareness and education

## ✨ Features

### Core Features

- **Real-Time Environmental Monitoring**: Live air quality, temperature, and pollution data
- **Interactive Visual Dashboard**: Color-coded gauges, charts, and heat maps
- **Health Impact Translation**: Converts data into readable health insights
- **Smart Recommendations**: Dynamic, actionable advice based on conditions
- **Comprehensive Pollutant Tracking**: PM2.5, PM10, O3, NO2, SO2, CO monitoring
- **Historical Trends**: 24-hour, 7-day, and 30-day visualizations
- **Multi-Factor Analysis**: Temperature, humidity, rainfall context
- **Community Awareness**: Educational content and sustainability tips
- **Mobile-First Design**: Responsive across all devices
- **Dark/Light Mode**: Accessibility-friendly color schemes

### AQI Categories

| AQI Range | Category | Health Impact |
|-----------|----------|---------------|
| 0-50 | Good | Safe for all outdoor activities |
| 51-100 | Moderate | Acceptable for most people |
| 101-150 | Unhealthy for Sensitive Groups | Limit outdoor exposure for sensitive groups |
| 151-200 | Unhealthy | Everyone should limit outdoor exertion |
| 201-300 | Very Unhealthy | Avoid all outdoor activities |
| 301+ | Hazardous | Stay indoors, emergency conditions |

## 🛠 Technology Stack

### Frontend
- **Next.js 14** (App Router)
- **React 18** (Functional Components)
- **TypeScript** (Strict Mode)
- **Tailwind CSS** (Styling)
- **Recharts** (Data Visualization)

### Backend
- **Next.js API Routes** (RESTful API)
- **Node.js 18+**

### Database
- **PostgreSQL 16** (Primary Database)
- **Prisma ORM** (Database Client)

### Caching
- **Redis 7** (In-Memory Cache)

### DevOps
- **Docker & Docker Compose** (Containerization)
- **Git** (Version Control)

### Deployment Ready
- **AWS** (EC2, RDS, ElastiCache)
- **Azure** (App Service, PostgreSQL, Redis Cache)

## 🏗 Architecture

```
┌─────────────┐
│   Client    │
│  (Browser)  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Next.js    │
│  Frontend   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Next.js    │
│ API Routes  │
└──────┬──────┘
       │
       ├────────────┐
       ▼            ▼
┌──────────┐  ┌──────────┐
│  Redis   │  │External  │
│  Cache   │  │AQI API   │
└────┬─────┘  └────┬─────┘
     │             │
     └──────┬──────┘
            ▼
     ┌──────────┐
     │PostgreSQL│
     │ Database │
     └──────────┘
```

### Data Flow

1. User requests AQI data for a city
2. Frontend sends request to API route
3. API checks Redis cache
   - **Cache Hit**: Return cached data
   - **Cache Miss**: Fetch from external API
4. Normalize and process AQI data
5. Generate health interpretations
6. Store in PostgreSQL
7. Cache result in Redis
8. Return enriched response to client

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.0.0 or higher
- **npm** 9.0.0 or higher
- **Docker** (optional, recommended)
- **PostgreSQL** 16+ (if not using Docker)
- **Redis** 7+ (if not using Docker)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/air-platform.git
cd air-platform
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env
```

Edit `.env` with your configuration (see [Environment Variables](#environment-variables))

4. **Generate Prisma Client**

```bash
npm run prisma:generate
```

5. **Run database migrations**

```bash
npm run prisma:migrate
```

6. **Start development server**

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# Application
NEXT_PUBLIC_APP_NAME=AIR
NODE_ENV=development

# Database
DATABASE_URL="postgresql://air_user:air_password@localhost:5432/air_db?schema=public"

# Redis
REDIS_URL="redis://localhost:6379"
REDIS_PASSWORD=
REDIS_CACHE_TTL=3600

# External AQI API
AQI_API_KEY=your_api_key_here
AQI_API_BASE_URL=https://api.waqi.info/feed

# Cache Settings
CACHE_ENABLED=true
CACHE_DEFAULT_TTL=3600

# API Rate Limiting
API_RATE_LIMIT=100
API_RATE_WINDOW=900000
```

### Getting an AQI API Key

AIR uses the World Air Quality Index (WAQI) API. Get your free API key at:
👉 [https://aqicn.org/data-platform/token/](https://aqicn.org/data-platform/token/)

## 💻 Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server

# Build
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio

# Docker
npm run docker:up        # Start all containers
npm run docker:down      # Stop all containers
npm run docker:build     # Rebuild containers

# Type Checking
npm run type-check       # Run TypeScript compiler check

# Linting
npm run lint             # Run ESLint
```

### Development Workflow

1. Start Docker services (PostgreSQL + Redis):
   ```bash
   npm run docker:up
   ```

2. Run database migrations:
   ```bash
   npm run prisma:migrate
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Make your changes and test

5. Run type checking:
   ```bash
   npm run type-check
   ```

## 🐳 Docker Setup

### Using Docker Compose (Recommended)

Docker Compose sets up the entire stack with one command:

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose up -d --build
```

The stack includes:
- **Next.js Application** (Port 3000)
- **PostgreSQL Database** (Port 5432)
- **Redis Cache** (Port 6379)

### Docker Services

| Service | Port | Description |
|---------|------|-------------|
| app | 3000 | Next.js Application |
| postgres | 5432 | PostgreSQL Database |
| redis | 6379 | Redis Cache |

### Production Docker Build

```bash
# Build production image
docker build -t air-platform:latest .

# Run production container
docker run -p 3000:3000 --env-file .env air-platform:latest
```

## 📡 API Documentation

### Base URL

```
http://localhost:3000/api
```

### Endpoints

#### Get AQI Data

**GET** `/api/aqi`

Query Parameters:
- `city` (string): City name (e.g., "London")
- OR
- `lat` (number): Latitude
- `lon` (number): Longitude

**Response:**
```json
{
  "success": true,
  "data": {
    "aqi": 42,
    "category": "Good",
    "categoryCode": "good",
    "color": "#00E400",
    "dominantPollutant": "PM2.5",
    "pollutants": {
      "pm25": 10.5,
      "pm10": 20.3
    },
    "temperature": 22,
    "healthImpact": "Air quality is satisfactory...",
    "recommendation": "Perfect day for outdoor activities...",
    "preventiveActions": ["Enjoy outdoor activities"],
    "timestamp": "2026-02-05T10:30:00Z"
  },
  "timestamp": "2026-02-05T10:30:00Z"
}
```

#### Get Historical AQI

**GET** `/api/aqi/history`

Query Parameters:
- `city` (string, required): City name
- `hours` (number, optional): Hours of history (default: 24, max: 720)

**Response:**
```json
{
  "success": true,
  "data": {
    "cityName": "London",
    "period": {
      "start": "2026-02-04T10:30:00Z",
      "end": "2026-02-05T10:30:00Z",
      "hours": 24
    },
    "data": [
      {
        "timestamp": "2026-02-04T10:30:00Z",
        "aqi": 45,
        "category": "good"
      }
    ],
    "summary": {
      "average": 42,
      "min": 35,
      "max": 52,
      "trend": "stable"
    }
  }
}
```

#### Get Health Interpretation

**POST** `/api/health`

Request Body:
```json
{
  "aqi": 150,
  "temperature": 28
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "healthImpact": "Members of sensitive groups may experience health effects...",
    "recommendation": "Sensitive groups should limit prolonged outdoor exertion...",
    "sensitiveGroups": ["Children", "Elderly"],
    "preventiveActions": [
      "Limit outdoor exposure",
      "Close windows during peak hours"
    ],
    "activities": {
      "outdoor": "limited",
      "indoor": "normal",
      "exercise": "limited"
    }
  }
}
```

## 📁 Project Structure

```
air-platform/
├── app/                      # Next.js App Router
│   ├── api/                  # API Routes
│   │   ├── aqi/
│   │   │   ├── route.ts      # AQI endpoint
│   │   │   └── history/
│   │   │       └── route.ts  # Historical data
│   │   └── health/
│   │       └── route.ts      # Health interpretation
│   ├── dashboard/
│   │   └── page.tsx          # Dashboard page
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Landing page
│
├── components/               # React components
│   ├── aqi/                  # AQI-specific components
│   │   ├── AQIGauge.tsx
│   │   └── AQICategoryBadge.tsx
│   ├── charts/               # Chart components
│   ├── layout/               # Layout components
│   └── ui/                   # Reusable UI components
│
├── lib/                      # Core utilities
│   ├── aqi-utils.ts          # AQI calculations
│   ├── api-client.ts         # External API client
│   ├── db.ts                 # Prisma client
│   ├── health-utils.ts       # Health interpretations
│   ├── redis.ts              # Redis client
│   └── utils.ts              # General utilities
│
├── services/                 # Business logic
│   ├── aqi-service.ts        # AQI service layer
│   └── cache-service.ts      # Cache management
│
├── types/                    # TypeScript types
│   ├── aqi.ts                # AQI types
│   └── api.ts                # API types
│
├── prisma/
│   └── schema.prisma         # Database schema
│
├── styles/
│   └── globals.css           # Global styles
│
├── docs/
│   └── AIR_PROJECT_CONTEXT.md # Project documentation
│
├── docker-compose.yml        # Docker services
├── Dockerfile                # Production Docker image
├── .env.example              # Environment template
├── .gitignore                # Git ignore rules
├── next.config.js            # Next.js configuration
├── package.json              # Dependencies
├── postcss.config.js         # PostCSS config
├── tailwind.config.ts        # Tailwind config
├── tsconfig.json             # TypeScript config
└── README.md                 # This file
```

## 🎯 Core Principles

### Separation of Concerns

- **UI Components**: Pure presentation, no business logic
- **API Routes**: Data transformation and orchestration
- **Services**: Business logic and external integrations
- **Utilities**: Reusable calculations and helpers

### AQI Priority Rule

- AQI is always the primary data point
- Temperature and other metrics are secondary/supporting

### Data Flow Rule

All data follows: `Frontend → API → Cache → External API → DB → Cache → Response`

### No Raw Data Rule

Raw API responses are never sent directly to the frontend. All data is:
1. Validated
2. Normalized
3. Enriched with health interpretations
4. Formatted for client consumption

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Use TypeScript strict mode
- Follow existing code structure
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [World Air Quality Index](https://waqi.info/) for AQI data
- [Next.js](https://nextjs.org/) team for the amazing framework
- All contributors and supporters of this project

## 📞 Support

For questions and support:
- Open an [issue](https://github.com/yourusername/air-platform/issues)
- Review the [Project Context Document](docs/AIR_PROJECT_CONTEXT.md)

---

**Made with ❤️ for a healthier planet**
