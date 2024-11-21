const BASE_URL = "https://api.unsplash.com";
const CLIENT_ID = "5Occ4SJGQNgunE9rEoMBy3ZgDwY8Y1guYwXTMYhzbrE";


export const fetchPhotos = async (endpoint) => {
  const response = await fetch(`${BASE_URL}${endpoint}&client_id=${CLIENT_ID}`);
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }
  return await response.json();
};

export const getPhotos = (page = 1, perPage = 12) => {
  return fetchPhotos(`/photos/?page=${page}&per_page=${perPage}`);
};


export const searchPhotos = (query, perPage = 12) => {
  return fetchPhotos(`/search/photos/?query=${query}&per_page=${perPage}`);
};
