import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { postLogin } from "../../services/api.login";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode"; // Giải mã token
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { postRegister } from "../../services/api.register";
import { useAuth } from '../../contexts/AuthContext';

function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [isRememberMe, setIsRememberMe] = useState(false);

  const [errors] = useState({});

  const navigate = useNavigate();

  const { updateAuthState } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeRememberMe = (e) => {
    setIsRememberMe(e.target.checked);
  };

  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail }));
      setIsRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      Object.keys(errors).length === 0 &&
      Object.values(formData).every((x) => x !== "")
    ) {
      console.log("Submitting login with:", formData);
      try {
        const data = await postLogin(formData);
        console.log("Login response:", data);

        if (typeof data === "string") {
          const token = data;
          localStorage.setItem("token", token);
          if (isRememberMe) {
            localStorage.setItem("email", formData.email);
          } else {
            localStorage.removeItem("email");
          }
          toast.success("Login successful!");
          const decoded = jwtDecode(token);
          
          // Update auth context
          updateAuthState({
            isAuthenticated: true,
            user: decoded
          });

          const role = decoded.role;
          if (role === "Customer") {
            navigate("/");
          } else if (role === "Staff" || role === "Manager") {
            navigate("/dashboard");
          }
        } else if (data && data.token) {
          const token = data.token;
          localStorage.setItem("token", token);
          if (isRememberMe) {
            localStorage.setItem("email", formData.email);
          } else {
            localStorage.removeItem("email");
          }
          toast.success("Login successful!");
          const decoded = jwtDecode(token);
          const role = decoded.role;
          if (role === "Customer") {
            navigate("/");
          } else if (role === "Staff" || role === "Manager") {
            navigate("/dashboard");
          }
        } else {
          console.error("Login failed: No token received");
          toast.error("Login failed: Invalid credentials.");
        }
      } catch (error) {
        console.error("Login failed:", error);
        toast.error("Login failed: " + error.message);
      }
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log("Google user info:", decoded);

      // Thử đăng nhập trước với email từ Google
      const loginData = {
        email: decoded.email,
        password: decoded.sub, // Sử dụng sub như password
      };

      try {
        // Thử đăng nhập trước
        const loginResponse = await postLogin(loginData);
        if (loginResponse) {
          // Nếu đăng nhập thành công
          localStorage.setItem("token", credentialResponse.credential);
          const role = decoded.role || "Customer";
          if (role === "Customer") {
            navigate("/");
          } else if (role === "Staff" || role === "Manager") {
            navigate("/dashboard");
          }
          toast.success("Login with Google successful!");
          return; // Thoát khỏi hàm nếu đăng nhập thành công
        }
      } catch (loginError) {
        console.log("Login attempt failed:", loginError);
        if (loginError.response) {
          console.log("Error response:", loginError.response.data);
        }
        // Không hiển thị toast error ở đây vì chúng ta sẽ thử register
      }

      // Nếu đăng nhập thất bại, tiến hành đăng ký
      const googleUserData = {
        email: decoded.email,
        userName: decoded.name,
        passwordHash: decoded.sub,
        gender: decoded.gender,
        dateOfBirth:
          decoded.birthdate || new Date().toISOString().split("T")[0],
        address: decoded.address,
        phoneNumber: decoded.phoneNumber,
        profileImage: decoded.picture || "",
      };

      // Thử đăng ký tài khoản mới
      const registerResponse = await postRegister(googleUserData);

      if (registerResponse) {
        localStorage.setItem("token", credentialResponse.credential);
        const role = decoded.role || "Customer";
        if (role === "Customer") {
          navigate("/");
        } else if (role === "Staff" || role === "Manager") {
          navigate("/dashboard");
        }
        toast.success("Account created and logged in successfully!");
      }
    } catch (error) {
      console.error("Google authentication error:", error);
      toast.error(
        "Authentication failed: " + (error.response?.data || error.message)
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex">
        {/* Left side - Image */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <div className="absolute inset-0 opacity-80"></div>
          <img
            src="https://res.cloudinary.com/dygipvoal/image/upload/v1742332471/gjuwhnko8f5c10dq1b3x.png"
            className="w-full h-full object-cover"
            alt="Skincare"
          />
        </div>

        {/* Right side - Login Form */}
        <div className="w-full lg:w-1/2 p-8 md:p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-pink-600">Sign In</h2>
            <p className="mt-2 text-gray-600">
              Welcome to SKINNE - World of Skincare
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition duration-200"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition duration-200"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-xl" />
                  ) : (
                    <FaEye className="text-xl" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={isRememberMe}
                  onChange={handleChangeRememberMe}
                  className="w-4 h-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                />
                <label className="ml-2 text-sm text-gray-600">
                  Remember me
                </label>
              </div>
              {/* <a
                href="#"
                className="text-sm font-medium text-pink-600 hover:text-pink-500"
              >
                Forgot password?
              </a> */}
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition duration-200 transform hover:scale-[1.02]"
            >
              Sign in
            </button>

            {/* OR Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">OR</span>
              </div>
            </div>

            {/* Google Login Button */}
            <div className="mt-4">
              <GoogleOAuthProvider clientId="320408738074-vfl63gh4tcus7pp6f8i0s870kqhlkgmu.apps.googleusercontent.com">
                <div className="flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => {
                      console.log("Login Failed");
                      toast.error("Google login failed");
                    }}
                    useOneTap
                    theme="outline"
                    size="large"
                    text="signin_with"
                    shape="rectangular"
                  />
                </div>
              </GoogleOAuthProvider>
            </div>

            {/* Register Link */}
            <div className="text-center mt-6">
              <span className="text-gray-600">Do not have an account? </span>
              <Link
                to="/register"
                className="text-pink-600 hover:text-pink-500 font-semibold hover:underline"
              >
                Create one
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
