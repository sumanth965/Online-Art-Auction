import React from 'react';
import { Trash2 } from 'lucide-react';
import useAppState from '../useAppState';

const AdminPanel = () => {
  const {
    pendingArtworks = [],
    setPendingArtworks,
    handleApproveArtwork,
    users = [],
    handleDeleteUser,
  } = useAppState();

  return (
    <section className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">
          Admin Panel
        </h1>

        {/* Pending Artworks */}
        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 mb-10">
          <h2 className="text-2xl font-bold mb-4">Pending Artworks</h2>
          {pendingArtworks.length > 0 ? (
            pendingArtworks.map((art) => (
              <div
                key={art.id}
                className="flex justify-between items-center bg-gray-700 p-4 rounded-lg mb-3"
              >
                <div>
                  <h3 className="font-semibold">{art.title}</h3>
                  <p className="text-gray-400 text-sm">by {art.artist}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApproveArtwork(art.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() =>
                      setPendingArtworks(
                        pendingArtworks.filter((a) => a.id !== art.id)
                      )
                    }
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No pending artworks.</p>
          )}
        </div>

        {/* Manage Users */}
        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
          <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
          {users.length > 0 ? (
            <div className="space-y-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex justify-between items-center bg-gray-700 p-4 rounded-lg"
                >
                  <div>
                    <h3 className="font-semibold">{user.name}</h3>
                    <p className="text-gray-400 text-sm">{user.email}</p>
                    <p className="text-amber-400 text-sm">{user.role}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No users found.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminPanel;
