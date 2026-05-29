import {
  useEffect,
  useState,
} from 'react'

import api
from '../services/api'

import Sidebar
from '../components/Sidebar'

function Dashboard() {
  const [stats, setStats] =
    useState(null)

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard =
    async () => {
      try {
        const token =
          localStorage.getItem(
            'token',
          )

        const response =
          await api.get(
            '/dashboard',
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            },
          )

        setStats(
          response.data,
        )

      } catch (error) {
        console.log(error)
      }
    }

  return (
    <div className="flex">

      <Sidebar />

      <div className="ml-64 min-h-screen bg-gray-100 p-10 w-full">

        <h1 className="text-4xl font-bold mb-8">
          Admin Dashboard
        </h1>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-gray-500">
                Total Books
              </h2>

              <p className="text-3xl font-bold">
                {
                  stats.totalBooks
                }
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-gray-500">
                Borrowed Books
              </h2>

              <p className="text-3xl font-bold">
                {
                  stats.borrowedBooks
                }
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-gray-500">
                Overdue Books
              </h2>

              <p className="text-3xl font-bold">
                {
                  stats.overdueBooks
                }
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-gray-500">
                Students
              </h2>

              <p className="text-3xl font-bold">
                {
                  stats.students
                }
              </p>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard