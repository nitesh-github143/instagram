import React, { useEffect, useState, useContext } from 'react';
import NetworkContext from '../context/NetworkContext';
import UserContext from '../context/UserContext';
import LoadingPage from '../components/LoadingPage';

const Profile = () => {
    const networkUrl = useContext(NetworkContext)
    const { state, dispatch } = useContext(UserContext)

    const [image, setImage] = useState("");
    const [preview, setPreview] = useState(null);
    const [mypic, setMyPics] = useState([])
    const [isLoading, setIsLoading] = useState(true);

    console.log(state)

    useEffect(() => {
        fetch(`${networkUrl}/mypost`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then(res => res.json())
            .then(result => {
                setMyPics(result.mypost)
                setIsLoading(false);
            })
    }, [])



    // const handleEditProfilePic = () => {

    //     const data = new FormData()
    //     data.append("file", image)
    //     data.append("upload_preset", "social-clone")
    //     data.append("cloud_name", "dpi7s3f48")
    //     fetch("https://api.cloudinary.com/v1_1/dpi7s3f48/image/upload", {
    //         method: "post",
    //         body: data
    //     })
    //         .then(res => res.json())
    //         .then(data => {
    //             setUrl(data.url)
    //         })
    //         .catch(err => {
    //             console.log(err)
    //         })
    // };

    useEffect(() => {
        if (image) {
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
                    fetch(`${networkUrl}/updatepic`, {
                        method: "put",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + localStorage.getItem("jwt")
                        },
                        body: JSON.stringify({
                            pic: data.url
                        })
                    })
                        .then(res => res.json())
                        .then(result => {
                            console.log(result)
                            localStorage.setItem("user", JSON.stringify({ ...state, pic: result.pic }))
                            dispatch({ type: "UPDATEPIC", payload: result.pic })
                            //window.location.reload()
                        })
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }, [image])

    const uploadPic = (file) => {
        setPreview(URL.createObjectURL(file))
        setImage(file)
    }

    return (
        <div className="flex flex-col items-center">
            {isLoading ? (
                <LoadingPage />
            ) : (

                <>
                    <div className="w-2/3 bg-white shadow-md rounded-lg p-4 mb-4">
                        <div className="flex items-center mb-4">
                            <img
                                className="w-20 h-20 mx-4 md:w-40 md:h-40 lg:w-60 lg:h-60 rounded-full object-cover"
                                src={state ? state.pic : "Loading"}
                                alt="Profile"
                            />
                            <div>
                                <h2 className="text-xl font-bold">{state ? state.name : "Loading"}</h2>
                            </div>
                        </div>
                        <div className="flex justify-between mb-4">
                            <div className="flex flex-col items-center">
                                <span className="font-bold">{state ? state.followers.length : "0"}</span>
                                <span className="text-gray-600">Followers</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="font-bold">{state ? state.following.length : "0"}</span>
                                <span className="text-gray-600">Following</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="font-bold">{mypic.length}</span>
                                <span className="text-gray-600">Posts</span>
                            </div>
                        </div>

                        <div >
                            <label htmlFor="image" className="bg-blue-500 text-white font-bold py-2 px-4 rounded">
                                Profile Pic
                            </label>
                            <div style={{ display: "none" }}>
                                <input
                                    type="file"
                                    id="image"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files[0]) {
                                            uploadPic(e.target.files[0])
                                        }
                                    }}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                                {image && (
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="mt-2 rounded "
                                        style={{ maxWidth: '100%', maxHeight: '140px' }}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="w-full bg-white shadow-md rounded-lg p-4">
                        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 gap-4">
                            {
                                mypic.map(item => {
                                    return (
                                        <img
                                            key={item._id}
                                            className="w-full h-full object-cover rounded-lg"
                                            src={item.photo}
                                            alt={item.title}
                                        />
                                    )
                                })
                            }
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default Profile;
