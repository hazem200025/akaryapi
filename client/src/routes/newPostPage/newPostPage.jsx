import React, { useState } from "react";
import "./newPostPage.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import apiRequest from "../../lib/apiRequest";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import { useNavigate } from "react-router-dom";
import MapModal from "../../components/model/MapModal";
import citiesData from "../../data/cities.json";

function NewPostPage() {
  const [value, setValue] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [mapVisible, setMapVisible] = useState(false);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [submittedPostId, setSubmittedPostId] = useState(null); // State to hold the submitted post ID

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);

    try {
      const res = await apiRequest.post("/posts", {
        postData: {
          title: inputs.title,
          price: parseInt(inputs.price),
          address: inputs.address,
          city: selectedCity,
          bedroom: parseInt(inputs.bedroom),
          bathroom: parseInt(inputs.bathroom),
          type: inputs.type,
          property: inputs.property,
          latitude: inputs.latitude,
          longitude: inputs.longitude,
          images: images,
        },
        postDetail: {
          desc: value,
          utilities: inputs.utilities,
          pet: inputs.pet,
          income: inputs.income,
          size: parseInt(inputs.size),
          school: parseInt(inputs.school),
          bus: parseInt(inputs.bus),
          restaurant: parseInt(inputs.restaurant),
        },
      });

      setShowConfirmation(true);
      setSubmittedPostId(res.data.id); // Save the ID of the newly created post

      setValue("");
      setImages([]);
      setSelectedCity("");
      setLatitude("");
      setLongitude("");
      setIsSubmitting(false);

    } catch (err) {
      console.log(err);
      setError("فشل في إرسال المنشور. يرجى المحاولة مرة أخرى.");
      setIsSubmitting(false);
    }
  };

  const handleLocationSelect = (lat, lng) => {
    setLatitude(lat);
    setLongitude(lng);
    setMapVisible(false);
  };

  const handleImageDelete = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);

    if (submittedPostId) {
      navigate("/" + submittedPostId); // Navigate to post detail page after confirmation
    }
  };

  return (
    <div className="newPostPage">
      <div className="formContainer">
        <h1>إضافة منشور جديد</h1>
        <div className="wrapper">
          <form onSubmit={handleSubmit}>
            <div className="item">
              <label htmlFor="title">العنوان</label>
              <input id="title" name="title" type="text" required />
            </div>
            <div className="item">
              <label htmlFor="price">السعر</label>
              <input id="price" name="price" type="number" required />
            </div>
            <div className="item">
              <label htmlFor="address">العنوان</label>
              <input id="address" name="address" type="text" required />
            </div>
            <div className="item description">
              <label htmlFor="desc">الوصف</label>
              <ReactQuill theme="snow" onChange={setValue} value={value} />
            </div>
            <div className="item">
              <label htmlFor="city">المدينة</label>
              <select
                id="city"
                name="city"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                required
              >
                <option value="">اختر المدينة</option>
                {citiesData.map((city, index) => (
                  <option key={index} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            <div className="item">
              <label htmlFor="bedroom">عدد غرف النوم</label>
              <input min={1} id="bedroom" name="bedroom" type="number" required />
            </div>
            <div className="item">
              <label htmlFor="bathroom">عدد الحمامات</label>
              <input min={1} id="bathroom" name="bathroom" type="number" required />
            </div>
            <div className="item">
              <label htmlFor="latitude">خط العرض</label>
              <input id="latitude" name="latitude" type="text" value={latitude} readOnly />
            </div>
            <div className="item">
              <label htmlFor="longitude">خط الطول</label>
              <input id="longitude" name="longitude" type="text" value={longitude} readOnly />
            </div>
            <div className="item">
              <button type="button" onClick={() => setMapVisible(true)}>اختر الموقع</button>
            </div>
            <div className="item">
              <label htmlFor="type">النوع</label>
              <select name="type" required>
                <option value="rent" defaultChecked>
                  للإيجار
                </option>
                <option value="buy">للبيع</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="property">العقار</label>
              <select name="property" required>
                <option value="apartment">شقة</option>
                <option value="house">منزل</option>
                <option value="condo">شقة مشتركة</option>
                <option value="land">أرض</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="utilities">سياسة الخدمات</label>
              <select name="utilities" required>
                <option value="owner">المالك مسؤول</option>
                <option value="tenant">المستأجر مسؤول</option>
                <option value="shared">مشترك</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="pet">سياسة الحيوانات الأليفة</label>
              <select name="pet" required>
                <option value="allowed">مسموح</option>
                <option value="not-allowed">غير مسموح</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="income">سياسة الدخل</label>
              <input
                id="income"
                name="income"
                type="text"
                placeholder="سياسة الدخل"
              />
            </div>
            <div className="item">
              <label htmlFor="size">المساحة الإجمالية (قدم مربع)</label>
              <input min={0} id="size" name="size" type="number" required />
            </div>
            <div className="item">
              <label htmlFor="school">المدرسة</label>
              <input min={0} id="school" name="school" type="number" required />
            </div>
            <div className="item">
              <label htmlFor="bus">الحافلة</label>
              <input min={0} id="bus" name="bus" type="number" required />
            </div>
            <div className="item">
              <label htmlFor="restaurant">المطعم</label>
              <input min={0} id="restaurant" name="restaurant" type="number" required />
            </div>
            <button className="sendButton" disabled={isSubmitting}>
              {isSubmitting ? "جاري الإرسال..." : "إضافة"}
            </button>
            {error && <span className="error">{error}</span>}
          </form>
        </div>
      </div>
      <div className="sideContainer">
        {images.map((image, index) => (
          <div className="imageContainer" key={index}>
            <img src={image} alt="" />
            <button className="deleteButton" onClick={() => handleImageDelete(index)}>✖</button>
          </div>
        ))}
        <UploadWidget
          uwConfig={{
            multiple: true,
            cloudName: "silverestate",
            uploadPreset: "estate",
            folder: "posts",
          }}
          setState={setImages}
        />
      </div>
      {mapVisible && (
        <MapModal onSelectLocation={handleLocationSelect} onClose={() => setMapVisible(false)} />
      )}
      {showConfirmation && (
        <div className="popup">
          <div className="popup-content">
            <p>لقد تم إرسال منشورك بنجاح. سيتم مراجعته قبل النشر للتأكد من عدم نشر محتوى غير اخلاقى سيتم توجيهك الى صفحه الاعلان ولكنه لن يظهر للجمهور الا بعد الموافقه عليه  </p>
            <button onClick={handleConfirmationClose}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default NewPostPage;
