import {
  useEffect,
  useState,
} from 'react'

import api from '../services/api'
import Sidebar from '../components/Sidebar'

function History() {
  const [history, setHistory] =
    useState([])

  const [page, setPage] =
    useState(1)

  const [totalPages, setTotalPages] =
    useState(1)

  const [student, setStudent] =
    useState('')

  const [status, setStatus] =
    useState('')

  const [collapsed, setCollapsed] =
    useState(
      JSON.parse(
        localStorage.getItem(
          'sidebarCollapsed',
        ),
      ) || false,
    )

  useEffect(() => {
    fetchHistory()
  }, [
    page,
    student,
    status,
  ])

  const fetchHistory =
    async () => {
      try {
        const token =
          localStorage.getItem(
            'token',
          )

        const response =
          await api.get(
            `/borrow/history?page=${page}&limit=10&student=${student}&status=${status}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            },
          )

        setHistory(
          response.data.data,
        )

        setTotalPages(
          response.data
            .totalPages,
        )

      } catch (error) {
        console.log(error)
      }
    }

  return (
    <div className="flex">

      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <div className="flex-1 min-h-screen bg-[#F8F7F4] p-4 md:p-6 lg:p-10">

        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6">
          Transaction History
        </h1>

        {/* Filters */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

          <input
            type="text"
            placeholder="Search Student"
            value={student}
            onChange={(e) => {
              setPage(1)
              setStudent(
                e.target.value,
              )
            }}
            className="border p-3 rounded w-full"
          />

          <select
            value={status}
            onChange={(e) => {
              setPage(1)
              setStatus(
                e.target.value,
              )
            }}
            className="border p-3 rounded w-full"
          >
            <option value="">
              All Status
            </option>

            <option value="BORROWED">
              Borrowed
            </option>

            <option value="RETURNED">
              Returned
            </option>

            <option value="OVERDUE">
              Overdue
            </option>
          </select>

        </div>

        {/* Cards */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {history.map(
            (item) => (
              <div
                key={item.id}
                className="bg-white p-6 rounded-xl shadow"
              >

                <h2 className="text-xl font-bold mb-2">
                  {item.book?.title}
                </h2>

                <p>
                  <strong>
                    Student:
                  </strong>{' '}
                  {
                    item.user
                      ?.name
                  }
                </p>

                <p>
                  <strong>
                    Copy Number:
                  </strong>{' '}
                  {
                    item.copyNumber
                  }
                </p>

                <p>
                  <strong>
                    Borrow Date:
                  </strong>{' '}
                  {new Date(
                    item.borrowDate,
                  ).toLocaleDateString()}
                </p>

                <p>
                  <strong>
                    Due Date:
                  </strong>{' '}
                  {new Date(
                    item.dueDate,
                  ).toLocaleDateString()}
                </p>

                {item.returnDate && (
                  <p>
                    <strong>
                      Return Date:
                    </strong>{' '}
                    {new Date(
                      item.returnDate,
                    ).toLocaleDateString()}
                  </p>
                )}

                {item.fine >
                  0 && (
                  <p className="mt-2 text-red-600 font-semibold">
                    Fine:
                    ₹
                    {item.fine}
                  </p>
                )}

                <div className="mt-4">

                  <span
                    className={`
                      px-3
                      py-1
                      rounded-full
                      text-sm
                      font-semibold
                      ${
                        item.status ===
                        'RETURNED'
                          ? 'bg-green-100 text-green-700'
                          : item.status ===
                            'OVERDUE'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }
                    `}
                  >
                    {
                      item.status
                    }
                  </span>

                </div>

              </div>
            ),
          )}

        </div>

        {/* Pagination */}

        <div className="flex flex-wrap justify-center items-center gap-4 mt-8">

          <button
            disabled={
              page === 1
            }
            onClick={() =>
              setPage(
                page - 1,
              )
            }
            className="
              bg-[#365545]
              text-white
              px-4
              py-2
              rounded
              disabled:opacity-50
            "
          >
            Previous
          </button>

          <span>
            Page {page} of{' '}
            {totalPages}
          </span>

          <button
            disabled={
              page ===
              totalPages
            }
            onClick={() =>
              setPage(
                page + 1,
              )
            }
            className="
              bg-[#365545]
              text-white
              px-4
              py-2
              rounded
              disabled:opacity-50
            "
          >
            Next
          </button>

        </div>

      </div>

    </div>
  )
}

export default History