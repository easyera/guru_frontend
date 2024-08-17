/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Styles from "./register.module.css";
import Googlelogo from "../../assets/img/logo-google.png";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ErrorMessage = (props) => {
  return <p className={Styles.errorMessage}>{props.message}</p>;
};

function Register() {
  const navigate = useNavigate();

  const redirecttopath = (path) => {
    navigate(path);
  };

  const validateField = (name, value) => {
    switch (name) {
      case "firstName":
      case "lastName":
        if (!/^[a-zA-Z\s]+$/.test(value) && value !== "") {
          return `${
            name === "firstName" ? "First" : "Last"
          } name should contain only alphabets and spaces.`;
        } else {
          return "";
        }
      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value !== "") {
          return "Invalid email address.";
        } else {
          return "";
        }
      case "password":
        if (
          !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
            value
          ) &&
          value !== ""
        ) {
          return "Password should have at least 8 characters, one number, and one special character.";
        } else {
          return "";
        }
      default:
        return "";
    }
  };

  const [roleSelected, setRoleSelected] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [generalError, setGeneralError] = useState("");

  const getIsFormValid = () => {
    return (
      formData.firstName !== "" &&
      !errors.firstName &&
      !errors.lastName &&
      formData.email !== "" &&
      !errors.email &&
      formData.password !== "" &&
      !errors.password
    );
  };

  const clearForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "",
    });
    setErrors({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    });
    setRoleSelected(false);
    setGeneralError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {
      firstName: validateField("firstName", formData.firstName),
      lastName: validateField("lastName", formData.lastName),
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
    };
    setErrors(newErrors);
    if (!Object.values(newErrors).some((error) => error)) {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/register/${formData.role}`,
          {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
          }
        );
        if (response.status === 200) {
          // alert("Account created successfully!");
          if (formData.role === "mentor") {
            clearForm();
            redirecttopath("/login/mentor");
          } else if (formData.role === "mentee") {
            clearForm();
            redirecttopath("/login/mentee");
          }
        } else {
          setGeneralError(response.data.message);
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          setGeneralError(error.response.data.message);

          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            role: formData.role,
          });
          setErrors({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
          });
        } else {
          console.error("Error:", error);
          setGeneralError("An error occurred while creating the account.");
        }
      }
    }
  };

  const handleChange = (e) => {
    setGeneralError("");
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validateField(name, value),
    }));
  };

  const handleGoogleLogin = (role) => {
    window.location.href = `${API_BASE_URL}/auth/google/${role}`;
  };

  return (
    <div className={Styles.container}>
      {!roleSelected ? (
        <div className={Styles.roleSelection}>
          <h1 className={Styles.title}>Select Your Role</h1>
          <button
            className={Styles.roleButton}
            onClick={() => {
              setFormData((prevData) => ({ ...prevData, role: "mentor" }));
              setRoleSelected(true);
            }}
          >
            Mentor
          </button>
          <button
            className={Styles.roleButton}
            onClick={() => {
              setFormData((prevData) => ({ ...prevData, role: "mentee" }));
              setRoleSelected(true);
            }}
          >
            Mentee
          </button>
          <button
            className={Styles.secondary_btn}
            onClick={() => {
              clearForm();
              redirecttopath("/");
            }}
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className={Styles.formcontainer}>
          <h1 className={Styles.title}>Register as a {formData.role}</h1>
          {generalError && <ErrorMessage message={generalError} />}
          <form onSubmit={handleSubmit} className={Styles.form}>
            <div className={Styles.Field}>
              <label>
                First name <sup>*</sup>
              </label>
              <input
                name="firstName"
                value={formData.firstName}
                type="text"
                maxLength="40"
                onChange={handleChange}
                placeholder="First name"
              />
              {errors.firstName && <ErrorMessage message={errors.firstName} />}
            </div>
            <div className={Styles.Field}>
              <label>Last name</label>
              <input
                name="lastName"
                value={formData.lastName}
                type="text"
                maxLength="40"
                onChange={handleChange}
                placeholder="Last name"
              />
              {errors.lastName && <ErrorMessage message={errors.lastName} />}
            </div>
            <div className={Styles.Field}>
              <label>
                Email address <sup>*</sup>
              </label>
              <input
                name="email"
                type="email"
                maxLength="80"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email address"
              />
              {errors.email && <ErrorMessage message={errors.email} />}
            </div>
            <div className={Styles.Field}>
              <label>
                Password <sup>*</sup>
              </label>
              <input
                name="password"
                maxLength="30"
                value={formData.password}
                type="password"
                onChange={handleChange}
                placeholder="Password"
              />
              {errors.password && <ErrorMessage message={errors.password} />}
            </div>
            <div
              className={Styles.google_btn}
              onClick={() => handleGoogleLogin(formData.role)}
            >
              <img src={Googlelogo} alt="Oauth" />
              <span>Continue with Google</span>
            </div>
            <div className={Styles.btns}>
              <button
                className={Styles.primary_btn}
                type="submit"
                disabled={!getIsFormValid()}
              >
                Create account
              </button>
              <button
                className={Styles.secondary_btn}
                onClick={() => {
                  clearForm();
                  setRoleSelected(false);
                }}
              >
                Go back
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Register;
