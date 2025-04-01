import { useState } from "react"; //Import the useState
import { FaEye, FaEyeSlash } from "react-icons/fa"; //Import the icons
import { Link, useNavigate } from "react-router-dom"; //Import the Link and useNavigate
import { postRegister } from "../../services/api.register"; // Import postRegister
import { toast } from "react-toastify"; // Import toast

const RegisterPage = () => {
  const navigate = useNavigate(); // Khởi tạo navigate
  const [formData, setFormData] = useState({
    email: "",
    passwordHash: "",
    confirmPassword: "",
    userName: "",
    gender: "",
    dateOfBirth: "",
    address: "",
    phoneNumber: "",
  });

  //Show Password
  const [showPassword, setShowPassword] = useState(false);

  //Errors
  const [errors, setErrors] = useState({});

  //Validate Password
  const validatePassword = (password) => {
    const strengthChecks = {
      length: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*]/.test(password),
    };
    return Object.values(strengthChecks).filter(Boolean).length;
  };

  //Get Password Strength
  const getPasswordStrength = () => {
    const strength = validatePassword(formData.passwordHash);
    if (strength === 0) return "";
    if (strength < 3) return "weak";
    if (strength < 5) return "medium";
    return "strong";
  };

  //Handle Change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    validateField(name, type === "checkbox" ? checked : value);
  };

  //Validate Field
  const validateField = (name, value) => {
    let newErrors = { ...errors };
    //Full Name Validation
    switch (name) {
      case "fullName":
        if (!value || value.length < 2) {
          newErrors[name] = "Full name must be at least 2 characters";
        } else {
          delete newErrors[name];
        }
        break;

      //Phone Number Validation
      case "phoneNumber": {
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(value)) {
          newErrors.phoneNumber = "Please enter a valid 10-digit phone number";
        } else {
          delete newErrors.phoneNumber;
        }
        break;
      }

      //Email Validation
      case "email": {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          newErrors.email = "Please enter a valid email address";
        } else {
          delete newErrors.email;
        }
        break;
      }

      //Password Validation
      case "passwordHash":
        if (validatePassword(value) < 5) {
          newErrors.passwordHash =
            "Password must contain at least 8 characters, including uppercase, lowercase, number and special character";
        } else {
          delete newErrors.passwordHash;
        }
        break;

      case "confirmPassword":
        if (value !== formData.passwordHash) {
          newErrors.confirmPassword = "Passwords do not match";
        } else {
          delete newErrors.confirmPassword;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
  };

  //Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate all required fields
    const requiredFields = [
      "email",
      "passwordHash",
      "userName",
      "gender",
      "dateOfBirth",
      "phoneNumber",
    ];
    const newErrors = {};
    requiredFields.forEach((field) => {
      if (!formData[field] || formData[field].trim() === "") {
        newErrors[field] = `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } is required`;
      }
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    if (Object.keys(errors).length === 0) {
      try {
        // Remove confirmPassword and restructure data
        const { passwordHash, ...otherData } = formData;

        // Ensure all values are strings
        const submitData = {
          ...otherData,
          passwordHash: passwordHash.toString(),
          profileImage: "",
        };

        // Log the data being sent to check its structure
        console.log("Sending data:", submitData);
        // Call postRegister from api.register
        const response = await postRegister(submitData); // Pass submitData to postRegister
        console.log("Registration successful:", response);

        // Show success toast notification
        toast.success("Registration successful!");

        // Chuyển hướng đến trang đăng nhập ngay lập tức
        navigate("/login");
      } catch (error) {
        console.error(
          "Registration failed:",
          error.response?.data || error.message
        );
        setErrors((prev) => ({
          ...prev,
          submit: error.response?.data?.message || "Registration failed",
        }));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Left side - Image with Overlay */}
          <div className="lg:w-1/2 relative">
            <div className="h-64 lg:h-full">
              <img
                src="https://images.unsplash.com/photo-1612817288484-6f916006741a?ixlib=rb-4.0.3"
                alt="Skincare"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right side - Form */}
          <div className="lg:w-1/2 p-8">
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-pink-600">
                  Create Your Account
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Join the World of Skincare
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* User Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name*
                  </label>
                  <input
                    type="text"
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                    placeholder="Enter your full name"
                  />
                  {errors.userName && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.userName}
                    </p>
                  )}
                </div>

                {/* Date and Gender Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Date of Birth */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      max={new Date().toISOString().split("T")[0]}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Gender
                    </label>
                    <div className="mt-2 flex space-x-4">
                      {["Male", "Female"].map((option) => (
                        <label
                          key={option}
                          className="inline-flex items-center"
                        >
                          <input
                            type="radio"
                            name="gender"
                            value={option}
                            checked={formData.gender === option}
                            onChange={handleChange}
                            className="form-radio h-4 w-4 text-pink-600 focus:ring-pink-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                        placeholder="your.email@example.com"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                      placeholder="Enter your phone number"
                    />
                    {errors.phoneNumber && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.phoneNumber}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows="3"
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                      placeholder="Enter your address"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="passwordHash"
                      value={formData.passwordHash}
                      onChange={handleChange}
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 pr-10"
                      placeholder="Enter your password"
                      title="Password must contain at least 8 characters, including uppercase, lowercase, number and special character (!@#$%^&*)"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <FaEyeSlash className="h-5 w-5 text-gray-400" />
                      ) : (
                        <FaEye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {/* Password requirements hint */}
                  <p className="mt-1 text-xs text-gray-500">
                    Password must contain:
                    <ul className="list-disc list-inside ml-2">
                      <li>At least 8 characters</li>
                      <li>Uppercase letter (A-Z)</li>
                      <li>Lowercase letter (a-z)</li>
                      <li>Number (0-9)</li>
                      <li>Special character (!@#$%^&*)</li>
                    </ul>
                  </p>
                  {formData.passwordHash && (
                    <div className="mt-2">
                      <div className="h-2 rounded-full bg-gray-200">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            getPasswordStrength() === "weak"
                              ? "w-1/3 bg-red-500"
                              : getPasswordStrength() === "medium"
                              ? "w-2/3 bg-yellow-500"
                              : "w-full bg-green-500"
                          }`}
                        ></div>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        Password strength: {getPasswordStrength()}
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <FaEyeSlash className="h-5 w-5 text-gray-400" />
                      ) : (
                        <FaEye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={Object.keys(errors).length > 0}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    Create Account
                  </button>
                </div>

                {/* Login Link */}
                <div className="text-center mt-4">
                  <span className="text-sm text-gray-600">
                    Already have an account?{" "}
                  </span>
                  <Link
                    to="/login"
                    className="text-sm font-medium text-pink-600 hover:text-pink-500"
                  >
                    Login here
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
