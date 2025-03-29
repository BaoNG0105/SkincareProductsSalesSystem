import { useEffect, useState } from 'react';
import { getAllRatings } from '../../../services/api.rating';
import { FaStar } from 'react-icons/fa';
import { format } from 'date-fns';

const RatingFeedbackPage = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const data = await getAllRatings();
        setRatings(data);
      } catch (error) {
        console.error('Error fetching ratings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Customer Ratings & Feedback</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {ratings.map((rating) => (
          <div 
            key={rating.id} 
            className="bg-white rounded-lg shadow-lg p-6 transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl"
          >
            <div className="flex items-center mb-4">
              <img
                src={rating.customer.profileImage}
                alt={rating.customer.userName}
                className="w-12 h-12 rounded-full object-cover mr-4"
              />
              <div>
                <h3 className="font-semibold">{rating.customer.userName}</h3>
                <p className="text-sm text-gray-500">
                  {format(new Date(rating.createdAt), 'MMM dd, yyyy')}
                </p>
              </div>
            </div>

            <div className="flex items-center mb-4">
              <img
                src={rating.product.image}
                alt={rating.product.productName}
                className="w-12 h-12 rounded object-cover mr-2"
              />
              <span className="font-medium">{rating.product.productName}</span>
            </div>

            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, index) => (
                <FaStar
                  key={index}
                  className={`w-5 h-5 ${
                    index < rating.rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>

            <p className="text-gray-700">{rating.comment}</p>

            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center text-sm text-gray-500">
                <span className="font-medium">Product Price:</span>
                <span className="ml-2">
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  }).format(rating.product.price)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RatingFeedbackPage;
