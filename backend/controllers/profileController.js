import { db } from "../config/firebase.js";

const createProfile = async (req, res) => {
  const { uid } = req.user;
  const { profileName } = req.body;

  try {
    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      const profiles = userDoc.data().profiles || [];

      if (profiles.length >= 5) {
        return res.status(400).json({ message: "Maximum 5 profiles allowed" });
      }

      profiles.push({ id: Date.now().toString(), name: profileName });
      await userRef.update({ profiles });
      res
        .status(201)
        .json({ message: "Profile created successfully", profiles });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Define read, update, and delete methods similarly

export { createProfile };
