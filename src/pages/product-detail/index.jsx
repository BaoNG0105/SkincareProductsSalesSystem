import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, getRelatedProducts } from "../../services/api.product";
import {
  getOrderIdAndStatusByUserId,
  addOrderId,
  addOrderItems,
  getOrderItemsByOrderId,
  updateOrderItemsByOrderId,
} from "../../services/api.order";
import { toast } from "react-toastify";
import { FaExchangeAlt, FaShoppingCart, FaMoneyBillWave } from "react-icons/fa";
import { MdCompare } from "react-icons/md";
import { jwtDecode } from "jwt-decode";

//Hàm thêm sản phẩm vào giỏ hàng
const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [compareProducts, setCompareProducts] = useState(() => {
    const saved = localStorage.getItem("compareProducts");
    return saved ? JSON.parse(saved) : [];
  });
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    localStorage.setItem("compareProducts", JSON.stringify(compareProducts));
  }, [compareProducts]);

  //Hàm thêm sản phẩm vào so sánh
  const handleCompareToggle = (product) => {
    setCompareProducts((prev) => {
      const isProductInCompare = prev.some(
        (p) => p.productId === product.productId
      );
      if (isProductInCompare) {
        return prev.filter((p) => p.productId !== product.productId);
      }
      if (prev.length >= 2) {
        toast.warning("Only 2 products can be compared!");
        return prev;
      }
      return [...prev, product];
    });
  };

  //Hàm lấy sản phẩm
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await getProductById(id);
        if (productData) {
          setProduct(productData);
          const related = await getRelatedProducts(productData.category, id);
          setRelatedProducts(related.slice(0, 3));
        } else {
          setError("Product not found");
        }
      } catch (err) {
        console.error("Error details:", err);
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  //Hàm thêm sản phẩm vào giỏ hàng
  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to add items to your cart.");
        return;
      }
      // Decode token to get customerId
      const decoded = jwtDecode(token);
      const customerId = decoded.id;

      // Step 1: Check if orderId exists and status is PENDING
      const order = await getOrderIdAndStatusByUserId(customerId);
      console.log("Existing order:", order);

      let currentOrderId;

      // Step 2: If no orderId exists, create a new one
      if (!order) {
        const newOrder = await addOrderId({
          userId: customerId,
          totalPrice: 0,
        });
        currentOrderId = newOrder.orderId;
        await addOrderItems({
          orderId: currentOrderId,
          productId: product.productId,
          quantity: quantity,
          unitPrice: product.price,
          discountAmount: 0,
        });
      } else {
        // Check if order exists and has elements
        if (!order || !order[0]) {
          throw new Error("Invalid order data");
        }
        
        currentOrderId = order[0].orderId;
        
        // Get all order items for this order
        const orderItems = await getOrderItemsByOrderId(currentOrderId);
        
        // Check if product already exists in order
        const existingOrderItem = orderItems.find(item => item.product.productId === product.productId);
        
        if (existingOrderItem) {
          // Update existing order item quantity
          await updateOrderItemsByOrderId(existingOrderItem.orderItemId, {
            ...existingOrderItem,
            quantity: existingOrderItem.quantity + quantity
          });
        } else {
          // Add new order item
          await addOrderItems({
            orderId: currentOrderId,
            productId: product.productId,
            quantity: quantity,
            unitPrice: product.price,
            discountAmount: 0,
          });
        }
      }

      toast.success("Product added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add product to cart.");
    }
  };

  //Hàm xử lý mua ngay
  const handleBuyNow = async () => {
    try {
      await handleAddToCart(); // Thêm vào giỏ hàng trước
      navigate("/cart"); // Sau đó chuyển đến trang giỏ hàng
    } catch (error) {
      console.error("Error processing buy now:", error);
      toast.error("Failed to process purchase.");
    }
  };

  //Hàm hiển thị loading
  if (loading)
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-red-600 mb-4">Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Back to Home
          </button>
        </div>
      </div>
    );

  //Hàm hiển thị sản phẩm không tồn tại
  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Product not found
          </h3>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Back to Home
          </button>
        </div>
      </div>
    );

  //Hàm hiển thị sản phẩm
  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
      
        {/* Product Image */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="relative h-[450px] group">
            <img
              src={product.image}
              alt={product.productName}
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-150"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">{product.productName}</h1>
            <p className="text-2xl font-bold text-red-600">
              {product.price.toLocaleString()} VND
            </p>

            <hr className="border-gray-200" />

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-gray-600">{product.description}</p>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2">
              <span>Status:</span>
              <span
                className={`px-2 py-1 rounded text-sm ${
                  product.stockQuantity > 0
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {product.stockQuantity > 0 ? "In Stock" : "Sold Out"}
              </span>
            </div>

            {/* Available */}
            <div className="flex items-center gap-2">
              <span>Available:</span>
              <span className="px-2 py-1 rounded text-sm bg-blue-100 text-blue-800">
                {product.stockQuantity} items
              </span>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-4">
              <span>Quantity:</span>
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="px-3 py-1 border-r hover:bg-gray-200"
                  disabled={quantity <= 1 || product.stockQuantity === 0}
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.stockQuantity}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(
                      Math.min(
                        product.stockQuantity,
                        Math.max(1, parseInt(e.target.value) || 1)
                      )
                    )
                  }
                  className="w-15 text-center focus:outline-none"
                  disabled={product.stockQuantity === 0}
                />
                <button
                  onClick={() =>
                    setQuantity((prev) =>
                      Math.min(product.stockQuantity, prev + 1)
                    )
                  }
                  className="px-3 py-1 border-l hover:bg-gray-200"
                  disabled={quantity >= product.stockQuantity || product.stockQuantity === 0}
                >
                  +
                </button>
              </div>
            </div>

            {/* Compare */}
            <div className="space-y-3">
              <button
                onClick={() => handleCompareToggle(product)}
                className={`w-full py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200 ${
                  compareProducts.some((p) => p.productId === product.productId)
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-300 hover:bg-gray-400 text-gray-800"
                }`}
              >
                <MdCompare className="w-5 h-5" />
                {compareProducts.some((p) => p.productId === product.productId)
                  ? "Added to compare"
                  : "Add to compare"}
              </button>

              {compareProducts.length > 0 && (
                <button
                  onClick={() => navigate("/product-compare")}
                  className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 transition-colors duration-200"
                >
                  <FaExchangeAlt className="w-5 h-5" />
                  Compare ({compareProducts.length} products)
                </button>
              )}

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={product.stockQuantity === 0}
                className="w-full py-2.5 px-4 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 flex items-center justify-center gap-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaShoppingCart className="w-5 h-5" />
                {product.stockQuantity === 0 ? "Sold Out" : "Add to Cart"}
              </button>

              {/* Buy Now */}
              <button
                onClick={handleBuyNow}
                disabled={product.stockQuantity === 0}
                className="w-full py-2.5 px-4 rounded-lg bg-pink-600 hover:bg-pink-700 text-white flex items-center justify-center gap-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaMoneyBillWave className="w-5 h-5" />
                {product.stockQuantity === 0 ? "Sold Out" : "Buy Now"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-12">
        <h2 className="text-3xl font-bold text-pink-700 text-center mb-6">
          Related Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {relatedProducts.map((relatedProduct) => (
            <div
              key={relatedProduct.productId}
              onClick={() =>
                navigate(`/product-detail/${relatedProduct.productId}`)
              }
              className="bg-white rounded-lg light-md hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="p-4">
                <img
                  alt={relatedProduct.productName}
                  src={relatedProduct.image}
                  className="h-48 w-full object-contain"
                />
                <div className="mt-4">
                  <h3 className="font-semibold text-lg">
                    {relatedProduct.productName}
                  </h3>
                  <p className="text-red-600 font-bold mt-2">
                    {relatedProduct.price.toLocaleString()} VND
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
