# Environmental Analytics Dashboard

A professional web application for visualizing building performance data exported from IES Virtual Environment (IESVE) software.

## Overview

The Environmental Analytics Dashboard is a full-stack web application that accepts CSV data files containing energy, carbon, water, HVAC, and comfort metrics from IES building performance simulations, then provides interactive visualizations and analytics.

**Built with:** React 18, Node.js/Express, Recharts, Tailwind CSS, Vite

## Features

### 📊 Data Import & Parsing
- **CSV Upload**: Accept standard CSV files via file input interface
- **Smart Parsing**: Handles quoted fields, empty lines, and various date formats
- **Auto-Detection**: Automatically categorizes metrics based on column headers
- **Error Handling**: Clear error messages for invalid files
- **Record Count**: Displays total records loaded

### 🎯 Automatic Metric Detection
Supports five metric categories with intelligent keyword matching:

- **Energy**: Keywords like "energy", "consumption", "kwh", "demand", "peak", "load"
- **Carbon**: Keywords like "carbon", "co2", "emissions", "ghg"
- **Water**: Keywords like "water", "usage", "m3", "liters", "consumption"
- **HVAC**: Keywords like "hvac", "heating", "cooling", "load", "kw"
- **Comfort**: Keywords like "temperature", "humidity", "comfort", "co2", "ppm"

### 📈 Interactive Dashboard
- **Header**: Sticky top bar with status indicator and application title
- **Metric Selector**: Quick-switch buttons for all metric categories
- **Statistics Cards**: Shows average, min, max values for each metric
- **Trend Analysis**: Area chart showing metric trends over time
- **Metric Comparison**: Bar chart comparing multiple metrics
- **Date Filtering**: Filter data by date range with from/to inputs
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop

### 🎨 Visual Design
- Dark theme with slate and emerald color palette
- Glass-morphism effects with backdrop blur
- Smooth animations and transitions
- Professional typography hierarchy
- Accessible color contrasts

## Installation

### Prerequisites
- Node.js 18 or higher
- npm 9 or higher

### Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Development mode** (with hot reload)
   ```bash
   npm run dev
   ```
   Access at `http://localhost:5173`

3. **Production build**
   ```bash
   npm run build
   npm run server
   ```
   Access at `http://localhost:3000`

4. **Start with build**
   ```bash
   npm start
   ```
   Builds and starts the production server

## Usage

### Uploading Data

1. Click the "Upload CSV" button
2. Select a CSV file from IES or in the supported format
3. File is immediately parsed and data loaded
4. Record count displays below the filename

### Filtering Data

- Use **From Date** and **To Date** inputs to filter by date range
- Charts and statistics update automatically
- Click "Clear filters" to reset the date range
- Filtering works based on date columns in your data

### Selecting Metrics

- Click metric category buttons: Energy, Carbon, Water, HVAC, or Comfort
- Dashboard updates to show relevant metrics
- Statistics cards populate with category-specific data
- Charts display selected category metrics

### Reading Charts

- **Trend Analysis**: Area chart showing metric values over time
- **Metric Comparison**: Bar chart comparing top 2 metrics in category
- Hover over charts for detailed values
- Charts show up to 100 recent data points

## Data Format

### Expected CSV Structure

```csv
Date,Energy Consumption (kWh),Peak Demand (kW),Carbon Emissions (kg CO2),Water Usage (m³),Temperature (°C),Humidity (%),HVAC Heating Load (kW),HVAC Cooling Load (kW)
2024-01-01,520.3,65.2,128.5,15.2,18.5,52,22.3,2.1
2024-01-02,548.7,71.4,135.8,14.8,17.9,55,24.1,1.8
```

### Requirements
- **Headers**: First row must contain column names (case-insensitive)
- **Minimum Columns**: At least 2 columns required
- **Date Formats Supported**:
  - YYYY-MM-DD (ISO format)
  - MM/DD/YYYY (US format)
  - DD/MM/YYYY (European format)
- **Numeric Values**: Will be automatically parsed as numbers
- **Missing Values**: Empty cells are handled gracefully

### Column Naming
Column names can include metric keywords in any case:
- ✅ "Energy Consumption (kWh)"
- ✅ "energy_consumption"
- ✅ "ENERGY CONSUMPTION"
- ✅ "Total Energy"

## IES Virtual Environment Context

IES Virtual Environment (IESVE) is building performance simulation software that exports comprehensive datasets including:

- **Energy**: Consumption, demand, heating/cooling loads, peak loads
- **Carbon**: Emissions factors, total embodied carbon, operational carbon
- **Water**: Usage volumes, intensity per area, hot water consumption
- **HVAC**: System loads, temperatures, flow rates, efficiencies
- **Comfort**: Temperature, humidity, CO₂ levels, occupant satisfaction

This dashboard visualizes standard IESVE exports enabling rapid performance analysis.

## API Endpoints

### Health Check
```
GET /api/health
```
Returns: `{ status: "ok", timestamp: ISO8601, environment: "production|development" }`

## Project Structure

```
.
├── package.json                 # Dependencies and scripts
├── vite.config.js              # Vite bundler config
├── tailwind.config.js          # Tailwind CSS config
├── postcss.config.js           # PostCSS config
├── index.html                  # HTML entry point
├── README.md                   # This file
├── src/
│   ├── App.jsx                 # Main React component
│   ├── main.jsx                # React DOM entry
│   ├── index.css               # Tailwind styles
│   └── utils/
│       └── csvParser.js        # CSV parsing utilities
├── server/
│   └── index.js                # Express server
└── dist/                       # Built frontend (generated)
```

## Configuration

### Environment Variables

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment mode (development/production)

### Customization

**Colors by Metric Type** (in src/utils/csvParser.js):
- Energy: `#3b82f6` (blue)
- Carbon: `#ef4444` (red)
- Water: `#06b6d4` (cyan)
- HVAC: `#8b5cf6` (purple)
- Comfort: `#f59e0b` (amber)

**Theme Colors** (in tailwind.config.js):
- Edit the Tailwind theme extension for colors
- Glass-morphism effects in App.jsx

## Performance

- **Load Time**: < 3 seconds typical
- **Large Files**: Handles up to 50MB CSV files
- **Memory**: Optimized filtering and memoization
- **Rendering**: Smooth 60fps animations
- **Chart Data**: Limited to last 100 points for performance

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Accessibility

- ✅ Semantic HTML with proper heading hierarchy
- ✅ WCAG AA color contrast compliance
- ✅ Keyboard navigation (Tab, Enter, Space)
- ✅ ARIA labels for interactive elements
- ✅ Focus indicators
- ✅ Screen reader support

## Troubleshooting

### "CSV must have at least 2 columns"
Ensure your CSV file has at least 2 columns and is in valid format.

### "Failed to parse CSV file"
- Check file encoding (UTF-8 recommended)
- Verify no special characters in headers that break parsing
- Ensure proper comma separation
- Check for mismatched quotes in fields

### Charts not appearing
- Ensure numeric columns exist in selected metric category
- Check that file has data rows (not just headers)
- Verify metric keywords match your column names

### Date filtering not working
- Ensure date column exists and is in supported format
- Check that date format matches one of: YYYY-MM-DD, MM/DD/YYYY, DD/MM/YYYY

## Development

### Hot Reload
During development, changes to React components automatically reload:
```bash
npm run dev
```

### Building for Production
```bash
npm run build
```
Creates optimized build in `./dist/` directory.

### Starting Production Server
```bash
npm run server
```
Serves static files from `./dist/` on configured port.

## Notes

- Data is processed client-side for privacy
- No data is sent to external servers
- All calculations performed in the browser
- Supports reactive updates as filters change

## License

Built for IES Virtual Environment integration.

## Support

For issues or questions about:
- **CSV Format**: Refer to IES IESVE documentation
- **Building Performance Metrics**: Consult IES or building performance specialists
- **Application Features**: Check the dashboard Help section or documentation
