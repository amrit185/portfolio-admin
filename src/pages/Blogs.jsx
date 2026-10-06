import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Trash2, Plus } from 'lucide-react';

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const fetchBlogs = async () => {
    try {
      const { data } = await api.get('/blogs');
      setBlogs(data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  useEffect(() => { fetchBlogs(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let coverImage = '';
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const uploadRes = await api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        coverImage = uploadRes.data.imageUrl;
      }
      await api.post('/blogs', { title, content, coverImage, published: true });
      setTitle(''); setContent(''); setImageFile(null);
      fetchBlogs();
    } catch (error) {
      alert('Error saving blog');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this blog post?')) {
      await api.delete(`/blogs/${id}`);
      fetchBlogs();
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-800">Manage Blogs</h2>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><Plus size={20} /> Add New Blog</h3>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
          <input type="text" placeholder="Blog Title" required className="w-full border p-2 rounded"
                 value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea placeholder="Blog Content (Markdown or plain text)" required rows="6" className="w-full border p-2 rounded"
                    value={content} onChange={(e) => setContent(e.target.value)} />
          <input type="file" accept="image/*" className="w-full border p-2 rounded"
                 onChange={(e) => setImageFile(e.target.files[0])} />
          <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded">
            {loading ? 'Saving...' : 'Publish Blog'}
          </button>
        </form>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div key={blog._id} className="bg-white border rounded-lg overflow-hidden shadow-sm">
            {blog.coverImage && <img src={blog.coverImage} alt={blog.title} className="w-full h-40 object-cover" />}
            <div className="p-4">
              <h4 className="font-bold text-lg mb-2">{blog.title}</h4>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{blog.content}</p>
              <button onClick={() => handleDelete(blog._id)} className="text-red-500 flex items-center gap-1 text-sm hover:text-red-700">
                <Trash2 size={16} /> Delete Post
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}