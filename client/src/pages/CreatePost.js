import React, { useState } from 'react';

const CreatePost = () => {
    const [image, setImage] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(URL.createObjectURL(file));
    };

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle the submission of the post data (e.g., send it to an API)
        console.log('Submitted:', { image, title, description });
        // Reset the form fields
        setImage(null);
        setTitle('');
        setDescription('');
    };
    return (
        <div className="flex justify-center">
            <div className="max-w-4xl w-2/3 bg-white  rounded-lg p-4">
                <h2 className="text-2xl font-bold mb-4">Add Post</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block font-semibold mb-2 text-gray-800" htmlFor="image">
                            Image:
                        </label>
                        <input
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="border border-gray-300 rounded p-2 w-full"
                        />
                        {image && (
                            <img
                                src={image}
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
                            onChange={handleTitleChange}
                            className="border border-gray-300 rounded p-2 w-full"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block mb-2 font-semibold text-gray-800" htmlFor="description">
                            Description:
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={handleDescriptionChange}
                            className="border border-gray-300 rounded p-2 w-full h-30"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                    >
                        Add
                    </button>
                </form>
            </div>
        </div>
    )
}

export default CreatePost
