import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Debug logging
console.log(`\n=== Server Starting ===`);
console.log(`Current working directory: ${process.cwd()}`);
console.log(`Server file directory: ${__dirname}`);

// Try multiple possible locations for dist
const possiblePaths = [
  path.join(process.cwd(), 'dist'),
  path.join(__dirname, '../dist'),
  path.join(__dirname, '../../dist'),
  '/opt/render/project/dist',
  '/app/dist'
];

let distPath = null;
for (const testPath of possiblePaths) {
  if (fs.existsSync(testPath)) {
    distPath = testPath;
    console.log(`✓ Found dist at: ${testPath}`);
    break;
  }
}

if (!distPath) {
  console.error(`✗ Could not find dist folder!`);
  console.log(`Attempted paths:`);
  possiblePaths.forEach(p => console.log(`  - ${p}`));
  process.exit(1);
}

console.log(`Using distPath: ${distPath}`);

// List files in dist directory
try {
  const files = fs.readdirSync(distPath);
  console.log(`Files in dist: ${files.join(', ')}`);
} catch (e) {
  console.error(`Error reading dist: ${e.message}`);
}
console.log(`======================\n`);

// CORS
app.use(cors());

// Middleware
app.use(express.json());
app.use(express.static(distPath));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV
  });
});

// Serve index.html for all other routes (client-side routing)
app.get('/', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ error: 'index.html not found', path: indexPath });
  }
});

app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');

  // Check if it's an API route
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Not found' });
  }

  // Serve index.html for client-side routing
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({
      error: 'Build not found. Run npm run build first.',
      lookingFor: indexPath,
      distExists: fs.existsSync(distPath)
    });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`Environmental Analytics Dashboard running on http://localhost:${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
});
