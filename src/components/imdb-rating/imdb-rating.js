import Image from "next/image";
import typography from "../../typography.module.css";

export const IMDBRating = ({ rating }) => {
  return (
    <div style={{ "--gap": "10px" }} className="d-row align-items-center">
      <Image
        src="/assets/icons/imdb.png"
        alt="IMDB Icon"
        priority
        width={35}
        height={17}
      />

      <span className={typography.bodySmall}>{rating}</span>
    </div>
  );
};
