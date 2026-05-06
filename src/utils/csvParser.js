export function parseCSV(content) {
  const lines = content.trim().split('\n').filter(line => line.trim());

  if (lines.length < 1) {
    throw new Error('CSV file is empty');
  }

  const headers = parseCSVLine(lines[0]);

  if (headers.length < 2) {
    throw new Error('CSV must have at least 2 columns');
  }

  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row = {};

    for (let j = 0; j < headers.length; j++) {
      const value = values[j] || '';
      row[headers[j]] = tryParseValue(value);
    }

    data.push(row);
  }

  if (data.length === 0) {
    throw new Error('CSV file has no data rows');
  }

  return { headers, data };
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

function tryParseValue(value) {
  if (!value) return '';

  // Try to parse as number
  const num = parseFloat(value);
  if (!isNaN(num) && value.trim() !== '') {
    return num;
  }

  // Try to parse as date
  const date = parseDate(value);
  if (date) {
    return date;
  }

  return value;
}

function parseDate(value) {
  if (!value || typeof value !== 'string') return null;

  // YYYY-MM-DD format
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const date = new Date(value + 'T00:00:00Z');
    if (!isNaN(date.getTime())) return date;
  }

  // MM/DD/YYYY format
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
    const [month, day, year] = value.split('/');
    const date = new Date(year, month - 1, day);
    if (!isNaN(date.getTime())) return date;
  }

  // DD/MM/YYYY format (try if it looks plausible)
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
    const [part1, part2, year] = value.split('/');
    const day = parseInt(part1);
    const month = parseInt(part2);

    // If day > 12, it must be DD/MM/YYYY
    if (day > 12) {
      const date = new Date(year, month - 1, day);
      if (!isNaN(date.getTime())) return date;
    }
  }

  return null;
}

export function detectMetrics(headers) {
  const metrics = {
    energy: [],
    carbon: [],
    water: [],
    hvac: [],
    comfort: []
  };

  const energyKeywords = ['energy', 'consumption', 'kwh', 'demand', 'peak', 'load'];
  const carbonKeywords = ['carbon', 'co2', 'emission', 'ghg', 'emissions factor'];
  const waterKeywords = ['water', 'usage', 'm3', 'consumption', 'liters'];
  const hvacKeywords = ['hvac', 'heating', 'cooling', 'load', 'demand', 'kw'];
  const comfortKeywords = ['temperature', 'humidity', 'temp', 'comfort', 'co2', 'ppm', 'indoor air'];

  headers.forEach(header => {
    const lower = header.toLowerCase();
    const isNumeric = (value) => typeof value === 'number';

    if (energyKeywords.some(kw => lower.includes(kw))) {
      metrics.energy.push(header);
    } else if (carbonKeywords.some(kw => lower.includes(kw))) {
      metrics.carbon.push(header);
    } else if (waterKeywords.some(kw => lower.includes(kw))) {
      metrics.water.push(header);
    } else if (hvacKeywords.some(kw => lower.includes(kw))) {
      metrics.hvac.push(header);
    } else if (comfortKeywords.some(kw => lower.includes(kw))) {
      metrics.comfort.push(header);
    }
  });

  return metrics;
}

export function getMetricColor(category) {
  const colors = {
    energy: '#3b82f6',
    carbon: '#ef4444',
    water: '#06b6d4',
    hvac: '#8b5cf6',
    comfort: '#f59e0b'
  };
  return colors[category] || '#3b82f6';
}
