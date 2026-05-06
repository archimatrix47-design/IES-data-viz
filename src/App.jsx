import { useState, useMemo, useCallback } from 'react';
import {
  AreaChart, Area, BarChart, Bar, CartesianGrid, XAxis, YAxis,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  Upload, Zap, Leaf, Droplets, Wind, Thermometer, X, AlertCircle
} from 'lucide-react';
import { parseCSV, detectMetrics, getMetricColor } from './utils/csvParser';
import './index.css';

export default function EnvironmentalDashboard() {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [fileName, setFileName] = useState('');
  const [selectedMetric, setSelectedMetric] = useState('energy');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [error, setError] = useState('');

  const metrics = useMemo(() => detectMetrics(headers), [headers]);

  const filteredData = useMemo(() => {
    if (!data.length) return [];

    return data.filter(row => {
      if (!dateRange.start && !dateRange.end) return true;

      const dateCol = headers.find(h => {
        const val = row[h];
        return val instanceof Date;
      });

      if (!dateCol) return true;

      const rowDate = row[dateCol];
      if (!(rowDate instanceof Date)) return true;

      const start = dateRange.start ? new Date(dateRange.start) : null;
      const end = dateRange.end ? new Date(dateRange.end) : null;

      if (start && rowDate < start) return false;
      if (end && rowDate > end) return false;

      return true;
    });
  }, [data, dateRange, headers]);

  const stats = useMemo(() => {
    if (!filteredData.length) return {};

    const category = selectedMetric;
    const categoryMetrics = metrics[category] || [];

    const result = {};
    categoryMetrics.forEach(metric => {
      const values = filteredData
        .map(row => row[metric])
        .filter(v => typeof v === 'number');

      if (values.length === 0) {
        result[metric] = { avg: 0, min: 0, max: 0, total: 0 };
        return;
      }

      const sum = values.reduce((a, b) => a + b, 0);
      result[metric] = {
        avg: parseFloat((sum / values.length).toFixed(2)),
        min: parseFloat(Math.min(...values).toFixed(2)),
        max: parseFloat(Math.max(...values).toFixed(2)),
        total: parseFloat(sum.toFixed(2))
      };
    });

    return result;
  }, [filteredData, selectedMetric, metrics]);

  const handleFileUpload = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const content = event.target?.result;
        const { headers: h, data: d } = parseCSV(content);
        setHeaders(h);
        setData(d);
        setFileName(file.name);
        setSelectedMetric('energy');
      } catch (err) {
        setError(err.message || 'Failed to parse CSV file');
        setData([]);
        setHeaders([]);
        setFileName('');
      }
    };

    reader.readAsText(file);
  }, []);

  const handleClearFilters = useCallback(() => {
    setDateRange({ start: '', end: '' });
  }, []);

  const chartData = useMemo(() => {
    if (!filteredData.length) return [];
    return filteredData.slice(-100);
  }, [filteredData]);

  const categoryMetrics = metrics[selectedMetric] || [];
  const hasData = data.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-700 bg-slate-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <div>
              <h1 className="text-3xl font-light tracking-tight text-slate-50">
                Environmental Analytics
              </h1>
              <p className="text-sm text-slate-400">
                IES Building Performance Data Visualization
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Upload Section */}
        <div className="mb-8 p-6 bg-slate-800/50 border border-slate-700/50 rounded-lg backdrop-blur-sm">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 flex-wrap">
              <label className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg cursor-pointer font-medium transition-colors">
                <Upload size={18} />
                <span>Upload CSV</span>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  aria-label="Upload CSV file"
                />
              </label>

              {fileName && (
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-medium">{fileName}</span>
                  <span className="text-blue-400 text-sm">{data.length} records</span>
                </div>
              )}
            </div>

            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-900/20 border border-red-700/50 rounded-lg">
                <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {hasData && (
              <div className="flex flex-col gap-3">
                <div className="flex gap-4 flex-wrap">
                  <div>
                    <label className="block text-xs text-slate-400 mb-2">From Date</label>
                    <input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                      className="px-3 py-2 bg-slate-900 border border-slate-600 rounded text-slate-50 text-sm"
                      aria-label="Filter start date"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-2">To Date</label>
                    <input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                      className="px-3 py-2 bg-slate-900 border border-slate-600 rounded text-slate-50 text-sm"
                      aria-label="Filter end date"
                    />
                  </div>
                  {(dateRange.start || dateRange.end) && (
                    <button
                      onClick={handleClearFilters}
                      className="text-sm text-slate-400 hover:text-slate-200 self-end transition-colors"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {!hasData ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center mb-4">
              <Upload size={32} className="text-slate-600" />
            </div>
            <h2 className="text-xl font-light text-slate-300 mb-2">No data loaded</h2>
            <p className="text-sm text-slate-400 mb-1">
              Upload a CSV file from IES to begin visualization
            </p>
            <p className="text-xs text-slate-500">
              Supports energy consumption, carbon emissions, water usage, HVAC loads, and comfort metrics
            </p>
          </div>
        ) : (
          <>
            {/* Metric Selector */}
            <div className="mb-8 flex flex-wrap gap-2">
              {[
                { id: 'energy', label: 'Energy', icon: Zap },
                { id: 'carbon', label: 'Carbon', icon: Leaf },
                { id: 'water', label: 'Water', icon: Droplets },
                { id: 'hvac', label: 'HVAC', icon: Wind },
                { id: 'comfort', label: 'Comfort', icon: Thermometer }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setSelectedMetric(id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedMetric === id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                  aria-pressed={selectedMetric === id}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>

            {/* Statistics Cards */}
            {categoryMetrics.length > 0 && (
              <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {categoryMetrics.map(metric => {
                  const stat = stats[metric] || { avg: 0, min: 0, max: 0, total: 0 };
                  return (
                    <div
                      key={metric}
                      className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-lg backdrop-blur-sm hover:border-slate-600 transition-colors"
                    >
                      <h3 className="text-xs uppercase text-slate-400 tracking-wider line-clamp-1 mb-3">
                        {metric}
                      </h3>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-slate-500">Average</p>
                          <p className="text-lg font-light text-emerald-400">{stat.avg}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <p className="text-slate-500">Max</p>
                            <p className="text-slate-300">{stat.max}</p>
                          </div>
                          <div>
                            <p className="text-slate-500">Min</p>
                            <p className="text-slate-300">{stat.min}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Charts */}
            {categoryMetrics.length > 0 && chartData.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Trend Analysis Chart */}
                <div className="p-6 bg-slate-800/50 border border-slate-700/50 rounded-lg backdrop-blur-sm">
                  <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wide mb-4">
                    Trend Analysis
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 116, 139, 0.1)" />
                      <XAxis
                        dataKey={headers.find(h => chartData[0][h] instanceof Date) || headers[0]}
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                      />
                      <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1e293b',
                          border: '1px solid #475569',
                          borderRadius: '8px'
                        }}
                        labelStyle={{ color: '#e2e8f0' }}
                      />
                      {categoryMetrics.slice(0, 3).map((metric) => (
                        <Area
                          key={metric}
                          type="monotone"
                          dataKey={metric}
                          stroke={getMetricColor(selectedMetric)}
                          fill={getMetricColor(selectedMetric)}
                          fillOpacity={0.3}
                          isAnimationActive={false}
                        />
                      ))}
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Metric Comparison Chart */}
                {categoryMetrics.length >= 2 && (
                  <div className="p-6 bg-slate-800/50 border border-slate-700/50 rounded-lg backdrop-blur-sm">
                    <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wide mb-4">
                      Metric Comparison
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData.slice(-12)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 116, 139, 0.1)" />
                        <XAxis
                          dataKey={headers.find(h => chartData[0][h] instanceof Date) || headers[0]}
                          tick={{ fill: '#94a3b8', fontSize: 12 }}
                        />
                        <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1e293b',
                            border: '1px solid #475569',
                            borderRadius: '8px'
                          }}
                          labelStyle={{ color: '#e2e8f0' }}
                        />
                        <Bar
                          dataKey={categoryMetrics[0]}
                          fill={getMetricColor(selectedMetric)}
                          radius={[4, 4, 0, 0]}
                        />
                        {categoryMetrics[1] && (
                          <Bar
                            dataKey={categoryMetrics[1]}
                            fill={`${getMetricColor(selectedMetric)}80`}
                            radius={[4, 4, 0, 0]}
                          />
                        )}
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
