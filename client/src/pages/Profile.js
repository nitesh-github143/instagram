import React, { useEffect, useState, useContext } from 'react';
import NetworkContext from '../context/NetworkContext';
import UserContext from '../context/UserContext';
import LoadingPage from '../components/LoadingPage';

const Profile = () => {
    const networkUrl = useContext(NetworkContext);
    const { state, dispatch } = useContext(UserContext);

    const [image, setImage] = useState('');
    const [preview, setPreview] = useState(null);
    const [mypic, setMyPics] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch(`${networkUrl}/mypost`, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('jwt'),
            },
        })
            .then(res => res.json())
            .then(result => {
                setMyPics(result.mypost);
                setIsLoading(false);
            });
    }, []);

    useEffect(() => {
        if (image) {
            setIsLoading(true)
            const data = new FormData();
            data.append('file', image);
            data.append('upload_preset', 'social-clone');
            data.append('cloud_name', 'dpi7s3f48');
            fetch('https://api.cloudinary.com/v1_1/dpi7s3f48/image/upload', {
                method: 'post',
                body: data,
            })
                .then(res => res.json())
                .then(data => {
                    fetch(`${networkUrl}/updatepic`, {
                        method: 'put',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: 'Bearer ' + localStorage.getItem('jwt'),
                        },
                        body: JSON.stringify({
                            pic: data.url,
                        }),
                    })
                        .then(res => res.json())
                        .then(result => {
                            localStorage.setItem('user', JSON.stringify({ ...state, pic: result.pic }));
                            dispatch({ type: 'UPDATEPIC', payload: result.pic })
                            setIsLoading(false)
                        });
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }, [image]);

    const uploadPic = file => {
        setPreview(URL.createObjectURL(file));
        setImage(file);
    };

    return (
        <div className="flex flex-col items-center">
            {isLoading ? (
                <LoadingPage />
            ) : (
                <>
                    <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-center mb-4">
                            <div className="flex-shrink-0">
                                <div className="w-24 h-24 md:w-40 md:h-40 lg:w-48 lg:h-48 relative rounded-full overflow-hidden border-2 border-black">
                                    <img
                                        className="w-full h-full object-cover"
                                        src={state ? state.pic : 'Loading'}
                                        alt="Profile"
                                    />
                                </div>
                            </div>
                            <div className="ml-4">
                                <h2 className="text-xl font-semibold">{state ? state.name : 'Loading'}</h2>
                                <div className="flex mt-2">
                                    <span className="mr-4">
                                        <strong>{mypic.length}</strong> posts
                                    </span>
                                    <span className="mr-4">
                                        <strong>{state ? state.followers.length : 0}</strong> followers
                                    </span>
                                    <span className="mr-4">
                                        <strong>{state ? state.following.length : 0}</strong> following
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-center">
                            <label
                                htmlFor="image"
                                className="bg-blue-500 text-white font-bold py-2 px-4 rounded cursor-pointer"
                            >
                                Edit Profile
                            </label>
                            <input
                                type="file"
                                id="image"
                                accept="image/*"
                                onChange={e => {
                                    if (e.target.files[0]) {
                                        uploadPic(e.target.files[0]);
                                    }
                                }}
                                className="hidden"
                            />
                        </div>
                    </div>
                    <div className="w-full bg-white rounded-lg p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {mypic.map(item => (
                                <div key={item._id} className="relative overflow-hidden rounded-lg">
                                    <img className="w-full h-full object-cover" src={item.photo} alt={item.title} />
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Profile;
