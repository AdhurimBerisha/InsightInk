import React, { useState } from "react";
import { Alert, Button, FileInput, TextInput, Select } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function CreateEvent() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const [descriptionLength, setDescriptionLength] = useState(0);
  const maxLength = 50;
  const [imageUrl, setImageUrl] = useState(null);
  const [category, setCategory] = useState(""); // State for category
  const [descriptionOption, setDescriptionOption] = useState(""); // State for description option

  const navigate = useNavigate();

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please select an image");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError("Image upload failed");
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image_url: downloadURL });
            setImageUrl(downloadURL);
          });
        }
      );
    } catch (error) {
      setImageUploadError("Image upload failed");
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setFormData({ ...formData, description: value });
      setDescriptionLength(value.length);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Category:", category); // Make sure category is logged properly
    console.log("Description Option:", descriptionOption); // Make sure description option is logged properly
    try {
      const res = await fetch("/api/event/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          category,
          descriptionOption, // Include the description option in the request
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message || "Failed to create event");
        return;
      }

      if (res.ok) {
        setPublishError(null);
        navigate(`/events`);
      }
    } catch (error) {
      console.error("Error:", error);
      setPublishError("Something went wrong");
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">
        Create an event
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder="Title"
          required
          id="title"
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <div className="relative">
          <TextInput
            type="text"
            placeholder="Description"
            required
            id="description"
            onChange={handleDescriptionChange}
            value={formData.description || ""}
          />
          <span className="absolute bottom-1 right-1 text-xs text-gray-400">
            {descriptionLength}/{maxLength}
          </span>
        </div>
        <TextInput
          type="date"
          placeholder="Start Date"
          required
          id="start_date"
          onChange={(e) =>
            setFormData({ ...formData, start_date: e.target.value })
          }
        />
        <TextInput
          type="date"
          placeholder="End Date"
          required
          id="end_date"
          onChange={(e) =>
            setFormData({ ...formData, end_date: e.target.value })
          }
        />

        {/* Category Dropdown */}
        <div className="flex gap-20">
          <Select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border-2 border-gray-300 p-2 rounded-md w-80"
          >
            <option value="">Select Category</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Business">Business</option>
            <option value="Science">Science</option>
            <option value="Charity">Charity</option>
            <option value="Other">Other</option>
          </Select>

          {/* Description Option Dropdown */}
          <Select
            id="descriptionOption"
            value={descriptionOption}
            onChange={(e) => setDescriptionOption(e.target.value)}
            className="border-2 border-gray-300 p-2 rounded-md w-80"
          >
            <option value="">Select Description Option</option>
            <option value="Free to join">Free to join</option>
            <option value="Pay to join">Pay to join</option>
          </Select>
        </div>

        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            onClick={handleUploadImage}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>
        </div>
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Uploaded Image"
            className="mt-4 w-full object-contain"
          />
        )}

        <Button type="submit" gradientDuoTone="purpleToPink">
          Create Event
        </Button>
        {publishError && (
          <Alert className="mt-5" color="failure">
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
}
