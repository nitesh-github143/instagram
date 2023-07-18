import React, { useEffect, useState, useContext } from "react";
import { HeartIcon, ThumbDownIcon, TrashIcon } from "@heroicons/react/solid";
import { Link } from "react-router-dom";

import LoadingPage from "../components/LoadingPage";

import NetworkContext from "../context/NetworkContext";
import UserContext from "../context/UserContext";

const SubscribedUserPost = () => {
  const networkUrl = useContext(NetworkContext);
  const { state, dispatch } = useContext(UserContext);
  const [data, setData] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showAllComments, setShowAllComments] = useState(false);

  const handleLikeClick = (postId) => {
    if (likedPosts.includes(postId)) {
      unlikedPost(postId);
    } else {
      likedPost(postId);
    }
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleAddComment = (itemId) => {
    if (comment.trim() !== "") {
      const postId = itemId;
      makeComment(comment, postId);
      setComment("");
    }
  };

  useEffect(() => {
    fetch(`${networkUrl}/getfollowerspost`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setData(result.posts);
        setIsLoading(false);
        const likedPostIds = result.posts
          .filter((post) => post.likes.includes(state?._id))
          .map((post) => post._id);
        setLikedPosts(likedPostIds);
      });
  }, []);

  const likedPost = (id) => {
    fetch(`${networkUrl}/like`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
        setLikedPosts([...likedPosts, id]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const unlikedPost = (id) => {
    fetch(`${networkUrl}/unlike`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
        setLikedPosts(likedPosts.filter((postId) => postId !== id));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const makeComment = (text, postId) => {
    fetch(`${networkUrl}/comment`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId,
        text,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deletePost = (postId) => {
    fetch(`${networkUrl}/deletepost/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.filter((item) => {
          return item._id !== result._id;
        });
        setData(newData);
      });
  };

  return (
    <div className="flex flex-col items-center">
      {isLoading ? (
        <LoadingPage />
      ) : (
        data.map((item) => (
          <div
            key={item._id}
            className="max-w-xl w-full bg-white shadow-2xl rounded-lg p-4 mb-8"
          >
            <div className="flex items-center mb-4">
              <img
                className="w-12 h-12 rounded-full mr-4 object-cover"
                src={item.postedBy?.pic}
                alt="Profile"
              />
              <div>
                <Link
                  to={
                    item.postedBy?._id
                      ? `/profile/${item.postedBy._id}`
                      : "/profile"
                  }
                >
                  <h2 className="text-lg font-bold">{item.postedBy?.name}</h2>
                </Link>
              </div>
              <div className="ml-auto">
                {item.postedBy?._id === state?._id && (
                  <TrashIcon
                    className="h-6 w-6 text-red-500 cursor-pointer"
                    onClick={() => deletePost(item._id)}
                  />
                )}
              </div>
            </div>
            <div className="mb-4">
              <img
                className="w-full sm:rounded-lg h-80 object-contain"
                src={item.photo}
                alt="Post"
              />
            </div>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <button
                  className="text-gray-600 focus:outline-none"
                  onClick={() => handleLikeClick(item._id)}
                >
                  {likedPosts.includes(item._id) ? (
                    <ThumbDownIcon className="h-6 w-6 text-red-500" />
                  ) : (
                    <HeartIcon className="h-6 w-6 text-red-500" />
                  )}
                </button>
                <span className="text-gray-600 ml-2">
                  {item.likes.length} likes
                </span>
              </div>
              <div className="flex">
                <input
                  type="text"
                  className="border border-gray-300 rounded-l-lg px-4 py-2 w-full focus:outline-none"
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={handleCommentChange}
                />
                <button
                  className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-r-lg"
                  onClick={() => handleAddComment(item._id)}
                >
                  Comment
                </button>
              </div>
            </div>
            <h3 className="text-lg font-bold mt-4">{item.title}</h3>
            <p className="text-gray-600">{item.body}</p>
            <div className="mt-4">
              {item.comments
                .slice(0, showAllComments ? item.comments.length : 2)
                .map((comment, index) => (
                  <div key={index} className="flex mb-2">
                    <p className="font-semibold">{comment.postedBy?.name}</p>
                    <p className="text-gray-600 ml-2">{comment.text}</p>
                  </div>
                ))}
              {item.comments.length > 2 && (
                <button
                  className="text-blue-500"
                  onClick={() => setShowAllComments(!showAllComments)}
                >
                  {showAllComments ? "Hide comments" : "Read more comments"}
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default SubscribedUserPost;
