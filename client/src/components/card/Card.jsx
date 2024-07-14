import { Link } from "react-router-dom";
import "./card.scss";
import apiRequest from "../../lib/apiRequest";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function Card({ item }) {
  const { currentUser } = useContext(AuthContext);

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this post?");
    if (confirmed) {
      try {
        await apiRequest.delete(`/posts/${item.id}`);
        window.location.reload();
      } catch (error) {
        console.error("Failed to delete the post", error);
      }
    }
  };

  const getTimeAgo = (createdAt) => {
    const now = new Date();
    const createdAtDate = new Date(createdAt);
    const diffTime = Math.abs(now - createdAtDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const diffWeeks = Math.floor(diffDays / 7);
      return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
    } else if (diffDays < 365) {
      const diffMonths = Math.floor(diffDays / 30);
      return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
    } else {
      const diffYears = Math.floor(diffDays / 365);
      return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
    }
  };

  const getTypeText = () => {
    return item.type === "rent" ? "للإيجار" : "للبيع";
  };

  return (
    <div className="card">
      <Link to={`/${item.id}`} className="imageContainer">
        <img src={item.images[0]} alt="" />
      </Link>
      <div className="textContainer">
        <h2 className="title">
          <Link to={`/${item.id}`}>{item.title}</Link>
        </h2>
        <p className="address">
          <img src="/pin.png" alt="" />
          <span>{item.address}</span>
        </p>
        <p className="price">EGB {item.price}</p>
        <p className="type">{getTypeText()}</p>
        <div className="bottom">
          <div className="features">
            <div className="feature">
              <img src="/bed.png" alt="" />
              <span>{item.bedroom} غرف نوم</span>
            </div>
            <div className="feature">
              <img src="/bath.png" alt="" />
              <span>{item.bathroom} حمامات</span>
            </div>
          </div>
          <div className="userInfo">
            <span className="createdAt">{getTimeAgo(item.createdAt)}</span>
          </div>
        </div>
        {currentUser && currentUser.id === item.userId && (
          <div className="icons">
            <div className="icon" onClick={handleDelete}>
              <img src="/delete.png" alt="Delete" />
            </div>
            <div className="icon">
              <Link to={`/update/${item.id}`}>
                <img src="/edit.png" alt="edit" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Card;
