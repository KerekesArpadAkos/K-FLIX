import { auth, db } from "../config/firebase.js";

// Register a new user
const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userRecord = await auth.createUser({ email, password });
    await db.collection("users").doc(userRecord.uid).set({ profiles: [] });
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Login function (dummy example, as Firebase handles this on the client side)
const login = async (req, res) => {
  const { email, password } = req.body;

  // This example is just a placeholder, as Firebase handles login on the client.
  // Usually, you would use Firebase client SDK on the frontend to get a token.
  res.status(200).json({ message: "Login function placeholder" });
};

export { register, login };
