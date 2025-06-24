"use client"
import { useState, useEffect, useRef } from "react";
import FilterButtons from "./FilterButtons";
import PhotoGrid from "./PhotoGrid";

export default function GalleryGrid({ filters }) {
  const [activeFilter, setActiveFilter] = useState(filters[0]?.type || "");
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const cacheRef = useRef({}); // { [filterType]: [...] }

  useEffect(() => {
    if (!activeFilter) return;

    if (cacheRef.current[activeFilter]) {
      setGalleryPhotos(cacheRef.current[activeFilter]);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_SRTAPI_URL}/api/galler-photos?populate=*&filters[type]=${encodeURIComponent(activeFilter)}`
    )
      .then(res => res.json())
      .then(json => {
        const photos = json.data || [];
        cacheRef.current[activeFilter] = photos;
        setGalleryPhotos(photos);
      })
      .catch(() => setGalleryPhotos([]))
      .finally(() => setLoading(false));
  }, [activeFilter]);

  return (
    <>
      <FilterButtons filters={filters} onChange={setActiveFilter} />
      {loading ? <div>Loading...</div> : <PhotoGrid images={galleryPhotos} />}
    </>
  );
}