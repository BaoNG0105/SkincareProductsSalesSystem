# SKINNE - Skincare E-commerce Platform

## Overview
SKINNE is a modern e-commerce platform specialized in skincare products, built with React and Vite. The application offers a comprehensive shopping experience with features like skin testing, personalized routines, and product recommendations.

## Features
- **User Authentication**
  - Email/Password login
  - Google OAuth integration
  - Role-based access (Customer, Staff, Manager)

- **Shopping Experience**
  - Product browsing and search
  - Shopping cart management
  - Secure checkout process
  - Promotion code system

- **Specialized Features**
  - Skin type testing
  - Personalized skincare routines
  - Product comparison tool
  - Rating and feedback system

- **Dashboard Management**
  - Order management
  - Product inventory
  - Customer management
  - Sales analytics
  - Promotion management

## Tech Stack
- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Ant Design
- **Charts**: Recharts
- **Authentication**: JWT, Google OAuth
- **HTTP Client**: Axios
- **Other Tools**:
  - React Router DOM for routing
  - React Toastify for notifications
  - Swiper for carousels
  - Date-fns for date manipulation

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
1. Clone the repository

```bash
git clone [repository-url]
```

2. Install dependencies

```bash
npm install
```

3. Start the development server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure
- `/src`
  - `/assets` - Static assets
  - `/components` - Reusable components
  - `/contexts` - React context providers
  - `/pages` - Application pages
  - `/services` - API services
  - `/layout` - Layout components
  - `/auth` - Authentication components

## Environment Setup
Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:8080/api
VITE_GOOGLE_CLIENT_ID=[your-google-client-id]
```

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details.
