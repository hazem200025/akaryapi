import React, { useContext, useEffect, useState, Suspense } from 'react';
import { useParams, Link, useLoaderData, Await } from 'react-router-dom';
import './DetailPage.scss';
import { AuthContext } from '../../context/AuthContext';
import List from "../../components/list/List";
import apiRequest from '../../lib/apiRequest';

const propertyTypeMap = {
  apartment: 'شقة',
  house: 'منزل',
  condo: 'شقة فندقية',
  land: 'أرض',
};

const DetailPage = () => {
  const { id } = useParams();
  const { currentUser } = useContext(AuthContext);
  const data = useLoaderData();
  const [request, setRequest] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [newPostId, setNewPostId] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);
  const [showLinkedPosts, setShowLinkedPosts] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequestDetails();
  }, []);

  useEffect(() => {
    updateCommentCount();
  }, [comments]);

  const fetchRequestDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest.get(`/requests/${id}`);
      const translatedRequest = {
        ...response.data,
        type: response.data.type === 'buy' ? 'شراء' : 'إيجار',
        property: propertyTypeMap[response.data.property],
      };
      setRequest(translatedRequest);
      setComments(translatedRequest.comments || []);
    } catch (error) {
      console.error('فشل في جلب تفاصيل الطلب', error);
      setError('فشل في جلب تفاصيل الطلب');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      const response = await apiRequest.post(`/requests/${id}/comments`, {
        text: newComment,
        user: { connect: { id: currentUser.id } },
      });
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (error) {
      console.error('فشل في إضافة تعليق', error);
      setError('فشل في إضافة تعليق');
    }
  };

  const handleAddPost = async (e) => {
    e.preventDefault();
    try {
      if (request.savedPostRequests.some(savedPostRequest => savedPostRequest.post?.id === newPostId)) {
        console.log('المنشور موجود بالفعل.');
        return;
      }
  
      const response = await apiRequest.post(`/requests/${id}/savedPosts`, {
        postId: newPostId,
        user: { connect: { id: currentUser.id } },
      });

      window.location.reload();
    } catch (error) {
      console.error('فشل في إضافة منشور', error);
      setError('فشل في إضافة منشور');
    }
  };

  const handleReadAllComments = () => {
    setShowAllComments(true);
  };

  const handleShowLinkedPosts = () => {
    setShowLinkedPosts(true);
  };

  const handleClosePopup = () => {
    setShowAllComments(false);
    setShowLinkedPosts(false);
  };

  const updateCommentCount = () => {
    const commentCount = comments.length;
    const counterElement = document.getElementById('commentCounter');
    if (counterElement) {
      counterElement.textContent = commentCount.toString();
    }
  };

  if (loading) {
    return <p>جار التحميل...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  const linkedPosts = request?.savedPostRequests?.map(savedPostRequest => savedPostRequest.post) || [];

  return (
    <div className="detailPage">
      <h1>تفاصيل الطلب</h1>
      {request ? (
        <div className="requestCard">
          <p className="requestDescription">{request.description}</p>
          <p>نوع الطلب: {request.type}</p>
          <p>نوع الممتلكات: {request.property}</p>
          <p> السعر: {request.minPrice} - {request.maxPrice}</p>
          <p>المدينة: {request.city}</p>
          <Link to="/requests">العودة إلى الطلبات</Link>
        </div>
      ) : (
        <p>الطلب غير موجود</p>
      )}

      <div className="commentsSection">
        <div className="counterAndButton">
          <button className="readAllButton" onClick={handleReadAllComments}>
            قراءة جميع التعليقات
          </button>
          <span id="commentCounter" className="commentCounter">
            {comments.length}
          </span>
        </div>
      </div>

      <div className="postsSection">
      <div className="counterAndButton">
        {linkedPosts && linkedPosts.length >= 0 ? (
          <button className="readAllButton" onClick={handleShowLinkedPosts}>
            عرض المنشورات المرتبطة 
          </button>
        ) : (
          <p>لا توجد منشورات مرتبطة</p>
        )}
        <span id="commentCounter" className="commentCounter">
             {linkedPosts.length}
          </span>
        </div>
      </div>

      {showAllComments && (
        <div className="popup">
          <div className="popupContent">
          <button className="closeButton" onClick={handleClosePopup}>
            </button>
            <h2>كل التعليقات</h2>
            <div className="allComments">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="comment">
                    <img src={comment.user.avatar} alt={comment.user.username} className="avatar" />
                    <div className="commentContent">
                      <p dangerouslySetInnerHTML={{ __html: comment.text }}></p>
                      <p>بواسطة: {comment.user.username}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p>لا توجد تعليقات بعد</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="addCommentSection">
        <h2>إضافة تعليق</h2>
        <form className="commentForm" onSubmit={handleAddComment}>
          <textarea
            name="newComment"
            placeholder="اكتب تعليقك هنا..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            required
          />
          <button type="submit">إضافة تعليق</button>
        </form>
      </div>

     

      {showLinkedPosts && (
        <div className="popup">
          <div className="popupContent">
            <h2>كل المنشورات المرتبطة</h2>
            <button className="closeButton" onClick={handleClosePopup}>
            
            </button>
            <div className="allLinkedPosts">
              {linkedPosts.length > 0 ? (
                <List posts={linkedPosts} />
              ) : (
                <p>لا توجد منشورات مرتبطة</p>
              )}
            </div>
          </div>
        </div>
      )}

      <Suspense fallback={<p>جاري تحميل منشورات المستخدم...</p>}>
        <Await resolve={data.postResponse} errorElement={<p>فشل تحميل منشورات المستخدم!</p>}>
          {(userPosts) => {
            if (!userPosts || !userPosts.data || !userPosts.data.userPosts) return <p>لا توجد منشورات</p>;
            return (
              <div className="addPostSection">
                <h2>إضافة منشور</h2>
                <form className="postForm" onSubmit={handleAddPost}>
                  <select
                    name="postId"
                    value={newPostId}
                    onChange={(e) => setNewPostId(e.target.value)}
                    required
                  >
                    <option value="">اختر منشورًا</option>
                    {userPosts.data.userPosts.map((post) => (
                      <option key={post.id} value={post.id}>
                        {post.title}
                      </option>
                    ))}
                  </select>
                  <button type="submit">إضافة منشور</button>
                </form>
              </div>
            );
          }}
        </Await>
      </Suspense>
    </div>
  );
};

export default DetailPage;
