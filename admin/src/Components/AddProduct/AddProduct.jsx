import React, { useState } from "react";
import "./AddProduct.css";
import upload_area from "../Assets/upload_area.svg";
import { backend_url } from "../../App";

const AddProduct = () => {
  const [image, setImage] = useState(false);
  const [productDetails, setProductDetails] = useState({
    name: "",
    description: "",
    image: "",
    category: "women",
    new_price: "",
    old_price: ""
  });

  const AddProductHandler = async () => {
    // 🔒 Validate required fields
    if (!productDetails.name || !productDetails.description.trim() || !productDetails.new_price || !image) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      // 🔼 Upload image first
      const formData = new FormData();
      formData.append("product", image);

      const uploadRes = await fetch(`${backend_url}/upload`, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      const uploadData = await uploadRes.json();

      if (!uploadData.success) {
        alert("Image upload failed");
        return;
      }

      const product = {
        ...productDetails,
        image: uploadData.image_url
      };

      // 📤 Submit product details
      const res = await fetch(`${backend_url}/addproduct`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      const data = await res.json();

      if (data.success) {
        alert("✅ Product Added Successfully");
        setProductDetails({
          name: "",
          description: "",
          image: "",
          category: "women",
          new_price: "",
          old_price: ""
        });
        setImage(false);
      } else {
        alert("❌ Failed to add product");
      }
    } catch (err) {
      console.error("Error adding product:", err);
      alert("❗ Server error. Try again.");
    }
  };

  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  return (
    <div className="addproduct">
      <div className="addproduct-itemfield">
        <p>Product title</p>
        <input type="text" name="name" value={productDetails.name} onChange={changeHandler} placeholder="Type here" />
      </div>
      <div className="addproduct-itemfield">
        <p>Product description</p>
        <input type="text" name="description" value={productDetails.description} onChange={changeHandler} placeholder="Type here" />
      </div>
      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>New Price</p>
          <input type="number" name="new_price" value={productDetails.new_price} onChange={changeHandler} placeholder="₹" />
        </div>
        <div className="addproduct-itemfield">
          <p>Old Price</p>
          <input type="number" name="old_price" value={productDetails.old_price} onChange={changeHandler} placeholder="₹" />
        </div>
      </div>
      <div className="addproduct-itemfield">
        <p>Category</p>
        <select name="category" value={productDetails.category} onChange={changeHandler}>
          <option value="women">Women</option>
          <option value="men">Men</option>
          {/* <option value="kids">Kids</option> */}
        </select>
      </div>
      <div className="addproduct-itemfield">
        <label htmlFor="file-input">
          <img src={image ? URL.createObjectURL(image) : upload_area} alt="upload" className="addproduct-thumbnail" />
        </label>
        <input onChange={(e) => setImage(e.target.files[0])} type="file" name="image" id="file-input" hidden />
      </div>
      <button className="addproduct-btn" onClick={AddProductHandler}>ADD</button>
    </div>
  );
};

export default AddProduct;
