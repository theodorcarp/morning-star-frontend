import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

import './App.css';  // We'll add Tailwind next

function App() {
  const [trustData, setTrustData] = useState({ fts: 0, root: '' });
  const [prefs, setPrefs] = useState({ diversity: 0.5, engagement: 0.5 });
  const [currentVid, setCurrentVid] = useState({ cid: 'QmExample', src: 'placeholder.mp4' });

  useEffect(() => {
    const fetchFTS = async () => {
      try {
        const res = await axios.get('/trust/score');  // Proxies to backend
        setTrustData({ fts: res.data.latest_trust_score, root: 'sha256...' });  // Mock root
      } catch (err) {
        console.log('FTS fetch error:', err);  // Graceful fallback
      }
    };
    fetchFTS();
    const interval = setInterval(fetchFTS, 30000);  // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  const updateTune = (key, value) => setPrefs({ ...prefs, [key]: value });

  const chartData = {
    labels: ['Node A', 'Node B', 'Node C'],
    datasets: [
      {
        label: 'Federated Trust Score',
        data: [0.91, 0.88, 0.95],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl">🌅 Morning Star: Democratic Feed & Trust Dashboard</h1>
      </header>
      <main className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Video Player */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-bold mb-2">Video Feed</h2>
          <video src={currentVid.src} controls className="w-full max-w-md mb-2">
            Your browser doesn't support video.
          </video>
          <button
            onClick={() => setCurrentVid({ cid: 'NewCID', src: 'new-placeholder.mp4' })}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Next Video (Federated)
          </button>
        </div>

        {/* Tuner Dashboard */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-bold mb-2">Tune Your Algorithm</h2>
          <label className="block mb-2">
            Diversity: <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={prefs.diversity}
              onChange={(e) => updateTune('diversity', parseFloat(e.target.value))}
              className="ml-2"
            />
            <span className="ml-2">{(prefs.diversity * 100).toFixed(0)}%</span>
          </label>
          <label className="block mb-4">
            Engagement: <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={prefs.engagement}
              onChange={(e) => updateTune('engagement', parseFloat(e.target.value))}
              className="ml-2"
            />
            <span className="ml-2">{(prefs.engagement * 100).toFixed(0)}%</span>
          </label>
          <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Apply Tune</button>
          <button className="bg-purple-500 text-white px-4 py-2 rounded">Vote on Moderation</button>
          <p className="text-sm mt-2 text-gray-600">SHAP Expl: 70% tags, 30% views.</p>
        </div>

        {/* FTS Dashboard */}
        <div className="bg-white p-4 rounded shadow col-span-2">
          <h2 className="text-lg font-bold mb-2">Federated Trust Score</h2>
          <p className="mb-2">Current FTS: <span className="font-bold text-green-600">{trustData.fts.toFixed(3)}</span></p>
          <p className="mb-4 text-sm text-gray-600">Latest Root: {trustData.root?.slice(0, 16)}...</p>
          <Line data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
        </div>
      </main>
    </div>
  );
}

export default App;
