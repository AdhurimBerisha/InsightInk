import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Alert, Button, FileInput, TextInput } from 'flowbite-react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';

export default function UpdateEvent() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/event/${eventId}`);
        if (!res.ok) {
          throw new Error('Failed to fetch event');
        }
        const eventData = await res.json();
        setFormData(eventData);
      } catch (error) {
        setPublishError('Failed to fetch event');
      }
    };
    fetchEvent();
  }, [eventId]);

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError('Please select an image');
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + '-' + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError('Image upload failed');
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image_url: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError('Image upload failed');
      setImageUploadProgress(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/event/updateevent/${eventId}/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        throw new Error('Failed to update event');
      }
      navigate(`/events`);
    } catch (error) {
      setPublishError('Failed to update event');
    }
  };
  

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Update an event</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder="Title"
          required
          id="title"
          value={formData.title || ''}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <TextInput
          type="text"
          placeholder="Description"
          required
          id="description"
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
        <TextInput
          type="date"
          placeholder="Start Date"
          required
          id="start_date"
          value={formData.start_date || ''}
          onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
        />
        <TextInput
          type="date"
          placeholder="End Date"
          required
          id="end_date"
          value={formData.end_date || ''}
          onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
        />
        <FileInput type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
        <Button type="button" onClick={handleUploadImage} disabled={imageUploadProgress}>
          {imageUploadProgress ? (
            <div className="w-16 h-16">
              <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}%`} />
            </div>
          ) : (
            'Upload Image'
          )}
        </Button>
        {formData.image_url && <img src={formData.image_url} alt="Event" className="w-full h-auto" />}
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        <Button type="submit">Update Event</Button>
        {publishError && <Alert color="failure">{publishError}</Alert>}
      </form>
    </div>
  );
}
