const API_URL = "http://localhost:5000/api";

export const api = {
  register: (data) =>
    fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(data)
    }),

 login: async (data) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text); // will catch in your component
  }

  return res.json();
},


    
getProductsByCategory: (type) =>
  fetch(`http://localhost:5000/api/products/${type}`)
    .then(res => res.json()),

  getProducts: (category) =>
    fetch(`${API_URL}/products/${category}`).then(res => res.json()),

  addToCart: (data) =>
    fetch(`${API_URL}/cart/add`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(data)
    }),

  getCart: (userId) =>
    fetch(`${API_URL}/cart/${userId}`).then(res => res.json()),

  removeCartItem: (id) =>
    fetch(`${API_URL}/cart/remove/${id}`, { method:"DELETE" }),

  checkout: (data) =>
    fetch(`${API_URL}/orders/checkout`, {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(data)
    })
};
