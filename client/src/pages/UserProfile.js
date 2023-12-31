import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import NetworkContext from "../context/NetworkContext";
import UserContext from "../context/UserContext";
import LoadingPage from "../components/LoadingPage";

const UserProfile = () => {
  const networkUrl = useContext(NetworkContext);
  const { state, dispatch } = useContext(UserContext);
  const { userId } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [isFollowing, setIsFollowing] = useState(
    state ? state.following.includes(userId) : false
  );

  useEffect(() => {
    fetch(`${networkUrl}/user/${userId}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setUserProfile(result);
      });
    console.log(state);
  }, []);

  const followUser = () => {
    fetch(`${networkUrl}/follow`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setUserProfile((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, data._id],
            },
          };
        });
        setIsFollowing(true);
      });
  };

  const unfollowUser = () => {
    fetch(`${networkUrl}/unfollow`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        unfollowId: userId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setUserProfile((prevState) => {
          const newFollowers = prevState.user.followers.filter(
            (item) => item !== data._id
          );
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: newFollowers,
            },
          };
        });
        setIsFollowing(false);
      });
  };

  return (
    <>
      {userProfile ? (
        <div className="flex flex-col items-center">
          <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-4 mb-4">
            <div className="flex items-center mb-4">
              <img
                className="w-24 h-24 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full object-cover mr-4 "
                src={userProfile.user.pic}
                alt="Profile"
              />
              <div>
                <h2 className="text-2xl font-bold">{userProfile.user.name}</h2>
              </div>
            </div>
            <div className="flex justify-between mb-4">
              <div className="flex flex-col items-center">
                <span className="font-bold">
                  {userProfile.user.followers?.length || 0}
                </span>
                <span className="text-gray-600">Followers</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-bold">
                  {userProfile.user.following?.length || 0}
                </span>
                <span className="text-gray-600">Following</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-bold">{userProfile.posts.length}</span>
                <span className="text-gray-600">Posts</span>
              </div>
            </div>
            {isFollowing ? (
              <div className="flex flex-col items-center">
                <button
                  className="w-1/2 bg-red-500 text-white px-4 py-2 rounded"
                  onClick={unfollowUser}
                >
                  Unfollow
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <button
                  className="w-1/2 bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={followUser}
                >
                  Follow
                </button>
              </div>
            )}
          </div>
          <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {userProfile.posts.map((item) => {
                return (
                  <img
                    key={item._id}
                    className="w-full sm:rounded-lg h-80 object-contain"
                    src={item.photo}
                    alt={item.title}
                  />
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <LoadingPage />
      )}
    </>
  );
};

export default UserProfile;
