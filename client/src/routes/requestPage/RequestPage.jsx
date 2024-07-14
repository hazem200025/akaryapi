import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './RequestPage.scss';
import { AuthContext } from '../../context/AuthContext';
import apiRequest from '../../lib/apiRequest';
import citiesData from '../../data/cities.json'; // استيراد بيانات المدن من ملف JSON

const RequestPage = () => {
  const { currentUser } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    description: '',
    minPrice: '',
    maxPrice: '',
    type: 'buy',
    property: 'apartment',
    price: '0', // السعر الافتراضي كسلسلة نصية
    city: '', // تم تغييرها إلى قائمة منسدلة
    user: { connect: { id: currentUser.id } }, // تضمين حقل المستخدم
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedRequests, setExpandedRequests] = useState({});
  const [showPopup, setShowPopup] = useState(false); // حالة لإظهار النافذة المنبثقة

  // حالة لتخزين الفلاتر
  const [filters, setFilters] = useState({
    type: '',
    property: '',
    city: '',
  });

  const propertyTypeMap = {
    apartment: 'شقة',
    house: 'منزل',
    condo: 'شقة فندقية',
    land: 'أرض',
  };

  useEffect(() => {
    fetchRequests();
  }, [filters]); // جلب الطلبات عند تغيير الفلاتر

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      // تحضير معلمات الاستعلام بناءً على الفلاتر
      const queryParams = {};
      if (filters.type) queryParams.type = filters.type;
      if (filters.property) queryParams.property = filters.property;
      if (filters.city) queryParams.city = filters.city;

      // إنشاء سلسلة الاستعلام
      let queryString = Object.keys(queryParams)
        .map(key => `${key}=${encodeURIComponent(queryParams[key])}`)
        .join('&');

      // جلب الطلبات مع سلسلة الاستعلام الاختيارية
      const response = await apiRequest.get(`/requests${queryString ? `?${queryString}` : ''}`);

      if (Array.isArray(response.data)) {
        // ترتيب الطلبات حسب تاريخ الإنشاء بترتيب تنازلي
        const sortedRequests = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // تهيئة حالة التوسيع لكل طلب
        const initialExpanded = {};
        sortedRequests.forEach(request => {
          initialExpanded[request.id] = false;
        });

        setRequests(sortedRequests);
        setExpandedRequests(initialExpanded);
      } else {
        setRequests([]);
        console.error('Unexpected response format: not an array', response.data);
      }
    } catch (error) {
      console.error('Failed to fetch requests', error);
      setError('فشل في جلب الطلبات');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const minPrice = parseInt(form.minPrice);
      const maxPrice = parseInt(form.maxPrice);
      const price = `${(minPrice + maxPrice) / 2}`;
      const newForm = { ...form, price, user: { connect: { id: currentUser.id } } };
      const response = await apiRequest.post('/requests', newForm);
      fetchRequests();
      setShowModal(false);
      setForm({
        description: '',
        minPrice: '',
        maxPrice: '',
        type: 'buy',
        property: 'apartment',
        city: '',
      });
      setShowPopup(true); // إظهار النافذة المنبثقة
    } catch (error) {
      console.error('Failed to create request', error);
      setError('فشل في إنشاء الطلب');
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      property: '',
      city: '', // إعادة تعيين فلتر المدينة
    });
  };

  const toggleTextExpansion = (requestId) => {
    setExpandedRequests(prevState => ({
      ...prevState,
      [requestId]: !prevState[requestId]
    }));
  };

  return (
    <div className="requestPage">
      <h1>طلبات المنازل</h1>

      {/* واجهة الفلاتر */}
      <div className="filters">
        <label>
          النوع:
          <select name="type" value={filters.type} onChange={handleFilterChange}>
            <option value="">الكل</option>
            <option value="buy">شراء</option>
            <option value="rent">إيجار</option>
          </select>
        </label>
        <label>
          العقار:
          <select name="property" value={filters.property} onChange={handleFilterChange}>
            <option value="">الكل</option>
            <option value="apartment">شقة</option>
            <option value="house">منزل</option>
            <option value="condo">شقة فندقية</option>
            <option value="land">أرض</option>
          </select>
        </label>
        <label>
          المدينة:
          <select
            name="city"
            value={filters.city}
            onChange={handleFilterChange}
          >
            <option value="">الكل</option>
            {citiesData.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </label>
        <button onClick={clearFilters}>إعادة تعيين الفلاتر</button>
      </div>

      {/* زر إنشاء طلب */}
      <button className="createButton" onClick={() => setShowModal(true)}>
        <img src="/add.png" alt="إضافة" />
        إنشاء طلب
      </button>

      {/* نافذة منبثقة لإنشاء طلب */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowModal(false)}>&times;</span>
            <form className="requestForm" onSubmit={handleSubmit}>
              <textarea
                name="description"
                placeholder="الوصف"
                value={form.description}
                onChange={handleChange}
                required
              />
              <input
                type="number"
                name="minPrice"
                placeholder="السعر الأدنى"
                value={form.minPrice}
                onChange={handleChange}
                required
              />
              <input
                type="number"
                name="maxPrice"
                placeholder="السعر الأقصى"
                value={form.maxPrice}
                onChange={handleChange}
                required
              />
              <select name="type" value={form.type} onChange={handleChange}>
                <option value="buy">شراء</option>
                <option value="rent">إيجار</option>
              </select>
              <select name="property" value={form.property} onChange={handleChange}>
                <option value="apartment">شقة</option>
                <option value="house">منزل</option>
                <option value="condo">شقة فندقية</option>
                <option value="land">أرض</option>
              </select>
              <select
                name="city"
                value={form.city}
                onChange={handleChange}
              >
                <option value="">اختر المدينة</option>
                {citiesData.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              <button type="submit">إرسال الطلب</button>
            </form>
          </div>
        </div>
      )}

      {/* نافذة منبثقة لرسالة التأكيد */}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>طلبك قيد المراجعة سيتم النشر فى أقرب وقت شكرا لتفهمك</p>
            <button onClick={() => setShowPopup(false)}>OK</button>
          </div>
        </div>
      )}

      {/* رسالة الخطأ */}
      {error && <p className="error">{error}</p>}

      {/* قائمة الطلبات */}
      <div className="scrollableContainer">
        {loading ? (
          <p>جاري تحميل الطلبات...</p>
        ) : requests.length > 0 ? (
          requests.map(request => (
            <div key={request.id} className="requestCard">
              <div className="requestDetails">
                <p className={`requestText ${expandedRequests[request.id] ? 'expanded' : ''}`}>
                  {request.description.length > 100 && !expandedRequests[request.id] ?
                    `${request.description.substring(0, 100)}...` : request.description
                  }
                  {request.description.length > 100 && (
                    <Link to={`/requests/${request.id}`}>عرض المزيد</Link>
                  )}
                </p>
                <p> السعر:  {request.minPrice} -  {request.maxPrice}</p>
                <p>النوع: {request.type === 'buy' ? 'شراء' : 'إيجار'}</p>
                <p>العقار: {propertyTypeMap[request.property] || request.property}</p>
                <p>المدينة: {request.city}</p>
                <Link to={`/requests/${request.id}`}>عرض التفاصيل</Link>
              </div>
            </div>
          ))
        ) : (
          <p>لم يتم العثور على طلبات</p>
        )}
      </div>
    </div>
  );
};

export default RequestPage;
