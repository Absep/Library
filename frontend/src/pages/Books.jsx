import {
  useEffect,
  useState,
} from 'react'

import api
from '../services/api'

import Sidebar
from '../components/Sidebar'

function Books() {
  const [books, setBooks] =
    useState([])

  const [search, setSearch] =
    useState('')

  const [loading, setLoading] =
    useState(true)

  const user =
    JSON.parse(
      localStorage.getItem(
        'user',
      ),
    )

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks =
    async () => {
      try {
        const response =
          await api.get(
            `/books?search=${search}`,
          )

        setBooks(
          response.data.data,
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

        alert(
          'Book Borrowed Successfully',
        )

        fetchBooks()

      } catch (error) {
        alert(
          error.response?.data
            ?.message ||
          'Could not borrow book',
        )
      }
    }

  return (
    <div className="flex">

      <Sidebar />

      <div className="ml-64 min-h-screen bg-gray-100 p-10 w-full">

        <h1 className="text-4xl font-bold mb-6">
          Books
        </h1>

        <div className="flex gap-3 mb-8">

          <input
            type="text"
            placeholder="Search books..."
            className="border p-3 rounded w-full"
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value,
              )
            }
          />

          <button
            onClick={
              fetchBooks
            }
            className="bg-blue-500 text-white px-6 rounded"
          >
            Search
          </button>

        </div>

        {loading ? (
          <p>
            Loading...
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {books.map(
              (book) => (
                <div
                  key={book.id}
                  className="bg-white rounded-xl shadow p-5"
                >
                  <h2 className="text-2xl font-bold">
                    {book.title}
                  </h2>

                  <p className="text-gray-600">
                    {
                      book.author
                    }
                  </p>

                  <p className="mt-2">
                    Category:
                    {' '}
                    {
                      book.category
                    }
                  </p>

                  <p>
                    Available:
                    {' '}
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
        )}

      </div>
    </div>
  )
}

export default Books