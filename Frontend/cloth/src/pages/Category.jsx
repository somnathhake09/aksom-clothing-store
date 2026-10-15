import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";

export default function Category() {
  const { type } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/products/${type}`)
      .then(res => setProducts(res.data))
      .catch(err => console.log(err));
  }, [type]);

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-4 text-capitalize">
        {type === "featured" ? "New & Featured" : type}
      </h3>

      <div className="row">
        {products.map(product => (
          <div className="col-md-3 mb-4" key={product.id}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
