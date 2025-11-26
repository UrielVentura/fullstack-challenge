# Fullstack Challenge - Complete Project

## 🎯 Project Overview

A complete full-stack application for processing and visualizing CSV file data. Built with modern technologies and fully tested.

**Status**: ✅ **COMPLETE** - All requirements met including Docker support

---

## 📊 Project Statistics

### Tech Stack

- **Backend**: Node.js + Express.js
- **Frontend**: React 18 + Redux
- **Testing**: Mocha + Chai (backend), Jest + React Testing Library (frontend)
- **Containerization**: Docker + Docker Compose

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm 9+
- Docker & Docker Compose (optional, for containerized setup)

### Option 1: Docker (Recommended)

```bash
# Clone and navigate
cd fullstack-challenge

# Start all services
docker-compose up

# Services will be available at:
# - Frontend: http://localhost:3001
# - Backend: http://localhost:3000
```

### Option 2: Local Development

```bash
# Backend
cd backend
npm install
npm start

# Frontend (new terminal)
cd frontend
npm install
npm start

# Services will be available at:
# - Frontend: http://localhost:3001
# - Backend: http://localhost:3000
```

---

## 📁 Project Structure

```
fullstack-challenge/
├── docker-compose.yml                  # Docker orchestration
├── PROJECT_README.md                   # Complete project documentation
│
├── backend/
│   ├── Dockerfile                      # Backend container (Node.js Alpine)
│   ├── .dockerignore                   # Docker build exclusions
│   ├── package.json                    # Backend dependencies
│   ├── src/
│   │   ├── index.js                    # Server entry point
│   │   ├── app.js                      # Express application setup
│   │   ├── config/                     # Configuration files
│   │   ├── constants/                  # Application constants
│   │   ├── controllers/                # Request handlers
│   │   ├── routes/                     # API route definitions
│   │   ├── services/                   # Business logic
│   │   └── middlewares/                # Express middlewares
│   └── test/
│       ├── unit/                       # Unit tests
│       │   ├── services/               # Service tests
│       │   └── controllers/            # Controller tests
│       └── integration/                # Integration tests
│           └── routes/                 # API endpoint tests
│
└── frontend/
    ├── Dockerfile                      # Frontend container (Nginx multi-stage)
    ├── .dockerignore                   # Docker build exclusions
    ├── nginx.conf                      # Nginx SPA routing configuration
    ├── package.json                    # Frontend dependencies
    ├── public/
    │   ├── index.html                  # HTML entry point
    │   └── favicon.ico                 # Browser favicon
    ├── src/
    │   ├── index.js                    # React entry point
    │   ├── App.js                      # Root React component
    │   ├── components/                 # React components
    │   ├── redux/                      # Redux store, actions, reducers
    │   │   ├── store.js                # Redux store configuration
    │   │   ├── actionTypes.js          # Action type constants
    │   │   ├── actions.js              # Action creators & thunks
    │   │   ├── reducers.js             # Reducer logic
    │   │   └── __tests__/              # Redux tests
    │   ├── services/                   # API client services
    │   ├── config/                     # Frontend configuration
    │   ├── __tests__/                  # Component & integration tests
    │   └── setupTests.js               # Jest test setup
    └── __mocks__/                      # Jest module mocks
        └── styleMock.js                # CSS module mock
```

---

## 🎨 Features

### Backend API

#### Endpoints

| Method | Route         | Description             |
| ------ | ------------- | ----------------------- |
| GET    | `/health`     | Health check            |
| GET    | `/files/list` | Get available files     |
| GET    | `/files/data` | Get processed file data |

#### Features

- ✅ CSV file processing and validation
- ✅ External API integration
- ✅ Error handling & logging
- ✅ Middleware for async operations
- ✅ CORS enabled

### Frontend Application

#### Components

- ✅ File Filter (dropdown selector)
- ✅ Data Table (displays CSV data)
- ✅ Loading states
- ✅ Error handling
- ✅ Responsive Bootstrap UI

#### State Management

- ✅ Redux 4 state management (classic setup)
- ✅ Redux Thunk for async actions
- ✅ Action types & creators pattern
- ✅ Error state tracking

---

## 🧪 Testing

### Backend Tests (64 tests)

```bash
cd backend
npm test
```

**Coverage:**

- Services: Async operations, API calls, CSV validation
- Controllers: Request handling, response formatting
- Routes: Integration tests with HTTP assertions

### Frontend Tests (71 tests)

```bash
cd frontend
npm test
```

**Coverage:**

- Redux: Reducers, actions, async thunks
- Components: Rendering, props, events
- Integration: App + Redux + Components
- Services: API client methods

### Run All Tests

```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test
```

---

## 🐳 Docker Setup

### Quick Start with Docker

```bash
# Start all services
docker-compose up

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Docker Details

**Backend Container**

- Image: `node:18-alpine`
- Port: 3000
- Health check: `/health` endpoint
- Restart policy: unless-stopped

**Frontend Container**

- Image: `nginx:alpine` (multi-stage build)
- Port: 3001
- Health check: HTTP GET to `/health`
- Restart policy: unless-stopped
- Gzip compression enabled

See the Docker Compose configuration above for more details.

---

## 📚 Documentation

### Testing Commands

**Backend:**

```bash
cd backend
npm test              # Run all tests (64 tests)
npm test -- --watch  # Watch mode
npm test -- --grep   # Filter by pattern
```

**Frontend:**

```bash
cd frontend
npm test              # Run all tests (71 tests)
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report
```

---

## 🛠️ Technology Stack

### Backend

- **Runtime**: Node.js 18
- **Framework**: Express.js 4
- **HTTP Client**: Axios 1.6
- **CSV Parser**: csv-parse 5
- **Async Handling**: Async/await with Express middleware

### Frontend

- **Library**: React 18
- **State**: Redux 4 + Redux Thunk
- **UI Framework**: React Bootstrap 2
- **HTTP**: Axios 1.6
- **Build**: Webpack 5

### Testing

- **Backend**: Mocha + Chai + Sinon + Nock
- **Frontend**: Jest + React Testing Library
- **Mocking**: redux-mock-store

### DevOps

- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Web Server**: Nginx (frontend)

---

## ✨ Project Highlights

1. **Complete Test Suite**: 135 tests covering all layers
2. **Modern Stack**: React 18, Redux 4 + Thunk, Node.js 18, Express.js
3. **Production Ready**: Docker, error handling, validation
4. **Well Documented**: Comprehensive guides for setup and testing
5. **Best Practices**: Clean code, separation of concerns, proper testing
6. **Containerized**: Docker Compose for easy deployment

---

## 🎉 Summary

This is a **complete, production-ready fullstack application** with:

- ✅ Working frontend and backend
- ✅ Comprehensive test coverage
- ✅ Docker containerization
- ✅ Detailed documentation
- ✅ Error handling and validation
- ✅ Modern development practices

**Ready to deploy!** 🚀

---

## License

MIT

---
