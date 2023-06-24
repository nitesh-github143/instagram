import React from 'react'

const Profile = () => {
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
                        <h2 className="text-xl font-bold">John Doe</h2>
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
                        <span className="font-bold">100</span>
                        <span className="text-gray-600">Posts</span>
                    </div>
                </div>
            </div>
            <div className="w-full bg-white shadow-md rounded-lg p-4">
                <div className="flex justify-between mb-4">
                    <img
                        className="w-1/3 rounded-lg mr-2"
                        src="https://placekitten.com/400/400"
                        alt="Post"
                    />
                    <img
                        className="w-1/3 rounded-lg mx-2"
                        src="https://placekitten.com/400/400"
                        alt="Post"
                    />
                    <img
                        className="w-1/3 rounded-lg ml-2"
                        src="https://placekitten.com/400/400"
                        alt="Post"
                    />
                </div>
                <div className="flex justify-between">
                    <img
                        className="w-1/3 rounded-lg mr-2"
                        src="https://placekitten.com/400/400"
                        alt="Post"
                    />
                    <img
                        className="w-1/3 rounded-lg mx-2"
                        src="https://placekitten.com/400/400"
                        alt="Post"
                    />
                    <img
                        className="w-1/3 rounded-lg ml-2"
                        src="https://placekitten.com/400/400"
                        alt="Post"
                    />
                </div>
            </div>
        </div>
    )
}

export default Profile
