"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { $axios } from "@/utils/api";
import moment from "moment";

export default function Movie({ params }) {
  const { movie } = params;
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    $axios
      .get(`https://api.themoviedb.org/3/movie/${movie}`)
      .then(({ data }) => {
        setDetails(data);
      })
      .finally(() => setLoading(false));
  }, [movie]);

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

  const duration = moment.duration(details?.runtime || 0, "minutes");

  return (
    <>
      <div className={styles.sidebar}>
        <div className={styles.sidebar_logo}>
          <Image
            src="/assets/images/logo_dark.svg"
            alt="Moviebox Logo"
            priority
            width={186}
            height={50}
          />
        </div>

        <nav className={styles.sidebar_nav}>
          <a href="#">
            <Image
              src="/assets/icons/home.svg"
              alt="Icon"
              priority
              width={25}
              height={25}
            />

            <span>Home</span>
          </a>

          <a href="#" data-current>
            <Image
              src="/assets/icons/movie_projector.svg"
              alt="Icon"
              priority
              width={25}
              height={25}
            />

            <span>Movies</span>
          </a>

          <a href="#">
            <Image
              src="/assets/icons/tv_show.svg"
              alt="Icon"
              priority
              width={25}
              height={25}
            />

            <span>TV Series</span>
          </a>

          <a href="#">
            <Image
              src="/assets/icons/calendar.svg"
              alt="Icon"
              priority
              width={25}
              height={25}
            />

            <span>Calendar</span>
          </a>
        </nav>

        <div className={styles.sidebar_ad}>
          <p>Play movie quizes and earn free tickets</p>
          <p>50k people are playing now</p>
          <button>Start playing</button>
        </div>

        <button>
          <Image
            src="/assets/icons/logout.png"
            alt="Icon"
            priority
            width={30}
            height={30}
          />

          <span>Log out</span>
        </button>
      </div>

      <main className={styles.main}>
        {!details && (
          <div
            style={{
              height: "50vh",
              display: "flex",
              flexDirection: "column",
              gap: "33px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <h1 className={styles.title}>Resource not Found</h1>

            <a href="/">Back home</a>
          </div>
        )}

        {details && (
          <div
            className={styles.video_player}
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/original${details.backdrop_path})`,
            }}
          >
            <a href={details.homepage}>
              <Image
                src="/assets/icons/play.png"
                alt="Icon"
                priority
                width={54}
                height={54}
              />
            </a>

            <span>Watch Trailer</span>
          </div>
        )}

        <div
          className="d-column xl-d-row justify-content-space-between"
          style={{ marginTop: "30px", "--gap": "26px" }}
        >
          {details && (
            <div>
              <div style={{ "--gap": "25px" }} className="d-column">
                <div>
                  <div
                    className="d-column xl-d-row xl-align-items-center"
                    style={{ "--gap": "17px" }}
                  >
                    <h2 className={styles.title}>
                      <span data-testid="movie-title">{details.title}</span> •{" "}
                      {details.release_date} • {Math.floor(duration.asHours())}h{" "}
                      {duration.minutes()}m
                    </h2>

                    <span data-testid="movie-runtime" hidden>
                      {details.runtime}
                    </span>
                    <span data-testid="movie-release-date" hidden>
                      {moment(details.release_date).toDate().toUTCString()}
                    </span>

                    <div
                      className="d-row"
                      style={{ "--gap": "11px", justifyContent: "flex-start" }}
                    >
                      {details.genres.map((g) => (
                        <span key={g.id} className={styles.genre}>
                          {g.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ "--gap": "20px" }} className="d-column">
                  <p
                    className={styles.description}
                    data-testid="movie-overview"
                  >
                    {details.overview}
                  </p>

                  <div className={styles.crew}>
                    <div style={{ "--gap": "31px" }} className="d-column">
                      <p>
                        Director : <span>Joseph Kosinski</span>
                      </p>

                      <p>
                        Writers :{" "}
                        <span>Jim Cash, Jack Epps Jr, Peter Craig</span>
                      </p>

                      <p>
                        Stars :{" "}
                        <span>Tom Cruise, Jennifer Connelly, Miles Teller</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: "15px" }}>
                <div className={styles.top_rated}>
                  <span>Top rated movie #65</span>

                  <span>Awards 9 nominations</span>

                  <Image
                    src="/assets/icons/expand_arrow.svg"
                    alt="Icon"
                    priority
                    width={30}
                    height={30}
                  />
                </div>
              </div>
            </div>
          )}

          {details && (
            <div style={{ "--gap": "33px" }} className="d-column">
              <div className="d-column" style={{ "--gap": "24px" }}>
                <div className={styles.rating}>
                  <div>
                    <div
                      className="d-row align-items-center"
                      style={{ "--gap": "9px", justifyContent: "flex-end" }}
                    >
                      <Image
                        src="/assets/icons/star.png"
                        alt="Icon"
                        priority
                        width={30}
                        height={30}
                      />

                      <span>
                        <span>8.5</span> | 350k
                      </span>
                    </div>
                  </div>
                </div>

                <div className="d-column" style={{ "--gap": "12px" }}>
                  <button className={styles.primary_button}>
                    <div
                      className="d-row align-items-center justify-content-center"
                      style={{ "--gap": "12px" }}
                    >
                      <Image
                        src="/assets/icons/two_tickets.svg"
                        alt="Icon"
                        priority
                        width={25}
                        height={25}
                      />

                      <span>See Showtimes</span>
                    </div>
                  </button>

                  <button className={styles.secondary_button}>
                    <div
                      className="d-row align-items-center justify-content-center"
                      style={{ "--gap": "12px" }}
                    >
                      <Image
                        src="/assets/icons/list.svg"
                        alt="Icon"
                        priority
                        width={23}
                        height={23}
                      />

                      <span>More watch options</span>
                    </div>
                  </button>
                </div>
              </div>

              <a href="#" className={styles.best_shows}>
                <Image
                  src="/assets/images/rectangle_37.png"
                  alt="Best shows"
                  priority
                  width={360}
                  height={229}
                />

                <div
                  className="d-row align-items-center justify-content-center"
                  style={{ "--gap": "12px" }}
                >
                  <Image
                    src="/assets/icons/list_light.svg"
                    alt="Icon"
                    priority
                    width={23}
                    height={23}
                  />

                  <span>The Best Movies and Shows in September</span>
                </div>
              </a>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
