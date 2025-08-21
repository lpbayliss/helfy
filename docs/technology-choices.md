# Technology Choices

## Status
**FINALIZED** - Ready for implementation

## Backend Framework

### Primary Choice: Node.js + TypeScript + Hono
- **Rationale**: Team expertise with Node.js/TypeScript ecosystem
- **Hono**: Modern, lightweight web framework with excellent TypeScript support
- **Benefits**: Fast development, strong typing, excellent real-time capabilities
- **Trade-offs**: May need to bridge to Python for advanced ML operations

### Considerations
- ML/AI integration may require Python microservices or WASM
- Hono provides excellent performance with minimal overhead
- TypeScript ensures type safety across the stack

**Decision:** ✅ **Node.js + TypeScript + Hono**

## Database Strategy

### Dual Database Architecture
- **TimescaleDB (PostgreSQL)**: Personal health metrics, biometrics, time-series data
  - Workouts, nutrition, sleep, weight, measurements
  - Excellent analytics with time-series functions
  - Drizzle ORM for TypeScript integration
  - Docker-friendly with persistent volumes
  
- **Neo4j**: Knowledge base and relationship graphs (separate from personal data)
  - Exercise library, muscle groups, routine relationships
  - Food database, nutrition relationships
  - Future: Processed insights and correlations from personal data
  - Native graph queries for recommendations

### Data Flow Strategy
1. **Phase 1**: Separate databases - personal metrics in TimescaleDB, knowledge in Neo4j
2. **Phase 2**: Process personal metrics → generate insights → store in Neo4j graph
3. **Future**: Cross-database analytics for personalized recommendations

### ORM & Query Strategy
- **TimescaleDB**: Drizzle ORM with raw SQL for time-series analytics
- **Neo4j**: Neo4j JavaScript driver for Cypher queries
- **Type safety**: TypeScript interfaces for both database interactions

### Docker Compose Deployment
- Two containers with persistent volumes
- Independent scaling and maintenance
- Clear data boundaries and backup strategies

**Decision:** ✅ **TimescaleDB (PostgreSQL) + Neo4j** with Drizzle ORM

## Frontend Technology

### Primary Choice: Vike (React/Vue)
- **Vike**: Framework-agnostic meta-framework, less vendor lock-in than Next.js
- **TypeScript**: Consistent with backend language choice
- **Benefits**: Flexible, performant, good SSR/SPA hybrid capabilities
- **Alternative**: Next.js (more ecosystem, but higher vendor lock-in)

### Key Requirements
- Excellent data visualization libraries (D3, Chart.js, Recharts)
- Real-time updates (WebSocket support)
- PWA capabilities for offline functionality
- Strong TypeScript integration

**Decision:** ✅ **Vike + React + TypeScript** (with React Native for mobile)

## Workflow & Background Jobs

### Primary Choice: Temporal
- **Rationale**: Team expertise with Temporal workflows
- **Durable execution**: Workflows survive system restarts (crucial for home servers)
- **Complex health processing**: Multi-step data pipelines between TimescaleDB and Neo4j
- **Time-based workflows**: Perfect for health tracking (sleep cycles, program periodization)
- **TypeScript SDK**: Native integration with existing tech stack

### Key Use Cases
- Daily/weekly health analytics processing
- Long-term fitness program tracking (12+ week programs)
- Data correlation analysis across time periods
- Device sync and data validation workflows
- Scheduled backup and maintenance tasks

### Docker Integration
- Temporal server + PostgreSQL backend (shared with TimescaleDB)
- Dedicated worker processes for health data processing
- Web UI for workflow monitoring and debugging

**Decision:** ✅ **Temporal** (leveraging existing expertise)

## Infrastructure & Deployment

### Containerization & Deployment
- **Docker + Docker Compose**: Self-hosted deployment optimized for home servers
- **Multi-container architecture**: PostgreSQL, Neo4j, Temporal, Application services
- **Persistent volumes**: Reliable data persistence through restarts
- **Health monitoring**: Built-in health checks and service dependencies

### Database Architecture
- **PostgreSQL instance**: Shared for both application data and Temporal
- **Separate databases**: `helfy_app` (with TimescaleDB) and `helfy_temporal`
- **Neo4j instance**: Dedicated container for knowledge graph data

**Decision:** ✅ **Docker Compose with multi-database PostgreSQL + Neo4j**

---
*Last updated: [Date]*