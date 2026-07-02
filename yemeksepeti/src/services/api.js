import axios from 'axios';

// Create a centralized Axios instance configured for JSON Server
const apiInstance = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Centralized API endpoints integration
export const api = {
  // Users endpoints
  getUsers: async () => {
    const response = await apiInstance.get('/users');
    return response.data;
  },
  getUserByEmail: async (email) => {
    const response = await apiInstance.get(`/users?email=${encodeURIComponent(email)}`);
    return response.data;
  },

  // Restaurants endpoints
  getRestaurants: async () => {
    const response = await apiInstance.get('/restaurants');
    return response.data;
  },
  getRestaurantByUserId: async (userId) => {
    const response = await apiInstance.get(`/restaurants?userId=${userId}`);
    return response.data;
  },

  // Foods endpoints
  getFoods: async () => {
    const response = await apiInstance.get('/foods');
    return response.data;
  },
  getFoodsByRestaurantId: async (restaurantId) => {
    const response = await apiInstance.get(`/foods?restaurantId=${restaurantId}`);
    return response.data;
  },
  addFood: async (foodData) => {
    const response = await apiInstance.post('/foods', foodData);
    return response.data;
  },
  updateFood: async (foodId, foodData) => {
    const response = await apiInstance.put(`/foods/${foodId}`, foodData);
    return response.data;
  },
  deleteFood: async (foodId) => {
    const response = await apiInstance.delete(`/foods/${foodId}`);
    return response.data;
  },

  // Orders endpoints
  getOrders: async () => {
    const response = await apiInstance.get('/orders');
    return response.data;
  },
  getOrdersByRestaurantId: async (restaurantId) => {
    const response = await apiInstance.get(`/orders?restaurantId=${restaurantId}`);
    return response.data;
  },
  updateOrderStatus: async (orderId, status) => {
    const response = await apiInstance.patch(`/orders/${orderId}`, { status });
    return response.data;
  },
  addOrder: async (orderData) => {
    const response = await apiInstance.post('/orders', orderData);
    return response.data;
  },
};

export default api;
