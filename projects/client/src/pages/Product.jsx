import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProduct, fetchProductUser } from "../features/productSlice";
import { formatRupiah } from "../utils/formatRupiah";
import axios from "axios";
import { fetchCart } from "../features/cartSlice";

function Product() {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  const { productName } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user_id } = useSelector((state) => state.user.user);
  const product = useSelector((state) => state.product.product);
  const { isLoading } = useSelector((state) => state.product);
  const { store_id, store_name } = useSelector((state) => state.location.location.nearestStore);
  const userGlobal = useSelector((state) => state.user.user);

  // fungsi untuk menambah quantity
  const increaseQuantity = () => {
    setQuantity((prevQuantity) => (prevQuantity === product.quantity_in_stock ? prevQuantity : prevQuantity + 1));
  };

  // fungsi untuk mengurangi quantity
  const decreaseQuantity = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  // Handle manual input
  const handleInputChange = (event) => {
    const value = parseInt(event.target.value);
    const stock = product.quantity_in_stock;

    // Ensure value is a number and is at least 1
    let quantity = isNaN(value) ? 1 : value < 1 ? 1 : value;

    // Ensure quantity does not exceed stock
    quantity = Math.min(quantity, stock);

    setQuantity(quantity);
  };

  const handleAddToCart = async () => {
    try {
      let cart = {
        user_id: user_id,
        product_id: product.product_id,
        quantity: quantity,
      };

      // console.log(object);
      const response = await axios.post("http://localhost:8000/api/cart/addtocart", cart);

      dispatch(fetchCart(userGlobal));
      dispatch(fetchProductUser(productName, store_id));
      alert(response.data.message);
    } catch (error) {
      alert(`Add to cart fails. Amount in cart (${quantity}) exceeds product's stock`);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchProductUser(productName, store_id));
      } catch (error) {
        await alert(error.response.data);
        navigate("/products");
      }
    };

    fetchData();
  }, [productName, store_id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-5 mt-10">
      <div className="md:w-[95%] xl:max-w-screen-lg mx-auto border rounded-md p-5 shadow-md">
        <div className="flex gap-5 h-auto">
          {/*  */}
          <div className=" w-[40%] flex gap-2">
            <div className="w-1/5 flex flex-col gap-2">
              <img className="w-full" src="https://webstyle.unicomm.fsu.edu/3.4/img/placeholders/ratio-pref-1-1.png" alt="" />
              <img className="w-full" src="https://webstyle.unicomm.fsu.edu/3.4/img/placeholders/ratio-pref-1-1.png" alt="" />
              <img className="w-full" src="https://webstyle.unicomm.fsu.edu/3.4/img/placeholders/ratio-pref-1-1.png" alt="" />
            </div>
            <div className="w-4/5">
              <img className="w-full" src="https://webstyle.unicomm.fsu.edu/3.4/img/placeholders/ratio-pref-1-1.png" alt="" />
            </div>
          </div>

          {/*  */}
          <div className="w-[60%] flex flex-col gap-5">
            <h2 className="font-semibold text-3xl">{product.product_name}</h2>
            <p className="font-semibold text-4xl bg-neutral-50 rounded-md p-3 text-red-500">{formatRupiah(product.product_price)}</p>
            <div>
              <p className="text-lg font-semibold">Description</p>
              <p className=" text-lg">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sapiente, illo accusantium officia esse in id voluptas atque architecto quas distinctio magni facilis culpa sed iusto pariatur, itaque quo eligendi voluptatum!
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-lg font-semibold">Quantity</p>
              <div className="flex gap-2">
                <div className="flex flex-row px-4 py-2 rounded-md border justify-between font-semibold">
                  <button onClick={decreaseQuantity}>-</button>
                  <input type="number" className="text-center" value={quantity} onChange={handleInputChange} />
                  <button onClick={increaseQuantity}>+</button>
                </div>
                <button
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-semibold rounded-md disabled:cursor-not-allowed"
                  disabled={!user_id || product.quantity_in_stock === 0}
                  onClick={() => {
                    handleAddToCart();
                  }}
                >
                  Add To Cart
                </button>
              </div>
              <div>Stock: {product.quantity_in_stock}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;