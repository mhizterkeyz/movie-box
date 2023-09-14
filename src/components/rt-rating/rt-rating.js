import Image from "next/image";
import typography from "../../typography.module.css";

export const RTRating = ({ rating }) => {
  return (
    <div style={{ "--gap": "10px" }} className="d-row align-items-center">
      <Image
        src="/assets/icons/rotten_tomatoes.png"
        alt="Rotten Tomatoes Icon"
        priority
        width={16}
        height={17}
      />

      <span className={typography.bodySmall}>{rating}</span>
    </div>
  );
};
