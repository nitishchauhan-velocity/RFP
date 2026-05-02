import { NavLink, Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import { useAuthStore } from '@/store/authStore'

const Layout = () => {
  const {type} = useAuthStore();
  return (
    <>
    {type==="admin"?(
    <div className="flex bg-gray-100">
        <nav className=" min-h-screen w-64 bg-white ">
          <aside className="p-8">

            <h2 className="text-xl font-bold mb-6 text-black">Admin Dashboard</h2>
            <ul className="">
                <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded-md ${
                      isActive
                        ? " text-red-600 font-bold"
                        : "text-black hover:bg-gray-300"
                    }`
                  }
                >
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/vendors-list"
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded-md ${
                      isActive
                        ? " text-red-600 font-bold"
                        : "text-black hover:bg-gray-300"
                    }`
                  }
                >
                  Vendors
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/categories"
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded-md  ${
                      isActive
                        ? " text-red-600 font-semibold"
                        : "text-black hover:bg-gray-300"
                    }`
                  }
                >
                  Categories
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/rfp-list"
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded-md  ${
                      isActive
                        ? " text-red-600 font-semibold"
                        : "text-black hover:bg-gray-300"
                    }`
                  }
                >
                    RFP List
                </NavLink>
              </li>
            </ul>
          </aside>
        </nav>
      <main className="flex-1">
        <Navbar/>
        <Outlet />
      </main>
    </div>
    ):(<div className="flex bg-gray-100">
        <nav className=" min-h-screen w-64 bg-white ">
          <aside className="p-8">

            <h2 className="text-xl font-bold mb-6 text-black">Vendor Dashboard</h2>
            <ul className="">
                <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded-md ${
                      isActive
                        ? " text-red-600 font-bold"
                        : "text-black hover:bg-gray-300"
                    }`
                  }
                >
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/rfp-for-quotes"
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded-md  ${
                      isActive
                        ? " text-red-600 font-semibold"
                        : "text-black hover:bg-gray-300"
                    }`
                  }
                >
                    RFP For Quotes
                </NavLink>
              </li>
            </ul>
          </aside>
        </nav>
      <main className="flex-1">
        <Navbar/>
        <Outlet />
      </main>
    </div>)}
    </>
  )
}

export default Layout
