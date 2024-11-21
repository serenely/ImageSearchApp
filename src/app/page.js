"use client";
import styles from "./page.module.css";
import { FcLikePlaceholder, FcLike, FcBusinessman, FcAddImage } from "react-icons/fc";
import { useEffect, useState } from "react";
import { getPhotos, searchPhotos } from "../api/getPhotosApi";

export default function Home() {
  const [unsplashPhotoArray, setUnsplashPhotoArray] = useState([]);
  const [isThreeColumn, setIsThreeColumn] = useState(true);
  const [likedPhotos, setLikedPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const data = await getPhotos();
      setUnsplashPhotoArray(data);
    } catch (error) {
      console.error(error.message);
    }
    setLoading(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await searchPhotos(query);
      setUnsplashPhotoArray(data.results);
    } catch (error) {
      console.error(error.message);
    }
    setLoading(false);
  };

  const likedPhotosHandler = (id) => {
    setLikedPhotos((prevLikedPhotos) =>
      prevLikedPhotos.includes(id)
        ? prevLikedPhotos.filter((photoId) => photoId !== id)
        : [...prevLikedPhotos, id]
    );
  };

  const openModal = (photo) => {
    setSelectedPhoto(photo);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPhoto(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  return (
    <div>
      <div className={styles.searchContainer}>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search for photos and illustrations"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={styles.searchInput}
          />
        </form>
        <button className={styles.searchButton}>
          <FcAddImage size={20} /> {/* Иконка для загрузки фотографии */}
        </button>
        <button className={styles.searchButton}>
          <FcBusinessman size={20} /> {/* Иконка для профиля */}
        </button>
      </div>
      <div className={styles.toggleButtonContainer}>
        <button
          className={styles.toggleButton}
          onClick={() => setIsThreeColumn(!isThreeColumn)}
        >
          Toggle Columns
        </button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div
          className={
            isThreeColumn
              ? styles.photoContainer
              : styles.photoContainerFiveColumns
          }
        >
          {unsplashPhotoArray.map((item) => (
            <div className={styles.photoContainerItem} key={item.id}>
              <button
                className={styles.photoContainerItemButton}
                onClick={() => openModal(item)}
              >
                <img
                  src={item.urls.small}
                  width={300}
                  height={"auto"}
                  alt={item.alt_description || "Unsplash Photo"}
                />
              </button>
              <button
                onClick={() => likedPhotosHandler(item.id)}
                className={styles.likeButton}
              >
                {likedPhotos.includes(item.id) ? (
                  <FcLike size={20} />
                ) : (
                  <FcLikePlaceholder size={20} />
                )}
              </button>
            </div>
          ))}
        </div>
      )}
      {isModalOpen && selectedPhoto && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.modalCloseButton} onClick={closeModal}>
              X
            </button>
            <img
              src={selectedPhoto.urls.regular}
              alt={selectedPhoto.alt_description || "Photo"}
              className={styles.modalImage}
            />
            <p>
              <strong>Description:</strong>{" "}
              {selectedPhoto.description || "No description available."}
            </p>
            <p>
              <strong>Author:</strong> {selectedPhoto.user.name}
            </p>
            <p>
              <strong>Likes:</strong> {selectedPhoto.likes}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
