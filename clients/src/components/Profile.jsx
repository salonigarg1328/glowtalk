import React, { useState, useRef } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { setShowProfile } from '../redux/profileSlice';
import { IoMdLogOut } from 'react-icons/io';
import { FaCamera } from 'react-icons/fa';
import InputEdit from './profile/InputEdit';
import { updateUser, uploadProfilePic } from '../apis/auth';
import { toast } from 'react-toastify';
import { setUserNameAndBio, setUserProfilePic } from '../redux/activeUserSlice';
import { fetchChats } from '../redux/chatsSlice';

function Profile(props) {
  const dispatch = useDispatch();
  const { showProfile } = useSelector((state) => state.profile);
  const activeUser = useSelector((state) => state.activeUser);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: activeUser.name,
    bio: activeUser.bio,
  });

  const [uploading, setUploading] = useState(false);

  const logoutUser = () => {
    toast.success('Logout Successful!');
    localStorage.removeItem('userToken');
    window.location.href = '/login';
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    try {
      dispatch(setUserNameAndBio(formData));
      await updateUser(activeUser.id, formData);
      toast.success('Profile updated!');
      dispatch(fetchChats());
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file!');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB!');
      return;
    }

    try {
      setUploading(true);
      const data = await uploadProfilePic(activeUser.id, file);

      if (data.success) {
        dispatch(setUserProfilePic(data.profilePicUrl));
        dispatch(fetchChats());
        toast.success('Profile picture updated! 🎉');
      } else {
        toast.error(data.message || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      style={{
        transition: showProfile ? '0.3s ease-in-out' : '',
        background: 'linear-gradient(180deg, #fdf4ff 0%, #faf5ff 100%)'
      }}
      className={props.className}
    >
      <div className="absolute w-[100%]">

        {/* Header — gradient theme */}
        <div
          className="pt-5 pb-3 px-4"
          style={{ background: 'linear-gradient(135deg, #6d28d9, #a855f7, #ec4899)' }}
        >
          <button
            onClick={() => dispatch(setShowProfile(false))}
            className="flex items-center gap-2"
          >
            <IoArrowBack style={{ color: '#fff', width: '24px', height: '24px' }} />
            <h6 className="text-[18px] text-white font-semibold">Profile</h6>
          </button>
        </div>

        <div className="pt-8">

          {/* Profile Pic */}
          <div className="flex items-center flex-col relative">
            <div className="relative">

              {/* gradient ring */}
              <div
                style={{
                  padding: '3px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
                }}
              >
                <img
                  className="w-[150px] h-[150px] rounded-full object-cover border-4 border-white shadow-lg"
                  src={activeUser?.profilePic}
                  alt="Profile"
                />
              </div>

              {/* Camera button */}
              <button
                onClick={handleImageClick}
                disabled={uploading}
                className="absolute bottom-2 right-2 p-3 rounded-full transition-all disabled:opacity-50 shadow-lg hover:scale-110 active:scale-95"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }}
              >
                {uploading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <FaCamera className="text-white w-5 h-5" />
                )}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {uploading && (
              <p className="text-sm mt-2 animate-pulse text-purple-500">
                Uploading...
              </p>
            )}
          </div>

          {/* NAME INPUT — unchanged */}
          <InputEdit
            type="name"
            handleChange={handleChange}
            input={formData.name}
            handleSubmit={submit}
          />

          {/* Help text — same place, only color changed */}
          <div>
            <div className="py-5 px-4">
              <p className="text-[11px] tracking-wide text-purple-500">
                This is not your username or pin. This name will be visible to
                your contacts.
              </p>
            </div>
          </div>

          {/* BIO INPUT — unchanged */}
          <InputEdit
            type="bio"
            handleChange={handleChange}
            input={formData.bio}
            handleSubmit={submit}
          />
        </div>

        {/* Logout — themed */}
        <div
          onClick={logoutUser}
          className="flex items-center justify-center mt-8 cursor-pointer transition-colors py-3 mx-4 rounded-lg"
          style={{ background: '#fff1f2' }}
        >
          <IoMdLogOut className="w-[24px] h-[24px]" style={{ color: '#ec4899' }} />
          <h6 className="text-[17px] font-semibold ml-2" style={{ color: '#ec4899' }}>
            Logout
          </h6>
        </div>

      </div>
    </div>
  );
}

export default Profile;
