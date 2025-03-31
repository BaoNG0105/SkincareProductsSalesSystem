import { Outlet, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';

const DashboardLayout = () => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const isManager = token ? jwtDecode(token).role === 'Manager' : false;
  const isStaff = token ? jwtDecode(token).role === 'Staff' : false;
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const user = token ? jwtDecode(token) : null;

  // Hàm xử lý logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Hàm để lấy chữ cái đầu của email cho avatar
  const getInitials = (email) => {
    return email ? email.charAt(0).toUpperCase() : "U";
  };

  // Redirect to overview if at /dashboard
  if (location.pathname === '/dashboard/') {
    return <Navigate to="/dashboard/" replace />;
  }

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-pink-300 text-white h-screen fixed overflow-y-auto">
        <div className="p-4 text-center text-xl font-extrabold">MENU</div>
        <nav>
          <ul>

            {isManager && (
              <li className="p-4 hover:bg-pink-200">
                <a href="/dashboard/overview" className="flex items-center">
                  <span className="material-icons">bar_chart</span>
                  <span className="ml-2">Overview</span>
                </a>
              </li>
            )}

            {isStaff && (
              <li className="p-4 hover:bg-pink-200">
                <a href="/dashboard/order" className="flex items-center">
                  <span className="material-icons">shopping_cart</span>
                <span className="ml-2">Order</span>
                </a>
              </li>
            )}

            {isStaff && (
              <li className="p-4 hover:bg-pink-200">
                <a href="/dashboard/product" className="flex items-center">
                  <span className="material-icons">inventory</span>
                <span className="ml-2">Product</span>
                </a>
              </li>
            )}

            {isStaff && (
              <li className="p-4 hover:bg-pink-200">
                <a href="/dashboard/promotion" className="flex items-center">
                  <span className="material-icons">discount</span>
                  <span className="ml-2">Promotion</span>
                </a>
              </li>
            )}

            {isStaff && (
              <li className="p-4 hover:bg-pink-200">
                <a href="/dashboard/rating" className="flex items-center">
                  <span className="material-icons">star</span>
                  <span className="ml-2">Rating - Feedback</span>
                </a>
              </li>
            )}
            
            {isManager && (
              <li className="p-4 hover:bg-pink-200">
                <a href="/dashboard/staff" className="flex items-center">
                  <span className="material-icons">people</span>
                  <span className="ml-2">Staff</span>
                </a>
              </li>
            )}

            {isStaff && (
              <li className="p-4 hover:bg-pink-200">
                <a href="/dashboard/customer" className="flex items-center">
                  <span className="material-icons">person</span>
                <span className="ml-2">Customer</span>
              </a>
            </li>
            )}

          </ul>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col ml-64">
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <div className="w-1/3"></div> {/* Spacer */}
          <h1 className="text-2xl text-pink-600 font-extrabold w-1/3 text-center">Dashboard</h1>
          
          {/* User Menu */}
          <div className="relative w-1/3 flex justify-end">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="p-2 rounded-full hover:bg-pink-100 transition-all duration-300"
            >
              {user && (
                <div className="w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {getInitials(user.email)}
                  </span>
                </div>
              )}
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 w-56 bg-white/95 backdrop-blur-sm 
                rounded-2xl shadow-lg border border-pink-100 overflow-hidden transform 
                transition-all duration-300 ease-out z-50 top-[calc(100%+5px)]"
              >
                <div className="p-4 bg-gradient-to-r from-pink-100/50 to-pink-50/50">
                  <h3 className="text-pink-600 font-semibold text-lg mb-1">
                    Welcome!
                  </h3>
                  <p className="text-gray-600 text-s">
                    {user?.user}
                  </p>
                </div>
                <div className="p-2">
                  <Link
                    to={`/profile/${user?.id}`}
                    className="flex items-center space-x-2 px-4 py-3 text-gray-700 
                      hover:bg-pink-50 rounded-xl hover:text-pink-600 transition-colors"
                  >
                    <span className="p-1 bg-pink-100 rounded-lg">
                      <FaUser className="text-pink-500 text-sm" />
                    </span>
                    <span className="font-medium">Profile</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-3 text-gray-700 w-full
                      hover:bg-pink-50 rounded-xl hover:text-pink-600 transition-colors"
                  >
                    <span className="p-1 bg-pink-100 rounded-lg">
                      <FaSignOutAlt className="text-pink-500 text-sm" />
                    </span>
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>
        <main className="flex-1 p-4 bg-pink-100">
          <div className="bg-white p-6 rounded-lg shadow">
            {/* thay the page trong children */}
            <Outlet />
          </div>
        </main>
        <footer className="bg-white text-center p-4">
          Skinne  ©{new Date().getFullYear()} Created by Skinne
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;