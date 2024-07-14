import React, { useState, useContext, useEffect } from "react";
import SearchBar from "../../components/searchBar/SearchBar";
import "./homePage.scss";
import { AuthContext } from "../../context/AuthContext";

function HomePage() {
  const { currentUser } = useContext(AuthContext);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false); // State to determine if mobile

  useEffect(() => {
    // Check if it's a mobile device
    const isMobileDevice = /Mobi|Android/i.test(navigator.userAgent);
    setIsMobile(isMobileDevice);

    // Popup logic on first load
    const hasAgreed = sessionStorage.getItem("hasAgreed");
    if (!hasAgreed) {
      setIsPopupVisible(true);
    }
  }, []);

  const handleAgree = () => {
    setIsPopupVisible(false);
    sessionStorage.setItem("hasAgreed", true);
  };

  const posts = [
    { id: 1, title: "شقه للبيع فى جمصه ", image: "/M.png", link: "/6664cc32cd7a7cf906e45a07" },
    { id: 2, title: "شقه للايجار حي الجامعه", image: "/S.png", link: "/66649e047195ba36a5272cc2" },
    { id: 3, title: "مخزن للايجار حى الجامعه", image: "/W.png", link: "/665ceac3453e083f5d94a3ac" },
  ];

  return (
    <div className="homePage">
      {isPopupVisible && (
        <div className="popup">
          <div className="popup-content">
            <h2>الشروط والأحكام</h2>
            <p>هذه بعض الشروط والأحكام لاستخدام هذا الموقع:</p>
<ul>
  <li>يجب أن تكون جميع المشاركات والإعلانات المتعلقة بالعقارات دقيقة وصحيحة</li>
  <li>الموقع ليس مسؤولًا عن محتوى المستخدمين ويتوجب على المستخدمين تحمل المسؤولية الكاملة عن محتواهم</li>
  <li>يتعين على المستخدمين التأكد من سلامة المعلومات قبل اتخاذ أي قرار بناءً عليها</li>
  <li>لا يجوز استخدام الموقع لنشر أي محتوى غير قانوني أو مخالف للأخلاق العامة</li>
  <li>قد يتم مراجعة وحذف أي محتوى مخالف للشروط والأحكام دون سابق إنذار</li>
</ul>

            <button onClick={handleAgree}>موافق</button>
          </div>
        </div>
      )}
      <div className="textContainer">
        <div className="wrapper">
          <h1 className="title">منصة عقاري</h1>
          <p className="description">
            منصة عقاري هي منصة متوفر بها كل عقار تبحث عنه في{" "}
            <span className="highlight">المنصورة</span> وجميع انحاء <span className="highlight">الدقهلية </span>
          </p>
          <SearchBar />
          <div className="posts">
            {posts.map((post) => (
              <div key={post.id} className="post">
                <a href={post.link}>
                  <img src={post.image} alt={post.title} />
                  <h2>{post.title}</h2>
                </a>
              </div>
            ))}
          </div>
          <div className="spacer"></div>
        </div>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="Background" />
      </div>
    </div>
  );
}

export default HomePage;
