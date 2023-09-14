"use client";
import Image from "next/image";
import styles from "./page.module.css";
import typography from "../typography.module.css";
import { IMDBRating } from "@/components/imdb-rating/imdb-rating";
import { RTRating } from "@/components/rt-rating/rt-rating";
import { TitleCard } from "@/components/title-card/title-card";
import { useCallback, useEffect, useState } from "react";
import { $axios } from "@/utils/api";
import debounce from "lodash.debounce";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState({});
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [titleIndex, setTitleIndex] = useState(0);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      $axios.get("/genre/movie/list"),
      $axios.get("/trending/movie/week"),
    ]).then(
      ([
        {
          data: { genres },
        },
        {
          data: { results },
        },
      ]) => {
        setGenres(
          genres.reduce((acc, cur) => ({ ...acc, [cur.id]: cur.name }), {})
        );

        results.slice(0, 5).forEach((title) => {
          const img = new window.Image();
          img.src = `https://image.tmdb.org/t/p/original${title.backdrop_path}`;
        });

        setMovies(results);
        setLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    const i = titleIndex;
    const timeout = setTimeout(() => {
      setTitleIndex(i >= 4 ? 0 : i + 1);
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, [titleIndex]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearch = useCallback(
    debounce((query) => {
      setSearchResult([]);
      if (!query) {
        return;
      }
      setLoading(true);
      $axios
        .get("/search/movie", { params: { query } })
        .then(({ data }) => {
          setSearchResult(data.results.filter((title) => !!title.poster_path));
          setLoading(false);
        })
        .finally(() => {
          setLoading(false);
        });
    }, 500),
    []
  );

  if (loading) {
    return (
      <div className="loader">
        <div className="lds-roller">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }

  const searching = !!search;
  const firstTitle = movies[titleIndex];
  if (!firstTitle && !searching) {
    return null;
  }

  return (
    <>
      <header
        className={styles.header}
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${firstTitle.backdrop_path})`,
        }}
      >
        <div className={styles.navbar}>
          <div className="container">
            <div className="d-row justify-content-space-between align-items-center">
              <div>
                <Image
                  src="/assets/images/logo.svg"
                  alt="Moviebox Logo"
                  priority
                  width={186}
                  height={50}
                />
              </div>

              <div className="d-none l-d-block">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSearch(e.target.query.value);
                  }}
                  className={styles.searchBar}
                >
                  <input
                    type="text"
                    onChange={(e) => {
                      setSearch(e.target.value);
                      handleSearch(e.target.value);
                    }}
                    value={search}
                    name="query"
                    placeholder="What do you want to watch?"
                  />

                  <button type="submit">
                    <Image
                      src="/assets/icons/search.svg"
                      alt="Search Icon"
                      priority
                      width={16}
                      height={16}
                    />
                  </button>
                </form>
              </div>

              <div className={styles.nav}>
                <div className="d-row align-items-center">
                  <a href="#" className="d-none md-d-block">
                    Sign in
                  </a>

                  <button>
                    <Image
                      className="icon"
                      src="/assets/icons/menu.svg"
                      alt="Menu Icon"
                      priority
                      width={24}
                      height={24}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.banner}>
          <div className="container">
            <div className="d-row align-items-center justify-content-space-between">
              <div
                style={{ "--gap": "16px", maxWidth: "404px" }}
                className="d-column"
              >
                <h2 className={typography.heading1}>{firstTitle.title}</h2>

                <div
                  style={{ "--gap": "34px" }}
                  className="d-row align-items-center"
                >
                  <IMDBRating
                    rating={`${(firstTitle.vote_average * 10).toFixed(
                      1
                    )} / 100`}
                  />

                  <RTRating
                    rating={`${(firstTitle.vote_average * 10).toFixed(0)}%`}
                  />
                </div>

                <div style={{ maxWidth: "302px" }}>
                  <p className={typography.bodyBig}>{firstTitle.overview}</p>
                </div>

                <div>
                  <button className={styles.watchButton}>
                    <div
                      style={{ "--gap": "8px" }}
                      className="d-row align-items-center content"
                    >
                      <Image
                        src="/assets/icons/play.svg"
                        alt="Play Icon"
                        priority
                        width={20}
                        height={20}
                      />

                      <span className={typography.button}>WATCH TRAILER</span>
                    </div>
                  </button>
                </div>
              </div>

              <div className={styles.pagination}>
                <div className="d-none md-d-block">
                  <div style={{ "--gap": "10px" }} className="d-column">
                    {Array(5)
                      .fill(null)
                      .map((_, index) => (
                        <button
                          onClick={() => setTitleIndex(index)}
                          {...(index === titleIndex
                            ? { "data-current": "true" }
                            : {})}
                          key={`slider_button_${index}`}
                        >
                          {index + 1}
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className="container">
          <div style={{ "--gap": "44px" }} className="d-column">
            <div className="d-row align-items-center justify-content-space-between">
              <span className={typography.heading2}>
                {searching ? `Search: ${search}` : "Featured Movie"}
              </span>

              {!searching && (
                <div className="d-none md-d-block">
                  <a
                    href="#"
                    style={{ "--gap": "8px" }}
                    className="d-row align-items-center"
                  >
                    <span className={styles.seeMore}>See more</span>

                    <Image
                      src="/assets/icons/chevron_right.svg"
                      alt="Chevron Icon"
                      priority
                      width={20}
                      height={20}
                    />
                  </a>
                </div>
              )}
            </div>

            <div
              style={{ flexWrap: "wrap" }}
              className="d-row justify-content-space-between"
            >
              {(searching ? searchResult : movies)
                .slice(0, searching ? 8 : 4)
                .map((title) => (
                  <TitleCard
                    key={title.id}
                    id={title.id}
                    image={`https://image.tmdb.org/t/p/original${title.poster_path}`}
                    date={title.release_date}
                    title={title.title}
                    imbdRating={`${(title.vote_average * 10).toFixed(1)} / 100`}
                    rtRating={`${(title.vote_average * 10).toFixed(0)}%`}
                    genre={title.genre_ids.map((id) => genres[id]).join(", ")}
                  />
                ))}
            </div>
            {searching && !searchResult.length && !loading && (
              <div className="d-row justify-content-center">
                <p className={typography.heading2}>
                  Nothing matches your search query
                </p>
              </div>
            )}
          </div>

          {!searching && (
            <div
              style={{ "--gap": "76px", marginTop: "103px" }}
              className="d-column"
            >
              <div
                style={{ flexWrap: "wrap", "--gap": 0 }}
                className="d-row justify-content-space-between"
              >
                {movies.slice(4, 8).map((title) => (
                  <TitleCard
                    key={title.id}
                    id={title.id}
                    image={`https://image.tmdb.org/t/p/original${title.poster_path}`}
                    date={title.release_date}
                    title={title.title}
                    imbdRating={`${(title.vote_average * 10).toFixed(1)} / 100`}
                    rtRating={`${(title.vote_average * 10).toFixed(0)}%`}
                    genre={title.genre_ids.map((id) => genres[id]).join(", ")}
                  />
                ))}
              </div>

              <div
                style={{ flexWrap: "wrap", "--gap": 0 }}
                className="d-row justify-content-space-between"
              >
                {movies.slice(8, 12).map((title) => (
                  <TitleCard
                    key={title.id}
                    id={title.id}
                    image={`https://image.tmdb.org/t/p/original${title.poster_path}`}
                    date={title.release_date}
                    title={title.title}
                    imbdRating={`${(title.vote_average * 10).toFixed(1)} / 100`}
                    rtRating={`${(title.vote_average * 10).toFixed(0)}%`}
                    genre={title.genre_ids.map((id) => genres[id]).join(", ")}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className={styles.footer}>
        <div
          style={{ marginTop: "147px", "--gap": "36px" }}
          className="d-column align-items-center"
        >
          <div style={{ "--gap": "48px" }} className="d-row align-items-center">
            <a href="#">
              <Image
                src="/assets/icons/facebook.svg"
                alt="Facebook Icon"
                priority
                width={24}
                height={27.43}
              />
            </a>

            <a href="#">
              <Image
                src="/assets/icons/instagram.svg"
                alt="Instagram Icon"
                priority
                width={24}
                height={27.43}
              />
            </a>

            <a href="#">
              <Image
                src="/assets/icons/twitter.svg"
                alt="Twitter Icon"
                priority
                width={24}
                height={24}
              />
            </a>

            <a href="#">
              <Image
                src="/assets/icons/youtube.svg"
                alt="Youtube Icon"
                priority
                width={24}
                height={21.33}
              />
            </a>
          </div>

          <div
            style={{ "--gap": "48px" }}
            className="d-column md-d-row align-items-center"
          >
            <a href="#">Conditions of Use</a>

            <a href="#">Privacy & Policy</a>

            <a href="#">Press Room</a>
          </div>

          <p>© 2021 MovieBox by Adriana Eka Prayudha</p>
        </div>
      </footer>
    </>
  );
}

// export default function Home() {
//   return (
//     <main className={styles.main}>
//       <div className={styles.description}>
//         <p>
//           Get started by editing&nbsp;
//           <code className={styles.code}>src/app/page.js</code>
//         </p>
//         <div>
//           <a
//             href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             By{' '}
//             <Image
//               src="/vercel.svg"
//               alt="Vercel Logo"
//               className={styles.vercelLogo}
//               width={100}
//               height={24}
//               priority
//             />
//           </a>
//         </div>
//       </div>

//       <div className={styles.center}>
//         <Image
//           className={styles.logo}
//           src="/next.svg"
//           alt="Next.js Logo"
//           width={180}
//           height={37}
//           priority
//         />
//       </div>

//       <div className={styles.grid}>
//         <a
//           href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//           className={styles.card}
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <h2>
//             Docs <span>-&gt;</span>
//           </h2>
//           <p>Find in-depth information about Next.js features and API.</p>
//         </a>

//         <a
//           href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//           className={styles.card}
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <h2>
//             Learn <span>-&gt;</span>
//           </h2>
//           <p>Learn about Next.js in an interactive course with&nbsp;quizzes!</p>
//         </a>

//         <a
//           href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//           className={styles.card}
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <h2>
//             Templates <span>-&gt;</span>
//           </h2>
//           <p>Explore the Next.js 13 playground.</p>
//         </a>

//         <a
//           href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//           className={styles.card}
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <h2>
//             Deploy <span>-&gt;</span>
//           </h2>
//           <p>
//             Instantly deploy your Next.js site to a shareable URL with Vercel.
//           </p>
//         </a>
//       </div>
//     </main>
//   )
// }
