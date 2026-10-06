import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
        <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
      </div>
      <p>Your CMS dashboard is ready. We will build the CRUD tables here next.</p>
    </div>
  );
}