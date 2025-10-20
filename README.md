# 🍽️ Restaurant Management API – Technical Assessment (Task 1)

This repository contains **Task 1** of the technical assessment for the **Software and Data Engineer position at Pleny Software**. The goal is to design and implement a modular, scalable backend API for managing restaurants and user interactions using **Nest.js**, **MongoDB**, and **Mongoose**.

## 📌 Project Overview

This API enables:

* **Restaurant Management**:

  * Create restaurants with multilingual names, unique slugs, and up to 3 cuisines.
  * List restaurants with optional cuisine filtering.
  * Retrieve restaurant details by ID or slug.
  * Find nearby restaurants using MongoDB GeoSpatial queries.

* **User Interaction**:

  * Define users with favorite cuisines.
  * Model user-restaurant follow relationships.
  * Recommend restaurants based on shared cuisine preferences using MongoDB Aggregation Pipeline.

## 🛠️ Tech Stack

* **Nest.js + TypeScript** – Modular backend architecture
* **Express.js** – HTTP server framework
* **MongoDB** – NoSQL database with geospatial and aggregation support
* **Mongoose** – ODM for schema definition and data modeling
* **Swagger** – Auto-generated API documentation


## 🚀 Getting Started


### 1. Clone the Repository

```bash
git clone https://github.com/OmarTamer206/pleny-restaurant-management-api.git
cd pleny-restaurant-management-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

```bash
MONGO_URI=mongodb://localhost:27017/restaurant-api
PORT=3000
```
The .env file is excluded from version control for security.

### 4. Running the Application
#### Development
```bash
npm run start
```
#### Watch Mode (Auto Reload)
```bash
npm run start:dev
```
#### Production
```bash
npm run build
npm run start:prod
```
### 5. API Documentation
Swagger UI is automatically generated.
```bash
http://localhost:3000/api
```
This contains:
* Full list of endpoints
* Schema definitions
* Live testing interface
