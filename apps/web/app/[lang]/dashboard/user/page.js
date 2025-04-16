'use client'

import { useAuth } from '@/app/context/AuthContext'

export default function UserDashboard({ params: { lang } }) {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}</h2>
        <p className="mt-2 text-gray-600">This is your user dashboard.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900">My Reports</h3>
          <p className="mt-2 text-gray-600">View and manage your submitted reports.</p>
          <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
            View Reports
          </button>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900">Submit New Report</h3>
          <p className="mt-2 text-gray-600">Create a new anonymous report.</p>
          <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
            Submit Report
          </button>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900">Profile Settings</h3>
          <p className="mt-2 text-gray-600">Update your account information.</p>
          <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  )
} 