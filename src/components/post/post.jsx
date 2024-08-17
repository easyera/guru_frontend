/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect } from "react";
import Styles from "./post.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dummy from "../../assets/img/user.png";
import no_image from "../../assets/img/no_image.png";
import { AuthContext } from "../../AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Post({ data, User }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const { auth, logout, refreshToken } = useContext(AuthContext);
  
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [isUpdate, setUpdate] = useState(false);
  const [mainUser, setMainUser] = useState({});
  const [PostData, setPostData] = useState(data);

  useEffect(() => {
    if (data) {
      data.answers = data.answers || [];
      setPostData(data);
    }

    if (User){
      setMainUser(User);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleAnswer = async () => {
    setShowAnswer(!showAnswer);
    if (!showAnswer) {
      try {
        const response = await axios.get(`${API_BASE_URL}/answers`, {
          params: {
            Postid: data.id, // Send Postid as a query parameter
          },
          headers: {
            authorization: `Bearer ${auth.token}`,
          },
        });

        if (
          response.status === 200 &&
          response.data.message === "No answers found"
        ) {
          setPostData((prevData) => ({
            ...prevData,
            answers: [],
          }));
        } else {
          setPostData((prevData) => ({
            ...prevData,
            answers: response.data.answers,
          }));
        }
      } catch (error) {
        if (error.response && error.response.data.message === "Token expired") {
          refreshToken();
          window.location.reload();
        } else {
          logout();
          redirecttopath("/login");
        }
      }
    }
  };

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };
  const redirecttopath = (path) => {
    const lastSegment = path.split('/').pop();

    if (lastSegment === auth.userData.id) {
      window.location.href = '/profile';
    } else {
      window.location.href = path;
    }
  };

  const getDescription = () => {
    if (isExpanded) {
      return data.description;
    }
    return data.description.length > 100
      ? `${data.description.substring(0, 100)}...`
      : data.description;
  };

  const handleSubmitAnswer = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/answers`,
        {
          post_id: data.id, // Send post_id as a parameter
          answer: input, // Send the answer
        },
        {
          headers: {
            authorization: `Bearer ${auth.token}`,
          },
        }
      );

      if (
        response.status === 200 &&
        response.data.message === "Answer added successfully"
      ) {
        setPostData((prevData) => ({
          ...prevData,
          answers: [...prevData.answers, response.data.answer],
        }));
        // console.log(response.data.answer);
      }
    } catch (error) {
      if (error.response && error.response.data.message === "Token expired") {
        refreshToken();
        const response = await axios.post(
          `${API_BASE_URL}/answersPost`,
          {
            post_id: data.id, // Send post_id as a parameter
            answer: input, // Send the answer
          },
          {
            headers: {
              authorization: `Bearer ${auth.token}`,
            },
          }
        );

        if (
          response.status === 200 &&
          response.data.message === "Answer added successfully"
        ) {
          setPostData((prevData) => ({
            ...prevData,
            answers: [...prevData.answers, response.data.answer],
          }));
        } else {
          console.error("Error submitting answer:", error.message);
        }
      } else {
        console.error("Error submitting answer:", error.message);
        logout();
        redirecttopath("/login");
      }
    } finally {
      setInput("");
    }
  };

  const handleLikesOrDislikes = async (which, answer_id) => {
    setPostData((prevData) => {
      const updatedAnswers = prevData.answers.map((answer, index) => {
        if (index === answer_id) {
          const updatedAnswer = { ...answer };

          if (which === "like") {
            if (updatedAnswer.liked) {
              updatedAnswer.like_count -= 1;
              updatedAnswer.liked = false;
            } else {
              updatedAnswer.like_count += 1;
              updatedAnswer.liked = true;
              if (updatedAnswer.disliked) {
                updatedAnswer.dislike_count -= 1;
                updatedAnswer.disliked = false;
              }
            }
          } else if (which === "dislike") {
            if (updatedAnswer.disliked) {
              updatedAnswer.dislike_count -= 1;
              updatedAnswer.disliked = false;
            } else {
              updatedAnswer.dislike_count += 1;
              updatedAnswer.disliked = true;
              if (updatedAnswer.liked) {
                updatedAnswer.like_count -= 1;
                updatedAnswer.liked = false;
              }
            }
          }

          return updatedAnswer;
        }
        return answer;
      });

      // You can use updatedAnswers here
      const updatedAnswer = updatedAnswers[answer_id];

      (async () => {
        try {
          const response = await axios.post(
            `${API_BASE_URL}/answers/likesanddislike`,
            {
              answer_id: updatedAnswer.id,
              which: which,
              like: updatedAnswer.liked,
              dislike: updatedAnswer.disliked,
            },
            {
              headers: {
                authorization: `Bearer ${auth.token}`,
              },
            }
          );

          if (
            response.status === 200 &&
            response.data.message === "Like/Dislike updated successfully"
          ) {
            console.log(response.data.message);
          }
        } catch (error) {
          if (
            error.response &&
            error.response.data.message === "Token expired"
          ) {
            refreshToken();
            const response = await axios.post(
              `${API_BASE_URL}/likesanddislike`,
              {
                answer_id: updatedAnswer.id,
                which: which,
                like: updatedAnswer.liked,
                dislike: updatedAnswer.disliked,
              },
              {
                headers: {
                  authorization: `Bearer ${auth.token}`,
                },
              }
            );

            if (
              response.status === 200 &&
              response.data.message === "Like/Dislike updated successfully"
            ) {
              console.log(response.data.message);
            }
          } else {
            console.error("Error submitting answer:", error.message);
            // logout();
            // redirecttopath("/login");
          }
        }
      })();
      return {
        ...prevData,
        answers: updatedAnswers,
      };
    });
  };
  const handleLikesOrDislikesforpost = async (which, post_id) => {
    setPostData((prevData) => {
      const updateData = { ...prevData };
      if (which === "like") {
        if (updateData.liked) {
          updateData.like_count -= 1;
          updateData.liked = false;
        } else {
          updateData.like_count += 1;
          updateData.liked = true;
          if (updateData.disliked) {
            updateData.dislike_count -= 1;
            updateData.disliked = false;
          }
        }
      } else if (which === "dislike") {
        if (updateData.disliked) {
          updateData.dislike_count -= 1;
          updateData.disliked = false;
        } else {
          updateData.dislike_count += 1;
          updateData.disliked = true;
          if (updateData.liked) {
            updateData.like_count -= 1;
            updateData.liked = false;
          }
        }
      }
      
      (async () => {
        try {
          const response = await axios.post(
            `${API_BASE_URL}/post/likesanddislike`,
            {
              Post_id: post_id,
              which: which,
              like: updateData.liked,
              dislike: updateData.disliked,
            },
            {
              headers: {
                authorization: `Bearer ${auth.token}`,
              },
            }
          );

          if (
            response.status === 200 &&
            response.data.message === "Like/Dislike updated successfully"
          ) {
            console.log(response.data.message);
          }
        } catch (error) {
          if (
            error.response &&
            error.response.data.message === "Token expired"
          ) {
            refreshToken();
            const response = await axios.post(
              `${API_BASE_URL}/likesanddislike`,
              {
                Post_id: post_id,
                which: which,
                like: updateData.liked,
                dislike: updateData.disliked,
              },
              {
                headers: {
                  authorization: `Bearer ${auth.token}`,
                },
              }
            );

            if (
              response.status === 200 &&
              response.data.message === "Like/Dislike updated successfully"
            ) {
              console.log(response.data.message);
            }
          } else {
            console.error("Error submitting answer:", error.message);
            logout();
            redirecttopath("/login");
          }
        }
      })();
      return updateData;
    });
  };

  return (
    <div className={Styles.post}>
      {/* owner profile */}
      <div className={Styles.profile}>
        <div className={Styles.profile_image} onClick={() => redirecttopath(`/profile/${PostData.user.id}`)}>
          <img
            src={
              PostData.user.profile_image ? PostData.user.profile_image : dummy
            }
            alt="profile"
          />
        </div>
        <div className={Styles.profile_content}>
          <h2 onClick={() => redirecttopath(`/profile/${PostData.user.id}`)}>{PostData.user.first_name + " " + PostData.user.last_name}</h2>
          <p title="user type and category">
            {PostData.user.role} | {PostData.category}
          </p>
        </div>
      </div>
      {/* post content */}
      <div className={Styles.Questioncontent}>
        <div className={Styles.question}>{PostData.question}</div>
        <div className={Styles.description}>
          {getDescription()}
          {PostData.description.length > 100 && (
            <button onClick={toggleReadMore} className={Styles.readMoreBtn}>
              {isExpanded ? "Read Less" : "Read More"}
            </button>
          )}
        </div>
        <div className={Styles.PostImage}>
          <img src={PostData.image ? PostData.image : no_image} alt="post" />
        </div>
      </div>
      <div className={Styles.PostFooter}>
        <div className={Styles.ld}>
          <button onClick={() => handleLikesOrDislikesforpost("like" , PostData.id)}>
            <FontAwesomeIcon icon="fa-solid fa-thumbs-up" size="lg" />{" "}
            {PostData.like_count ? PostData.like_count : 0}
          </button>
          <button onClick={() => handleLikesOrDislikesforpost("dislike" , PostData.id)}>
            <FontAwesomeIcon icon="fa-solid fa-thumbs-down" size="lg" />{" "}
            {PostData.dislike_count ? PostData.dislike_count : 0}
          </button>
        </div>
        <button className={Styles.answersbtn} onClick={toggleAnswer}>
          <FontAwesomeIcon
            icon="fa-solid fa-comment"
            flip="horizontal"
            size="xl"
          />
        </button>
      </div>
      {showAnswer && (
        <div className={Styles.answers} data-parentid={PostData.id}>
          {PostData.answers &&
            PostData.answers.map((answer, index) => (
              <div key={index} className={Styles.answer}>
                <div className={Styles.ansprofile} onClick={() => redirecttopath(`/profile/${answer.owner_id}`)}>
                  <img src={answer.profileImg} alt="profile" />
                </div>
                <div className={Styles.anscontent}>
                  <h3 className={Styles.username} onClick={() => redirecttopath(`/profile/${answer.owner_id}`)}>{answer.name}</h3>
                  <p className={Styles.answercontent}>{answer.answer}</p>
                  <div className={Styles.ansbtn}>
                    <div className={Styles.ansld}>
                      <button
                        onClick={() => handleLikesOrDislikes("like", index)}
                      >
                        <FontAwesomeIcon
                          icon="fa-solid fa-thumbs-up"
                          size="lg"
                        />{" "}
                        {answer.like_count}
                      </button>
                      <button
                        onClick={() => handleLikesOrDislikes("dislike", index)}
                      >
                        <FontAwesomeIcon
                          icon="fa-solid fa-thumbs-down"
                          size="lg"
                        />{" "}
                        {answer.dislike_count}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          <div className={Styles.ansinput}>
            <div className={Styles.ansprofile}>
              <img
                src={
                  mainUser.profile_image
                    ? mainUser.profile_image
                    : dummy
                }
                alt="profile"
              />
            </div>
            <input
              type="text"
              placeholder="Write your answer"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button className={Styles.ansbtn} onClick={handleSubmitAnswer}>
              <FontAwesomeIcon icon="fa-solid fa-angles-right" size="xl" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Post;
