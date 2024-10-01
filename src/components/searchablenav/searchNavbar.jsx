/* eslint-disable react/prop-types */
import Styles from "./searchNavbar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dummy from "../../assets/img/user.png";
import { useState, useContext } from "react";
import { AuthContext } from "../../AuthContext";
import "ldrs/tailspin";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Searchbar(props) {
  const redirecttopath = (path) => {
    const lastSegment = path.split('/').pop();

    if (lastSegment === auth.userData.id) {
      window.location.href = '/profile';
    } else {
      window.location.href = path;
    }
  };

  const { auth, refreshToken, logout } = useContext(AuthContext);
  const User = auth.userData;

  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchresult, setSearchResult] = useState([]);

  const [isOpenMenu, setIsOpenMenu] = useState(false);

  const [isSeachbarOpen, setIsSearchbarOpen] = useState(false);

  const toggleMenu = () => {
    if (!isSeachbarOpen) {
      setIsOpenMenu(!isOpenMenu);
    }
  };

  const toggleSearchbar = () => {
    if (!isOpenMenu) {
      setIsSearchbarOpen(!isSeachbarOpen);
      if (isSeachbarOpen === true) {
        setSearch("");
        setShowDropdown(false);
      }
    }
  };

  const searchChange = async (event) => {
    const query = event.target.value;
    setSearch(query);
    setLoading(true);

    if (query === "") {
      setShowDropdown(false);
    } else {
      setShowDropdown(true);
      try {
        // Call search API with the search query
        const response = await axios.get(
          `${API_BASE_URL}/dashboard/search`,
          {
            params: {
              Search: query, // Send search query as a parameter
            },
            headers: {
              authorization: `Bearer ${auth.token}`, // Include the auth token in headers
            },
          }
        );

        // Process the response data
        if (response.status === 200) {
          const results = response.data.result;
          setSearchResult(results);
          // console.log(results);
        }
      } catch (error) {
        if (error.response.data.message === "Token expired") {
          await refreshToken();
          console.log("Token refreshed");
          // Retry the search after refreshing the token
          const retryResponse = await axios.get(
            `${API_BASE_URL}/dashboard/search`,
            {
              params: {
                Search: query,
              },
              headers: {
                authorization: `Bearer ${auth.token}`, // Include the updated auth token
              },
            }
          );
          if (retryResponse.status === 200) {
            const results = retryResponse.data.result;
            // console.log(results);
            setSearchResult(results);
          }
        } else {
          console.error("Unexpected error:", error);
          logout();
          redirecttopath("/login");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleButtonClick = () => {
    props.openForm(true); // This will update the state in the parent component
  };

  const updatequetion = (question,id) => {
    props.setQuestion(question);
    props.setquestionId(id);
    setIsSearchbarOpen(false);
    setShowDropdown(false);
    setSearch("");
    setSearchResult([]);
  };

  return (
    <div className={Styles.mainbar}>
      <div className={Styles.title}>Gurunatha</div>
      <div className={Styles.searchbar}>
        <input
          type="text"
          placeholder="Search..."
          className={Styles.input}
          onChange={searchChange}
          value={search}
          maxLength={40}
        />
      </div>

      <div className={Styles.navbar}>
        <div className={Styles.item} onClick={() => redirecttopath("/inbox")}>
          <FontAwesomeIcon icon="fa-envelope" size="xl" />
        </div>
        <div className={Styles.item} onClick={handleButtonClick}>
          <FontAwesomeIcon icon="fa-square-plus" size="xl" />
        </div>
        <div className={Styles.item} onClick={() => redirecttopath("/profile")}>
          <img
            src={User && User.profile_image ? User.profile_image : dummy}
            className={Styles.profile_img}
          />
        </div>
      </div>
      <div className={Styles.mobilesearch}>
        {!isSeachbarOpen ? (
          <FontAwesomeIcon
            icon="fa-solid fa-magnifying-glass"
            size="xl"
            onClick={toggleSearchbar}
          />
        ) : (
          <FontAwesomeIcon
            icon="fa-solid fa-xmark"
            size="xl"
            onClick={toggleSearchbar}
          />
        )}
      </div>
      <div
        className={
          Styles.taggle_btn + " " + `${isOpenMenu ? Styles.active : ""}`
        }
        onClick={toggleMenu}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div
        className={
          Styles.mobileview + " " + ` ${isOpenMenu ? Styles.is_active : ""}`
        }
      >
        <div className={Styles.mob_list}>
          <div className={Styles.item} onClick={() => redirecttopath("/inbox")}>
            <FontAwesomeIcon icon="fa-envelope" size="xl" />
            inbox
          </div>
          <div className={Styles.item} onClick={handleButtonClick}>
            <FontAwesomeIcon icon="fa-square-plus" size="xl" />
            new post
          </div>
          <div
            className={Styles.item}
            onClick={() => redirecttopath("/profile")}
          >
            <FontAwesomeIcon icon="fa-solid fa-user" size="xl" />
            profile
          </div>
        </div>
      </div>
      <div
        className={
          Styles.Mobsearch + " " + `${isSeachbarOpen ? Styles.is_active : ""}`
        }
      >
        <input
          type="text"
          placeholder="Search..."
          className={Styles.input}
          value={search}
          onChange={searchChange}
          maxLength={40}
        />
      </div>
      {showDropdown && (
        <div className={Styles.dropdown}>
          {loading && (
            // loading animation
            <div className={Styles.loading}>
              <l-tailspin
                size="40"
                stroke="5"
                speed="0.9"
                color="black"
              ></l-tailspin>
            </div>
          )}
          {searchresult.length > 0 ? (
            <ul className={Styles.dropdown_list}>
              {searchresult.map((item, index) => (
                <li key={index} className={Styles.dropdown_item}>
                  {item.type === "post" ? (
                    <div className={Styles.questionitem} onClick={() => updatequetion(item.question,item.id)}>
                      <FontAwesomeIcon icon="fa-regular fa-circle-question"  />
                      {" "}
                      {item.question}
                    </div>
                  ) : item.type === "mentor" ? (
                    <div className={Styles.mentoritem} onClick={() => {
                      setSearch("");
                      redirecttopath(`/profile/${item.id}`);
                    }}>
                      <img
                        src={item.profile_image ? item.profile_image : dummy}
                        alt={item.profile_name}
                        className={Styles.profile_img}
                      />
                      <strong>Mentor:</strong> {item.first_name + " " + item.last_name}
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            !loading && <p className={Styles.no_result}>No result found</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Searchbar;
