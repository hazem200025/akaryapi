import React, { useRef, useState } from "react";
import emailjs from "emailjs-com";
import "./contactus.scss"; // Import CSS file for styling

const Contactus = () => {
  const formRef = useRef();
  const [successMessage, setSuccessMessage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_owpv7fg", // Replace with your emailjs service ID
        "template_x8sdz27", // Replace with your emailjs template ID
        formRef.current,
        "TMRXrLY-X-GvYtVnG" // Replace with your emailjs user ID public id
      )
      .then(
        (result) => {
          console.log(result.text);
          setSuccessMessage("تم إرسال رسالتك بنجاح. سنقوم بالرد عليك قريبًا :)");
        },
        (error) => {
          console.log(error.text);
          setSuccessMessage(
            "عذرًا، حدثت مشكلة أثناء إرسال رسالتك. يرجى المحاولة مرة أخرى لاحقًا."
          );
        }
      );
  };

  return (
    <section className="contactus">
      <div className="contactus-container">
        <div className="contactus-content">
          <h1 className="contactus-title">اتصل بنا</h1>
          <p className="contactus-description">
            مرحبًا بكم في منصتنا الابتكارية للعقارات! نحن نوفر وسيلة حديثة لمشاركة
            معلومات عن العقارات. إذا كان لديكم أي استفسارات أو ملاحظات، يرجى التواصل
            معنا باستخدام النموذج أدناه.
          </p>
          <form ref={formRef} onSubmit={handleSubmit} className="contactus-form">
            <input
              type="text"
              className="contactus-input"
              placeholder="الاسم"
              name="name"
              required
            />
            <input
              type="email"
              className="contactus-input"
              placeholder="البريد الإلكتروني"
              name="email"
              required
            />
            <textarea
              className="contactus-textarea"
              placeholder="رسالتك"
              name="message"
              rows={5}
              required
            ></textarea>
            <button type="submit" className="contactus-button">
              إرسال الرسالة
            </button>
            {successMessage && <p className="contactus-success-message">{successMessage}</p>}
          </form>
          <p className="contactus-info">
            لأية استفسارات، يمكنكم التواصل معنا على البريد الإلكتروني{" "}
            <a href="mailto:info@yourdomain.com">admin@akary.org</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contactus;
