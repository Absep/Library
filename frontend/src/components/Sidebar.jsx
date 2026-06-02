import {
  NavLink,
  useNavigate,
} from 'react-router-dom'

import {
  FaChartBar,
  FaTools,
  FaBook,
  FaBookOpen,
  FaHistory,
  FaSignOutAlt,
  FaBars,
} from 'react-icons/fa'

function Sidebar({
  collapsed,
  setCollapsed,
}) {
  const navigate =
    useNavigate()

  const user = JSON.parse(
    localStorage.getItem('user'),
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

  const toggleSidebar =
    () => {
      const newValue =
        !collapsed

      setCollapsed(newValue)

      localStorage.setItem(
        'sidebarCollapsed',
        JSON.stringify(
          newValue,
        ),
      )
    }

  const linkClass = ({
    isActive,
  }) =>
    `
    flex
    items-center
    ${
      collapsed
        ? 'justify-center'
        : 'gap-3'
    }
    p-3
    rounded-lg
    transition-all
    duration-200
    ${
      isActive
        ? `
          bg-[#4F7C65]
          text-white
          shadow-lg
          border-l-4
          border-white
        `
        : `
          hover:bg-[#4F7C65]
          hover:translate-x-1
        `
    }
  `

  return (
    <div
      className={`
        h-screen
        min-h-screen
        bg-[#365545]
        text-white
        flex
        flex-col
        flex-shrink-0
        shadow-lg
        transition-all
        duration-300
        ${
          collapsed
            ? 'w-16'
            : 'w-56'
        }
      `}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-3 py-4 border-b border-[#4F7C65]">

        <button
          onClick={
            toggleSidebar
          }
          className="
            w-10
            h-10
            flex
            items-center
            justify-center
            rounded-lg
            hover:bg-[#4F7C65]
            transition-all
          "
        >
          <FaBars size={18} />
        </button>

        {!collapsed && (
          <h1 className="text-xl font-bold">
            Library
          </h1>
        )}

      </div>

      {/* Navigation */}
      <div className="flex flex-col gap-2 p-2 mt-3 flex-1">

        {user?.role ===
          'ADMIN' && (
          <>
            <NavLink
              to="/dashboard"
              className={
                linkClass
              }
              title="Dashboard"
            >
              <FaChartBar
                size={18}
              />

              {!collapsed && (
                <span>
                  Dashboard
                </span>
              )}
            </NavLink>

            <NavLink
              to="/admin-books"
              className={
                linkClass
              }
              title="Manage Books"
            >
              <FaTools
                size={18}
              />

              {!collapsed && (
                <span>
                  Manage Books
                </span>
              )}
            </NavLink>
          </>
        )}

        <NavLink
        to="/history"
        className={
          linkClass
        }
        title="History"
      >
        <FaHistory
          size={18}
        />

        {!collapsed && (
          <span>
            History
          </span>
        )}
      </NavLink>

        <NavLink
          to="/books"
          className={
            linkClass
          }
          title="Books"
        >
          <FaBook
            size={18}
          />

          {!collapsed && (
            <span>
              Books
            </span>
          )}
        </NavLink>

        <NavLink
          to="/borrowed-books"
          className={
            linkClass
          }
          title="Borrowed Books"
        >
          <FaBookOpen
            size={18}
          />

          {!collapsed && (
            <span>
              Borrowed Books
            </span>
          )}
        </NavLink>

      </div>

      {/* Logout */}
      <div className="p-3 border-t border-[#4F7C65] flex justify-center">

        <button
          onClick={
            handleLogout
          }
          className={`
            bg-red-500
            hover:bg-red-600
            transition-all
            rounded-lg
            flex
            items-center
            justify-center
            ${
              collapsed
                ? 'w-10 h-10'
                : 'w-full py-2 gap-2'
            }
          `}
        >
          <FaSignOutAlt
            size={18}
          />

          {!collapsed && (
            <span>
              Logout
            </span>
          )}
        </button>

      </div>

    </div>
  )
}

export default Sidebar