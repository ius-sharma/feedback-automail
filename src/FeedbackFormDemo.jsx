import { useState } from "react";
import emailjs from "@emailjs/browser";

emailjs.init("DHuCrovdA3r5C2vNd");

const FIELD_CONFIG = {
  NAME: "user_name",
  EMAIL: "user_email",
  RATING: "user_rating",
  FEEDBACK: "user_feedback",
  AGENT: "user_agent",
  AGREE: "user_agree",
};

const AGENTS = ["Gamer", "Student", "Content Creator"];

export default function FeedbackFormDemo() {
  const [feedbackform, setFeedbackform] = useState({
    [FIELD_CONFIG.NAME]: "",
    [FIELD_CONFIG.EMAIL]: "",
    [FIELD_CONFIG.RATING]: "",
    [FIELD_CONFIG.FEEDBACK]: "",
    [FIELD_CONFIG.AGENT]: [],
    [FIELD_CONFIG.AGREE]: false,
  });

  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Validation
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setError((prev) => ({ ...prev, [name]: "" }));

    if (type === "checkbox" && name === FIELD_CONFIG.AGENT) {
      if (checked) {
        setFeedbackform({
          ...feedbackform,
          [name]: [...feedbackform[name], value],
        });
      } else {
        setFeedbackform({
          ...feedbackform,
          [name]: feedbackform[name].filter((agent) => agent !== value),
        });
      }
    } else if (type === "checkbox") {
      setFeedbackform({ ...feedbackform, [name]: checked });
    } else {
      setFeedbackform({ ...feedbackform, [name]: value });
    }
  };

  const validate = () => {
    let newErrors = {};

    // Name validation
    if (!feedbackform[FIELD_CONFIG.NAME].trim()) {
      newErrors[FIELD_CONFIG.NAME] = "Name is required";
    } else if (feedbackform[FIELD_CONFIG.NAME].length < 3) {
      newErrors[FIELD_CONFIG.NAME] = "Name must be at least 3 characters";
    }

    // Email validation
    if (!feedbackform[FIELD_CONFIG.EMAIL].trim()) {
      newErrors[FIELD_CONFIG.EMAIL] = "Email is required";
    } else if (!isValidEmail(feedbackform[FIELD_CONFIG.EMAIL])) {
      newErrors[FIELD_CONFIG.EMAIL] = "Please enter a valid email address";
    }

    // Rating validation
    if (!feedbackform[FIELD_CONFIG.RATING]) {
      newErrors[FIELD_CONFIG.RATING] = "Rating is required";
    }

    // Feedback validation
    if (!feedbackform[FIELD_CONFIG.FEEDBACK].trim()) {
      newErrors[FIELD_CONFIG.FEEDBACK] = "Feedback is required";
    } else if (feedbackform[FIELD_CONFIG.FEEDBACK].length < 10) {
      newErrors[FIELD_CONFIG.FEEDBACK] =
        "Feedback must be at least 10 characters";
    } else if (feedbackform[FIELD_CONFIG.FEEDBACK].length > 500) {
      newErrors[FIELD_CONFIG.FEEDBACK] =
        "Feedback cannot exceed 500 characters";
    }

    // Agent validation
    if (feedbackform[FIELD_CONFIG.AGENT].length === 0) {
      newErrors[FIELD_CONFIG.AGENT] = "Please select at least one agent type";
    }

    // Agreement validation
    if (!feedbackform[FIELD_CONFIG.AGREE]) {
      newErrors[FIELD_CONFIG.AGREE] = "You must agree to submit feedback";
    }

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendEmail = async (formData) => {
    try {
      const templateParams = {
        email: formData[FIELD_CONFIG.EMAIL],
        to_email: formData[FIELD_CONFIG.EMAIL],
        user_name: formData[FIELD_CONFIG.NAME],
        user_rating: formData[FIELD_CONFIG.RATING],
        user_feedback: formData[FIELD_CONFIG.FEEDBACK],
        user_agent: formData[FIELD_CONFIG.AGENT].join(", "),
        from_name: "Feedback Form",
      };

      console.log("Sending email with params:", templateParams);

      // Send email using EmailJS
      const response = await emailjs.send(
        "service_ieqm76b", // Service ID
        "template_ga95edf", // Template ID
        templateParams,
      );

      console.log("Email sent successfully!", response);
      return true;
    } catch (error) {
      console.error("EmailJS Error:", error);
      console.error("Error message:", error.text);
      console.log("Attempted with:", {
        serviceID: "service_ieqm76b",
        templateID: "template_ga95edf",
        publicKey: "DHuCrovdA3r5C2vNd",
      });
      alert(
        `Email Error: ${error.text || error.message}\n\nCheck browser console for details.`,
      );
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      setLoading(true);
      console.log("Feedback submitted:", feedbackform);

      // Send email
      await sendEmail(feedbackform);

      // Reset form
      setFeedbackform({
        [FIELD_CONFIG.NAME]: "",
        [FIELD_CONFIG.EMAIL]: "",
        [FIELD_CONFIG.RATING]: "",
        [FIELD_CONFIG.FEEDBACK]: "",
        [FIELD_CONFIG.AGENT]: [],
        [FIELD_CONFIG.AGREE]: false,
      });

      setSuccess(true);
      setLoading(false);

      // Hide success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    }
  };

  const handleReset = () => {
    setFeedbackform({
      [FIELD_CONFIG.NAME]: "",
      [FIELD_CONFIG.EMAIL]: "",
      [FIELD_CONFIG.RATING]: "",
      [FIELD_CONFIG.FEEDBACK]: "",
      [FIELD_CONFIG.AGENT]: [],
      [FIELD_CONFIG.AGREE]: false,
    });
    setError({});
    setSuccess(false);
  };

  return (
    <div className="form-container">
      {success && (
        <div className="success-message">
          Thank you! Your feedback has been sent to your email.
        </div>
      )}

      <h1 className="form-title">Feedback Form</h1>

      <form onSubmit={handleSubmit}>
        {/* Name Field */}
        <div className="form-group">
          <label htmlFor={FIELD_CONFIG.NAME}>Name</label>
          <input
            id={FIELD_CONFIG.NAME}
            type="text"
            name={FIELD_CONFIG.NAME}
            value={feedbackform[FIELD_CONFIG.NAME]}
            onChange={handleChange}
            placeholder="Enter your full name"
          />
          {error[FIELD_CONFIG.NAME] && (
            <div className="error-message">{error[FIELD_CONFIG.NAME]}</div>
          )}
        </div>

        {/* Email Field */}
        <div className="form-group">
          <label htmlFor={FIELD_CONFIG.EMAIL}>Email</label>
          <input
            id={FIELD_CONFIG.EMAIL}
            type="email"
            name={FIELD_CONFIG.EMAIL}
            value={feedbackform[FIELD_CONFIG.EMAIL]}
            onChange={handleChange}
            placeholder="Enter your email address"
          />
          {error[FIELD_CONFIG.EMAIL] && (
            <div className="error-message">{error[FIELD_CONFIG.EMAIL]}</div>
          )}
        </div>

        {/* Rating Field */}
        <div className="form-group">
          <label>Rating (1-5)</label>
          <div className="rating-group">
            {[1, 2, 3, 4, 5].map((rating) => (
              <label key={rating}>
                <input
                  type="radio"
                  name={FIELD_CONFIG.RATING}
                  value={rating.toString()}
                  checked={
                    feedbackform[FIELD_CONFIG.RATING] === rating.toString()
                  }
                  onChange={handleChange}
                />
                {rating === 1 && "⭐"}
                {rating === 2 && "⭐⭐"}
                {rating === 3 && "⭐⭐⭐"}
                {rating === 4 && "⭐⭐⭐⭐"}
                {rating === 5 && "⭐⭐⭐⭐⭐"}
              </label>
            ))}
          </div>
          {error[FIELD_CONFIG.RATING] && (
            <div className="error-message">{error[FIELD_CONFIG.RATING]}</div>
          )}
        </div>

        {/* Feedback Field */}
        <div className="form-group">
          <label htmlFor={FIELD_CONFIG.FEEDBACK}>
            Feedback (10-500 characters)
          </label>
          <textarea
            id={FIELD_CONFIG.FEEDBACK}
            name={FIELD_CONFIG.FEEDBACK}
            value={feedbackform[FIELD_CONFIG.FEEDBACK]}
            onChange={handleChange}
            placeholder="Please share your thoughts and feedback..."
          />
          <small style={{ color: "#666" }}>
            {feedbackform[FIELD_CONFIG.FEEDBACK].length} / 500
          </small>
          {error[FIELD_CONFIG.FEEDBACK] && (
            <div className="error-message">{error[FIELD_CONFIG.FEEDBACK]}</div>
          )}
        </div>

        {/* Agent Type Field */}
        <div className="form-group">
          <label>Type</label>
          <div className="checkbox-group">
            {AGENTS.map((agent) => (
              <label key={agent}>
                <input
                  type="checkbox"
                  name={FIELD_CONFIG.AGENT}
                  value={agent}
                  checked={feedbackform[FIELD_CONFIG.AGENT].includes(agent)}
                  onChange={handleChange}
                />
                {agent}
              </label>
            ))}
          </div>
          {error[FIELD_CONFIG.AGENT] && (
            <div className="error-message">{error[FIELD_CONFIG.AGENT]}</div>
          )}
        </div>

        {/* Agreement Checkbox */}
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name={FIELD_CONFIG.AGREE}
              checked={feedbackform[FIELD_CONFIG.AGREE]}
              onChange={handleChange}
            />{" "}
            I agree to submit my feedback
          </label>
          {error[FIELD_CONFIG.AGREE] && (
            <div className="error-message">{error[FIELD_CONFIG.AGREE]}</div>
          )}
        </div>

        {/* Submit and Reset Buttons */}
        <div className="button-group">
          <button type="submit" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span> Sending...
              </>
            ) : (
              "Submit"
            )}
          </button>
          <button type="reset" onClick={handleReset}>
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}
