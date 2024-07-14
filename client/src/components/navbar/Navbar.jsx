import React, { useContext, useState, useEffect } from "react";
import "./navbar.scss";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useNotificationStore } from "../../lib/notificationStore";

function Navbar() {
  const [open, setOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const fetchNotifications = useNotificationStore((state) => state.fetch);
  const number = useNotificationStore((state) => state.number);

  // Function to handle menu toggle
  const handleMenuToggle = () => {
    setOpen(!open);
  };

  // Function to close menu
  const closeMenu = () => {
    setOpen(false);
  };

  // Fetch notifications when currentUser changes or on initial render
  useEffect(() => {
    if (currentUser) {
      fetchNotifications();
    }
  }, [currentUser, fetchNotifications]);

  return (
    <nav>
      <div className="left">
        <Link to="/" className="logo">
          <img src="/logo.png" alt="Logo" />
          <span>Akary</span>
        </Link>
      </div>
      <div className="middle">
        <Link to="/">الرئيسية</Link>
        <Link to="/term">سياسه الخصوصيه وشروط الاستخدام</Link>
        <Link to="/contactus">اتصل بنا</Link>
        <Link to="/add">انشاء اعلان</Link>
        <Link to="/requests">الطلبات</Link>
      </div>
      <div className="right">
        <div className="user">
          {currentUser ? (
            <Link to="/profile" className="profile">
              <img src={currentUser.avatar || "/noavatar.jpg"} alt="User Avatar" />
              {number > 0 && <div className="notification">{number}</div>}
              <span>{currentUser.username}</span>
            </Link>
          ) : (
            <>
              <Link to="/login">تسجيل الدخول</Link>
              <Link to="/register" className="register">
                انضم الآن
              </Link>
            </>
          )}
        </div>
        <div className="menuIcon" onClick={handleMenuToggle}>
          <img src="/menu.png" alt="Menu Icon" />
        </div>
        <div className={`menu ${open ? "active" : ""}`}>
          <div className="menuItems">
            {/* Close Button */}
            <div className="closeMenu" onClick={closeMenu}>
              X
            </div>
            <Link to="/" onClick={closeMenu}>الرئيسية</Link>
            <Link to="/term" onClick={closeMenu}>سياسه الخصوصيه وشروط الاستخدام</Link>
            <Link to="/contactus" onClick={closeMenu}>اتصل بنا</Link>
            <Link to="/add" onClick={closeMenu}>انشاء اعلان</Link>
            <Link to="/requests" onClick={closeMenu}>الطلبات</Link>
            {currentUser ? (
              <Link to="/profile" className="profile" onClick={closeMenu}>
                <span>الملف الشخصي</span>
              </Link>
            ) : (
              <>
                <Link to="/login" onClick={closeMenu}>تسجيل الدخول</Link>
                <Link to="/register" onClick={closeMenu}>انضم الآن</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
