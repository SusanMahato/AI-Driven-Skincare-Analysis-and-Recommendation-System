'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { analyzeScan } from '@/lib/api';
import { isLoggedIn } from '@/lib/auth';
import { useEffect } from 'react';

export default function ScanPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push('/login');
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setResult(null);
      setError('');
    }
  };

  const handleScan = async () => {
    if (!file) return;
    setLoading(true);
    setError('');

    try {
      const response = await analyzeScan(file, 27.7172, 85.3240);
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Scan failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-rose-50">
      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <button onClick={() => router.push('/dashboard')} className="text-rose-500 font-medium text-sm">
          ← Back
        </button>
        <h1 className="text-lg font-bold text-gray-800">New Scan</h1>
        <div></div>
      </div>

      <div className="max-w-lg mx-auto px-6 py-8 space-y-6">

        {/* Upload Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-md font-semibold text-gray-800 mb-2">Upload Your Photo</h2>
          <p className="text-sm text-gray-500 mb-4">
            Take a clear front-facing photo in good lighting for best results.
          </p>

          <div className="border-2 border-dashed border-rose-200 rounded-xl p-6 text-center">
            {preview ? (
              <img src={preview} alt="Preview" className="w-48 h-48 object-cover rounded-xl mx-auto" />
            ) : (
              <div className="text-gray-400">
                <p className="text-4xl mb-2">📷</p>
                <p className="text-sm">Click to upload a photo</p>
              </div>
            )}
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-4 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-rose-50 file:text-rose-500 hover:file:bg-rose-100"
          />

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <button
            onClick={handleScan}
            disabled={!file || loading}
            className="mt-4 w-full bg-rose-500 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-rose-600 transition disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Analyze Skin'}
          </button>
        </div>

        {/* Results Section */}
        {result && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-md font-semibold text-gray-800 mb-4">Scan Results</h3>

            <div className="space-y-3">
              {Object.entries(result.cv_scores)
                .filter(([key]) => key !== 'photo_confidence')
                .map(([key, value]: [string, any]) => (
                  <div key={key}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 capitalize">{key.replace('_score', '').replace('_', ' ')}</span>
                      <span className="text-gray-800 font-medium">{(value * 100).toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-rose-400 h-2 rounded-full transition-all"
                        style={{ width: `${value * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
            </div>

            <div className="mt-4 p-3 bg-rose-50 rounded-xl">
              <p className="text-xs text-gray-500">Weather at scan time</p>
              <p className="text-sm text-gray-700 mt-1">
                {result.weather.weather_condition} · {result.weather.temperature}°C · UV {result.weather.uv_index}
              </p>
            </div>

            <button
              onClick={() => router.push('/dashboard')}
              className="mt-4 w-full bg-gray-800 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-gray-900 transition"
            >
              View Full Recommendation →
            </button>
          </div>
        )}

      </div>
    </div>
  );
}