# FRESH Tomato Farm - Supply Chain Management App

A comprehensive supply chain management application for tomato distribution. Built with React, TypeScript, Shadcn UI, and Tailwind CSS.

## 📸 Screenshots

### Dashboard
![Dashboard](public/screenshots/dashboard.png)

### Supply Chain Visualization
![Supply Chain](public/screenshots/supply-chain.png)

## 🎯 Project Overview

Georgie is a manager of a tomato distributor. Her company buys tomatoes from **farms** and sells them to **stores**. However, sometimes farms become **contaminated**, and tomatoes from those farms can no longer be sold.

This app helps Georgie:
- **Track revenue and profits** from all transactions
- **Monitor contamination** across the supply chain
- **Visualize the supply chain flow** from farms through warehouses to stores
- **Manage farms** and identify high-risk suppliers
- **Analyze orders** with sorting, filtering, and pagination

## ✨ Features Implemented

### 📊 Dashboard
- **Key Metrics Cards**: Total Revenue, Profit, Profit Margin, Volume Sold
- **Contamination Impact Widget**: Shows lost revenue, affected orders, and contamination rate
- **Top Performing Farms**: Ranked list of farms by volume
- **Recent Orders**: Latest transactions with revenue and status

### 🔗 Supply Chain Visualization
- **Visual Flow Diagram**: Farms → Warehouses → Stores with order counts
- **Volume Metrics**: Track volume at each stage (purchased, stored, sold, lost)
- **Contamination Impact**: Impact breakdown at each supply chain level
- **Top Supply Routes**: Best-performing Farm → Warehouse → Store paths

### 🚜 Farms Page
- **10,000 farms** with full data table (TanStack Table)
- **Contamination tracking** per farm (status, rate, order count)
- **Sortable columns**: Name, Orders, Volume, Contamination Rate
- **Filter by status**: Contaminated only, Clean only
- **Top Contaminated Farms Widget**: Identify high-risk suppliers

### 📝 Orders Page
- **16,000 Buy Orders** and **4,000 Sell Orders**
- **Toggle between Buy/Sell** orders
- **Date range filtering** with calendar pickers
- **Contamination filters**: Show only contaminated or clean orders
- **Sortable columns**: Date, Volume, Cost, Revenue, Profit
- **Pagination**: Navigate through large datasets

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Rsbuild
- **UI Library**: Shadcn UI (Radix UI primitives)
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: TanStack Query (React Query)
- **Tables**: TanStack Table
- **Charts**: Recharts (available)
- **Icons**: Lucide React
- **Mock Data**: Faker.js

## 📁 Project Structure

```
src/
├── @/components/ui/    # Shadcn UI components
├── components/         # Custom components
│   ├── ContaminationImpactCard.tsx
│   ├── FlowArrow.tsx
│   ├── MetricCard.tsx
│   ├── RecentOrdersWidget.tsx
│   ├── SupplyChainFlowCard.tsx
│   ├── SupplyChainRoutesWidget.tsx
│   ├── TopContaminatedFarmsWidget.tsx
│   └── TopFarmsWidget.tsx
├── hooks/              # Custom React hooks
│   ├── useContaminationData.ts
│   ├── useDashboardMetrics.ts
│   ├── useFarmMetrics.ts
│   ├── useOrdersData.ts
│   └── useSupplyChainMetrics.ts
├── pages/              # Page components
│   ├── Dashboard.tsx
│   ├── Farms.tsx
│   ├── Orders.tsx
│   └── SupplyChain.tsx
├── data/               # Types and mock data
│   ├── mockData.ts
│   └── types.ts
├── utils/              # Utility functions
│   └── orderCalculations.ts
└── layout/             # Layout components
    └── DefaultLayout.tsx
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repo-url>

# Install dependencies
npm install

# Start development server
npm start
```

The app will be available at `http://localhost:3000` (or next available port).

## 📊 Data Model

```typescript
// Buy tomatoes from Farms → store in Warehouses
BuyOrder: {
  supplier: Farm,
  destination: Warehouse,
  volume: number,        // kg
  pricePerUnit: number,  // $
  isContaminated: boolean
}

// Sell tomatoes from Warehouses → to Stores
SellOrder: {
  costs: BuyOrder[],     // Buy orders that make up this sale
  destination: Store,
  pricePerUnit: number   // $
}
```

## 🧮 Key Calculations

### Revenue & Profit
```javascript
Revenue = totalVolume × sellPricePerUnit
Cost = sum(buyOrder.volume × buyOrder.pricePerUnit)
Profit = Revenue - Cost
ProfitMargin = (Profit / Revenue) × 100
```

### Contamination Impact
```javascript
// If ANY buy order in a sell order is contaminated, the entire order is lost
isContaminated = sellOrder.costs.some(buyOrder => buyOrder.isContaminated)
lostRevenue = sum(contaminatedOrders.revenue)
```

## 📝 Key Features in Detail

### Modular Architecture
- **Hooks**: Data fetching and calculations separated into reusable hooks
- **Components**: Modular, reusable UI components
- **Utils**: Shared calculation functions

### Performance Optimizations
- **TanStack Query**: Shared caching across components
- **useMemo**: Expensive calculations memoized
- **TanStack Table**: Efficient rendering for large datasets
- **Pagination**: 50 rows per page for optimal performance

### Type Safety
- Full TypeScript throughout
- Strongly typed props and return values
- Type-safe data structures

## 🎨 Design Patterns

- **Consistent styling** with Shadcn/Radix components
- **Responsive design** for mobile/tablet/desktop
- **Color-coded metrics**: Green (revenue), Blue (profit), Red (contamination)
- **Visual indicators**: Badges, icons, and progress bars

## 📈 Future Enhancements

- [ ] Table virtualization for 10K+ rows
- [ ] Time-series charts for trends
- [ ] Export to CSV functionality
- [ ] Farm remediation workflow
- [ ] Advanced search across entities
- [ ] Real-time data updates

## 📄 License

MIT License
