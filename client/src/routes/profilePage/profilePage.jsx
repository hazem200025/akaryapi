import Chat from "../../components/chat/Chat";
import List from "../../components/list/List";
import "./profilePage.scss";
import apiRequest from "../../lib/apiRequest";
import { Await, Link, useLoaderData, useNavigate } from "react-router-dom";
import { Suspense, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function ProfilePage() {
  const data = useLoaderData();

  const { updateUser, currentUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout");
      updateUser(null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="profilePage">
      <div className="details">
        <div className="wrapper">
          <div className="title">
            <h1>معلومات المستخدم</h1> {/* User Information in Arabic */}
            <Link to="/profile/update">
              <button>تحديث الملف الشخصي</button> {/* Update Profile in Arabic */}
            </Link>
          </div>
          <div className="info">
            <span>
              الصورة الشخصية:
              <img src={currentUser.avatar || "noavatar.jpg"} alt="" />
            </span>
            <span>
              اسم المستخدم: <b>{currentUser.username}</b>
            </span>
            <span>
              البريد الإلكتروني: <b>{currentUser.email}</b>
            </span>
            <button onClick={handleLogout}>تسجيل الخروج</button> {/* Logout in Arabic */}
          </div>
          <div className="title">
            <h1>قائمتي</h1> {/* My List in Arabic */}
            <Link to="/add">
              <button>إنشاء مشاركة جديدة</button> {/* Create New Post in Arabic */}
            </Link>
          </div>
          <Suspense fallback={<p>جار التحميل...</p>}>
            <Await
              resolve={data.postResponse}
              errorElement={<p>خطأ في تحميل المشاركات!</p>}
            >
              {(postResponse) => <List posts={postResponse.data.userPosts} />}
            </Await>
          </Suspense>
          <div className="title">
            <h1>المشاركات المحفوظة</h1> {/* Saved List in Arabic */}
          </div>
          <Suspense fallback={<p>جار التحميل...</p>}>
            <Await
              resolve={data.postResponse}
              errorElement={<p>خطأ في تحميل المشاركات!</p>}
            >
              {(postResponse) => <List posts={postResponse.data.savedPosts} />}
            </Await>
          </Suspense>
        </div>
      </div>
      <div className="chatContainer">
        <div className="wrapper">
          <Suspense fallback={<p>جار التحميل...</p>}>
            <Await
              resolve={data.chatResponse}
              errorElement={<p>خطأ في تحميل المحادثات!</p>}
            >
              {(chatResponse) => <Chat chats={chatResponse.data} />}
            </Await>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
