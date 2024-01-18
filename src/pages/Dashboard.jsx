import React, { useEffect, useState } from 'react';
import "../styles/Dashboard.css";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const Dashboard = () => {
  const [token, setToken] = useState(JSON.parse(localStorage.getItem("auth")) || "");
  const [data, setData] = useState({});
  const [images, setImages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  const openImage = (image) => {
    incrementViews(image._id);
    setSelectedImage(image);
  }

  const closeImage = () => {
    setSelectedImage(null);
  }
  const fetchLuckyNumber = async () => {
    let axiosConfig = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    try {
      const response = await axios.get(import.meta.env.VITE_APP_API+"/api/v1/dashboard", axiosConfig);
      setData({ msg: response.data.msg, luckyNumber: response.data.secret });
    } catch (error) {
      toast.error(error.message);
    }
  }

  const fetchImages = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_APP_API+"/api/v1/images");
      setImages(response.data);
    } catch (error) {
      toast.error(error.message);
    }
  }

  const incrementViews = async (id) => {
    try {
      console.log(id);
      await axios.put(import.meta.env.VITE_APP_API+`/api/v1/images/${id}`);
      // Refresh the images to get the updated view counts
      fetchImages();
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
      selectedFile.name
    );
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
    fetchLuckyNumber();
    fetchImages();
    if(token === ""){
      navigate("/login");
      toast.warn("Please login first to access dashboard");
    }
  }, [token]);

  return (
    <div className='dashboard-main'>
      <h1>Dashboard</h1>
      <p>Hi { data.msg }! { data.luckyNumber }</p>
      
        <div className='image-upload'>
        <input type="file" onChange={onFileChange} />
        
        <button className="but" onClick={onFileUpload}>Upload!</button>
        </div>
        <div>
        <div className="image-scroll">
        {images.map(image => (
          <><div className="image-container" key={image._id}>
          <img src={image.url} onClick={() => openImage(image)} />
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
