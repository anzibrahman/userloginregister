import React, { useEffect, useState } from 'react';
import userService from '../../services/user';
import authService from '../../services/auth';

const Home = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (currentUser && currentUser.token) { // Check if currentUser and token are valid
          const userList = await userService.getUsers(currentUser.token);
          setUsers(userList);
        }
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false); // Set loading to false after fetching users
      }
    };

    fetchUsers();
  }, []); // Include currentUser in the dependency array

  const handleDelete = async (id) => {
    try {
      await userService.deleteUser(id, currentUser.token);
      setUsers(users.filter(user => user._id !== id));
    } catch (err) {
      console.error(err.message);
    }
  };
  const handleUpdateStart = (user) => {
    setUpdatingUserId(user._id);
    setName(user.name);
    setMobileNumber(user.mobileNumber);
    // Assuming password can also be updated, initialize it if needed
    setPassword('');
  };

  const handleUpdateCancel = () => {
    setUpdatingUserId(null);
    setName('');
    setMobileNumber('');
    setPassword('');
  };

  const handleUpdateSubmit = async () => {
    try {
      const updatedUserData = {
        name,
        mobileNumber,
        password, // Include password if needed
      };
      const updatedUser = await userService.updateUser(updatingUserId, updatedUserData, currentUser.token);
      setUsers(users.map(user => user._id === updatingUserId ? updatedUser : user));
      setUpdatingUserId(null);
      setName('');
      setMobileNumber('');
      setPassword('');
    } catch (err) {
      console.error(err.message);
    }
  };


  if (loading) {
    return <div>Loading...</div>; // Render loading state while fetching data
  }
 

 
  return (
    <div>
      <h2>Home</h2>
      <ul>
        {users.map(user => (
          <li key={user._id}>
            {user.name} - {user.mobileNumber}
            <button onClick={() => handleDelete(user._id)}>Delete</button>
            {updatingUserId === user._id ? (
              <div>
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Mobile Number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                />
                {/* Include password input if needed */}
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={() => handleUpdateSubmit()}>Submit Update</button>
                <button onClick={() => handleUpdateCancel()}>Cancel</button>
              </div>
            ) : (
              <button onClick={() => handleUpdateStart(user)}>Update</button>
            )}
          </li>
        ))}
      </ul>
      
    </div>
  );
};

export default Home;
