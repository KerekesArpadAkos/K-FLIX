# 🎬 K-FLIX

## 📌 About the Project
K-FLIX is a modern streaming application designed for Smart TVs, developed using **LightningJS** for the frontend, **Firebase** for authentication and database management, and **Express.js** for email handling services.

## 🛠️ Technologies Used
- **Frontend:** LightningJS ⚡
- **Backend:** Firebase 🔥 & Express.js 🚀
- **Database:** Firebase Firestore 📂
- **Email Service:** Nodemailer ✉️
- **External APIs:**
  - **TMDB API 🎥** - Fetching movie and TV show data
  - **Pollinations.AI 🎭** - Generating unique avatar images

## 📐 Architecture Overview
The system consists of the following components:
- **Frontend:** Handles user interactions and communicates with APIs.
- **Backend:** Manages authentication, profile data, and email notifications.
- **Database:** Stores user profiles and other essential information.
- **Email Service:** Sends registration confirmation emails via Express.js and Nodemailer.

### 🖼️ Architecture Diagram
![System Architecture](/frontend/com.domain.app.AIFLIX/static/images/architekturaDiagram.png)

## 📥 Installation & Setup
### Prerequisites
- **Node.js** (Install from [here](https://nodejs.org/))
- **NPM** (Included with Node.js)
- **LightningJS CLI** (Install from [here](https://lightningjs.io/docs/#/getting-started/InstallCLI/index))
### 1️⃣ Clone the Repository
```bash
git clone https://github.com/KerekesArpadAkos/K-FLIX.git
cd K-FLIX
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Setup Firebase Configuration
Create a `firebaseConfig.ts` file and add your Firebase API keys:
```env
apiKey=your_api_key
authDomain=your_project_id.firebaseapp.com
projectId=your_project_id
storageBucket=your_project_id.appspot.com
messagingSenderId=your_messaging_id
appId=your_app_id
measurementId=your_measurement_id
```

### 4️⃣ Run the Application
#### Start the Backend (Express.js)
```bash
cd backend
npm start dev
```

#### Start the Frontend (LightningJS)
```bash
cd frontend/com.domain.app.AIFLIX
lng dev
```

## 🚀 Features
✔️ **User Authentication** (Login, Registration) 🔑  
✔️ **Profile Management** (Avatars) 👤  
✔️ **Movie & TV Show Browsing** via TMDB API 🎬  
✔️ **Avatar Generation** via Pollinations.AI 🎭  
✔️ **Email Notifications** using Nodemailer 📧  

## 🤝 Contributing
Feel free to contribute! Fork the repository and submit a pull request.

## 📜 License
This project is licensed under the MIT License.

## 📬 Contact
For any questions or issues, reach out via [GitHub Issues](https://github.com/KerekesArpadAkos/K-FLIX/issues).

---
🛠️ Built with passion by **Kerekes Arpad Akos** 🚀


---

### MIT License

Copyright (c) 2025 Kerekes Arpad Akos

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
