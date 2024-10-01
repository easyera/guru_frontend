/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import Styles from "./profile.module.css";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import no_image from "../../assets/img/no_image.png";
import dummy from "../../assets/img/user.png";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Profile_Edit from "../../components/profileedit/profileEdit";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import Post from "../../components/post/post";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// erro component
const ErrorMessage = (props) => {
  return <p className={Styles.errorMessage}>{props.message}</p>;
};

function Profile() {
  const { auth, logout, refreshToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [User, setUser] = useState(auth.userData);
  const { id } = useParams();
  const [isOwn, setIsOwn] = useState(true);
  const [OpenSetting, setOpenSetting] = useState(false);
  const [OpenEditProfile, setOpenEditProfile] = useState(true);
  const [OpenPostForm, setOpenPostForm] = useState(false);
  // post datas
  const [Posts, setPosts] = useState([]);
  const [single_post_data, setSinglePostData] = useState({
    question: "",
    description: "",
    category: "",
    image: null,
    image_url: "",
    previous_image_url: "",
  });
  const [Editsection, setEditSection] = useState(false);
  const [errorForPost, setErrorForPost] = useState({
    question: "",
    category: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const [openPost, setOpenPost] = useState(false);
  const [singlePost, setSinglePost] = useState({});

  const categories = [
    "Art",
    "Science and Technology",
    "Sports",
    "Music",
    "Other",
  ];
  // starter function
  useEffect(() => {
    if (id) {
      setIsOwn(false);
      const fetch = async () => {
        if (auth.token === null || auth.refreshToken === null) {
          logout();
          redirecttopath("/login");
        } else {
          try {
            const response = await axios.post(
              `${API_BASE_URL}/profile`,
              { id: id },
              {
                headers: {
                  Authorization: `Bearer ${auth.token}`,
                },
              }
            );
            if (response.status === 200) {
              setUser(transformData(response.data.User));
              setPosts(() => {
                return response.data.Posts.map((post) => ({
                  ...post,
                  image_url: post.image,
                  image: null,
                }));
              });
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
        }
      };

      fetch();
    } else {
      if (auth.userData === null) {
        const fetch = async () => {
          if (auth.token === null || auth.refreshToken === null) {
            logout();
            redirecttopath("/login");
          } else {
            try {
              if (auth.token !== null) {
                const response = await axios.get(
                  `${API_BASE_URL}/profile`,
                  {
                    headers: {
                      authorization: `Bearer ${auth.token}`,
                    },
                  }
                );
                setUser(transformData(response.data.User));
                setPosts(() => {
                  return response.data.Posts.map((post) => ({
                    ...post,
                    image_url: post.image,
                    image: null,
                  }));
                });

                // console.log(response.data.Posts);

                // console.log(response.data.User);
              }
            } catch (error) {
              if (error.response.data.message === "Token expired") {
                refreshToken();
                window.location.reload();
              } else {
                console.log(error);
                logout();
                redirecttopath("/login");
              }
            }
          }
        };
        fetch();
      }
      if (Posts.length === 0 && auth.userData !== null) {
        const fetch = async () => {
          if (auth.token === null || auth.refreshToken === null) {
            logout();
            redirecttopath("/login");
            return;
          }
          try {
            const response = await axios.get(`${API_BASE_URL}/post`, {
              headers: {
                authorization: `Bearer ${auth.token}`,
              },
            });
            setPosts(() => {
              return response.data.posts.map((post) => ({
                ...post,
                image_url: post.image,
                image: null,
              }));
            });
          } catch (error) {
            if (error.response.data.message === "Token expired") {
              refreshToken();
              window.location.reload();
            } else if (
              error.response.data.message === "No posts found for this user"
            ) {
              setPosts([]);
            } else {
              logout();
              redirecttopath("/login");
            }
          }
        };

        fetch();
      }
    }
  }, []);

  // utility functions
  const transformData = (data) => {
    const transformedData = {};
    for (const key in data) {
      if (key !== "password") {
        transformedData[key] = data[key] === null ? "" : data[key];
      }
    }
    return transformedData;
  };
  const redirecttopath = (path) => {
    if (path === "/dashboard") {
      navigate("/dashboard", { replace: true });
    } else {
      navigate(path);
    }
  };
  const tagglesettings = (setting) => {
    if (setting === "OpenEditProfile") {
      setOpenEditProfile(true);
    }
  };
  const logOut = () => {
    logout();
    redirecttopath("/login");
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

            // Check if the previous image URL needs to be updated
            const oldImageUrl = prevData.image_url;
            if (!Editsection) {
              if (
                oldImageUrl &&
                oldImageUrl.startsWith("https://storage.googleapis.com/")
              ) {
                updatedData.previous_image_url = oldImageUrl;
              } else {
                updatedData.previous_image_url = "";
              }
            }

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
        if (Editsection) {
          // Update existing post

          const response = await axios.put(
            `${API_BASE_URL}/post/postUpdate`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                authorization: `Bearer ${auth.token}`,
              },
            }
          );
          if (response.status === 200) {
            const updatedPost = response.data.post;
            setPosts((prevPosts) => {
              // Replace the post at the specific index
              const updatedPosts = [...prevPosts];
              updatedPosts[single_post_data.index] = {
                ...updatedPost,
                image_url: updatedPost.image,
                image: null,
              };
              return updatedPosts;
            });
          }
        } else {
          // Create new post
          const response = await apicall(formData);
          if (response.status === 200) {
            let post = response.data.post;
            setPosts((prevPosts) => {
              const newPost = {
                ...post,
                image_url: post.image,
                image: null,
              };
              return [...prevPosts, newPost];
            });
          }
        }
        // Handle response and update posts
      } catch (error) {
        const errorMessage = error.response?.data?.message;

        if (errorMessage === "Token expired") {
          await refreshToken();
          if (Editsection) {
            // Update existing post
            const response = await axios.put(
              `${API_BASE_URL}/post/postUpdate`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                  authorization: `Bearer ${auth.token}`,
                },
              }
            );
            if (response.status === 200) {
              const updatedPost = response.data.post;
              setPosts((prevPosts) => {
                // Replace the post at the specific index
                const updatedPosts = [...prevPosts];
                updatedPosts[single_post_data.index] = {
                  ...updatedPost,
                  image_url: updatedPost.image,
                  image: null,
                };
                return updatedPosts;
              });
            }
          } else {
            const response = await apicall(formData);
            if (response.status === 200) {
              let post = response.data.post;
              setPosts((prevPosts) => {
                const newPost = {
                  ...post,
                  image_url: post.image,
                  image: null,
                };
                return [...prevPosts, newPost];
              });
            }
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
    setEditSection(false);
  };
  const handleEdit = (e) => {
    const id = e.currentTarget.dataset.index;
    if (id) {
      if (Posts[id]) {
        setSinglePostData({
          question: Posts[id].question,
          description: Posts[id].description,
          category: Posts[id].category,
          image: null,
          image_url: Posts[id].image_url,
          previous_image_url: Posts[id].image_url,
          post_id: Posts[id].id,
          index: id,
        });
        setOpenPostForm(true);
        setEditSection(true);
      }
    }
  };
  const handleDelete = async (e) => {
    const index = e.currentTarget.dataset.index;

    if (index !== undefined) {
      // Show confirmation dialog
      confirmAlert({
        title: "Confirm to delete",
        message: "Are you sure you want to delete this post?",
        buttons: [
          {
            label: "Yes",
            onClick: async () => {
              try {
                // Get the post details
                const post = Posts[index];
                if (!post) {
                  console.error("Post not found");
                  return;
                }

                // Prepare the request to delete the post
                const { id, image_url } = post;

                // Make the DELETE request
                const response = await axios.delete(
                  `${API_BASE_URL}/post/postDelete`,
                  {
                    data: { id, image_url },
                    headers: {
                      authorization: `Bearer ${auth.token}`,
                    },
                  }
                );

                if (response.status === 200) {
                  setPosts((prevPosts) =>
                    prevPosts.filter((_, ind) => ind !== Number(index))
                  );
                  setUser((prevUser) => ({
                    ...prevUser,
                    Postcount: prevUser.posts_count - 1,
                  }));

                  // console.log('Updated posts:', Posts);
                }
              } catch (error) {
                const errorMessage = error.response?.data?.message;
                if (errorMessage === "Token expired") {
                  await refreshToken();
                  const { id, image_url } = Posts[index];
                  const response = await axios.delete(
                    `${API_BASE_URL}/post/postDelete`,
                    {
                      data: { id, image_url },
                      headers: {
                        authorization: `Bearer ${auth.token}`,
                      },
                    }
                  );

                  if (response.status === 200) {
                    // Update state to remove the deleted post
                    setPosts((prevPosts) =>
                      prevPosts.filter((_, ind) => ind !== Number(index))
                    );
                    setUser((prevUser) => ({
                      ...prevUser,
                      Postcount: prevUser.posts_count - 1,
                    }));
                    // console.log('Updated posts:', Posts);
                  }
                } else {
                  console.log(error);
                  window.location.reload();
                }
              }
            },
          },
          {
            label: "No",
            onClick: () => {
              console.log("Delete action canceled");
            },
          },
        ],
        closeOnEscape: false,
        closeOnClickOutside: false,
      });
    } else {
      console.error("Index not found");
    }
  };

  // single Post display
  const handlSingleDisplay = (id) => {

    const postData = Posts[id];
    
    setSinglePost({
      ...postData,
      image: postData.image_url,
      user: {
        id: User.id,
        first_name: User.first_name,
        last_name: User.last_name,
        profile_image: User.profile_image,
        role: User.role,
      },
    });

    console.log(postData);
    
    
    setOpenPost(true);
  };

  return (
    <div className={Styles.container}>
      {OpenSetting && (
        <div className={Styles.setting_container}>
          <div className={Styles.Setting_body}>
            <div className={Styles.close_setting_btn}>
              <FontAwesomeIcon
                icon="fa-solid fa-xmark"
                onClick={() => setOpenSetting(!OpenSetting)}
                size="2xl"
              />
            </div>
            <div className={Styles.Setting_item}>
              <p
                className={Styles.items}
                onClick={() => tagglesettings("OpenEditProfile")}
              >
                Edit profile
              </p>
              <p className={Styles.items} onClick={() => logOut()}>
                {" "}
                <span className={Styles.logout}>
                  Log out{" "}
                  <FontAwesomeIcon
                    icon="fa-solid fa-right-from-bracket"
                    size="sm"
                  />
                </span>
              </p>
            </div>
            <div className={Styles.Settings}>
              {OpenEditProfile && (
                <Profile_Edit
                  UserData={User}
                  setOpenSetting={setOpenSetting}
                  setUser={setUser}
                />
              )}
            </div>
          </div>
        </div>
      )}
      {/* close btn */}
      <button
        className={Styles.close_btn}
        title="go back"
        onClick={() => window.location.href = "/dashboard"}
      >
        <FontAwesomeIcon icon="fa-solid fa-arrow-left-long" size="2xl" />
      </button>
      <div className={Styles.background}></div>
      {User && (
        <div className={Styles.profile_box}>
          {/* profile details */}
          <div className={Styles.profile}>
            {/* hero content */}
            <div className={Styles.hero_content}>
              <div className={Styles.profile_img}>
                <img
                  src={User.profile_image ? User.profile_image : dummy}
                  alt="profile"
                />
              </div>
              <div className={Styles.counts}>
                <div className={Styles.count}>
                  <p className={Styles.count_number}>{User.Postcount}</p>
                  <p className={Styles.count_title}>post</p>
                </div>
                <div className={Styles.count}>
                  <p className={Styles.count_number}>{User.Commentcount}</p>
                  <p className={Styles.count_title}>comment</p>
                </div>
              </div>
              <div className={Styles.profile_buttons}>
                {isOwn ? (
                  <div className={Styles.Own_button}>
                    <button className={Styles.primary_btn}  onClick={() => window.location.href = `/inbox`}>inbox</button>
                    <button
                      className={Styles.secondary_btn}
                      onClick={() => setOpenSetting(true)}
                    >
                      settings
                    </button>
                  </div>
                ) : (
                  <div className={Styles.vister_button}>
                    <button className={Styles.primary_btn} onClick={() => redirecttopath(`/inbox/${User.id}`)}>message</button>
                  </div>
                )}
              </div>
            </div>
            {/* profile details */}
            <div className={Styles.profile_details}>
              <h1>
                {User.first_name} {User.last_name}
              </h1>
              {User.role === "mentor" && (
                <div className={Styles.exprerience}>
                  <p className={Styles.exprerience_count}>{User.experience}</p>
                  <p>exprerience</p>
                </div>
              )}
              {User.role === "mentor" ? (
                <div className={Styles.mentor_section}>
                  <div className={Styles.mentor_details}>
                    <div className={Styles.single_category}>
                      <div className={Styles.Acategory} title="Category">
                        {User.category}
                      </div>
                      <div className={Styles.skill} title="Skill">
                        {User.skill}
                      </div>
                    </div>
                    <div className={Styles.mentor_bio}>
                      {/* <div className={Styles.detal}>
                      <h3>phone number</h3>
                      <p>: {}</p>
                    </div> */}
                      <div className={Styles.detal}>
                        <h3>email</h3>
                        <p>: {User.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className={Styles.description}>
                    <p>{User.description}</p>
                  </div>
                </div>
              ) : (
                <div className={Styles.student_section}>
                  <div className={Styles.category_list}>
                    {User.category && User.category !== null ? (
                      User.category.map((category, index) => (
                        <div key={index} className={Styles.category}>
                          {category}
                        </div>
                      ))
                    ) : (
                      <div className={Styles.no_category}>No category</div>
                    )}
                  </div>
                  <div className={Styles.student_bio}>
                    <div className={Styles.detal}>
                      <h3>Occupation</h3>
                      <p>: {User.occupation}</p>
                    </div>
                    {User.occupation == "student" && (
                      <div className={Styles.detal}>
                        <h3>Eduction level</h3>
                        <p>: {User.student_level}</p>
                      </div>
                    )}
                    {User.occupation == "student" && (
                      <div className={Styles.detal}>
                        <h3>institution name</h3>
                        <p>: {User.institution_name}</p>
                      </div>
                    )}
                    <div className={Styles.detal}>
                      <h3>phone number</h3>
                      <p>: {User.phone_number}</p>
                    </div>
                    <div className={Styles.detal}>
                      <h3>email</h3>
                      <p>: {User.email}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className={Styles.posts}>
            {/* create post */}
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
                    <h1>{Editsection ? "Edit post" : "Create new post"}</h1>
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
            {openPost && (
              <div className={Styles.post_form}>
                <div className={Styles.Post_area}>
                  <div className={Styles.close_btn_form}>
                    <FontAwesomeIcon
                      icon="fa-solid fa-xmark"
                      onClick={() => {
                        setOpenPost(false);
                        window.location.reload();
                      }}
                      size="2xl"
                    />
                  </div>
                  <div className={Styles.post_box}>
                    <Post data={singlePost} User={User} />
                  </div>
                </div>
              </div>
            )}

            {isOwn && (
              <div className={Styles.posts_btn}>
                <button
                  className={Styles.primary_btn}
                  onClick={() => setOpenPostForm(true)}
                >
                  {" "}
                  Create new post{" "}
                </button>
              </div>
            )}
            <div className={Styles.post_list}>
              {Posts.map((post, index) => (
                <div
                  className={Styles.post}
                  key={index}
                >
                  <div className={Styles.post_img} onClick={() => handlSingleDisplay(index)}>
                    <img
                      src={post.image_url ? post.image_url : no_image}
                      alt="profile"
                    />
                  </div>
                  <div className={Styles.post_content}>
                    <h3>{post.question}</h3>
                    <div className={Styles.btn_and_like}>
                      <div className={Styles.likes}>
                        <FontAwesomeIcon
                          icon="fa-solid fa-thumbs-up"
                          size="sm"
                        />
                        {post.like_count}
                        <div style={{ marginLeft: "10px" }}></div>
                        <FontAwesomeIcon
                          icon="fa-solid fa-thumbs-down"
                          size="sm"
                        />
                        {post.dislike_count}
                      </div>

                      {isOwn && (
                        <div className={Styles.edit_and_delete}>
                          <button
                            className={Styles.edit_btn}
                            onClick={handleEdit}
                            data-index={index}
                          >
                            <FontAwesomeIcon icon="fa-solid fa-pen" size="xl" />
                          </button>
                          <button
                            className={Styles.delete_btn}
                            onClick={handleDelete}
                            data-index={index}
                          >
                            <FontAwesomeIcon
                              icon="fa-solid fa-trash"
                              size="xl"
                            />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
