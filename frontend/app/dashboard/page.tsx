'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getRecommendation, getScanHistory } from '@/lib/api';
import { isLoggedIn } from '@/lib/auth';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function DashboardPage() {
  const router = useRouter();
  const [recommendation, setRecommendation] = useState<any>(null);
  const [scanHistory, setScanHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push('/login');
      return;
    }
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [recRes, histRes] = await Promise.all([
        getRecommendation(),
        getScanHistory()
      ]);
      setRecommendation(recRes.data);
      setScanHistory(histRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = scanHistory.map((scan: any, index: number) => ({
    scan: `Scan ${index + 1}`,
    acne: scan.acne_score,
    redness: scan.redness_score,
    texture: scan.texture_score,
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-rose-50 flex items-center justify-center">
        <p className="text-gray-500">Loading your skin data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rose-50">
      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-rose-500">SkinCare AI</h1>
        <div className="flex gap-3">
          <button
            onClick={() => router.push('/scan')}
            className="bg-rose-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-rose-600 transition"
          >
            New Scan
          </button>
          <button
            onClick={() => router.push('/profile')}
            className="border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
          >
            Profile
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">

        {/* Welcome */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800">Welcome back 👋</h2>
          <p className="text-gray-500 text-sm mt-1">
            {scanHistory.length > 0
              ? `You have ${scanHistory.length} scan${scanHistory.length > 1 ? 's' : ''} recorded.`
              : 'No scans yet. Start your first scan!'}
          </p>
        </div>

        {/* Latest Recommendation */}
        {recommendation && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-md font-semibold text-gray-800 mb-4">Latest Skin Report</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{recommendation.skin_report}</p>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="bg-rose-50 rounded-xl p-4">
                <p className="text-xs font-medium text-rose-500 mb-2">☀️ Morning Routine</p>
                {recommendation.morning_routine.map((step: string, i: number) => (
                  <p key={i} className="text-sm text-gray-700">{i + 1}. {step}</p>
                ))}
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-medium text-gray-500 mb-2">🌙 Night Routine</p>
                {recommendation.night_routine.map((step: string, i: number) => (
                  <p key={i} className="text-sm text-gray-700">{i + 1}. {step}</p>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <p className="text-xs font-medium text-gray-500 mb-2">Recommended Ingredients</p>
              <div className="flex flex-wrap gap-2">
                {recommendation.ingredients.map((ing: string, i: number) => (
                  <span key={i} className="bg-rose-100 text-rose-600 text-xs px-3 py-1 rounded-full">
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Progress Chart */}
        {chartData.length > 1 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-md font-semibold text-gray-800 mb-4">Skin Progress</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="scan" />
                <YAxis domain={[0, 1]} />
                <Tooltip />
                <Line type="monotone" dataKey="acne" stroke="#f43f5e" name="Acne" />
                <Line type="monotone" dataKey="redness" stroke="#fb923c" name="Redness" />
                <Line type="monotone" dataKey="texture" stroke="#a78bfa" name="Texture" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Scan History */}
        {scanHistory.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-md font-semibold text-gray-800 mb-4">Scan History</h3>
            <div className="space-y-3">
              {scanHistory.map((scan: any, i: number) => (
                <div key={i} className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Scan {i + 1}</p>
                    <p className="text-xs text-gray-400">{new Date(scan.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Acne: {(scan.acne_score * 100).toFixed(0)}%</p>
                    <p className="text-xs text-gray-500">Redness: {(scan.redness_score * 100).toFixed(0)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}