import React, { useState, useEffect } from "react";
import "./updatePage.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import apiRequest from "../../lib/apiRequest";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import { useNavigate, useParams } from "react-router-dom";
import MapModal from "../../components/model/MapModal"; // Import the MapModal component
import cities from "../../data/cities.json"; // Import the cities data

function UpdatePage() {
  const { id } = useParams(); // Get the post ID from the URL
  const [value, setValue] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [mapVisible, setMapVisible] = useState(false); // State to control map modal visibility
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    address: "",
    city: "",
    bedroom: "",
    bathroom: "",
    type: "rent",
    property: "apartment",
    utilities: "owner",
    pet: "allowed",
    income: "",
    size: "",
    school: "",
    bus: "",
    restaurant: ""
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch existing post data
    const fetchPostData = async () => {
      try {
        const res = await apiRequest.get(`/posts/${id}`);
        const post = res.data;
        setFormData({
          title: post.title,
          price: post.price,
          address: post.address,
          city: post.city,
          bedroom: post.bedroom,
          bathroom: post.bathroom,
          type: post.type,
          property: post.property,
          utilities: post.postDetail.utilities,
          pet: post.postDetail.pet,
          income: post.postDetail.income,
          size: post.postDetail.size,
          school: post.postDetail.school,
          bus: post.postDetail.bus,
          restaurant: post.postDetail.restaurant,
        });
        setValue(post.postDetail.desc);
        setImages(post.images);
        setLatitude(post.latitude);
        setLongitude(post.longitude);
      } catch (err) {
        console.log(err);
        setError("فشل في جلب بيانات الإعلان");
      }
    };

    fetchPostData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);

    try {
      await apiRequest.put(`/posts/${id}`, {
        title: inputs.title,
        price: parseInt(inputs.price),
        address: inputs.address,
        city: inputs.city,
        bedroom: parseInt(inputs.bedroom),
        bathroom: parseInt(inputs.bathroom),
        type: inputs.type,
        property: inputs.property,
        latitude: inputs.latitude,
        longitude: inputs.longitude,
        images: images,
        desc: value,
        utilities: inputs.utilities,
        pet: inputs.pet,
        income: inputs.income,
        size: parseInt(inputs.size),
        school: parseInt(inputs.school),
        bus: parseInt(inputs.bus),
        restaurant: parseInt(inputs.restaurant),
      });
      navigate("/" + id);
    } catch (err) {
      console.log(err);
      setError("فشل في تحديث الإعلان");
    }
  };

  const handleLocationSelect = (lat, lng) => {
    setLatitude(lat);
    setLongitude(lng);
    setMapVisible(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageDelete = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  return (
    <div className="updatePage">
      <div className="formContainer">
        <h1>تحديث الإعلان</h1>
        <div className="wrapper">
          <form onSubmit={handleSubmit}>
            <div className="item">
              <label htmlFor="title">العنوان</label>
              <input id="title" name="title" type="text" value={formData.title} onChange={handleInputChange} />
            </div>
            <div className="item">
              <label htmlFor="price">السعر</label>
              <input id="price" name="price" type="number" value={formData.price} onChange={handleInputChange} />
            </div>
            <div className="item">
              <label htmlFor="address">العنوان</label>
              <input id="address" name="address" type="text" value={formData.address} onChange={handleInputChange} />
            </div>
            <div className="item description">
              <label htmlFor="desc">الوصف</label>
              <ReactQuill theme="snow" onChange={setValue} value={value} />
            </div>
            <div className="item">
              <label htmlFor="city">المدينة</label>
              <select id="city" name="city" value={formData.city} onChange={handleInputChange}>
                <option value="">اختر المدينة</option>
                {cities.map((city, index) => (
                  <option key={index} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            <div className="item">
              <label htmlFor="bedroom">عدد غرف النوم</label>
              <input min={1} id="bedroom" name="bedroom" type="number" value={formData.bedroom} onChange={handleInputChange} />
            </div>
            <div className="item">
              <label htmlFor="bathroom">عدد الحمامات</label>
              <input min={1} id="bathroom" name="bathroom" type="number" value={formData.bathroom} onChange={handleInputChange} />
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
              <select name="type" value={formData.type} onChange={handleInputChange}>
                <option value="rent">إيجار</option>
                <option value="buy">شراء</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="property">نوع العقار</label>
              <select name="property" value={formData.property} onChange={handleInputChange}>
                <option value="apartment">شقة</option>
                <option value="house">منزل</option>
                <option value="condo">عمارة سكنية</option>
                <option value="land">أرض</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="utilities">سياسة المرافق</label>
              <select name="utilities" value={formData.utilities} onChange={handleInputChange}>
                <option value="owner">المسؤولية على المالك</option>
                <option value="tenant">المسؤولية على المستأجر</option>
                <option value="shared">مشتركة</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="pet">سياسة الحيوانات الأليفة</label>
              <select name="pet" value={formData.pet} onChange={handleInputChange}>
                <option value="allowed">مسموح</option>
                <option value="not-allowed">غير مسموح</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="income">سياسة الدخل</label>
              <input id="income" name="income" type="text" placeholder="سياسة الدخل" value={formData.income} onChange={handleInputChange} />
            </div>
            <div className="item">
              <label htmlFor="size">المساحة الإجمالية (قدم مربع)</label>
              <input min={0} id="size" name="size" type="number" value={formData.size} onChange={handleInputChange} />
            </div>
            <div className="item">
              <label htmlFor="school">مدرسة</label>
              <input min={0} id="school" name="school" type="number" value={formData.school} onChange={handleInputChange} />
            </div>
            <div className="item">
              <label htmlFor="bus">حافلة</label>
              <input min={0} id="bus" name="bus" type="number" value={formData.bus} onChange={handleInputChange} />
            </div>
            <div className="item">
              <label htmlFor="restaurant">مطعم</label>
              <input min={0} id="restaurant" name="restaurant" type="number" value={formData.restaurant} onChange={handleInputChange} />
            </div>
            <button className="sendButton" type="submit">
              تحديث
            </button>
            {error && <span>{error}</span>}
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
    </div>
  );
}

export default UpdatePage;
