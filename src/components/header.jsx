import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FaMapMarkerAlt,
  FaSearch,
  FaShoppingCart,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import { getProduct } from "../services/api.product";
import { useAuth } from '../contexts/AuthContext';

function Header() {
  const { authState, updateAuthState } = useAuth();
  const [showAuthOptions, setShowAuthOptions] = useState(false); // State để control dropdown
  const [searchTerm, setSearchTerm] = useState(""); // State để lưu trữ từ khóa tìm kiếm
  const [suggestions, setSuggestions] = useState([]); // State để lưu trữ gợi ý sản phẩm
  const navigate = useNavigate();

  // Hàm xử lý thay đổi tìm kiếm
  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value) {
      const products = await getProduct(); // Gọi getProduct để lấy product
      const filteredSuggestions = products.filter(
        (
          product //lọc product theo tên
        ) => product.productName.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(
        filteredSuggestions.length > 0
          ? filteredSuggestions
          : [{ productName: "Product not found" }]
      ); // Cập nhật gợi ý sản phẩm
    } else {
      setSuggestions([{ productName: "Product not found" }]); // Nếu không có từ khóa, hiển thị từ không tìm thấy
    }
  };

  // Hàm xử lý submit tìm kiếm
  const handleSearchSubmit = () => {
    if (searchTerm) {
      navigate(`/product-search?query=${encodeURIComponent(searchTerm)}`); // Điều hướng đến trang tìm kiếm
    }
  };

  // Hàm xử lý click ngoài
  const handleClickOutside = () => {
    setSuggestions([]); // Đặt lại gợi ý khi nhấp chuột ra ngoài
  };

  // Sử dụng useEffect để thêm sự kiện click cho toàn bộ tài liệu
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      // Xóa sự kiện khi component bị hủy
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Hàm xử lý logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setShowAuthOptions(false);
    
    // Update auth context when logging out
    updateAuthState({
      isAuthenticated: false,
      user: null
    });
    
    navigate("/login");
  };

  // Hàm để lấy chữ cái đầu của email cho avatar
  const getInitials = (email) => {
    return email ? email.charAt(0).toUpperCase() : "U";
  };

  return (
    <header className="bg-pink-50 fixed top-0 left-0 w-full z-50 shadow-md border-b border-pink-100">
      {" "}
      {/*tạo header cố định*/}
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex justify-between items-center py-6">
          <div className="flex space-x-4">
            <Link
              to="/"
              className="text-4xl font-bold text-pink-600 tracking-wider hover:text-pink-700 
                transform hover:scale-105 transition-all duration-300"
            >
              SKINNE
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex items-center space-x-8">
            <div className="relative group">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="What are you looking for?"
                  className="w-80 px-6 py-3 rounded-full bg-white/80 backdrop-blur-sm 
                    border-2 border-pink-200 focus:border-pink-400 
                    shadow-sm hover:shadow-md transition-all duration-300
                    placeholder:text-gray-400 text-gray-700
                    focus:outline-none focus:ring-2 focus:ring-pink-200 focus:ring-opacity-50"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
                />
                <button
                  onClick={handleSearchSubmit}
                  className="absolute right-4 p-2 hover:bg-pink-100 rounded-full transition-colors duration-300"
                >
                  <FaSearch className="text-pink-500 text-lg" />
                </button>
              </div>

              {suggestions.length > 0 && (
                <div
                  className="absolute z-10 w-full bg-white/95 backdrop-blur-sm 
                  border border-pink-100 rounded-2xl mt-2 max-h-60 overflow-y-auto
                  shadow-lg transition-all duration-300"
                >
                  {suggestions.map((product) => (
                    <Link
                      key={product.productId}
                      to={
                        product.productName === "Product not found"
                          ? "#"
                          : `/product-detail/${product.productId}`
                      }
                      className="block px-4 py-3 hover:bg-pink-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        {product.productName === "Product not found" ? (
                          <div className="text-center w-full text-pink-500 font-medium">
                            Product not found
                          </div>
                        ) : (
                          <>
                            <img
                              src={product.image}
                              alt={product.productName}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <p className="text-gray-800 font-medium">
                                {product.productName}
                              </p>
                              <p className="text-pink-500 font-semibold">
                                {product.price} VND
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Navigation Icons */}
            <div className="flex items-center space-x-6">
              {/* Location Icon */}
              <div className="relative group">
                <Link
                  to="/location"
                  className="p-2 rounded-full hover:bg-pink-100 transition-all duration-300 block"
                >
                  <FaMapMarkerAlt className="text-pink-600 text-2xl transform group-hover:scale-110 transition-transform" />
                </Link>
              </div>

              {/* Login Icon with Dropdown */}
              <div
                className="relative group"
                onMouseEnter={() => setShowAuthOptions(true)}
                onMouseLeave={() => setShowAuthOptions(false)}
              >
                <button className="p-2 rounded-full hover:bg-pink-100 transition-all duration-300">
                  {authState.user ? (
                    <div className="w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {getInitials(authState.user.email)}
                      </span>
                    </div>
                  ) : (
                    <FaUser className="text-pink-600 text-2xl transform group-hover:scale-110 transition-transform" />
                  )}
                </button>
                {/* Dropdown Menu */}
                {showAuthOptions && (
                  <div
                    className="absolute right-0 w-56 bg-white/95 backdrop-blur-sm 
                    rounded-2xl shadow-lg border border-pink-100 overflow-hidden transform 
                    transition-all duration-300 ease-out z-50 top-[calc(100%-5px)]"
                  >
                    <div className="p-4 bg-gradient-to-r from-pink-100/50 to-pink-50/50">
                      <h3 className="text-pink-600 font-semibold text-lg mb-1">
                        {authState.user ? `Welcome!` : "Welcome!"}
                      </h3>
                      <p className="text-gray-600 text-s">
                        {authState.user
                          ? authState.user.user
                          : "Please login or create an account"}
                      </p>
                    </div>
                    <div className="p-2">
                      {authState.user ? (
                        // Menu cho user đã đăng nhập
                        <>
                          <Link
                            to={`/profile/${authState.user.id}`}
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
                        </>
                      ) : (
                        // Menu cho user chưa đăng nhập
                        <>
                          <Link
                            to="/login"
                            className="flex items-center space-x-2 px-4 py-3 text-gray-700 
                              hover:bg-pink-50 rounded-xl hover:text-pink-600 transition-colors"
                          >
                            <span className="p-1 bg-pink-100 rounded-lg">
                              <FaUser className="text-pink-500 text-sm" />
                            </span>
                            <span className="font-medium">Login</span>
                          </Link>
                          <Link
                            to="/register"
                            className="flex items-center space-x-2 px-4 py-3 text-gray-700 
                              hover:bg-pink-50 rounded-xl hover:text-pink-600 transition-colors"
                          >
                            <span className="p-1 bg-pink-100 rounded-lg">
                              <FaUser className="text-pink-500 text-sm" />
                            </span>
                            <span className="font-medium">Sign Up</span>
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Cart Icon */}
              <div className="relative group">
                <Link
                  to="/cart"
                  className="p-2 rounded-full hover:bg-pink-100 transition-all duration-300 block"
                >
                  <FaShoppingCart className="text-pink-600 text-2xl transform group-hover:scale-110 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="py-4 border-t border-pink-100/50">
          <ul className="flex justify-center space-x-8">
            <li>
              <NavLink
                to="/moisturizer"
                className={({ isActive }) => `
                  text-gray-700 relative py-2 transition-colors
                  hover:text-pink-600
                  after:content-[''] after:absolute after:left-0 after:bottom-0 
                  after:w-full after:h-0.5 after:bg-pink-400
                  after:transform after:transition-transform
                  ${
                    isActive
                      ? "text-pink-600 after:scale-x-100"
                      : "after:scale-x-0 hover:after:scale-x-100"
                  }
                `}
              >
                MOISTURIZER
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/serum"
                className={({ isActive }) => `
                  text-gray-700 relative py-2 transition-colors
                  hover:text-pink-600
                  after:content-[''] after:absolute after:left-0 after:bottom-0 
                  after:w-full after:h-0.5 after:bg-pink-400
                  after:transform after:transition-transform
                  ${
                    isActive
                      ? "text-pink-600 after:scale-x-100"
                      : "after:scale-x-0 hover:after:scale-x-100"
                  }
                `}
              >
                SERUM
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/cleanser"
                className={({ isActive }) => `
                  text-gray-700 relative py-2 transition-colors
                  hover:text-pink-600
                  after:content-[''] after:absolute after:left-0 after:bottom-0 
                  after:w-full after:h-0.5 after:bg-pink-400
                  after:transform after:transition-transform
                  ${
                    isActive
                      ? "text-pink-600 after:scale-x-100"
                      : "after:scale-x-0 hover:after:scale-x-100"
                  }
                `}
              >
                CLEANSER
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/sunscreen"
                className={({ isActive }) => `
                  text-gray-700 relative py-2 transition-colors
                  hover:text-pink-600
                  after:content-[''] after:absolute after:left-0 after:bottom-0 
                  after:w-full after:h-0.5 after:bg-pink-400
                  after:transform after:transition-transform
                  ${
                    isActive
                      ? "text-pink-600 after:scale-x-100"
                      : "after:scale-x-0 hover:after:scale-x-100"
                  }
                `}
              >
                SUN SCREEN
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/face-mask"
                className={({ isActive }) => `
                  text-gray-700 relative py-2 transition-colors
                  hover:text-pink-600
                  after:content-[''] after:absolute after:left-0 after:bottom-0 
                  after:w-full after:h-0.5 after:bg-pink-400
                  after:transform after:transition-transform
                  ${
                    isActive
                      ? "text-pink-600 after:scale-x-100"
                      : "after:scale-x-0 hover:after:scale-x-100"
                  }
                `}
              >
                FACE MASK
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/promotion"
                className={({ isActive }) => `
                  text-gray-700 relative py-2 transition-colors
                  hover:text-pink-600
                  after:content-[''] after:absolute after:left-0 after:bottom-0 
                  after:w-full after:h-0.5 after:bg-pink-400
                  after:transform after:transition-transform
                  ${
                    isActive
                      ? "text-pink-600 after:scale-x-100"
                      : "after:scale-x-0 hover:after:scale-x-100"
                  }
                `}
              >
                SPECIAL OFFERS
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/skin-test"
                className={({ isActive }) => `
                  text-gray-700 relative py-2 transition-colors
                  hover:text-pink-600
                  after:content-[''] after:absolute after:left-0 after:bottom-0 
                  after:w-full after:h-0.5 after:bg-pink-400
                  after:transform after:transition-transform
                  ${
                    isActive
                      ? "text-pink-600 after:scale-x-100"
                      : "after:scale-x-0 hover:after:scale-x-100"
                  }
                `}
              >
                SKIN TEST
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className={({ isActive }) => `
                  text-gray-700 relative py-2 transition-colors
                  hover:text-pink-600
                  after:content-[''] after:absolute after:left-0 after:bottom-0 
                  after:w-full after:h-0.5 after:bg-pink-400
                  after:transform after:transition-transform
                  ${
                    isActive
                      ? "text-pink-600 after:scale-x-100"
                      : "after:scale-x-0 hover:after:scale-x-100"
                  }
                `}
              >
                ABOUT US
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
