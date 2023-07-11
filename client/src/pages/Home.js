import React, { useEffect, useState, useContext } from 'react';
import { HeartIcon, ChatIcon, TrashIcon } from '@heroicons/react/solid';
import { Link } from 'react-router-dom';

import NetworkContext from '../context/NetworkContext';
import UserContext from '../context/UserContext';
import LoadingPage from '../components/LoadingPage';

const Home = () => {
    const networkUrl = useContext(NetworkContext);
    const { state, dispatch } = useContext(UserContext);
    const [data, setData] = useState([]);
    const [likedPosts, setLikedPosts] = useState([]);
    const [comment, setComment] = useState('');
    const [commentInputVisible, setCommentInputVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showAllComments, setShowAllComments] = useState(false);

    const handleLikeClick = (postId) => {
        if (likedPosts.includes(postId)) {
            unlikePost(postId);
        } else {
            likePost(postId);
        }
    };

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    const handleAddComment = (postId) => {
        if (comment.trim() !== '') {
            makeComment(comment, postId);
            setComment('');
            setCommentInputVisible(false);
        }
    };

    const toggleCommentInput = () => {
        setCommentInputVisible(!commentInputVisible);
    };

    const toggleShowAllComments = () => {
        setShowAllComments(!showAllComments);
    };

    const likePost = (postId) => {
        fetch(`${networkUrl}/like`, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                postId
            })
        })
            .then((res) => res.json())
            .then((result) => {
                const updatedData = data.map((item) => {
                    if (item._id === result._id) {
                        return result;
                    } else {
                        return item;
                    }
                });
                setData(updatedData);
                setLikedPosts([...likedPosts, postId]);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const unlikePost = (postId) => {
        fetch(`${networkUrl}/unlike`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                postId
            })
        })
            .then((res) => res.json())
            .then((result) => {
                const updatedData = data.map((item) => {
                    if (item._id === result._id) {
                        return result;
                    } else {
                        return item;
                    }
                });
                setData(updatedData);
                setLikedPosts(likedPosts.filter((id) => id !== postId));
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const makeComment = (text, postId) => {
        fetch(`${networkUrl}/comment`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                postId,
                text
            })
        })
            .then((res) => res.json())
            .then((result) => {
                const updatedData = data.map((item) => {
                    if (item._id === result._id) {
                        return result;
                    } else {
                        return item;
                    }
                });
                setData(updatedData);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const deletePost = (postId) => {
        fetch(`${networkUrl}/deletepost/${postId}`, {
            method: 'DELETE',
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('jwt')
            }
        })
            .then((res) => res.json())
            .then((result) => {
                const updatedData = data.filter((item) => item._id !== result._id);
                setData(updatedData);
            });
    };

    useEffect(() => {
        fetch(`${networkUrl}/allpost`, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('jwt')
            }
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

    return (
        <div className="flex flex-col items-center">
            {isLoading ? (
                <LoadingPage />
            ) : (
                data.map((item) => (
                    <div key={item._id} className="max-w-xl w-full bg-white sm:shadow-2xl rounded-lg p-4 sm:mb-8">
                        <div className="flex items-center mb-4">
                            <img className="w-12 h-12 rounded-full mr-4 object-cover" src={item.postedBy?.pic} alt="Profile" />
                            <div>
                                <Link to={item.postedBy._id !== state._id ? `/profile/${item.postedBy._id}` : "/profile"}>
                                    <h2 className="text-lg font-bold">{item.postedBy?.name}</h2>
                                </Link>
                            </div>
                            <div className="ml-auto">
                                {item.postedBy?._id === state?._id && (
                                    <TrashIcon className="h-6 w-6 text-red-500 cursor-pointer" onClick={() => deletePost(item._id)} />
                                )}
                            </div>
                        </div>
                        <div className="mb-4">
                            <img className="w-full sm:rounded-lg" src={item.photo} alt="Post" />
                        </div>
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center">
                                <button
                                    className="text-gray-600 focus:outline-none"
                                    onClick={() => handleLikeClick(item._id)}
                                >
                                    {likedPosts.includes(item._id) ? (
                                        <HeartIcon className="h-6 w-6 text-red-500" />
                                    ) : (
                                        <HeartIcon className="h-6 w-6" />
                                    )}
                                </button>
                                <button className="text-gray-600 focus:outline-none ml-2" onClick={toggleCommentInput}>
                                    <ChatIcon className="h-6 w-6" />
                                </button>
                            </div>
                            {commentInputVisible && (
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
                                        Post
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="mb-2">
                            <h3 className="text-lg font-bold">{item.title}</h3>
                            <p className="text-gray-600">{item.body}</p>
                        </div>
                        <div>
                            {item.comments.length > 2 && !showAllComments && (
                                <button className="text-blue-500" onClick={toggleShowAllComments}>
                                    Read comments
                                </button>
                            )}
                            {showAllComments || item.comments.length <= 2 ? (
                                item.comments.map((comment, index) => (
                                    <div key={index} className="flex items-center mb-2">
                                        <p className="font-semibold">{comment.postedBy?.name}</p>
                                        <p className="text-gray-600 ml-2">{comment.text}</p>
                                    </div>
                                ))
                            ) : null}
                            {item.comments.length > 2 && showAllComments && (
                                <button className="text-blue-500" onClick={toggleShowAllComments}>
                                    Hide comments
                                </button>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default Home;
