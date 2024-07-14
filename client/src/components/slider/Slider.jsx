import { useState } from "react";
import "./slider.scss";

function Slider({ images }) {
  const [imageIndex, setImageIndex] = useState(null);
  const smallImageCount = 3;

  const changeSlide = (direction) => {
    if (direction === "left") {
      if (imageIndex === 0) {
        setImageIndex(images.length - 1);
      } else {
        setImageIndex(imageIndex - 1);
      }
    } else {
      if (imageIndex === images.length - 1) {
        setImageIndex(0);
      } else {
        setImageIndex(imageIndex + 1);
      }
    }
  };

  const renderSmallImages = () => {
    const startIndex = Math.max(0, imageIndex - Math.floor(smallImageCount / 2));
    const endIndex = Math.min(images.length, startIndex + smallImageCount);
    const smallImages = images.slice(startIndex, endIndex);

    return smallImages.map((image, index) => (
      <img
        src={image}
        alt=""
        key={index}
        onClick={() => setImageIndex(startIndex + index)}
      />
    ));
  };

  const remainingImagesCount = images.length - smallImageCount;
  const remainingText =
    remainingImagesCount > 0 ? `+${remainingImagesCount}` : '';

  return (
    <div className="slider">
      {imageIndex !== null && (
        <div className="fullSlider">
          <div className="arrow" onClick={() => changeSlide("left")}>
            <img src="/arrow.png" alt="" />
          </div>
          <div className="imgContainer">
            <img src={images[imageIndex]} alt="" />
          </div>
          <div className="arrow" onClick={() => changeSlide("right")}>
            <img src="/arrow.png" className="right" alt="" />
          </div>
          <div className="close" onClick={() => setImageIndex(null)}>
            X
          </div>
        </div>
      )}
      <div className="bigImage">
        <img src={images[0]} alt="" onClick={() => setImageIndex(0)} />
      </div>
      <div className="smallImages">
        {renderSmallImages()}
        {remainingText && (
          <div className="more">
            المزيد {remainingText}
          </div>
        )}
      </div>
    </div>
  );
}

export default Slider;
