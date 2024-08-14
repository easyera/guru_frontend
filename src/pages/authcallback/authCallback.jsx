/* eslint-disable react/prop-types */
import Styles from "./authCallback.module.css";
import { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import axios from "axios";

const ErrorMessage = (props) => {
  return <p className={Styles.errorMessage}>{props.message}</p>;
};

function Callback() {
  const location = useLocation();
  const [isFinish, setIsFinish] = useState(false);
  const [message, setMessage] = useState("");
  const [refreshToken, setRefreshToken] = useState(null);
  const [tempcode , setTempcode] = useState("");
  const navigate = useNavigate();

  const redirecttopath = (path) => {
    navigate(path);
  };
  const [formData, setFormData] = useState({});
  const { setToken } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get("accessToken");
      const role = params.get("role");

      try {
        const url = `http://localhost:5000/login/google/${role}`;
        const headers = { authorization: `Bearer ${token}` };
        const response = await axios.get(url, { headers });
        switch (response.status) {
          case 200:
            setToken(response.data.accessToken, response.data.refreshToken);
            setMessage("Login successful");
            redirecttopath(`/dashbord`);
            break;
          case 206:
            setRefreshToken(response.data.refreshToken);
            setMessage("User profile incomplete");
            setTempcode(response.data.accessToken);
            setFormData(transformData(response.data.User));
            setFormData((prevFormData) => ({ ...prevFormData, role: role }));
            setTimeout(() => {
              redirecttopath(`/login/${role}`);
            }, 20 * 60 * 1000);
            break;
          default:
            setMessage("An unexpected error occurred");
        }
      } catch (err) {
        console.log(err);
        if (err.response.data.message === "Token expired") {
          redirecttopath(`/login/${role}`);
        } else if (err.response.data.message === "Invalid token") {
          redirecttopath(`/login/${role}`);
        } else {
          setMessage(err.response.data.message);
        }
      } finally {
        setIsFinish(true);
      }
    };

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const [showCategory, setShowCategory] = useState(false);

  const categories = [
    "Art",
    "Science and Technology",
    "Sports",
    "Music",
    "Other",
  ];

  const transformData = (data) => {
    const transformedData = {};
    for (const key in data) {
      if (key !== "password" && key !== "first_name" && key !== "last_name") {
        transformedData[key] = data[key] === null ? "" : data[key];
      }
    }
    return transformedData;
  };

  const [selectedCategories, setSelectedCategories] = useState([]);

  const toggleCategory = (category) => {
    setSelectedCategories((prevSelected) => {
      if (prevSelected.includes(category)) {
        return prevSelected.filter((cat) => cat !== category);
      } else {
        return [...prevSelected, category];
      }
    });
  };

  const validateField = (name, value) => {
    switch (name) {
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
        if (!/^\d+\s(years|months)$/.test(value)) {
          return "Experience format is invalid (e.g., '2 years' or '10 months').";
        } else {
          return "";
        }
      default:
        return "";
    }
  };

  const [errorsformentee, setErrorsformentee] = useState({
    occupation: "",
    age: "",
    phone_number: "",
    institution_name: "",
  });
  const [errorsformentor, setErrorsformentor] = useState({
    description: "",
    experience: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const role = formData.role; // Mentor or Mentee
    const endpoint =
      role === "mentor"
        ? "http://localhost:5000/profile/mentor"
        : "http://localhost:5000/profile/mentee";

    // Include the selected categories in formData if it's a mentee
    const finalData = {
      ...formData,
      category: role === "mentee" ? selectedCategories : formData.category,
    };

    try {
      const response = await axios.post(endpoint, finalData, {
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${tempcode}`,
        },
      });

      console.log(response);

      if (response.status === 200) {
        if (response.data.message === "User updated successfully") {
          const url = `http://localhost:5000/login/google/${role}`;
          const headers = { authorization: `Bearer ${refreshToken}` };
          try {
            const response = await axios.get(url, { headers });
            if (response.status === 200) {
              const { accessToken, refreshToken } = response.data;
              setToken(accessToken, refreshToken);
              redirecttopath(`/dashbord`);
            }
          } catch (error) {
            if (error.response.data.message === "Token expired") {
              const ok = window.confirm("Session expired. Please login again.");
              if (ok) {
                redirecttopath(`/login/${role}`);
              }
            }
          }
        }
      } else {
        alert(`Error:${response.data.message}`);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error.response.data.message === "Token expired") {
        redirecttopath(`/login/${role}`);
      }
      alert("An error occurred while updating the profile. Please try again.");
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    if (formData.role === "mentee") {
      setErrorsformentee((prevErrors) => ({
        ...prevErrors,
        [name]: validateField(name, value),
      }));
    } else if (formData.role === "mentor") {
      setErrorsformentor((prevErrors) => ({
        ...prevErrors,
        [name]: validateField(name, value),
      }));
    }
  };

  const isselected = () => {
    return selectedCategories.length > 0;
  };

  const getIsFormValid = () => {
    if (formData.role === "mentee") {
      if (formData.occupation === "employed") {
        return (
          formData.occupation !== "" &&
          !errorsformentee.occupation &&
          formData.age !== "" &&
          !errorsformentee.age &&
          formData.phone_number !== "" &&
          !errorsformentee.phone_number
        );
      }
      return (
        formData.occupation !== "" &&
        !errorsformentee.occupation &&
        formData.student_level !== "" &&
        formData.institution_name !== "" &&
        !errorsformentee.institution_name &&
        formData.age !== "" &&
        !errorsformentee.age &&
        formData.phone_number !== "" &&
        !errorsformentee.phone_number
      );
    } else {
      return (
        formData.category !== "" &&
        formData.description !== "" &&
        formData.experience !== "" &&
        !errorsformentor.experience &&
        formData.skill !== ""
      );
    }
  };

  return (
    <div className={Styles.container}>
      {isFinish &&
        (message === "User profile incomplete" ? (
          <div className={Styles.formcontainer}>
            <h1 className={Styles.title}>
              Complete your profile us a {formData.role}
            </h1>
            <form onSubmit={handleSubmit} className={Styles.form}>
              {formData.role === "mentee" ? (
                !showCategory ? (
                  <div className={Styles.Menteebord}>
                    <div className={Styles.Field}>
                      <label>
                        Occupation <sup>*</sup>
                      </label>
                      <select
                        value={formData.occupation}
                        onChange={handleChange}
                        name="occupation"
                      >
                        <option value="" hidden>
                          Select your occupation
                        </option>
                        <option value="student">Student</option>
                        <option value="employed">Employed</option>
                      </select>
                      {errorsformentee.occupation && (
                        <ErrorMessage message={errorsformentee.occupation} />
                      )}
                    </div>
                    {formData.occupation === "student" && (
                      <>
                        <div className={Styles.Field}>
                          <label>
                            Education Level <sup>*</sup>
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
                            <ErrorMessage
                              message={errorsformentee.student_level}
                            />
                          )}
                        </div>
                        <div className={Styles.Field}>
                          <label>
                            Institution Name <sup>*</sup>
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
                            <ErrorMessage
                              message={errorsformentee.institution_name}
                            />
                          )}
                        </div>
                      </>
                    )}
                    <div className={Styles.Field}>
                      <label>
                        Age <sup>*</sup>
                      </label>
                      <input
                        name="age"
                        value={formData.age}
                        inputMode="numeric"
                        onChange={handleChange}
                        placeholder="Age"
                      />
                      {errorsformentee.age && (
                        <ErrorMessage message={errorsformentee.age} />
                      )}
                    </div>
                    <div className={Styles.Field}>
                      <label>
                        Mobile Number <sup>*</sup>
                      </label>
                      <input
                        name="phone_number"
                        value={formData.phone_number}
                        inputMode="numeric"
                        onChange={handleChange}
                        placeholder="Mobile number"
                      />
                      {errorsformentee.phone_number && (
                        <ErrorMessage message={errorsformentee.phone_number} />
                      )}
                    </div>
                    <div className={Styles.btns}>
                      <button
                        className={Styles.primary_btn}
                        disabled={!getIsFormValid()}
                        onClick={() => setShowCategory(true)}
                      >
                        Go to Next
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={Styles.categories}>
                    <h2 className={Styles.cat_title}>Select Categories</h2>
                    <ul className={Styles.cat_list}>
                      {categories.map((category) => (
                        <li
                          key={category}
                          onClick={() => toggleCategory(category)}
                          className={
                            selectedCategories.includes(category)
                              ? Styles.selected
                              : ""
                          }
                        >
                          {category}
                        </li>
                      ))}
                    </ul>
                    <div className={Styles.btns}>
                      <button
                        className={Styles.secondary_btn}
                        onClick={() => {
                          setSelectedCategories([]);
                          setShowCategory(false);
                        }}
                      >
                        Go back
                      </button>
                      <button
                        className={Styles.primary_btn}
                        disabled={!isselected()}
                        type="submit"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                )
              ) : (
                <div className={Styles.Mentorbord}>
                  <div className={Styles.Field}>
                    <label>
                      Category <sup>*</sup>
                    </label>
                    <select
                      value={formData.category}
                      onChange={handleChange}
                      name="category"
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
                  <div className={Styles.Field}>
                    <label>
                      description <sup>*</sup>
                    </label>
                    <input
                      name="description"
                      value={formData.description}
                      type="text"
                      maxLength={250}
                      onChange={handleChange}
                      placeholder="description about you"
                    />
                    {errorsformentor.description && (
                      <ErrorMessage message={errorsformentor.description} />
                    )}
                  </div>
                  <div className={Styles.Field}>
                    <label>
                      exprience <sup>*</sup>
                    </label>
                    <input
                      name="experience"
                      value={formData.experience}
                      type="text"
                      onChange={handleChange}
                      placeholder="no. months / no. years (2 years / 10 months)"
                    />
                    {errorsformentor.experience && (
                      <ErrorMessage message={errorsformentor.experience} />
                    )}
                  </div>
                  <div className={Styles.Field}>
                    <label>
                      Skill <sup>*</sup>
                    </label>
                    <input
                      name="skill"
                      value={formData.skill}
                      type="text"
                      onChange={handleChange}
                      placeholder="Specify your skill"
                    />
                    {errorsformentor.skill && (
                      <ErrorMessage message={errorsformentor.skill} />
                    )}
                  </div>
                  <div className={Styles.btns}>
                    <button
                      className={Styles.primary_btn}
                      disabled={!getIsFormValid()}
                      type="submit"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        ) : (
          <div className={Styles.messagecontainer}>
            <h1>{message}</h1>
          </div>
        ))}
    </div>
  );
}

export default Callback;
