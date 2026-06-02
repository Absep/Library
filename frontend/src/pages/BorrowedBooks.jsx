import {
  useEffect,
  useState,
} from 'react'
import toast from 'react-hot-toast'
import api
from '../services/api'

import Sidebar
from '../components/Sidebar'

function BorrowedBooks() {
  const [books, setBooks] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [collapsed, setCollapsed] =
  useState(false)

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
        const token =
          localStorage.getItem(
            'token',
          )

        const endpoint =
          user.role ===
          'ADMIN'
            ? '/borrow'
            : `/borrow/my/${user.id}`

        const response =
          await api.get(
            endpoint,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            },
          )

        // Remove duplicate books for admin
        if (
          user.role ===
          'ADMIN'
        ) {
          const uniqueBooks =
            Object.values(
              response.data.reduce(
                (
                  acc,
                  item,
                ) => {
                  const key =
                    `${item.userId}-${item.bookId}`

                  if (
                    !acc[
                      key
                    ] ||
                    new Date(
                      item.borrowDate,
                    ) >
                      new Date(
                        acc[
                          key
                        ]
                          .borrowDate,
                      )
                  ) {
                    acc[
                      key
                    ] =
                      item
                  }

                  return acc
                },
                {},
              ),
            )

          setBooks(
            uniqueBooks,
          )

        } else {
          setBooks(
            response.data,
          )
        }

      } catch (error) {
        console.log(error)

      } finally {
        setLoading(false)
      }
    }

  const returnBook =
    async (id) => {
      try {
        const token =
          localStorage.getItem(
            'token',
          )

        await api.patch(
          `/borrow/return/${id}`,
          {},
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          },
        )

        toast.success(
          'Book Returned Successfully',
        )

        setBooks(
          (
            prevBooks,
          ) =>
            prevBooks.filter(
              (
                book,
              ) =>
                book.id !==
                id,
            ),
        )

      } catch (error) {
        console.log(error)

        toast.error(
          error.response?.data
            ?.message ||
            'Could not return book',
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
          Borrowed Books
        </h1>

        {loading ? (
          <p>
            Loading...
          </p>
        ) : books.length ===
          0 ? (
          <p>
            No borrowed
            books
          </p>
        ) : (
          <div className="grid gap-4">

            {books.map(
              (
                borrow,
              ) => (
                <div
                  key={
                    borrow.id
                  }
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100"
                >

                  <h2 className="text-2xl font-bold">
                    {
                      borrow.book
                        ?.title
                    }
                  </h2>

                  <p className="text-gray-600">
                    Author:
                    {' '}
                    {
                      borrow.book
                        ?.author
                    }
                  </p>

                  <p>
                    Copy Number:
                    {' '}
                    <span className="font-semibold">
                      {borrow.copyNumber}
                    </span>
                  </p>


                  <p>
                    Category:
                    {' '}
                    {
                      borrow.book
                        ?.category
                    }
                  </p>

                  {user.role ===
                    'ADMIN' && (
                    <p>
                      Student:
                      {' '}
                      {
                        borrow.user
                          ?.name
                      }
                    </p>
                  )}

                  <p className="mt-2">
                    Status:{' '}
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        borrow.status === 'OVERDUE'
                          ? 'bg-red-100 text-red-700'
                          : borrow.status === 'BORROWED'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {borrow.status}
                    </span>
                  </p>

                  <p>
                    Due Date:
                    {' '}
                    {new Date(
                      borrow.dueDate,
                    ).toLocaleDateString()}
                  </p>

                  {/* Fine */}
                  {borrow.fine >
                    0 && (
                    <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-red-700 font-bold">
                        Outstanding Fine: ₹{borrow.fine}
                      </p>
                    </div>
                  )}

                  {user.role ===
                    'STUDENT' &&
                    borrow.status !==
                      'RETURNED' && (
                    <button
                      onClick={() =>
                        returnBook(
                          borrow.id,
                        )
                      }
                      className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                    >
                      Return
                      Book
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

export default BorrowedBooks