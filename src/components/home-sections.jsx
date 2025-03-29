import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { getProduct } from "../services/api.product";
import PropTypes from "prop-types";

const ProductSection = ({ category }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //Hàm lấy danh sách sản phẩm theo category & sản phẩm còn hàng
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProduct();
        const filteredProducts = response.filter(
          (product) => 
            product.category.toLowerCase() === category.toLowerCase() &&
            product.stockQuantity > 0
        );
        setProducts(filteredProducts);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category]);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          {category.charAt(0).toUpperCase() + category.slice(1)} Collection
        </h2>
        <Swiper
          spaceBetween={20}
          slidesPerView={3}
          navigation={true}
          autoplay={{ delay: 3000 }}
          modules={[Autoplay, Navigation]}
        >
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">{error}</div>
          ) : (
            products.map((product) => (
              <SwiperSlide key={product.productId}>
                <div
                  className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl border border-gray-100 transition-all duration-300 transform hover:-translate-y-1"
                  onClick={() => {
                    window.location.href = `/product-detail/${product.productId}`;
                  }}
                >
                  <div className="relative mb-4 flex justify-center group">
                    <img
                      src={product.image}
                      alt={product.productName}
                      className="h-48 object-contain transition-transform duration-300 group-hover:scale-110"
                    />
                    {product.status === "out_of_stock" && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                        Out of Stock
                      </div>
                    )}
                  </div>
                  <h3 className="text-gray-800 font-semibold text-lg leading-tight min-h-[50px] mb-2">
                    {product.productName}
                  </h3>
                  <div className="text-xl font-bold text-[#C91F50] mb-4">
                    {product.price.toLocaleString()} VND
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm text-gray-600">Available:</span>
                    <span className="px-2 py-1 rounded text-sm bg-blue-100 text-blue-800">
                      {product.stockQuantity} items
                    </span>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() =>
                        (window.location.href = `/product-detail/${product.productId}`)
                      }
                      className="mt-4 w-full bg-gradient-to-r bg-pink-600 text-white py-2.5 rounded-lg hover:bg-pink-800 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] font-medium"
                    >
                      View details
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))
          )}
        </Swiper>
      </div>
    </section>
  );
};

// Add prop type validation
ProductSection.propTypes = {
  category: PropTypes.string.isRequired, // Validate that category is a required string
};

export default ProductSection;
