import React, { useEffect, useState, useContext } from 'react';
import { HeartIcon, ThumbDownIcon } from '@heroicons/react/solid';

import NetworkContext from '../context/NetworkContext'

const Home = () => {
    const networkUrl = useContext(NetworkContext)
    const [data, setData] = useState([])
    const [liked, setLiked] = useState(false);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);

    const handleLikeClick = () => {
        setLiked(!liked);
    };

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    const handleAddComment = () => {
        if (comment.trim() !== '') {
            setComments([...comments, comment]);
            setComment('');
        }
    };

    useEffect(() => {
        fetch(`${networkUrl}/allpost`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then(res => res.json())
            .then(result => {
                setData(result.posts)
            })
    }, [])

    return (
        <div className="flex flex-col items-center">
            {
                data.map(item => {
                    return (
                        <div
                            key={item._id}
                            className="max-w-4xl w-full bg-white shadow-md rounded-lg p-4">
                            <div className="flex items-center mb-4">
                                <img
                                    className="w-16 h-16 rounded-full mr-4"
                                    src="https://placekitten.com/200/200"
                                    alt="Profile"
                                />
                                <div>
                                    <h2 className="text-xl font-bold">{item.postedBy.name}</h2>
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
                                        {liked ? (
                                            <ThumbDownIcon className="h-6 w-6 text-red-500" />
                                        ) : (
                                            <HeartIcon className="h-6 w-6 text-red-500" />
                                        )}
                                    </button>
                                    <span className="text-gray-600 ml-2">100 likes</span>
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
                                        onClick={handleAddComment}
                                    >
                                        Comment
                                    </button>
                                </div>
                            </div>
                            <h3 className="text-lg font-bold mt-4">{item.title}</h3>
                            <p className="text-gray-600"> {item.body}</p>
                            <div className="mt-4">
                                {comments.map((comment, index) => (
                                    <p key={index} className="text-gray-600">
                                        {comment}
                                    </p>
                                ))}
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Home
