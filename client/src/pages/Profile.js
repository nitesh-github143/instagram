import React, { useEffect, useState, useContext } from 'react';
import NetworkContext from '../context/NetworkContext';
import UserContext from '../context/UserContext';

const Profile = () => {
    const networkUrl = useContext(NetworkContext)
    const { state, dispatch } = useContext(UserContext)

    const [mypic, setMyPics] = useState([])
    useEffect(() => {
        fetch(`${networkUrl}/mypost`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then(res => res.json())
            .then(result => {
                setMyPics(result.mypost)
            })
    }, [])
    return (
        <div className="flex flex-col items-center">
            <div className=" w-2/3 bg-white shadow-md rounded-lg p-4 mb-4">
                <div className="flex items-center mb-4">
                    <img
                        className="w-18 h-18 rounded-full mr-4"
                        src="https://placekitten.com/200/200"
                        alt="Profile"
                    />
                    <div>
                        <h2 className="text-xl font-bold">{state ? state.name : "Loading"}</h2>
                    </div>
                </div>
                <div className="flex justify-between mb-4">
                    <div className="flex flex-col items-center">
                        <span className="font-bold">500</span>
                        <span className="text-gray-600">Followers</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="font-bold">300</span>
                        <span className="text-gray-600">Following</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="font-bold">{mypic.length}</span>
                        <span className="text-gray-600">Posts</span>
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
        </div>
    )
}

export default Profile
