# Quick Start Guide

## Installation & First Run

### Prerequisites
- Node.js 18+ installed
- A CSV file with building performance data

### Development Mode (Hot Reload)

```bash
# Install dependencies (already done)
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:5173` with live reloading.

### Production Build & Run

```bash
# Build for production
npm run build

# Start the server
npm run server
```

Access at `http://localhost:3000`

**Or in one command:**
```bash
npm start
```

## Using the Application

### 1. Upload Data
- Click **"Upload CSV"** button
- Select a CSV file from your computer
- File is parsed immediately
- You'll see the filename and record count

### 2. View Your Data
- 5 metric buttons appear: Energy, Carbon, Water, HVAC, Comfort
- Click a button to view that metric category
- Statistics cards show for each metric
- Charts display trends and comparisons

### 3. Filter by Date
- Use **From Date** and **To Date** inputs
- Charts and stats update automatically
- Click **"Clear filters"** to reset

### 4. Analyze Results
- **Trend Analysis** (left chart): Shows metric values over time
- **Metric Comparison** (right chart): Compares top metrics
- **Statistics Cards**: Average, Min, Max values
- Hover charts for exact values

## Testing with Sample Data

A sample CSV file is included: `sample_environmental_data.csv`

To test:
1. Click "Upload CSV"
2. Select `sample_environmental_data.csv`
3. Click "Energy" to see energy metrics
4. Try filtering by date range
5. Switch between metric categories

## Data Format

Your CSV should include:
- **Date column** in format: `YYYY-MM-DD`, `MM/DD/YYYY`, or `DD/MM/YYYY`
- **Metric columns** with headers containing keywords:
  - Energy: "energy", "kwh", "consumption", "demand", "peak"
  - Carbon: "carbon", "co2", "emissions"
  - Water: "water", "usage", "m3"
  - HVAC: "hvac", "heating", "cooling"
  - Comfort: "temperature", "humidity", "co2", "ppm"

## Troubleshooting

**"Cannot find 'defs'" error?**
- Already fixed in the latest version

**Port 3000 already in use?**
```bash
# Use a different port
PORT=4000 npm run server
```

**Charts not showing?**
- Ensure metric column headers contain the keywords
- Check that numeric values are in those columns

**Date filtering not working?**
- Verify date format matches: YYYY-MM-DD, MM/DD/YYYY, or DD/MM/YYYY

## Project Structure

```
C:/data viz/
├── package.json          # Dependencies
├── vite.config.js        # Build config
├── tailwind.config.js    # Styles
├── index.html            # Entry point
├── README.md             # Full documentation
├── sample_environmental_data.csv  # Test data
├── src/
│   ├── App.jsx           # Main dashboard component
│   ├── main.jsx          # React entry point
│   ├── index.css         # Tailwind styles
│   └── utils/
│       └── csvParser.js  # CSV parsing utilities
├── server/
│   └── index.js          # Express server
└── dist/                 # Built app (generated)
```

## Key Features Built

✅ CSV upload with drag-drop support  
✅ Smart metric detection (5 categories)  
✅ Automatic value parsing (dates, numbers)  
✅ Interactive dashboard with filters  
✅ Area chart (trends) + Bar chart (comparison)  
✅ Statistics cards (avg, min, max)  
✅ Responsive design (mobile/tablet/desktop)  
✅ Dark theme with professional styling  
✅ Glass-morphism effects  
✅ Error handling with clear messages  
✅ Express backend for deployment  
✅ Health check endpoint  
✅ Client-side data processing (private)  

## Development Commands

```bash
npm run dev       # Start dev server (port 5173)
npm run build     # Create production build
npm run server    # Start Express server (port 3000)
npm start         # Build + start server
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Next Steps

1. **Test with your data**: Upload your IES CSV files
2. **Customize colors**: Edit `getMetricColor()` in `src/utils/csvParser.js`
3. **Deploy**: Use `npm run build` and `npm run server` on your hosting
4. **Scale up**: The app handles files up to 50MB efficiently

---

For detailed documentation, see [README.md](./README.md)
