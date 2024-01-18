import React, { useEffect, useState } from 'react';
import "../styles/Dashboard.css";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { fetchImages } from './Slice';
const Dashboard = () => {
  const dispatch = useDispatch();
  const images = useSelector((state) => state.images);

  useEffect(() => {
    dispatch(fetchImages());
  }, [dispatch]);



  const [token, setToken] = useState(JSON.parse(localStorage.getItem("auth")) || "");
  const [data, setData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imgtitle, setImgtitle] = useState("");
  const [imgdesc, setImgdesc] = useState("");
  const navigate = useNavigate();

  const openImage = (image) => {
    
    setSelectedImage(image);
    incrementViews(image._id);
  }

  const closeImage = () => {
    setSelectedImage(null);
  }

/*
  const fetchImages = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_APP_API+"/api/v1/images");
      setImages(response.data);
    } catch (error) {
      toast.error(error.message);
    }
  }
*/
  const incrementViews = async (id) => {
    try {
      console.log(id);
      await axios.put(import.meta.env.VITE_APP_API+`/api/v1/images/${id}`);
      // Refresh the images to get the updated view counts
      
    } catch (error) {
      toast.error(error.message);
    }
  }

  const onFileChange = event => {
    setSelectedFile(event.target.files[0]);
  };

  const onFileUpload = async () => {
    const formData = new FormData();
    formData.append(
      "image",
      selectedFile,
      selectedFile.name,
      imgtitle,
      imgdesc
    );
    console.log(formData)
    try {
      console.log(selectedFile)
      await axios.post(import.meta.env.VITE_APP_API+"/api/v1/images", formData);
      console.log("File Uploaded");
      // Refresh the images to get the new image
      fetchImages();
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchImages();
    if(token === ""){
      navigate("/login");
      toast.warn("Please login first to access dashboard");
    }
  }, [token]);

  return (
    <div className='dashboard-main'>
      <h1>Dashboard</h1>
      <p>Hi { data.msg }! Reload to get Current view count</p>
      
        <div className='image-upload'>
        <input type="file" onChange={onFileChange} />
        <input type="text" placeholder="Enter Title" onChange={e => setImgtitle(e.target.value)}/>
        <input type="text" placeholder="Enter Image Description" onChange={e => setImgdesc(e.target.value)} />

        <button className="but" onClick={onFileUpload}>Upload!</button>
        </div>
        <div>
        <div className="image-scroll">
        {images.map(image => (
          <><div className="image-container" key={image._id}>
          <img src={image.url} onClick={() => openImage(image)} />
          <p>Title: {image.title||"No title"}</p>
          <p>Description: {image.description||"No description"}</p>
          <p>Views: {image.views}</p>
        </div></>
          
        ))}
      </div>
      {selectedImage && (
        <div className="modal" onClick={closeImage}>
          <img src={selectedImage.url} onClick={(e) => e.stopPropagation()} />
          <p>Views: {selectedImage.views}</p>
        </div>
      )}
      </div>
      <Link to="/logout" className="logout-button">Logout</Link>
    </div>
  )
}

export default Dashboard;
