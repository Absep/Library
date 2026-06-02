import { useEffect, useState } from 'react'
import api from '../services/api'
import Sidebar from '../components/Sidebar'

function AdminBooks() {
  const [books, setBooks] = useState([])
  const [search, setSearch] =
    useState('')
  const [collapsed, setCollapsed] =
    useState(false)

  const [form, setForm] = useState({
    title: '',
    author: '',
    category: '',
    availableCopies: 1,
  })

  const [editingId, setEditingId] =
    useState(null)

  useEffect(() => {
    fetchBooks()
  }, [search])

  const fetchBooks = async () => {
    try {
      const token =
        localStorage.getItem(
          'token',
        )

      const response =
        await api.get(
          `/books?search=${search}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          },
        )

      setBooks(
        response.data.data ||
          response.data,
      )

    } catch (error) {
      console.log(error)
    }
  }

  const handleChange = (
    e,
  ) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    })
  }

  const handleSubmit =
    async (e) => {
      e.preventDefault()

      try {
        const token =
          localStorage.getItem(
            'token',
          )

        const bookData = {
          ...form,

          quantity:
            Number(
              form.availableCopies,
            ),

          availableCopies:
            Number(
              form.availableCopies,
            ),

          isbn:
            editingId
              ? undefined
              : `BOOK-${Date.now()}`,
        }

        if (editingId) {
          delete bookData.isbn

          await api.patch(
            `/books/${editingId}`,
            bookData,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            },
          )

          alert(
            'Book updated successfully',
          )

        } else {
          await api.post(
            '/books',
            bookData,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            },
          )

          alert(
            'Book added successfully',
          )
        }

        setForm({
          title: '',
          author: '',
          category: '',
          availableCopies: 1,
        })

        setEditingId(
          null,
        )

        fetchBooks()

      } catch (error) {
        console.log(error)

        alert(
          error.response?.data
            ?.message ||
            'Operation failed',
        )
      }
    }

  const handleEdit = (
    book,
  ) => {
    setEditingId(
      book.id,
    )

    setForm({
      title:
        book.title,
      author:
        book.author,
      category:
        book.category,
      availableCopies:
        book.availableCopies,
    })
  }

  const handleDelete =
    async (id) => {
      const confirmDelete =
        window.confirm(
          'Delete this book?',
        )

      if (
        !confirmDelete
      ) {
        return
      }

      try {
        const token =
          localStorage.getItem(
            'token',
          )

        await api.delete(
          `/books/${id}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          },
        )

        alert(
          'Book deleted successfully',
        )

        fetchBooks()

      } catch (error) {
        console.log(error)

        alert(
          error.response?.data
            ?.message ||
            'Delete failed',
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
          Manage Books
        </h1>

        <input
          type="text"
          placeholder="Search by title, author or category..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value,
            )
          }
          className="border p-3 rounded w-full mb-6"
        />

        <form
          onSubmit={
            handleSubmit
          }
          className="bg-white p-6 rounded-xl shadow mb-8"
        >
          <div className="grid md:grid-cols-2 gap-4">

            <input
              type="text"
              name="title"
              placeholder="Book Title"
              value={
                form.title
              }
              onChange={
                handleChange
              }
              className="border p-3 rounded"
              required
            />

            <input
              type="text"
              name="author"
              placeholder="Author"
              value={
                form.author
              }
              onChange={
                handleChange
              }
              className="border p-3 rounded"
              required
            />

            <input
              type="text"
              name="category"
              placeholder="Category"
              value={
                form.category
              }
              onChange={
                handleChange
              }
              className="border p-3 rounded"
              required
            />

            <input
              type="number"
              name="availableCopies"
              placeholder="Number of Copies"
              value={
                form.availableCopies
              }
              onChange={
                handleChange
              }
              className="border p-3 rounded"
              required
            />

          </div>

          <button
            type="submit"
            className="mt-4 bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
          >
            {editingId
              ? 'Update Book'
              : 'Add Book'}
          </button>

        </form>

        <div className="grid gap-4">

          {books.length ===
          0 ? (
            <div className="bg-white p-6 rounded-xl shadow">
              No books found
            </div>
          ) : (
            books.map(
              (
                book,
              ) => (
                <div
                  key={
                    book.id
                  }
                  className="bg-white p-5 rounded-xl shadow"
                >
                  <h2 className="text-2xl font-bold">
                    {
                      book.title
                    }
                  </h2>

                  <p>
                    Author:{' '}
                    {
                      book.author
                    }
                  </p>

                  <p>
                    Category:{' '}
                    {
                      book.category
                    }
                  </p>

                  <p>
                    Available
                    Copies:{' '}
                    {
                      book.availableCopies
                    }
                  </p>

                  <div className="flex gap-3 mt-4">

                    <button
                      onClick={() =>
                        handleEdit(
                          book,
                        )
                      }
                      className="bg-yellow-500 text-white px-4 py-2 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(
                          book.id,
                        )
                      }
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      Delete
                    </button>

                  </div>
                </div>
              ),
            )
          )}

        </div>

      </div>
    </div>
  )
}

export default AdminBooks