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

  const [collapsed, setCollapsed] =
  useState(false)

  return (
    <div className="flex">

      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <div className={`
          flex-1
          min-h-screen
          bg-[#F8F7F4]
          p-10
          transition-all
          duration-300
        `}>

        <h1 className="text-5xl font-bold text-[#365545] mb-2">
          Admin Dashboard
        </h1>

        <p className="text-gray-500 mb-8">
          Overview of library activity
        </p>

        {stats && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E8F0EB] hover:shadow-lg transition-all">
                <h2 className="text-gray-500">
                  Total Books
                </h2>

                <p className="text-4xl font-bold text-[#365545]">
                  {stats.totalBooks}
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E8F0EB] hover:shadow-lg transition-all">
                <h2 className="text-gray-500">
                  Available Books
                </h2>

                <p className="text-4xl font-bold text-green-600">
                  {stats.availableBooks}
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E8F0EB] hover:shadow-lg transition-all">
                <h2 className="text-gray-500">
                  Borrowed Books
                </h2>

                <p className="text-4xl font-bold text-yellow-600">
                  {stats.borrowedBooks}
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E8F0EB] hover:shadow-lg transition-all">
                <h2 className="text-gray-500">
                  Overdue Books
                </h2>

                <p className="text-4xl font-bold text-red-600">
                  {stats.overdueBooks}
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E8F0EB] hover:shadow-lg transition-all">
                <h2 className="text-gray-500">
                  Students
                </h2>

                <p className="text-4xl font-bold text-blue-600">
                  {stats.students}
                </p>
              </div>

            </div>

            <div className="mt-10 bg-white rounded-2xl shadow-sm border border-[#E8F0EB] p-6">

              <h2 className="text-2xl font-bold text-[#365545] mb-6">
                Recent Activity
              </h2>

              {stats.recentBorrows?.length > 0 ? (

                <div className="space-y-4">

                  {stats.recentBorrows.map(
                    (item) => (

                      <div
                        key={item.id}
                        className="flex justify-between items-center border-b border-gray-100 pb-4"
                      >

                        <div>

                          <p className="font-medium text-gray-800">
                            <span className="font-bold text-[#365545]">
                              {item.user.name}
                            </span>
                            {' '}
                            borrowed
                            {' '}
                            <span className="font-semibold">
                              {item.book.title}
                            </span>
                          </p>

                          <p className="text-sm text-gray-500">
                            {new Date(
                              item.borrowDate,
                            ).toLocaleString()}
                          </p>

                        </div>

                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            item.status === 'OVERDUE'
                              ? 'bg-red-100 text-red-700'
                              : item.status === 'RETURNED'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {item.status}
                        </span>

                      </div>

                    ),
                  )}

                </div>

              ) : (

                <p className="text-gray-500">
                  No recent activity
                </p>

              )}

            </div>
          </>
        )}

      </div>

    </div>
  )
}

export default Dashboard