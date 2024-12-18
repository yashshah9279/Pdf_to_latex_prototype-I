import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');

  // Fetch users when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleAddUser = async () => {
    if (!name || !dateOfBirth) {
      alert('Please fill in both fields.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/users', {
        name,
        dateOfBirth,
      });
      setUsers([...users, response.data]);
      setName('');
      setDateOfBirth('');
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>User Management</h1>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <input
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <button onClick={handleAddUser} style={{ padding: '5px 10px' }}>
          Add User
        </button>
      </div>
      <h2>Users</h2>
      <ul style={{ listStyleType: 'none', padding: '0' }}>
        {users.map((user) => (
          <li key={user._id} style={{ marginBottom: '10px' }}>
            <strong>{user.name}</strong> -{' '}
            {new Date(user.dateOfBirth).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
