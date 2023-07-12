import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import NetworkContext from '../context/NetworkContext'

import LoadingPage from "../components/LoadingPage"

const CreatePost = () => {
    const networkUrl = useContext(NetworkContext)
    const navigate = useNavigate()

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('')
    const [url, setUrl] = useState('')
    const [isProcessing, setIsProcessing] = useState(false)

    useEffect(() => {

        if (url) {
            fetch(`${networkUrl}/createpost`, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    title,
                    body,
                    pic: url
                })
            }).then(res => res.json())
                .then(data => {
                    if (data.error) {
                        console.log(data.error)
                    }
                    else {
                        setImage(null)
                        setPreview(null)
                        setTitle('')
                        setBody('')
                        setIsProcessing(false)
                        navigate('/')
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }, [url])

    const postData = () => {
        setIsProcessing(true)
        const data = new FormData()
        data.append("file", image)
        data.append("upload_preset", "social-clone")
        data.append("cloud_name", "dpi7s3f48")
        fetch("https://api.cloudinary.com/v1_1/dpi7s3f48/image/upload", {
            method: "post",
            body: data
        })
            .then(res => res.json())
            .then(data => {
                setUrl(data.url)
            })
            .catch(err => {
                console.log(err)
            })
    }

    if (isProcessing) {
        return <LoadingPage />
    }

    return (
        <div className="flex justify-center">
            <div className="max-w-4xl w-2/3 bg-white  rounded-lg p-4">
                <h2 className="text-2xl font-bold mb-4">Add Post</h2>
                <div className="mb-4">
                    <label className="block font-semibold mb-2 text-gray-800" htmlFor="image">
                        Image:
                    </label>
                    <input
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files[0]
                            setPreview(URL.createObjectURL(file))
                            setImage(file)
                        }}
                        className="border border-gray-300 rounded p-2 w-full"
                    />
                    {image && (
                        <img
                            src={preview}
                            alt="Preview"
                            className="mt-2 rounded"
                            style={{ maxWidth: '100%', maxHeight: '200px' }}
                        />
                    )}
                </div>
                <div className="mb-4">
                    <label className="block mb-2 font-semibold text-gray-800" htmlFor="title">
                        Title:
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="border border-gray-300 rounded p-2 w-full"
                    />
                </div>
                <div className="mb-6">
                    <label className="block mb-2 font-semibold text-gray-800" htmlFor="description">
                        Description:
                    </label>
                    <textarea
                        id="description"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        className="border border-gray-300 rounded p-2 w-full h-30"
                    />
                </div>
                <button
                    type="submit"
                    onClick={postData}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                >
                    Add
                </button>
            </div>
        </div>
    )
}

export default CreatePost
