import * as userService from '../service/userService.js'; // Add `.js` for ES modules

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching users' });
  }
};

// Register a new user
export const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const result = await userService.registerUser(name, email, password);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login an existing user
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await userService.loginUser(email, password);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};