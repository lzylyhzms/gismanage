# GIS-Manage: Spatial Intelligence & Satellite Resource Management Console

<div align="center">
  <p><b>Enterprise Visual Management and Monitoring Platform for D:\AFinal\gis-base</b></p>
  <p>Built with Vue 3 + TypeScript + Vite + Ant Design Vue + Vben Admin v5</p>
</div>

---

## 📖 Introduction

`gis-manage` is a comprehensive frontend management and monitoring platform tailored for the `gis-base` backend system (Spring Boot 3 + PostGIS + Netty + AI Agent). It covers **System Health Monitoring**, **GIS Map & Layer Services**, **Netty Multi-Protocol Sockets**, **AI & Agent Scheduling**, and **Space-Match Intelligent Payload Planning**.

---

## 🚀 Architecture & Development Phases

The project is architected into 6 core development phases:

### 📌 Phase 1: System Health & Runtime Monitoring
- **Paths**: `apps/web-antd/src/views/gis/monitor/`, `apps/web-antd/src/api/gis/monitor.ts`
- **Capabilities**:
  - Real-time status monitoring for Spring Boot 3, PostGIS database (HikariCP pool), and Redis cache.
  - JVM heap memory metrics and CPU load tracking.
  - Adaptive 10s auto-polling with timer leak prevention on component unmount.
  - Integrated Logback real-time log and alert timeline.

### 📌 Phase 2: GIS Spatial Maps & Layer Management
- **Paths**: `apps/web-antd/src/views/gis/map/`, `apps/web-antd/src/views/gis/layer/`, `apps/web-antd/src/api/gis/map-layer.ts`
- **Capabilities**:
  - Coordinate Reference System (CRS) management: EPSG:4326 (WGS84), EPSG:3857 (Web Mercator), CGCS2000.
  - Interactive 2D/3D WebGL map canvas preview with spatial center and bounding box configuration.
  - GeoServer proxy integration (Workspaces, DataStores, published layer stats).
  - Vector & raster layers, WMS/WFS service CRUD, opacity slider, and visibility toggling.

### 📌 Phase 3: Netty Multi-Protocol Socket Communication Console
- **Paths**: `apps/web-antd/src/views/gis/netty/`, `apps/web-antd/src/api/gis/monitor.ts`
- **Capabilities**:
  - High-performance Netty NIO communication engine metrics.
  - Multi-protocol port monitoring: TCP (9001), UDP (9002), WebSocket (9003 `/ws/netty-chat`).
  - Active channel tracking and message throughput counters.
  - Interactive WebSocket testing console for broadcast and unicast message push.

### 📌 Phase 4: AI Model & Space-Match Agent Scheduling
- **Paths**: `apps/web-antd/src/views/gis/ai-agent/`, `apps/web-antd/src/api/gis/ai-agent.ts`
- **Capabilities**:
  - Unified configuration for DashScope (Qwen), DeepSeek, Gemini, and OpenAI models.
  - Real-time Space-Match Agent thinking stream logs and iteration step tracking.
  - Context token consumption and latency metrics.
  - Interactive prompt execution and AI spatial inference sandbox.

### 📌 Phase 5: Space-Match Satellite Payload & Mission Planning
- **Paths**: `apps/web-antd/src/views/gis/spacematch/`, `apps/web-antd/src/api/gis/spacematch.ts`
- **Capabilities**:
  - Sensor metadata library (Optical, SAR, Infrared, Hyperspectral).
  - Launch vehicle mission scheduling (CZ-2D, CZ-6A, KZ-11) and orbit inclination constraints.
  - Constraint rule engine (Payload weight, Power budget, Orbit altitude, Launch window).
  - AI matching plan scoring matrix and multi-objective optimization results.

### 📌 Phase 6: Engineering, Optimization & Extensibility
- **Paths**: `apps/web-antd/src/router/routes/modules/gis.ts`, `apps/web-antd/vite.config.ts`
- **Capabilities**:
  - **Dynamic Modular Routing**: Decoupled subsystem routes with dynamic lazy loading.
  - **Unified API Client & Fallbacks**: Seamless switching between Nitro Mock and live backend.
  - **Bundle Optimization**: Gzip/Brotli compression, manual chunks splitting, and ESBuild production cleanup.

---

## 🛠️ Tech Stack

- **Framework**: Vue 3.5+ (Composition API, `<script setup>`)
- **Build System**: Vite 8+ / Turborepo / PNPM Workspace
- **Language**: TypeScript 5.x
- **UI Library**: Ant Design Vue 4.x + Tailwind CSS
- **Icons**: `@vben/icons` (Iconify / Lucide)
- **State Management**: Pinia

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Launch Development Server
```bash
pnpm dev:antd
```
Open **`http://localhost:5666/`** in your browser.

### 3. Default Credentials
- **Username**: `vben` (or `admin`)
- **Password**: `123456`

### 4. Build for Production
```bash
pnpm build:antd
```
