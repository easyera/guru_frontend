/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import Styles from "./dashboard.module.css";
import Searchbar from "../../components/searchablenav/searchNavbar";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../AuthContext";
import Post from "../../components/post/post";
import dummy from "../../assets/img/user.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import no_image from "../../assets/img/no_image.png";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// erro component
const ErrorMessage = (props) => {
  return <p className={Styles.errorMessage}>{props.message}</p>;
};

function Dashboard() {
  const { auth, logout, refreshToken, setUserData } = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showMentorList, setShowMentorList] = useState(true);
  const [Mentors, setMentors] = useState([]);
  const [Posts, setPostslist] = useState([]);
  const [errorForPost, setErrorForPost] = useState({
    question: "",
    category: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const [OpenPostForm, setOpenPostForm] = useState(false);
  // post datas
  const [single_post_data, setSinglePostData] = useState({
    question: "",
    description: "",
    category: "",
    image: null,
    image_url: "",
    previous_image_url: "",
  });

  const [question, setquestion] = useState("");
  const [questionId, setquestionId] = useState("");

  const categories = [
    "Art",
    "Science and Technology",
    "Sports",
    "Music",
    "Other",
  ];

  // starter function
  useEffect(() => {
    const fetchData = async () => {
      if (auth.token === null || auth.refreshToken === null) {
        logout();
        redirecttopath("/login");
      } else {
        try {
          const response = await axios.get(`${API_BASE_URL}/dashboard`, {
            headers: {
              authorization: `Bearer ${auth.token}`,
            },
          });
          setUserData(transformData(response.data.User));
          putCategory(response.data.User.category);
        } catch (error) {
          if (error.response.data.message === "Token expired") {
            refreshToken();
            window.location.reload();
          } else {
            logout();
            redirecttopath("/login");
          }
        }
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await fetchPostList();
      await fetchMentorList();
    };

    if (selectedCategories.length > 0) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategories]);

  const fetchMentorList = async () => {
    if (!auth.token || !auth.refreshToken) {
      logout();
      redirecttopath("/login");
      return;
    }
    try {
      const response = await axios.get(
        `${API_BASE_URL}/dashboard/mentorlist`,
        {
          params: {
            categories: selectedCategories, // Send categories as query parameters
          },
          headers: {
            authorization: `Bearer ${auth.token}`,
          },
        }
      );

      if (response.status === 200) {
        if (response.data.message === "Mentors found") {
          setMentors(response.data.mentors);
        } else if (response.data.message === "No mentors found") {
          setMentors([]);
        }
      }
    } catch (error) {
      if (error.response.data.message === "Token expired") {
        refreshToken();
        window.location.reload();
      } else {
        logout();
        redirecttopath("/login");
      }
    }
  };
  const fetchPostList = async () => {
    if (!auth.token || !auth.refreshToken) {
      logout();
      redirecttopath("/login");
      return;
    }
    try {
      const response = await axios.get(`${API_BASE_URL}/dashboard/posts`, {
        params: {
          categories: selectedCategories, // Send categories as query parameters
        },
        headers: {
          authorization: `Bearer ${auth.token}`,
        },
      });
      if (response.status === 200) {
        if (response.data.message === "No posts found") {
          setPostslist([]);
        } else {
          const sortedPosts = response.data.posts.sort(
            (a, b) => b.like_count - a.like_count
          );
          setPostslist(sortedPosts);
        }
      }
    } catch (error) {
      if (error.response.data.message === "Token expired") {
        refreshToken();
        window.location.reload();
      } else {
        logout();
        redirecttopath("/login");
      }
    }
  };

  useEffect(() => {

    const fetchSinglePost = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/dashboard/singlePost`,
          {
            params: {
              id: questionId,
            },
            headers: {
              authorization: `Bearer ${auth.token}`,
            },
          }
        );
        if (response.status === 200) {
          setPostslist([response.data.post]);
          // console.log(response.data.post);
        }
      } catch (error) {
        console.log(error);
        if (error.response.data.message === "Token expired") {
          refreshToken();
          const retryResponse = await axios.get(
            `${API_BASE_URL}/dashboard/singlePost`,
            {
              params: {
                id: questionId,
              },
              headers: {
                authorization: `Bearer ${auth.token}`,
              },
            }
          );
          setPostslist([retryResponse.data.post]);
        } else {
          logout();
          redirecttopath("/login");
        }
      }
    };
    if (question !== "") {
      fetchSinglePost();
    }
  }, [question]);

  const clearQuestion = () => {
    setquestion("");
    setquestionId("");
    let temp = [...selectedCategories];
    setSelectedCategories([]);
    setSelectedCategories(temp);
  };

  // utility function
  const putCategory = (category) => {
    if (Array.isArray(category)) {
      setSelectedCategories(category);
    } else {
      setSelectedCategories([category]);
    }
  };
  const redirecttopath = (path) => {
    navigate(path);
  };
  const transformData = (data) => {
    const transformedData = {};
    for (const key in data) {
      if (key !== "password") {
        transformedData[key] = data[key] === null ? "" : data[key];
      }
    }
    return transformedData;
  };
  const toggleShowMentorList = () => {
    setShowMentorList(!showMentorList);
  };
  const toggleCategory = (category) => {
    setSelectedCategories((prevSelected) => {
      if (prevSelected.includes(category)) {
        return prevSelected.filter((cat) => cat !== category);
      } else {
        return [...prevSelected, category];
      }
    });
  };

  const profileViewrs = (id) => {
    if (auth.userData.id === id) {
      window.location.href = "/profile";
    } else {
      window.location.href = `/profile/${id}`;
    }
  };

  // form validation
  const getIsFormValid = () => {
    return (
      single_post_data.question.trim() !== "" &&
      !errorForPost.question &&
      single_post_data.category !== "" &&
      !errorForPost.category &&
      single_post_data.image_url !== "" &&
      !errorForPost.image
    );
  };
  const validateField = (name, value) => {
    switch (name) {
      case "question":
        return value.trim() === "" ? "Question is required." : "";
      case "category":
        return value === "" ? "Category is required." : "";
      case "image":
        return value === "" ? "Image is required." : "";
      default:
        return "";
    }
  };

  // form handling
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      if (file) {
        if (!file.type.match("image/png|image/jpg|image/jpeg")) {
          alert("Only PNG, JPG, and JPEG files are allowed");
          return;
        }
        const fileReader = new FileReader();
        fileReader.onload = () => {
          setSinglePostData((prevData) => {
            const updatedData = {
              ...prevData,
              image: file,
              image_url: fileReader.result,
            };

            return updatedData;
          });
        };

        fileReader.readAsDataURL(file);
      }
    } else {
      setSinglePostData({
        ...single_post_data,
        [name]: value,
      });
      const errorMessage = validateField(name, value);
      setErrorForPost((prevErrors) => ({
        ...prevErrors,
        [name]: errorMessage,
      }));
    }
  };
  const apicall = async (formData) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await axios.post(
        `${API_BASE_URL}/post`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            authorization: `Bearer ${auth.token}`,
          },
        }
      );
      return response;
    } catch (error) {
      throw error;
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure question ends with a question mark
    if (!single_post_data.question.trim().endsWith("?")) {
      setSinglePostData((prevData) => ({
        ...prevData,
        question: `${prevData.question.trim()}?`,
      }));
    }

    // Proceed with form submission if form is valid
    if (getIsFormValid()) {
      const formData = new FormData();
      Object.keys(single_post_data).forEach((key) => {
        if (key !== "image_url") {
          formData.append(key, single_post_data[key]);
        }
      });
      try {
        setLoading(true);
        // Create new post
        const response = await apicall(formData);
        if (response.status === 200) {
          console.log(response.data.message);
        }

        // Handle response and update posts
      } catch (error) {
        const errorMessage = error.response?.data?.message;

        if (errorMessage === "Token expired") {
          await refreshToken();

          const response = await apicall(formData);
          if (response.status === 200) {
            console.log(response.data.message);
          }
        } else if (errorMessage === "Invalid token") {
          logout();
          redirecttopath("/login");
        } else {
          console.log(error);
          window.location.reload();
        }
      } finally {
        setLoading(false);
        handleClear();
      }
    } else {
      console.log("Form data is invalid.");
    }
  };
  const handleClear = () => {
    setSinglePostData({
      question: "",
      description: "",
      category: "",
      image: null,
      image_url: "",
      previous_image_url: "",
    });
    setOpenPostForm(false);
  };

  return (
    <div className={Styles.dashboard}>
      <div className={Styles.searchbar}>
        <Searchbar
          openForm={setOpenPostForm}
          setQuestion={setquestion}
          setquestionId={setquestionId}
        />
      </div>
      <div style={{ height: "60px", width: "100%" }}></div>
      <div className={Styles.categorylist}>
        {categories.map((category) => (
          <div
            key={category}
            value={category}
            onClick={() => toggleCategory(category)}
            className={
              selectedCategories.includes(category) ? Styles.selected : ""
            }
          >
            {category}
          </div>
        ))}
      </div>
      <div className={Styles.question_container}>
        {question !== "" && <h1>Question:</h1>}
        {question !== "" && (
          <div className={Styles.question}>
            <div className={Styles.questionText}>{question}</div>
            <button className={Styles.clearqueston} onClick={clearQuestion}>
              <FontAwesomeIcon
                icon="fa-solid fa-xmark"
                onClick={handleClear}
                size="2xl"
              />
            </button>
          </div>
        )}
      </div>
      <div className={Styles.mainBody}>
        <div className={Styles.postList}>
          {Posts.map((post) => (
            <Post key={post.id} data={post} User={auth.userData} />
          ))}
        </div>
        {/* sidebar */}
        <div
          className={
            Styles.sidebar + " " + (!showMentorList ? Styles.is_active : "")
          }
        >
          <div
            className={Styles.slider}
            onClick={toggleShowMentorList}
            title="Mentor List"
          >
            {showMentorList ? (
              <FontAwesomeIcon icon="fa-solid fa-circle-arrow-left" size="xl" />
            ) : (
              <FontAwesomeIcon
                icon="fa-solid fa-circle-arrow-right"
                size="xl"
              />
            )}
            <p>M</p>
            <p>e</p>
            <p>n</p>
            <p>t</p>
            <p>o</p>
            <p>r</p>
            <p>s</p>
            <p>&nbsp;</p>
            <p>L</p>
            <p>i</p>
            <p>s</p>
            <p>t</p>
          </div>
          {/* Mentor List */}
          <div className={Styles.mentorlist}>
            {Mentors.map((mentor) => (
              <div
                key={mentor.id}
                className={Styles.mentor}
                onClick={() => profileViewrs(mentor.id)}
              >
                <div className={Styles.mentorProfile}>
                  <img
                    src={mentor.profile_image ? mentor.profile_image : dummy}
                    alt="profile"
                  />
                </div>
                <div className={Styles.mentorContent}>
                  <h2 className={Styles.mentorName}>
                    Name :{mentor.first_name}
                  </h2>
                  <p className={Styles.mentorExperience}>
                    <span style={{ fontWeight: "bold" }}>Experience : </span>
                    {mentor.experience}
                  </p>
                  <p className={Styles.mentorCategory}>
                    <span style={{ fontWeight: "bold" }}>Category : </span>
                    {mentor.category}
                  </p>
                </div>
              </div>
            ))}
            {Mentors.length === 0 && (
              <p className={Styles.mentorlistEmpty}>No mentors found</p>
            )}
          </div>
        </div>
        {OpenPostForm && (
          <div className={Styles.post_form}>
            {/* loading animation */}
            {loading && (
              // loading animation
              <div className={Styles.loading}>
                <div className={Styles.container_for_loading}>
                  <div className={Styles.half}></div>
                  <div className={Styles.half}></div>
                </div>
              </div>
            )}
            <div className={Styles.form_area}>
              <div className={Styles.close_btn_form}>
                <FontAwesomeIcon
                  icon="fa-solid fa-xmark"
                  onClick={handleClear}
                  size="2xl"
                />
              </div>
              <div className={Styles.form_box}>
                <h1>Create new post</h1>
                <form className={Styles.Post_form} onSubmit={handleSubmit}>
                  {/* question */}
                  <div className={Styles.Post_input}>
                    <label htmlFor="question">Question</label>
                    <input
                      type="text"
                      name="question"
                      value={single_post_data.question}
                      onChange={handleChange}
                    />
                    {errorForPost.question && (
                      <ErrorMessage message={errorForPost.question} />
                    )}
                  </div>
                  {/* description */}
                  <div className={Styles.Post_input}>
                    <label htmlFor="description">Description</label>
                    <textarea
                      rows={5}
                      name="description"
                      value={single_post_data.description}
                      onChange={handleChange}
                    />
                  </div>
                  {/* image */}
                  <div className={Styles.piedit}>
                    <label htmlFor="image">Post Image</label>
                    <img
                      src={single_post_data.image_url || no_image}
                      alt="postImage"
                    />
                    <div className={Styles.update}>
                      <FontAwesomeIcon icon={faUpload} />
                    </div>
                    <input
                      className={Styles.fileInput}
                      type="file"
                      name="image"
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={handleChange}
                    />
                    {errorForPost.image && (
                      <ErrorMessage message={errorForPost.image} />
                    )}
                  </div>
                  {/* category */}
                  <div className={Styles.Post_input}>
                    <label htmlFor="category">Category</label>
                    <select
                      name="category"
                      value={single_post_data.category}
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
                    {errorForPost.category && (
                      <ErrorMessage message={errorForPost.category} />
                    )}
                  </div>
                  {/* buttons */}
                  <div className={Styles.btns}>
                    <button
                      className={Styles.secondary_btn}
                      type="button"
                      onClick={handleClear}
                    >
                      Cancel
                    </button>
                    <button
                      className={Styles.primary_btn}
                      type="submit"
                      disabled={!getIsFormValid()}
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
