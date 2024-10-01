/* eslint-disable react/prop-types */
import { useState, useEffect , useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Styles from "./login.module.css";
import Googlelogo from "../../assets/img/logo-google.png";
import { AuthContext } from "../../AuthContext";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

import Fill from "../../components/initial_profile/fill";

const ErrorMessage = (props) => {
  return <p className={Styles.errorMessage}>{props.message}</p>;
};


function Login() {
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const { role } = useParams();
  const [temcode, setTemcode] = useState("");

  const redirecttopath = (path) => {
    navigate(path);
  };

  const validateField = (name, value) => {
    switch (name) {
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
  const [formClose, setFormClose] = useState(false);

  const [UserData, setUserData] = useState({});

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [serverError, setServerError] = useState("");

  useEffect(() => {
    if (role) {
      setFormData((prevData) => ({ ...prevData, role }));
      setRoleSelected(true);
    }
  }, [role]);

  const getIsFormValid = () => {
    return (
      formData.email !== "" &&
      !errors.email &&
      formData.password !== "" &&
      !errors.password
    );
  };

  const clearForm = () => {
    setFormData({
      email: "",
      password: "",
      role: "",
    });
    setErrors({
      email: "",
      password: "",
    });
    setRoleSelected(false);
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const newErrors = {
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
    };
    setErrors(newErrors);
    if (!Object.values(newErrors).some((error) => error)) {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/login/${formData.role}`,
          {
            email: formData.email,
            password: formData.password,
          }
        );
        if (response.status === 206) {
          if (response.data.message === "User profile incomplete") {
            setUserData(response.data.User);
            setTemcode(response.data.accessToken);
            setUserData((prevData) => ({
              ...prevData,
              role: formData.role
            }));
            setFormClose(true);
          }
        } else {
          setToken(response.data.accessToken, response.data.refreshToken);
          redirecttopath(`/dashboard`);
          clearForm();
        }
      } catch (error) {
        if (error.response && error.response.data) {
          setServerError(error.response.data.message);
        } else {
          setServerError("An error occurred. Please try again.");
        }
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validateField(name, value),
    }));
    setServerError(""); // Clear server error when user makes changes
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
      ) : !formClose ? (
        <div className={Styles.formcontainer}>
          <h1 className={Styles.title}>Login as a {formData.role}</h1>
          <form onSubmit={handleSubmit} className={Styles.form}>
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
            {serverError && <ErrorMessage message={serverError} />}
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
                Login
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
      ) : (
        <Fill userData={UserData} handleSubmit={handleSubmit} temcode={temcode} />
      )}
    </div>
  );
}

export default Login;
