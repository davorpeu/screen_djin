import React, { useEffect } from 'react';
/*import { useAppDispatch } from 'hooks/useAppDispatch.ts';
import { MoviesList } from 'components/features/movies/MoviesList';
import { fetchPopularMovies, fetchTopRatedMovies } from 'store/slices/moviesSlice';*/
/*import './HomePage.css';*/

export const Home: React.FC = () => {
  /*  const dispatch = useAppDispatch();*/

/*    useEffect(() => {
    /!*    dispatch(fetchPopularMovies());
        dispatch(fetchTopRatedMovies());*!/
    }, [dispatch]);*/

    return (
        <div className="home-page">
            <section className="hero">
                <div className="hero__content">
                    <h1>Discover Movies & TV Shows</h1>
                    <p>Find and track your favorite entertainment from around the world</p>
                </div>
            </section>

            <div className="content-section">
      {/*          <MoviesList category="popular" title="Popular Movies" />
                <MoviesList category="top_rated" title="Top Rated Movies" />*/}
            </div>
        </div>
    );
};

