import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Trash2, Plus } from 'lucide-react';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [techStack, setTechStack] = useState('');
  const [imageFile, setImageFile] = useState(null);

  
  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = '';

     
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const uploadRes = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        imageUrl = uploadRes.data.imageUrl;
      }

  
      const techArray = techStack.split(',').map(tech => tech.trim());

 
      await api.post('/projects', {
        title,
        description,
        techStack: techArray,
        image: imageUrl
      });

     
      setTitle('');
      setDescription('');
      setTechStack('');
      setImageFile(null);
      fetchProjects();
    } catch (error) {
      alert('Error saving project');
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await api.delete(`/projects/${id}`);
        fetchProjects();
      } catch (error) {
        alert('Error deleting project');
      }
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-800">Manage Projects</h2>

  
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Plus size={20} /> Add New Project
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
          <input 
            type="text" placeholder="Project Title" required
            className="w-full border p-2 rounded"
            value={title} onChange={(e) => setTitle(e.target.value)}
          />
          <textarea 
            placeholder="Project Description" required rows="3"
            className="w-full border p-2 rounded"
            value={description} onChange={(e) => setDescription(e.target.value)}
          />
          <input 
            type="text" placeholder="Tech Stack (comma separated, e.g. React, Node, MongoDB)" required
            className="w-full border p-2 rounded"
            value={techStack} onChange={(e) => setTechStack(e.target.value)}
          />
          <input 
            type="file" accept="image/*"
            className="w-full border p-2 rounded"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
          <button 
            type="submit" disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Project'}
          </button>
        </form>
      </div>

   
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Image</th>
              <th className="p-4">Title</th>
              <th className="p-4">Tech Stack</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project._id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-4">
                  {project.image && <img src={project.image} alt={project.title} className="w-16 h-16 object-cover rounded" />}
                </td>
                <td className="p-4 font-medium">{project.title}</td>
                <td className="p-4 text-sm text-gray-500">{project.techStack.join(', ')}</td>
                <td className="p-4">
                  <button onClick={() => handleDelete(project._id)} className="text-red-500 hover:bg-red-50 p-2 rounded">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr><td colSpan="4" className="p-4 text-center text-gray-500">No projects found. Create one above!</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
