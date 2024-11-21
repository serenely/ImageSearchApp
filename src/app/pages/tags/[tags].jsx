"use client";
import styles from "../../page.module.css";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function TagPage() {
  const router = useRouter();
  const { tag } = router.query; 
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!tag) return;

    const fetchPhotosByTag = async () => {
      setLoading(true);
      const response = await fetch(
        `https://api.unsplash.com/search/photos/?client_id=5Occ4SJGQNgunE9rEoMBy3ZgDwY8Y1guYwXTMYhzbrE&query=${tag}&per_page=12`
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setPhotos(data.results);
      setLoading(false);
    };

    fetchPhotosByTag();
  }, [tag]);

  return (
    <div>
      <h1>Photos for tag: {tag}</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className={styles.photoContainer}>
          {photos.map((photo) => (
            <div className={styles.photoContainerItem} key={photo.id}>
              <img
                src={photo.urls.small}
                alt={photo.alt_description || "Unsplash Photo"}
              />
              <p>Author: {photo.user.name}</p>
              <p>Likes: {photo.likes}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
