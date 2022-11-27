import React from 'react';
import { useQuery } from '@apollo/client';
import { ROOT_QUERY } from './App';

const Photos = () => {
  const { data, loading } = useQuery(ROOT_QUERY, {
    fetchPolicy: "cache-and-network"
  });

  if (loading) return <p>loading photos...</p>

  return (
    <>
      {data.allPhotos.map((photo) =>
        <img
          key={photo.id}
          src={photo.url}
          alt={photo.name}
          width={350}
        />
      )}
    </>
  )
}

export default Photos