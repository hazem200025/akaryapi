import "./singlePage.scss";
import Slider from "../../components/slider/Slider";
import Map from "../../components/map/Map";
import { useNavigate, useLoaderData, Await } from "react-router-dom";
import DOMPurify from "dompurify";
import { useContext, useState, useEffect, Suspense } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import Chat from "../../components/chat/Chat"; // Ensure the correct path

function SinglePage() {
  const post = useLoaderData();
  const [saved, setSaved] = useState(post.isSaved);
  const [showChat, setShowChat] = useState(false); // State to manage chat view
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [chats, setChats] = useState(null);

  const handleSave = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    setSaved((prev) => !prev);
    try {
      await apiRequest.post("/users/save", { postId: post.id });
    } catch (err) {
      console.log(err);
      setSaved((prev) => !prev);
    }
  };

  const handleToggleChat = () => {
    setShowChat((prev) => !prev); // Toggle chat view
  };

  const fetchChats = async () => {
    try {
      const response = await apiRequest.get("/chats");
      setChats(response.data); // Assuming the response contains an array of chats
    } catch (error) {
      console.error("Error loading chats:", error);
    }
  };

  const handleMessageSend = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    if (!post.user || !currentUser) {
      console.log("User information is missing.");
      return;
    }

    const userIDs = [currentUser.id, post.userId].filter(Boolean);

    if (userIDs.length !== 2) {
      console.log("Invalid user information.");
      return;
    }
    if (userIDs[0] === userIDs[1]) {
      // If the sender and receiver IDs are the same, show the chat immediately
      setShowChat(true);
      return;
    }

    try {
      // Check if a chat already exists with the post's user
      await apiRequest.get(`/chats/${post.userId}?senderId=${userIDs[0]}&receiverId=${userIDs[1]}`);
      await fetchChats(); // Fetch chats after finding the existing chat
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 404) {
        // If chat doesn't exist, create a new chat
        try {
          await apiRequest.post("/chats", { receiverId: post.userId });
          await fetchChats(); // Fetch chats after creating a new chat
        } catch (err) {
          console.error(err);
        }
      }
    }
    setShowChat(true); // Show chat view
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <div className="singlePage">
      <div className="details">
        <div className="wrapper">
          <Slider images={post.images} />
          <div className="info">
            <div className="top">
              <div className="post">
                <h1>{post.title}</h1>
                <div className="address">
                  <img src="/pin.png" alt="" />
                  <span>{post.address}</span>
                </div>
                <div className="price">EGB {post.price}</div>
              </div>
              <div className="user">
                {post.user ? (
                  <>
                    <img src={post.user.avatar} alt="" />
                    <span>{post.user.username}</span>
                  </>
                ) : (
                  <span>User information is not available</span>
                )}
              </div>
            </div>
            <div
              className="bottom"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post.postDetail.desc),
              }}
            ></div>
          </div>
        </div>
      </div>
      {!showChat ? (
        <div className="features">
          <div className="wrapper">
            <p className="title">العامة</p>
            <div className="listVertical">
              <div className="feature">
                <img src="/utility.png" alt="" />
                <div className="featureText">
                  <span>المرافق</span>
                  {post.postDetail.utilities === "owner" ? (
                    <p>المالك مسؤول</p>
                  ) : (
                    <p>المستأجر مسؤول</p>
                  )}
                </div>
              </div>
              <div className="feature">
                <img src="/pet.png" alt="" />
                <div className="featureText">
                  <span>سياسة الحيوانات الأليفة</span>
                  {post.postDetail.pet === "allowed" ? (
                    <p>الحيوانات الأليفة مسموح بها</p>
                  ) : (
                    <p>الحيوانات الأليفة غير مسموح بها</p>
                  )}
                </div>
              </div>
              <div className="feature">
                <img src="/fee.png" alt="" />
                <div className="featureText">
                  <span>سياسة الدخل</span>
                  <p>{post.postDetail.income}</p>
                </div>
              </div>
            </div>
            <p className="title">الأحجام</p>
            <div className="sizes">
              <div className="size">
                <img src="/size.png" alt="" />
                <span>{post.postDetail.size} قدم مربع</span>
              </div>
              <div className="size">
                <img src="/bed.png" alt="" />
                <span>{post.bedroom} غرف نوم</span>
              </div>
              <div className="size">
                <img src="/bath.png" alt="" />
                <span>{post.bathroom} حمام</span>
              </div>
            </div>
            <p className="title">الأماكن القريبة</p>
            <div className="listHorizontal">
              <div className="feature">
                <img src="/school.png" alt="" />
                <div className="featureText">
                  <span>المدرسة</span>
                  <p>
                    {post.postDetail.school > 999
                      ? post.postDetail.school / 1000 + " كم"
                      : post.postDetail.school + " م"}{" "}
                    بعيداً
                  </p>
                </div>
              </div>
              <div className="feature">
                <img src="/pet.png" alt="" />
                <div className="featureText">
                  <span>محطة الحافلات</span>
                  <p>{post.postDetail.bus} م بعيداً</p>
                </div>
              </div>
              <div className="feature">
                <img src="/fee.png" alt="" />
                <div className="featureText">
                  <span>المطعم</span>
                  <p>{post.postDetail.restaurant} م بعيداً</p>
                </div>
              </div>
            </div>
            <p className="title">الموقع</p>
            <div className="mapContainer">
              <Map items={[post]} />
            </div>
            <div className="buttons">
              <button onClick={handleMessageSend}>
                <img src="/chat.png" alt="" />
                {showChat ? "العودة إلى الميزات" : "إرسال رسالة"}
              </button>
              <button
                onClick={handleSave}
                style={{
                  backgroundColor: saved ? "#fece51" : "white",
                }}
              >
                <img src="/save.png" alt="" />
                {saved ? "المكان محفوظ" : "حفظ المكان"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="chatContainer">
          <div className="wrapper">
            <button className="toggleButton" onClick={handleToggleChat}>
              {showChat ? "العودة إلى الميزات" : "فتح الدردشة"}
            </button>
            <Suspense fallback={<p>جار التحميل...</p>}>
              {chats && <Chat chats={chats} />}
            </Suspense>
          </div>
        </div>
      )}
    </div>
  );
}

export default SinglePage;
