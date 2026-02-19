// ============= TUMHARE EXISTING FUNCTIONS (YEH SAB RAHENGE) =============

export const registerUser = async (data) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error('Error in registerUser:', error);
    throw error;
  }
};

export const loginUser = async (data) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error('Error in loginUser:', error);
    throw error;
  }
};

export const validUser = async () => {
  try {
    const token = localStorage.getItem('userToken');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/valid`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  } catch (error) {
    console.error('Error in validUser:', error);
    throw error;
  }
};

export const googleAuth = async (tokenId) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tokenId }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error in googleAuth:', error);
    throw error;
  }
};

export const searchUsers = async (search) => {
  try {
    const token = localStorage.getItem('userToken');
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/user?search=${search}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return await response.json();
  } catch (error) {
    console.error('Error in searchUsers:', error);
    throw error;
  }
};

export const updateUser = async (userId, data) => {
  try {
    const token = localStorage.getItem('userToken');
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/users/update/${userId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );
    return await response.json();
  } catch (error) {
    console.error('Error in updateUser:', error);
    throw error;
  }
};

// ============= NAYA FUNCTION - YEH ADD KARO (LAST MEIN) =============
export const uploadProfilePic = async (userId, file) => {
  try {
    const formData = new FormData();
    formData.append('profilePic', file);
    formData.append('userId', userId);

    const token = localStorage.getItem('userToken');

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/users/upload-profile-pic`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error uploading profile pic:', error);
    throw error;
  }
};