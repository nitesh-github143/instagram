import React, { useEffect, useState, useContext } from 'react';
import { HeartIcon, ThumbDownIcon, TrashIcon } from '@heroicons/react/solid';
import { Link } from 'react-router-dom';

import LoadingPage from "../components/LoadingPage"

import NetworkContext from '../context/NetworkContext'
import UserContext from '../context/UserContext';

const SubscribedUserPost = () => {
    const networkUrl = useContext(NetworkContext)
    const { state, dispatch } = useContext(UserContext)
    const [data, setData] = useState([])
    const [liked, setLiked] = useState(false);
    const [comment, setComment] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const handleLikeClick = () => {
        setLiked(!liked);
    };

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    const handleAddComment = (itemId) => {
        if (comment.trim() !== '') {
            const postId = itemId
            makeComment(comment, postId)
            setComment('')
        }
    };

    useEffect(() => {
        fetch(`${networkUrl}/getfollowerspost`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then(res => res.json())
            .then(result => {
                setData(result.posts)
                setIsLoading(false);
            })
    }, [data])

    const likedPost = (id) => {
        fetch(`${networkUrl}/like`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            }
            )
    }

    const unlikedPost = (id) => {
        fetch(`${networkUrl}/unlike`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            }
            )
    }

    const makeComment = (text, postId) => {
        fetch(`${networkUrl}/comment`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId,
                text
            })
        })
            .then(res => res.json())
            .then(result => {
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)
            })
            .catch(err => {
                console.log(err)
            });
    };

    const deletePost = (postId) => {
        fetch(`${networkUrl}/deletepost/${postId}`, {
            method: "DELETE",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then(res => res.json())
            .then(result => {
                const newData = data.filter(item => {
                    return item._id !== result._id
                })
                setData(newData)
            })
    }


    return (
        <div className="flex flex-col items-center">
            {
                isLoading ? (
                    <LoadingPage />
                ) : (
                    data.map(item => {
                        return (
                            <div
                                key={item._id}
                                className="max-w-4xl w-full bg-white shadow-md rounded-lg p-4">
                                <div className="flex items-center mb-4">
                                    <img
                                        className="w-16 h-16 rounded-full mr-4 object-cover"
                                        src={item.postedBy.pic}
                                        alt="Profile"
                                    />
                                    <div>
                                        <Link to={item.postedBy._id !== state._id ? `/profile/${item.postedBy._id}` : "/profile"}>
                                            <h2

                                                className="text-xl font-bold">{item.postedBy.name}</h2>
                                        </Link>
                                    </div>
                                    <div className="ml-auto">
                                        {/* Delete Icon */}
                                        {
                                            item.postedBy._id === state._id && <TrashIcon
                                                className="h-6 w-6 text-red-500 cursor-pointer"
                                                onClick={() => deletePost(item._id)}
                                            />
                                        }
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <img
                                        className="w-full rounded-lg"
                                        src={item.photo}
                                        alt="Post"
                                    />
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center">
                                        <button
                                            className="text-gray-600 focus:outline-none"
                                            onClick={handleLikeClick}
                                        >
                                            {item.likes.includes(state._id) ? (
                                                <ThumbDownIcon
                                                    className="h-6 w-6 text-red-500"
                                                    onClick={() => unlikedPost(item._id)}
                                                />
                                            ) : (
                                                <HeartIcon
                                                    className="h-6 w-6  text-red-500"
                                                    onClick={() => likedPost(item._id)}
                                                />
                                            )}
                                        </button>
                                        <span className="text-gray-600 ml-2">{item.likes.length} likes</span>
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
                                            comment
                                        </button>
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold mt-4">{item.title}</h3>
                                <p className="text-gray-600"> {item.body}</p>
                                <div className="mt-4">
                                    {item.comments.map((comment, index) => {
                                        return (
                                            (
                                                <div key={index} className='flex'>
                                                    <p><span>{comment.postedBy.name}</span> <span className="text-gray-600">{comment.text}</span></p>
                                                </div>
                                            )
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })
                )
            }
        </div>
    )
}

export default SubscribedUserPost
