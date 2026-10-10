import { useState, useEffect } from 'react';
import api from '../utils/api';

export default function About() {
  const [formData, setFormData] = useState({ name: '', title: '', bio: '', resumeUrl: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const { data } = await api.get('/about');
        if (data.name) setFormData(data); 
      } catch (error) {
        console.error('Error fetching about:', error);
      }
    };
    fetchAbout();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/about', formData);
      alert('About section updated successfully!');
    } catch (error) {
      alert('Error updating about section');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-8">
      <h2 className="text-3xl font-bold text-gray-800">About Me</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input type="text" className="mt-1 w-full border p-2 rounded" 
                 value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Professional Title</label>
          <input type="text" className="mt-1 w-full border p-2 rounded" placeholder="e.g. Full Stack Developer"
                 value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea rows="5" className="mt-1 w-full border p-2 rounded" 
                    value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Resume Link (Google Drive / PDF URL)</label>
          <input type="text" className="mt-1 w-full border p-2 rounded" 
                 value={formData.resumeUrl} onChange={(e) => setFormData({...formData, resumeUrl: e.target.value})} />
        </div>
        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}
