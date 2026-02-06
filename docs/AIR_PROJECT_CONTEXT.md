# AIR — Project Context File

## 1. Project Overview

**Project Name:** AIR (Air Intelligence & Response)

AIR is a comprehensive environmental intelligence web platform designed to transform complex climate and environmental data into clear, visual, and actionable insights for citizens. The platform prioritizes accessibility and simplicity, enabling non-technical users to understand environmental conditions and make informed daily decisions.

The system provides multi-dimensional environmental monitoring including:
- **Air Quality Index (AQI)** - Primary indicator for air pollution
- **Temperature trends** - Climate comfort and heat risk assessment
- **Pollution levels** - Detailed pollutant tracking (PM2.5, PM10, O3, etc.)
- **Rainfall patterns** - Weather context and environmental impact
- **Health risk assessments** - Personalized health impact insights

**This document serves as the single source of truth for AI agents, developers, and contributors working on the AIR platform.**

---

## 2. Problem Statement

Climate and environmental data such as air quality, temperature trends, pollution levels, rainfall patterns, and health risks are publicly available but difficult for common citizens to understand. Data is often presented in raw numerical or scientific formats, preventing communities from interpreting risks and taking informed actions.

### Users need:

- Simple interpretation of environmental conditions
- Clear health impact explanations
- Actionable preventive recommendations
- Visual understanding instead of technical data tables
- Localized, city-level monitoring
- Community awareness and educational resources

**AIR bridges the gap between raw environmental data and public understanding, encouraging informed decision-making and community awareness.**

---

## 3. Project Goals

### Primary Goals

- Make AQI understandable for everyday users
- Visually represent air quality conditions
- Translate AQI into health impact insights
- Provide preventive recommendations based on air quality
- Deliver fast, responsive dashboards

### Secondary Goals

- Improve environmental awareness
- Enable city-level monitoring
- Create a scalable architecture for future environmental metrics

---

## 4. Target Users

- Urban citizens and families
- Students and researchers
- Health-conscious individuals
- Individuals with respiratory sensitivity
- Local communities and NGOs
- Municipal planners and environmental volunteers
- Families with children and elderly members

**Users are assumed to have no technical understanding of environmental data.**

---

## 5. Core Product Philosophy

AIR answers three primary user questions:

1. **How is the air quality right now?**
2. **What does this mean for my health?**
3. **What should I do today?**

**The platform prioritizes interpretation over raw data display.**

---

## 6. Core Features

### 6.1 Landing Page

- Clear hero section: "Understand Your Air. Protect Your Health."
- City search input as primary CTA
- Real-time AQI or climate highlight card
- Simple explanation of platform purpose
- Smooth animations and modern UI

### 6.2 Interactive Dashboard (Primary Feature)

#### Primary Elements

- Large AQI gauge or indicator
- AQI numerical value with color-coded risk indicators
- AQI category visualization (Good, Moderate, Unhealthy, Hazardous)
- Dominant pollutant identification (PM2.5, PM10, O3, NO2, SO2, CO)

#### Supporting Elements

- Temperature trends and current conditions
- Humidity and pressure readings
- Pollution level indicators
- Weather condition context
- Time filters (24 hours, 7 days, 30 days)

#### Interactive Visualizations

- Line charts for trends
- Heat maps for pollutant distribution
- Bar graphs for comparisons
- Gauge indicators for real-time data
- Hover interactions for detailed insights

#### AQI Categories

| Category | Range | Color |
|----------|-------|-------|
| Good | 0–50 | Green |
| Moderate | 51–100 | Yellow |
| Unhealthy for Sensitive Groups | 101–150 | Orange |
| Unhealthy | 151–200 | Red |
| Very Unhealthy | 201–300 | Purple |
| Hazardous | 301+ | Maroon |

### 6.3 Health Impact Translation

System converts AQI into readable insights such as:

- Safe for outdoor activities
- Sensitive groups should limit exposure
- Avoid prolonged outdoor activity

### 6.4 Preventive Actions

Dynamic recommendations:

- Reduce outdoor exposure
- Wear mask outdoors
- Keep windows closed
- Prefer indoor activities
- Hydration reminders during high temperatures

### 6.5 Historical Trends

- AQI trends for 24 hours
- 7-day trends
- 30-day trends
- Interactive charts with hover details
- Temperature and pollution correlations
- Rainfall pattern tracking

### 6.6 Community Awareness Section

- Educational content about pollution sources
- Climate tips and best practices
- Sustainable lifestyle recommendations
- Local environmental initiatives
- Community engagement resources

---

## 7. Technology Stack

### Frontend

- **Next.js** (App Router)
- React functional components
- Tailwind CSS
- Chart library (Recharts or equivalent)

### API Layer

- Next.js API Routes
- Data aggregation from external AQI APIs
- Data normalization and transformation
- Health insight generation

### Database

- **PostgreSQL**
- **Prisma ORM**

**Stored Data:**
- City metadata
- Historical AQI data
- Temperature and humidity records
- Pollution trends
- Rainfall patterns
- Processed health insights
- User preferences (optional)
- Cached dashboard data

### Caching Layer

- **Redis**

**Purpose:**
- Cache frequently requested AQI data
- Reduce external API calls
- Improve performance

### Containerization

- **Docker**

**Containers:**
- Next.js application
- PostgreSQL
- Redis

### Deployment & Cloud

- **AWS or Azure**

**Recommended Services:**
- EC2 / App Service
- RDS PostgreSQL
- Redis cache service
- CDN for static assets

---

## 8. System Architecture Overview

```
User Browser 
  ↓
Next.js Frontend 
  ↓
Next.js API Routes 
  ↓
Redis Cache Check 
  ↓
External AQI API (if cache miss) 
  ↓
PostgreSQL Storage 
  ↓
Processed Response to Client
```

**Caching strategy prioritizes recent AQI data to reduce latency.**

---

## 9. Data Flow

1. User searches for a city.
2. Frontend requests data via API route.
3. API checks Redis cache.
   - If cached → return data.
   - If not cached → fetch from external API.
4. Normalize AQI data.
5. Generate health interpretation.
6. Store in database.
7. Cache result in Redis.
8. Return structured response to frontend.

---

## 10. UI/UX Principles

- Environmental data must be visually dominant.
- Clean, data-first design approach.
- Minimal cognitive load, maximum clarity.
- Color-driven understanding with AQI color standards.
- Accessible color contrast for all users.
- Mobile-first responsive design.
- Dark and light mode support.
- Smooth transitions and animations.
- Fast loading and optimized performance.

---

## 11. Development Guidelines

- Use reusable components.
- Separate UI logic from data logic.
- Avoid exposing raw API data directly to UI.
- All AQI interpretations must be generated in API layer.
- Maintain consistent AQI color mapping across application.

---

## 12. Non-Goals (Current Scope)

- User authentication system
- Social features
- Advanced climate analytics
- Prediction models
- Multi-environment metrics beyond AQI and temperature

**These may be considered in future versions.**

---

## 13. Future Scope

- AQI and weather prediction using ML models
- Personalized health alerts and notifications
- User accounts and preference saving
- Community reporting and citizen science features
- Integration with wearable devices
- Carbon footprint tracking
- Comparative city analysis
- Environmental impact scoring
- Social sharing capabilities
- Mobile application (iOS/Android)

---

## 14. Success Criteria

The project is successful if:

- Users can understand air quality within 3 seconds of opening the dashboard.
- AQI meaning is understandable without prior knowledge.
- Users can identify recommended actions immediately.

---

**Document Version:** 1.0  
**Last Updated:** February 5, 2026  
**Status:** Active Development

---

## Quick Reference

### AQI Health Messages

| AQI Range | Health Impact | Recommendation |
|-----------|---------------|----------------|
| 0-50 | Minimal impact | Safe for all outdoor activities |
| 51-100 | Acceptable quality | Unusually sensitive people should consider limiting prolonged outdoor exertion |
| 101-150 | Unhealthy for sensitive groups | Children, elderly, and people with respiratory conditions should limit outdoor exposure |
| 151-200 | Unhealthy for everyone | Everyone should limit prolonged outdoor exertion |
| 201-300 | Very unhealthy | Avoid all outdoor activities |
| 301+ | Hazardous | Stay indoors and keep activity levels low |

### Key Technical Decisions

- **Why Next.js?** Server-side rendering for SEO and performance
- **Why Redis?** Fast caching layer to minimize API calls and improve response time
- **Why PostgreSQL?** Reliable storage for historical data and complex queries
- **Why Docker?** Consistent development and deployment environments

---

*End of Project Context File*
