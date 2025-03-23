import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  getUserById,
  updateUserById,
  updateUserPassword,
  deleteUserByUserId,
} from "../../services/api.user";
import { toast } from "react-toastify";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendar,
  FaVenusMars,
  FaLock,
  FaSave,
  FaKey,
  FaShoppingBag,
  FaTrash,
} from "react-icons/fa";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    gender: "",
    dateOfBirth: "",
    address: "",
    phoneNumber: "",
    profileImage: "",
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const decoded = jwtDecode(token);
        const userId = decoded.id;

        const userData = await getUserById(userId);
        setUser(userData);
        // Pre-populate form data with existing user data
        setFormData({
          gender: userData.gender || "",
          dateOfBirth: userData.dateOfBirth
            ? userData.dateOfBirth.split("T")[0]
            : "",
          address: userData.address || "",
          phoneNumber: userData.phoneNumber || "",
          profileImage: userData.profileImage || "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleEditProfile = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const userId = decoded.id;

      const response = await updateUserById(userId, formData);
      if (response) {
        toast.success("Profile updated successfully!");
        setUser({ ...user, ...response });
        setIsEditModalOpen(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validatePasswordForm = () => {
    const errors = {};

    if (!passwordData.oldPassword) {
      errors.oldPassword = "Current password is required";
    }

    if (!passwordData.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters";
    }

    if (!passwordData.confirmPassword) {
      errors.confirmPassword = "Please confirm your new password";
    } else if (passwordData.confirmPassword !== passwordData.newPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      return; // Dừng submit nếu có lỗi validation
    }

    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const userId = decoded.id;

      // Chỉ gửi oldPassword và newPassword lên server
      const passwordUpdateData = {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      };

      await updateUserPassword(userId, passwordUpdateData);
      toast.success("Password updated successfully!");
      setIsPasswordModalOpen(false);
      // Reset form
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordErrors({});
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Failed to update password");
    }
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDeleteAccount = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        const decoded = jwtDecode(token);
        const userId = decoded.id;

        await deleteUserByUserId(userId);
        toast.success("Account deleted successfully");
        localStorage.removeItem("token"); // Clear token
        navigate("/login");
      } catch (error) {
        console.error("Error deleting account:", error);
        toast.error("Failed to delete account");
      }
    }
  };

  // Edit Profile Modal
  const editProfileModal = isEditModalOpen && (
    <div className="fixed inset-0 bg-pink-100 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto relative">
        {/* Header */}
        <div className="border-b border-gray-200 pb-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <FaUser className="text-pink-500 mr-3" />
            Edit Profile
          </h2>
        </div>

        <form onSubmit={handleEditProfile} className="space-y-6">
          {/* Gender Select */}
          <div className="form-group">
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <FaVenusMars className="text-pink-500 mr-2" />
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-pink-500 
                focus:ring-2 focus:ring-pink-200 transition-all duration-200 bg-white"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          {/* Date of Birth */}
          <div className="form-group">
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <FaCalendar className="text-pink-500 mr-2" />
              Date of Birth
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-pink-500 
                focus:ring-2 focus:ring-pink-200 transition-all duration-200"
            />
          </div>

          {/* Address */}
          <div className="form-group">
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <FaMapMarkerAlt className="text-pink-500 mr-2" />
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-pink-500 
                focus:ring-2 focus:ring-pink-200 transition-all duration-200"
              placeholder="Enter your address"
            />
          </div>

          {/* Phone Number */}
          <div className="form-group">
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <FaPhone className="text-pink-500 mr-2" />
              Phone Number
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-pink-500 
                focus:ring-2 focus:ring-pink-200 transition-all duration-200"
              placeholder="Enter your phone number"
            />
          </div>

          {/* Profile Image URL */}
          <div className="form-group">
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <FaUser className="text-pink-500 mr-2" />
              Profile Image URL
            </label>
            <input
              type="text"
              name="profileImage"
              value={formData.profileImage}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-pink-500 
                focus:ring-2 focus:ring-pink-200 transition-all duration-200"
              placeholder="Enter image URL"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 
                transition-all duration-200 flex items-center font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg
                hover:from-pink-600 hover:to-pink-700 transition-all duration-200 flex items-center 
                font-medium shadow-md hover:shadow-lg"
            >
              <FaSave className="mr-2" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Password Change Modal
  const passwordChangeModal = isPasswordModalOpen && (
    <div className="fixed inset-0 bg-pink-100 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto relative">
        {/* Header */}
        <div className="border-b border-gray-200 pb-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <FaLock className="text-pink-500 mr-3" />
            Change Password
          </h2>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-6">
          {/* Current Password */}
          <div className="form-group">
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <FaKey className="text-pink-500 mr-2" />
              Current Password
            </label>
            <input
              type="password"
              name="oldPassword"
              value={passwordData.oldPassword}
              onChange={handlePasswordInputChange}
              className={`w-full px-4 py-3 rounded-lg border ${
                passwordErrors.oldPassword
                  ? "border-red-500"
                  : "border-gray-300"
              } focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200`}
            />
            {passwordErrors.oldPassword && (
              <p className="mt-1 text-sm text-red-500">
                {passwordErrors.oldPassword}
              </p>
            )}
          </div>

          {/* New Password */}
          <div className="form-group">
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <FaLock className="text-pink-500 mr-2" />
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordInputChange}
              className={`w-full px-4 py-3 rounded-lg border ${
                passwordErrors.newPassword
                  ? "border-red-500"
                  : "border-gray-300"
              } focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200`}
            />
            {passwordErrors.newPassword && (
              <p className="mt-1 text-sm text-red-500">
                {passwordErrors.newPassword}
              </p>
            )}
          </div>

          {/* Confirm New Password */}
          <div className="form-group">
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <FaLock className="text-pink-500 mr-2" />
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordInputChange}
              className={`w-full px-4 py-3 rounded-lg border ${
                passwordErrors.confirmPassword
                  ? "border-red-500"
                  : "border-gray-300"
              } focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200`}
            />
            {passwordErrors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">
                {passwordErrors.confirmPassword}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="button"
              onClick={() => {
                setIsPasswordModalOpen(false);
                setPasswordData({
                  oldPassword: "",
                  newPassword: "",
                  confirmPassword: "",
                });
                setPasswordErrors({});
              }}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 
                transition-all duration-200 flex items-center font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg
                hover:from-pink-600 hover:to-pink-700 transition-all duration-200 flex items-center 
                font-medium shadow-md hover:shadow-lg"
            >
              <FaKey className="mr-2" />
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Profile - Updated styling */}
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-12">
            <div className="flex items-center space-x-6">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg transform transition-transform hover:scale-105">
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-5xl font-bold text-pink-600">
                    {user?.email?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  {user?.userName}
                </h1>
                <p className="text-pink-100 text-lg flex items-center">
                  <FaEnvelope className="mr-2" />
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Information - Updated styling */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Personal Information */}
              <div className="space-y-8">
                <h2 className="text-2xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
                  Personal Information
                </h2>

                <div className="space-y-6">
                  {/* User name */}
                  <div className="flex items-center space-x-4 p-4 hover:bg-pink-50 rounded-lg transition-colors duration-200">
                    <FaUser className="text-pink-500 w-6 h-6" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        User name
                      </p>
                      <p className="text-gray-800 font-semibold text-lg">
                        {user?.userName}
                      </p>
                    </div>
                  </div>
                  {/* Email */}
                  <div className="flex items-center space-x-4 p-4 hover:bg-pink-50 rounded-lg transition-colors duration-200">
                    <FaEnvelope className="text-pink-500 w-6 h-6" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-gray-800 font-semibold text-lg">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  {/* Phone Number */}
                  <div className="flex items-center space-x-4 p-4 hover:bg-pink-50 rounded-lg transition-colors duration-200">
                    <FaPhone className="text-pink-500 w-6 h-6" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p className="text-gray-800 font-semibold text-lg">
                        {user?.phoneNumber || "Not provided"}
                      </p>
                    </div>
                  </div>
                  {/* Address */}
                  <div className="flex items-center space-x-4 p-4 hover:bg-pink-50 rounded-lg transition-colors duration-200">
                    <FaMapMarkerAlt className="text-pink-500 w-6 h-6" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Address
                      </p>
                      <p className="text-gray-800 font-semibold text-lg">
                        {user?.address || "Not provided"}
                      </p>
                    </div>
                  </div>
                  {/* Date of Birth */}
                  <div className="flex items-center space-x-4 p-4 hover:bg-pink-50 rounded-lg transition-colors duration-200">
                    <FaCalendar className="text-pink-500 w-6 h-6" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Date of Birth
                      </p>
                      <p className="text-gray-800 font-semibold text-lg">
                        {user?.dateOfBirth || "Not provided"}
                      </p>
                    </div>
                  </div>
                  {/* Gender */}
                  <div className="flex items-center space-x-4 p-4 hover:bg-pink-50 rounded-lg transition-colors duration-200">
                    <FaVenusMars className="text-pink-500 w-6 h-6" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Gender
                      </p>
                      <p className="text-gray-800 font-semibold text-lg">
                        {user?.gender || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Edit profile*/}
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 
                      text-white rounded-lg hover:from-pink-600 hover:to-pink-700 
                      transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <FaUser className="mr-2" /> Edit Profile
                </button>
              </div>

              {/* Account Information */}
              <div className="space-y-8">
                <h2 className="text-2xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
                  Account Information
                </h2>
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-xl shadow-sm">
                    <p className="text-pink-600 font-bold text-lg mb-2">
                      {new Date(user?.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600 flex items-center">
                      <FaCalendar className="mr-2" /> Member Since
                    </p>
                  </div>
                </div>

                {/* Password and Delete buttons in same row */}
                <div className="flex gap-4">
                  {/* Change Password */}
                  <button
                    onClick={() => setIsPasswordModalOpen(true)}
                    className="flex items-center px-4 py-4 text-sm bg-gradient-to-r from-purple-500 to-purple-600 
                        text-white rounded-lg hover:from-purple-600 hover:to-purple-700 
                        transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <FaLock className="mr-2 text-xs" /> Change Password
                  </button>
                  {/* Delete Account */}
                  <button
                    onClick={handleDeleteAccount}
                    className="flex items-center px-4 py-4 text-sm bg-gradient-to-r from-red-500 to-red-600 
                        text-white rounded-lg hover:from-red-600 hover:to-red-700 
                        transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <FaTrash className="mr-2 text-xs" /> Delete Account
                  </button>
                </div>
                {/* View Orders button on its own row */}
                <button
                  onClick={() => navigate(`/order-status/${user?.id}`)}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-pink-400 to-pink-500 
                      text-white rounded-lg hover:from-pink-500 hover:to-pink-600 
                      transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <FaShoppingBag className="mr-2" /> View Orders
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {editProfileModal}
      {passwordChangeModal}
    </div>
  );
}

export default ProfilePage;
