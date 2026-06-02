import {
  useEffect,
  useState,
} from 'react'
import toast from 'react-hot-toast'
import api
from '../services/api'

import Sidebar
from '../components/Sidebar'

import useDebounce
from '../hooks/useDebounce'

function Books() {
  const [books, setBooks] =
    useState([])
  
  const [collapsed, setCollapsed] =
  useState(false)

  const [search, setSearch] =
    useState('')

  const [page, setPage] =
    useState(1)

  const [
    totalPages,
    setTotalPages,
  ] = useState(1)

  const [loading, setLoading] =
    useState(true)

  const debouncedSearch =
    useDebounce(
      search,
      500,
    )

  const user =
    JSON.parse(
      localStorage.getItem(
        'user',
      ),
    )

  useEffect(() => {
    fetchBooks()
  }, [
    page,
    debouncedSearch,
  ])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  const fetchBooks =
    async () => {
      try {
        setLoading(true)

        const token =
          localStorage.getItem(
            'token',
          )

        const response =
          await api.get(
            `/books?page=${page}&limit=5&search=${debouncedSearch}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            },
          )

        setBooks(
          response.data.data,
        )

        setTotalPages(
          response.data.totalPages,
        )

      } catch (error) {
        console.log(error)

      } finally {
        setLoading(false)
      }
    }

  const handleBorrow =
    async (bookId) => {
      try {
        const token =
          localStorage.getItem(
            'token',
          )

        await api.post(
          `/borrow/${user.id}/${bookId}`,
          {},
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          },
        )

        toast.success(
          'Book Borrowed Successfully',
        )

        fetchBooks()

      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
          'Could not borrow book',
        )
      }
    }
    

  return (
    <div className="flex">

      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <div className="flex-1 min-h-screen bg-[#F8F7F4] p-10">

        <h1 className="text-4xl font-bold mb-6">
          Books
        </h1>

        <div className="mb-8">

          <input
            type="text"
            placeholder="Search by title, author or category..."
            className="
            w-full
            p-4
            rounded-xl
            bg-white
            border
            border-[#DDE6E0]
            focus:outline-none
            focus:ring-2
            focus:ring-[#4F7C65]
            "
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value,
              )
            }
          />

        </div>

        {loading ? (
          <p>
            Loading...
          </p>
        ) : books.length === 0 ? (
          <p>
            No books found
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {books.map(
                (book) => (
                  <div
                    key={book.id}
                    className="bg-white
                    rounded-2xl
                    shadow-sm
                    border
                    border-[#E8F0EB]
                    hover:shadow-lg
                    transition-all
                    duration-300 p-5"
                  >

                    <h2 className="text-2xl font-bold">
                      {
                        book.title
                      }
                    </h2>

                    <p className="text-gray-600">
                      {
                        book.author
                      }
                    </p>

                    <p className="mt-2">
                      Category:{' '}
                      {
                        book.category
                      }
                    </p>

                    <p>
                      Available:{' '}
                      {
                        book.availableCopies
                      }
                    </p>

                    {user.role ===
                      'STUDENT' && (
                      <button
                        onClick={() =>
                          handleBorrow(
                            book.id,
                          )
                        }
                        className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
                      >
                        Borrow
                      </button>
                    )}

                  </div>
                ),
              )}

            </div>

            <div className="flex justify-center items-center gap-4 mt-8">

              <button
                disabled={
                  page === 1
                }
                onClick={() =>
                  setPage(
                    page - 1,
                  )
                }
                className="px-4 py-2 bg-[#4F7C65]
hover:bg-[#365545] text-white rounded disabled:bg-gray-300"
              >
                Previous
              </button>

              <span className="font-semibold">
                Page {page} of {totalPages}
              </span>

              <button
                disabled={
                  page === totalPages
                }
                onClick={() =>
                  setPage(
                    page + 1,
                  )
                }
                className="px-4 py-2 bg-[#4F7C65]
hover:bg-[#365545] text-white rounded disabled:bg-gray-300"
              >
                Next
              </button>

            </div>
          </>
        )}

      </div>

    </div>
  )
}

export default Books