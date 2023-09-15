import Image from "next/image";
import styles from "./title-card.module.css";
import { IMDBRating } from "../imdb-rating/imdb-rating";
import { RTRating } from "../rt-rating/rt-rating";

export const TitleCard = ({
  tag,
  image,
  date,
  title,
  imbdRating,
  rtRating,
  genre,
  id,
}) => {
  return (
    <div data-testid="movie-card" className={styles.titleCard}>
      <div style={{ "--gap": "12px" }} className="d-column">
        {tag && <span data-title-tag>{tag}</span>}

        <button>
          <Image
            src="/assets/icons/heart.svg"
            alt="Heart Icon"
            priority
            width={20}
            height={20}
          />
        </button>

        <a href={`/movies/${id}`}>
          <Image
            data-testid="movie-poster"
            src={image}
            alt="Title Poster"
            priority
            width={250}
            height={370}
          />
        </a>

        <span data-testid="movie-release-date" data-info>
          {date}
        </span>

        <h3 data-testid="movie-title">
          <a href={`/movies/${id}`}>{title}</a>
        </h3>

        <div className="d-row justify-content-space-between align-items-center">
          <IMDBRating rating={imbdRating} />

          <RTRating rating={rtRating} />
        </div>

        <span data-info>{genre}</span>
      </div>
    </div>
  );
};
