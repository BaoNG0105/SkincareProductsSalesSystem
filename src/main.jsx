import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Effect from "./components/effect.jsx";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./auth/protectedRoute.jsx";
import ManagerRoute from "./auth/managerRoute.jsx";
import { AuthProvider } from "./contexts/AuthContext";

import MainLayout from "./layout/MainLayout.jsx";
import LoginPage from "./pages/login/index.jsx";
import ProfilePage from "./pages/profile/index.jsx";
import RegisterPage from "./pages/register/index.jsx";
import HomePage from "./pages/home/index.jsx";
import SkinTestPage from "./pages/skinTest/index.jsx";
import Routine from "./pages/routine/index.jsx";
import LocationPage from "./pages/location/index.jsx";
import AboutPage from "./pages/about/index.jsx";
import BlogPage from "./pages/blog/index.jsx";
import CartPage from "./pages/cart/index.jsx";
import CheckoutPage from "./pages/checkout/index.jsx";
import OrderStatusPage from "./pages/order-status/index.jsx";
import CleanserPage from "./pages/product/cleanser/index.jsx";
import FaceMaskPage from "./pages/product/faceMask/index.jsx";
import MoisturizerPage from "./pages/product/moisturizer/index.jsx";
import SerumPage from "./pages/product/serum/index.jsx";
import SunScreenPage from "./pages/product/sunScreen/index.jsx";
import CategoryPage from "./pages/category/index.jsx";
import ProductDetailPage from "./pages/product-detail/index.jsx";
import ProductComparePage from "./pages/product-compare/index.jsx";
import ProductSearchPage from "./pages/product-search/index.jsx";
import PromotionPage from "./pages/promotion/index.jsx";
import FAQsPage from "./pages/FAQs/index.jsx";
import PrivacyPolicyPage from "./pages/policies/privacy/index.jsx";
import ReturnPolicyPage from "./pages/policies/return/index.jsx";
import ShippingPolicyPage from "./pages/policies/shipping/index.jsx";
import TermsConditionsPage from "./pages/policies/terms-conditions/index.jsx";
import DashboardLayout from "./layout/DashboardLayout.jsx";
import OverviewPage from "./pages/dashboard/overview/index.jsx";
import ProductDashboardPage from "./pages/dashboard/product/index.jsx";
import PromotionDashboardPage from "./pages/dashboard/promotion/index.jsx";
import RatingFeedbackDashboardPage from "./pages/dashboard/rating-feedback/index.jsx";
import StaffDashboardPage from "./pages/dashboard/staff/index.jsx";
import OrderPage from "./pages/dashboard/order/index.jsx";
import CustomerDashboardPage from "./pages/dashboard/customer/index.jsx";

//Single Page Application
//Client side rendering
//document.getElementById('root'): Tìm 1 cái thẻ có Id là "root" -> Lấy code ở trong App gắn vào root

const router = createBrowserRouter([
  //Home Page (Default)
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
    ],
  },

  //Login Page
  {
    path: "/login",
    element: <MainLayout />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
    ],
  },

  //Register Page
  {
    path: "/register",
    element: <MainLayout />,
    children: [
      {
        path: "/register",
        element: <RegisterPage />,
      },
    ],
  },

  //Profile Page
  {
    path: "/profile/:id",
    element: <MainLayout />,
    children: [
      {
        path: "/profile/:id",
        element: <ProfilePage />,
      },
    ],
  },

  //Skin Test Page
  {
    path: "/skin-test",
    element: <SkinTestPage />,
  },

  //Routine Page
  {
    path: "/routine/:skinTypeId",
    element: <MainLayout />,
    children: [
      {
        path: "/routine/:skinTypeId",
        element: <Routine />,
      },
    ],
  },

  //Location Page
  {
    path: "/location",
    element: <MainLayout />,
    children: [
      {
        path: "/location",
        element: <LocationPage />,
      },
    ],
  },

  //Promotion Page
  {
    path: "/promotion",
    element: <MainLayout />,
    children: [
      {
        path: "/promotion",
        element: <PromotionPage />,
      },
    ],
  },

  //Category Page
  {
    path: "/category",
    element: <MainLayout />,
    children: [
      {
        path: "/category",
        element: <CategoryPage />,
      },
    ],
  },

  //cleanser Page
  {
    path: "/cleanser",
    element: <MainLayout />,
    children: [
      {
        path: "/cleanser",
        element: <CleanserPage />,
      },
    ],
  },

  //face-mask Page
  {
    path: "/face-mask",
    element: <MainLayout />,
    children: [
      {
        path: "/face-mask",
        element: <FaceMaskPage />,
      },
    ],
  },

  //moisturizer Page
  {
    path: "/moisturizer",
    element: <MainLayout />,
    children: [
      {
        path: "/moisturizer",
        element: <MoisturizerPage />,
      },
    ],
  },

  //serum Page
  {
    path: "/serum",
    element: <MainLayout />,
    children: [
      {
        path: "/serum",
        element: <SerumPage />,
      },
    ],
  },

  //sunscreen Page
  {
    path: "/sunscreen",
    element: <MainLayout />,
    children: [
      {
        path: "/sunscreen",
        element: <SunScreenPage />,
      },
    ],
  },

  //Product Detail Page
  {
    path: "/product-detail/:id",
    element: <MainLayout />,
    children: [
      {
        path: "",
        element: <ProductDetailPage />,
      },
    ],
  },

  //Product Search Page
  {
    path: "/product-search",
    element: <MainLayout />,
    children: [
      {
        path: "",
        element: <ProductSearchPage />,
      },
    ],
  },

  //Product Compare Page
  {
    path: "/product-compare",
    element: <MainLayout />,
    children: [
      {
        path: "/product-compare",
        element: <ProductComparePage />,
      },
    ],
  },

  //Cart Page
  {
    path: "/cart",
    element: <MainLayout />,
    children: [
      {
        path: "/cart",
        element: <CartPage />,
      },
    ],
  },

  //Checkout Page
  {
    path: "/checkout",
    element: <MainLayout />,
    children: [
      {
        path: "/checkout",
        element: <CheckoutPage />,
      },
    ],
  },
  //Product Status Page
  {
    path: "/order-status/:id",
    element: <MainLayout />,
    children: [
      {
        path: "/order-status/:id",
        element: <OrderStatusPage />,
      },
    ],
  },

  //About Page
  {
    path: "/about",
    element: <MainLayout />,
    children: [
      {
        path: "/about",
        element: <AboutPage />,
      },
    ],
  },

  //Blog Page
  {
    path: "/blog",
    element: <MainLayout />,
    children: [
      {
        path: "/blog",
        element: <BlogPage />,
      },
    ],
  },

  //FAQs Page
  {
    path: "/faqs",
    element: <MainLayout />,
    children: [
      {
        path: "/faqs",
        element: <FAQsPage />,
      },
    ],
  },

  //Privacy Policy Page
  {
    path: "/privacy-policy",
    element: <MainLayout />,
    children: [
      {
        path: "/privacy-policy",
        element: <PrivacyPolicyPage />,
      },
    ],
  },

  //Return Policy Page
  {
    path: "/return-policy",
    element: <MainLayout />,
    children: [
      {
        path: "/return-policy",
        element: <ReturnPolicyPage />,
      },
    ],
  },

  //Shipping Policy Page
  {
    path: "/shipping-policy",
    element: <MainLayout />,
    children: [
      {
        path: "/shipping-policy",
        element: <ShippingPolicyPage />,
      },
    ],
  },

  //Terms & Conditions Page
  {
    path: "/terms-conditions",
    element: <MainLayout />,
    children: [
      {
        path: "/terms-conditions",
        element: <TermsConditionsPage />,
      },
    ],
  },

  //Dashboard Page
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "overview",
        element: (
          <ManagerRoute>
            <OverviewPage />
          </ManagerRoute>
        ),
      },
      {
        path: "order",
        element: <OrderPage />,
      },
      {
        path: "product",
        element: <ProductDashboardPage />,
      },
      {
        path: "promotion",
        element: <PromotionDashboardPage />,
      },
      {
        path: "rating",
        element: <RatingFeedbackDashboardPage />,
      },
      {
        path: "staff",
        element: (
          <ManagerRoute>
            <StaffDashboardPage />
          </ManagerRoute>
        ),
      },
      {
        path: "customer",
        element: <CustomerDashboardPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <Effect /> {/* Thêm Effect Hoa đào rơi */}
      <RouterProvider router={router} /> {/* Router các pages */}
      <ToastContainer /> {/* Toast hiển thị thông báo */}
    </AuthProvider>
  </StrictMode>
);
