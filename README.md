# SmartCut Builder v1.0

> AI-powered precision woodworking design tool for custom furniture and cabinetry

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

## 🎯 Mission

Empower woodworkers, hobbyists, and professional carpenters to design and build custom furniture and cabinetry with precision, ease, and AI-driven guidance. SmartCut Builder reduces mistakes, optimizes material usage, and provides step-by-step instructions while allowing optional custom design enhancements.

## ✨ Key Features

### Current (MVP - In Development)

- 📐 **Precision Calculator** - Cabinet & carcass builder with drawer/door sizing
- 🤖 **AI Smart Defaults** - Intelligent design suggestions and error prevention
- 📋 **Cut Lists** - Automated PDF/CSV generation with material optimization
- 🔧 **Tool-Aware Guidance** - Instructions adapted to your workshop profile
- 📚 **Material Library** - Comprehensive database of wood types and hardware

### Coming Soon (V2)

- 🎨 **3D Preview** - Interactive visualization with Three.js
- 📊 **Cut Sheet Optimizer** - Minimize waste and material costs
- 📤 **CAD Export** - DXF and SketchUp file generation
- 🎯 **Hardware Diagrams** - Visual joinery and assembly guides

### Future (V3+)

- 🥽 **AR Room Preview** - See your design in your space
- 🏪 **Template Marketplace** - Share and download community designs
- 💰 **Cost Estimation** - Real-time material and hardware pricing
- 🎤 **Voice Assistant** - Hands-free build guidance

## 🏗️ Tech Stack

### Frontend

- **Framework:** Vue 3 (Composition API)
- **Language:** TypeScript
- **Build Tool:** Vite
- **State Management:** Pinia
- **3D Rendering:** Three.js
- **Styling:** TailwindCSS + shadcn/ui

### Backend

- **Runtime:** Node.js 20
- **Framework:** Express
- **Language:** TypeScript
- **Database:** MongoDB Atlas
- **AI:** OpenAI GPT-4
- **File Storage:** AWS S3 / GridFS

### DevOps

- **Containerization:** Docker + Docker Compose
- **CI/CD:** GitHub Actions
- **Testing:** Jest + Vue Test Utils + Supertest
- **Code Quality:** ESLint + Prettier

## 📚 Documentation

Comprehensive documentation is available in the [`planning-docs/`](./planning-docs) directory:

- **[OVERVIEW.md](./planning-docs/OVERVIEW.md)** - Project mission and scope
- **[TECHNICAL_ARCHITECTURE.md](./planning-docs/TECHNICAL_ARCHITECTURE.md)** - System design and API structure
- **[SCHEMA.md](./planning-docs/SCHEMA.md)** - JSON schema for project documents
- **[BUILD_RULES.md](./planning-docs/BUILD_RULES.md)** - Cabinet building rules and clearances
- **[ROADMAP.md](./planning-docs/ROADMAP.md)** - Feature roadmap and timeline
- **[IMPLEMENTATION_PLAN.md](./planning-docs/IMPLEMENTATION_PLAN.md)** - Sprint planning and team roles
- **[CODING_STANDARDS.md](./planning-docs/CODING_STANDARDS.md)** - Code style and conventions
- **[DEVELOPMENT_SETUP.md](./planning-docs/DEVELOPMENT_SETUP.md)** - Setup and configuration guide

## 🚀 Quick Start

### Prerequisites

- Node.js >= 20.0.0
- npm >= 10.0.0 or yarn
- MongoDB (local or Atlas)
- Docker & Docker Compose (optional but recommended)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/smartcut-builder.git
   cd smartcut-builder
   ```

2. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Using Docker Compose (Recommended)**

   ```bash
   docker-compose up
   ```

   The application will be available at:

   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

4. **Manual Setup**

   ```bash
   # Install backend dependencies
   cd backend
   npm install
   npm run dev

   # In a new terminal, install frontend dependencies
   cd frontend
   npm install
   npm run dev
   ```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📦 Building for Production

```bash
# Build backend
cd backend
npm run build

# Build frontend
cd frontend
npm run build
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow our [coding standards](./planning-docs/CODING_STANDARDS.md)
4. Commit your changes using [conventional commits](https://www.conventionalcommits.org/)
5. Push to your branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Commit Message Format

```
feat: add new feature
fix: resolve bug in calculator
docs: update API documentation
style: format code with prettier
refactor: restructure component hierarchy
test: add unit tests for rule engine
chore: update dependencies
```

## 📋 Project Structure

```
smartcut-builder/
├── backend/                 # Express API server
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # MongoDB models
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Express middleware
│   │   └── utils/          # Helper functions
│   └── tests/              # Backend tests
├── frontend/               # Vue 3 application
│   ├── src/
│   │   ├── components/     # Vue components
│   │   ├── views/          # Page views
│   │   ├── stores/         # Pinia stores
│   │   ├── services/       # API services
│   │   └── utils/          # Helper functions
│   └── tests/              # Frontend tests
├── planning-docs/          # Project documentation
└── docker-compose.yml      # Docker configuration
```

## 🗺️ Roadmap

### MVP (Nov 2024 – May 2025)

- ✅ Project setup and infrastructure
- 🔄 Core box geometry engine
- 🔄 AI smart defaults and wizard
- 🔄 PDF/CSV cut list generation

### V2 (May 2025 – Nov 2025)

- 📅 3D preview with Three.js
- 📅 Cut sheet optimizer
- 📅 DXF/SketchUp export

### V3 (Nov 2025 – Nov 2026)

- 📅 AR room preview
- 📅 Template marketplace
- 📅 Voice-guided assistant

See the full [roadmap](./planning-docs/ROADMAP.md) for detailed milestones.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for GPT-4 API
- Three.js community for 3D rendering capabilities
- Vue.js team for the amazing framework
- All contributors and woodworking enthusiasts who provide feedback

## 📞 Contact & Support

- **Issues:** [GitHub Issues](https://github.com/yourusername/smartcut-builder/issues)
- **Discussions:** [GitHub Discussions](https://github.com/yourusername/smartcut-builder/discussions)
- **Email:** support@smartcutbuilder.com

---

**Built with ❤️ for woodworkers, by woodworkers**
