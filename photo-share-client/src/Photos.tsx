import React from 'react';
import { useQuery } from '@apollo/client';
// @ts-expect-error TS(6142): Module './App' was resolved to '/Users/miyukano/mi... Remove this comment to see the full error message
import { ROOT_QUERY } from './App';

const Photos = () => {
  const { data, loading } = useQuery(ROOT_QUERY, {
    fetchPolicy: "cache-and-network"
  });

  // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
  if (loading) return <p>loading photos...</p>

  // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
  return <>
    {/* @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
    {data.allPhotos.map((photo: any) => <img
      key={photo.id}
      src={photo.url}
      alt={photo.name}
      width={350}
    />
    )}
  </>;
}

export default Photos