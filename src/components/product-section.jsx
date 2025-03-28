import { useState, useEffect } from "react";
import { getProduct } from "../services/api.product";
import PropTypes from "prop-types";

const ProductSection = ({ category }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProduct();
        const filteredProducts = response.filter(
          (product) => product.category.toLowerCase() === category.toLowerCase()
        );
        setProducts(filteredProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error)
    return <div className="text-center py-8 text-red-600">{error}</div>;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(products.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {currentProducts.map((product) => (
            <div
              key={product.productId}
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

              <div className="space-y-3">
                <h3 className="text-gray-800 font-semibold text-lg leading-tight min-h-[50px] mb-2">
                  {product.productName}
                </h3>

                <div className="text-xl font-bold text-[#C91F50] mb-2">
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
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8 gap-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 rounded-md ${
                currentPage === index + 1
                  ? "bg-[#C91F50] text-white"
                  : "bg-white border border-[#C91F50] text-[#C91F50] hover:bg-[#C91F50] hover:text-white"
              } transition-colors duration-300`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

ProductSection.propTypes = {
  category: PropTypes.string.isRequired,
};

export default ProductSection;
