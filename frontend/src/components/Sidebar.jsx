import {
  Link,
  useNavigate,
} from 'react-router-dom'

function Sidebar() {
  const navigate =
    useNavigate()

  const user =
    JSON.parse(
      localStorage.getItem(
        'user',
      ),
    )

  const handleLogout =
    () => {
      localStorage.removeItem(
        'token',
      )

      localStorage.removeItem(
        'user',
      )

      navigate('/')
    }

  return (
    <div className="w-64 h-screen bg-[#365545] text-white p-5 fixed">

      <h1 className="text-2xl font-bold mb-10">
        Library
      </h1>

      <div className="flex flex-col gap-4">

        {user?.role ===
          'ADMIN' && (
          <>
            <Link
              to="/dashboard"
              className="
              text-gray-100
              hover:text-white
              hover:bg-[#4F7C65]
              rounded-lg
              p-2
              transition-all
              "
            >
              Dashboard
            </Link>

            <Link
              to="/admin-books"
              className="
              text-gray-100
              hover:text-white
              hover:bg-[#4F7C65]
              rounded-lg
              p-2
              transition-all
              "
            >
              Manage Books
            </Link>
          </>
        )}

        <Link
          to="/books"
          className="
          text-gray-100
          hover:text-white
          hover:bg-[#4F7C65]
          rounded-lg
          p-2
          transition-all
          "
        >
          Books
        </Link>

        <Link
          to="/borrowed-books"
          className="
          text-gray-100
          hover:text-white
          hover:bg-[#4F7C65]
          rounded-lg
          p-2
          transition-all
"
        >
          Borrowed Books
        </Link>

        <button
          onClick={
            handleLogout
          }
          className="bg-red-500 p-2 rounded mt-10"
        >
          Logout
        </button>

      </div>

    </div>
  )
}

export default Sidebar