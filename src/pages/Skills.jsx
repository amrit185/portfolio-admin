import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Trash2, Plus } from 'lucide-react';

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Frontend');
  const [icon, setIcon] = useState('');

  const fetchSkills = async () => {
    try {
      const { data } = await api.get('/skills');
      setSkills(data);
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/skills', { name, category, icon });
      setName('');
      setIcon('');
      fetchSkills(); // Refresh the list
    } catch (error) {
      alert('Error saving skill');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this skill?')) {
      try {
        await api.delete(`/skills/${id}`);
        fetchSkills();
      } catch (error) {
        alert('Error deleting skill');
      }
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-800">Manage Skills</h2>

      {/* Create Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Plus size={20} /> Add New Skill
        </h3>
        <form onSubmit={handleSubmit} className="flex gap-4 items-end max-w-4xl">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Skill Name</label>
            <input 
              type="text" placeholder="e.g. React" required
              className="w-full border p-2 rounded"
              value={name} onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select 
              className="w-full border p-2 rounded bg-white"
              value={category} onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Database">Database</option>
              <option value="Tools">Tools & Other</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Icon URL (Optional)</label>
            <input 
              type="text" placeholder="https://..." 
              className="w-full border p-2 rounded"
              value={icon} onChange={(e) => setIcon(e.target.value)}
            />
          </div>
          <button 
            type="submit" disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 h-[42px] disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </form>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 w-16">Icon</th>
              <th className="p-4">Name</th>
              <th className="p-4">Category</th>
              <th className="p-4 w-24">Actions</th>
            </tr>
          </thead>
          <tbody>
            {skills.map((skill) => (
              <tr key={skill._id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-4">
                  {skill.icon ? <img src={skill.icon} alt={skill.name} className="w-8 h-8 object-contain" /> : '-'}
                </td>
                <td className="p-4 font-medium">{skill.name}</td>
                <td className="p-4 text-sm text-gray-500">
                  <span className="bg-gray-200 px-2 py-1 rounded text-xs">{skill.category}</span>
                </td>
                <td className="p-4">
                  <button onClick={() => handleDelete(skill._id)} className="text-red-500 hover:bg-red-50 p-2 rounded">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {skills.length === 0 && (
              <tr><td colSpan="4" className="p-4 text-center text-gray-500">No skills found. Add one above!</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}