/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { useState, useContext } from "react";
import Styles from "./profileEdit.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import dummy from "../../assets/img/user.png";
import axios from "axios";
import { AuthContext } from "../../AuthContext";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Errocomponent
const ErrorMessage = (props) => {
  return <p className={Styles.errorMessage}>{props.message}</p>;
};

function Profile_Edit(props) {
  const { auth, logout, refreshToken } = useContext(AuthContext);
  const [formData, setFormData] = useState(props.UserData);
  const [commonErrors, setCommonErrors] = useState({
    first_name: "",
    email: "",
    last_name: "",
  });
  const [errorsformentee, setErrorsformentee] = useState({
    occupation: "",
    age: "",
    phone_number: "",
    institution_name: "",
    student_level: "",
  });
  const [errorsformentor, setErrorsformentor] = useState({
    category: "",
    description: "",
    experience: "",
    skill: "",
  });
  const [loading, setLoading] = useState(false);

  // categories
  const categories = [
    "Art",
    "Science and Technology",
    "Sports",
    "Music",
    "Other",
  ];
  const [selectedCategories, setSelectedCategories] = useState(
    formData.category
  );
  const toggleCategory = (category) => {
    setSelectedCategories((prevSelected) => {
      let updatedCategories;
      if (prevSelected.includes(category)) {
        updatedCategories = prevSelected.filter((cat) => cat !== category);
      } else {
        updatedCategories = [...prevSelected, category];
      }

      // Update formData with the new selected categories
      setFormData((prevData) => ({
        ...prevData,
        category: updatedCategories,
      }));

      return updatedCategories;
    });
  };
  

// form validatefield
  const validateField = (name, value) => {
    switch (name) {
      case "first_name":
        if (!/^[a-zA-Z\s.]+$/i.test(value) && value !== "") {
          return "First name should only contain letters and spaces.";
        } else {
          return "";
        }
      case "last_name":
        if (!/^[a-zA-Z\s.]+$/.test(value) && value !== "") {
          return "Last name should only contain letters , dote and spaces. ";
        } else {
          return "";
        }
      case "institution_name":
        if (!/^[a-zA-Z\s]+$/.test(value) && value !== "") {
          return "Institution name should only contain letters and spaces.";
        } else {
          return "";
        }
      case "age":
        if (
          !/^\d+$/.test(value) ||
          value < 10 ||
          (value > 80 && value !== "")
        ) {
          return "Age must be a number between 10 and 80.";
        } else {
          return "";
        }
      case "phone_number":
        if (!/^\d{10}$/.test(value) && value !== "") {
          return "Phone number must be exactly 10 digits.";
        } else {
          return "";
        }
      case "experience":
        if (!/^\d+\s(years|months)$/.test(value) && value !== "") {
          return "Experience format is invalid (e.g., '2 years' or '10 months').";
        } else {
          return "";
        }
      case "email": {
        const emailRegex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        if (value !== "" && !emailRegex.test(value)) {
          return "Invalid email address.";
        } else {
          return "";
        }
      }
      default:
        return "";
    }
  };
  const getIsFormValid = () => {
    if (formData.role === "mentee") {
      if (formData.occupation === "employed") {
        return (
          formData.first_name !== "" &&
          !commonErrors.first_name &&
          formData.email !== "" &&
          !commonErrors.email &&
          formData.occupation !== "" &&
          !errorsformentee.occupation &&
          formData.age !== "" &&
          !errorsformentee.age &&
          formData.phone_number !== "" &&
          !errorsformentee.phone_number &&
          selectedCategories.length > 0
        );
      }
      return (
        formData.first_name !== "" &&
        !commonErrors.first_name &&
        formData.email !== "" &&
        !commonErrors.email &&
        formData.occupation !== "" &&
        !errorsformentee.occupation &&
        formData.student_level !== "" &&
        formData.institution_name !== "" &&
        !errorsformentee.institution_name &&
        formData.age !== "" &&
        !errorsformentee.age &&
        formData.phone_number !== "" &&
        !errorsformentee.phone_number &&
        selectedCategories.length > 0
      );
    } else {
      return (
        formData.first_name !== "" &&
        !commonErrors.first_name &&
        formData.email !== "" &&
        !commonErrors.email &&
        formData.category !== "" &&
        formData.experience !== "" &&
        !errorsformentor.experience
      );
    }
  };
  const isItSame = () => {
    let isSame = true;
    for (let key in formData) {
      if (formData[key] !== props.UserData[key]) {
        isSame = false;
        break;
      }
    }
    for (let i = 0; i < selectedCategories.length; i++) {
      if (!props.UserData.category.includes(selectedCategories[i])) {
        isSame = false;
        break;
      }
    }
    return isSame;
  };

  // form handlechange and submit and clear
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profile_image" && files[0]) {
      const file = files[0];

      // Check the file type
      if (!file.type.match("image/png|image/jpg|image/jpeg")) {
        alert("Only PNG, JPG, and JPEG files are allowed");
        return;
      }

      // Create a new File object to keep the previous image URL
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setFormData((prevData) => {
          const updatedData = {
            ...prevData,
            profile_image: fileReader.result,
            profile_image_data: file,
          };

          // Check if the previous image URL needs to be updated
          const oldImageUrl = prevData.profile_image;
          if (
            oldImageUrl &&
            (oldImageUrl.startsWith("https://lh3.googleusercontent.com/") ||
              oldImageUrl === "")
          ) {
            updatedData.previous_image_url = "";
          } else if (
            oldImageUrl &&
            oldImageUrl.startsWith("https://storage.googleapis.com/")
          ) {
            updatedData.previous_image_url = oldImageUrl;
          }

          return updatedData;
        });
      };
      fileReader.readAsDataURL(file);
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
      if (formData.role === "mentee" && name === "occupation") {
        if (value === "employed") {
          setFormData((prevData) => ({
            ...prevData,
            student_level: "",
            institution_name: "",
          }));
        }
      }
      if (formData.role === "mentee") {
        setCommonErrors((prevErrors) => ({
          ...prevErrors,
          [name]: validateField(name, value),
        }));
        setErrorsformentee((prevErrors) => ({
          ...prevErrors,
          [name]: validateField(name, value),
        }));
      } else if (formData.role === "mentor") {
        setCommonErrors((prevErrors) => ({
          ...prevErrors,
          [name]: validateField(name, value),
        }));
        setErrorsformentor((prevErrors) => ({
          ...prevErrors,
          [name]: validateField(name, value),
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (getIsFormValid()) {
      // Prepare the form data to send
      const formDataToSend = new FormData();

      // Append other form fields
      for (const [key, value] of Object.entries(formData)) {
        if (key !== "profile_image" && key !== "profile_image_data") {
          formDataToSend.append(key, value);
        }
      }

      const base64Pattern = /^data:image\/(jpeg|png|gif);base64,/;

      // Append the image file if available
      if (base64Pattern.test(formData.profile_image)) {
        formDataToSend.append(
          "profile_image_data",
          formData.profile_image_data
        );
      } else {
        formDataToSend.append("profile_image", props.UserData.profile_image);
      }
      try {
        setLoading(true);
        // Make the API request to submit the form
        const response = await axios.post(
          `${API_BASE_URL}/profile/${formData.role}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              authorization: `Bearer ${auth.token}`,
            },
          }
        );

        if (response.data.message === "User updated successfully") {
          // console.log("Form submitted successfully:", response.data);
          let updatedUser = response.data.User;
          updatedUser.role = formData.role;
          props.setUser(updatedUser);
        }
      } catch (error) {
        if (error.response.data.message === "Token expired") {
          refreshToken();
          alert("Session expired. reload the page and retry");
          window.location.reload();
        } else {
          console.log("Form submission failed:", error);
        }
      } finally {
        setLoading(false);
        props.setOpenSetting();
      }
    }
  };

  const closeForm = () => {
    setFormData(props.UserData);
    setSelectedCategories(props.UserData.category);
    setCommonErrors({});
    setErrorsformentee({});
    setErrorsformentor({});
  };

  
  return (
    <div className={Styles.edit_profile_container}>
      {loading && (
        // loading animation
        <div className={Styles.loading}>
          <div className={Styles.container_for_loading}>
            <div className={Styles.half}></div>
            <div className={Styles.half}></div>
          </div>
        </div>
      )}
      <h2 className={Styles.title}>Edit profile</h2>
      {/* form */}
      <form className={Styles.editform} onSubmit={handleSubmit}>
        {/* dp image */}
        <div className={Styles.dpedit}>
          <img
            src={formData.profile_image ? formData.profile_image : dummy}
            alt="profileimage"
          />
          <div className={Styles.update}>
            <FontAwesomeIcon icon={faUpload} />
          </div>
          <input
            type="file"
            name="profile_image"
            accept="image/png, image/jpeg, image/jpg"
            className={Styles.fileInput}
            onChange={handleChange}
          />
        </div>
        {/* first name */}
        <div className={Styles.data_section}>
          <label htmlFor="first_name">
            first name <sup>*</sup>
          </label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            maxLength={30}
          />
          {commonErrors.first_name && (
            <ErrorMessage message={commonErrors.first_name} />
          )}
        </div>
        {/* last name */}
        <div className={Styles.data_section}>
          <label htmlFor="last_name">last name</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            maxLength={30}
          />
          {commonErrors.last_name && (
            <ErrorMessage message={commonErrors.last_name} />
          )}
        </div>
        {/* email */}
        <div className={Styles.data_section}>
          <label htmlFor="email">
            email <sup>*</sup>
          </label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            maxLength={50}
          />
          {commonErrors.email && <ErrorMessage message={commonErrors.email} />}
        </div>
        {/* phone number */}
        {formData.role === "mentee" && (
          <div className={Styles.data_section}>
            <label htmlFor="phone_number">
              phone number <sup>*</sup>
            </label>
            <input
              inputMode="numeric"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              maxLength={10}
            />
            {errorsformentee.phone_number && (
              <ErrorMessage message={errorsformentee.phone_number} />
            )}
          </div>
        )}
        {/* category */}
        {formData.role === "mentor" && (
          <div className={Styles.data_section}>
            <label htmlFor="category">
              category <sup>*</sup>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="" hidden>
                Select your Category
              </option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errorsformentor.category && (
              <ErrorMessage message={errorsformentor.category} />
            )}
          </div>
        )}
        {/* description */}
        {formData.role === "mentor" && (
          <div className={Styles.data_section}>
            <label htmlFor="skill">skill</label>
            <input
              type="text"
              name="skill"
              value={formData.skill}
              placeholder="skill"
              onChange={handleChange}
              maxLength={30}
            />
            {errorsformentor.skill && (
              <ErrorMessage message={errorsformentor.skill} />
            )}
          </div>
        )}
        {/* experience */}
        {formData.role === "mentor" && (
          <div className={Styles.data_section}>
            <label htmlFor="experience">
              experience <sup>*</sup>
            </label>
            <input
              name="experience"
              value={formData.experience}
              type="text"
              placeholder="no. months / no. years (2 years / 10 months)"
              onChange={handleChange}
              maxLength={10}
            />
            {errorsformentor.experience && (
              <ErrorMessage message={errorsformentor.experience} />
            )}
          </div>
        )}
        {/* skill */}
        {formData.role === "mentor" && (
          <div className={Styles.data_section}>
            <label htmlFor="description">description</label>
            <textarea
              name="description"
              value={formData.description}
              type="text"
              maxLength={250}
              rows={7}
              placeholder="description about you"
              onChange={handleChange}
            />
            {errorsformentor.description && (
              <ErrorMessage message={errorsformentor.description} />
            )}
          </div>
        )}
        {/* mentee category */}
        {formData.role === "mentee" && (
          <div className={Styles.data_section}>
            <label htmlFor="category">
              category <sup>*</sup>
            </label>
            <ul className={Styles.cat_list}>
              {categories.map((category) => (
                <li
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={
                    selectedCategories.includes(category)
                      ? Styles.selected_category
                      : ""
                  }
                >
                  {category}
                </li>
              ))}
            </ul>
            {selectedCategories.length === 0 && (
              <ErrorMessage message={"Select atleast one"} />
            )}
          </div>
        )}
        {/* mentee ocupation */}
        {formData.role === "mentee" && (
          <div className={Styles.data_section}>
            <label htmlFor="occupation">
              occupation <sup>*</sup>
            </label>
            <select
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
            >
              <option value="" hidden>
                Select your occupation
              </option>
              <option value="student">student</option>
              <option value="employed">Employed</option>
            </select>
            {errorsformentee.occupation && (
              <ErrorMessage message={errorsformentee.occupation} />
            )}
          </div>
        )}
        {/* mentee conditions section */}
        {formData.role === "mentee" && formData.occupation === "student" && (
          <div className={Styles.data_section}>
            <label htmlFor="student_level">
              education_level <sup>*</sup>
            </label>
            <select
              value={formData.student_level}
              onChange={handleChange}
              name="student_level"
            >
              <option value="" hidden>
                Select your level
              </option>
              <option value="highschool">Highschool</option>
              <option value="undergraduate">Undergraduate</option>
              <option value="postgraduate">Postgraduate</option>
            </select>
            {errorsformentee.student_level && (
              <ErrorMessage message={errorsformentee.student_level} />
            )}
          </div>
        )}
        {formData.role === "mentee" && formData.occupation === "student" && (
          <div className={Styles.data_section}>
            <label htmlFor="institution_name">
              institution_name <sup>*</sup>
            </label>
            <input
              name="institution_name"
              value={formData.institution_name}
              type="text"
              maxLength={80}
              onChange={handleChange}
              placeholder="Institution name"
            />
            {errorsformentee.institution_name && (
              <ErrorMessage message={errorsformentee.institution_name} />
            )}
          </div>
        )}
        {/* mentee age */}
        {formData.role === "mentee" && (
          <div className={Styles.data_section}>
            <label htmlFor="age">
              age <sup>*</sup>
            </label>
            <input
              name="age"
              value={formData.age}
              inputMode="numeric"
              placeholder="age"
              onChange={handleChange}
            />
            {errorsformentee.age && (
              <ErrorMessage message={errorsformentee.age} />
            )}
          </div>
        )}
        {/* buttons */}
        <div className={Styles.btns}>
          <button
            className={Styles.secondary_btn}
            type="button"
            onClick={closeForm}
          >
            Cancel
          </button>
          <button
            className={Styles.primary_btn}
            type="submit"
            disabled={!getIsFormValid() || isItSame()}
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default Profile_Edit;
