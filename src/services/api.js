// src/services/api.js
const API_URL = 'http://localhost:3001'; // JSON Server default port

export const api = {
  async getAllProperties() {
    const response = await fetch(`${API_URL}/properties`);
    return response.json();
  },

  async getPropertyById(id) {
    const response = await fetch(`${API_URL}/properties/${id}`);
    return response.json();
  },

  async getPropertiesByCity(city) {
    const response = await fetch(`${API_URL}/properties?city=${city}`);
    return response.json();
  },

  async searchProperties(params) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_URL}/properties?${queryString}`);
    return response.json();
  }
};