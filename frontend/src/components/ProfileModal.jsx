import React, { useEffect, useState } from "react";
import "./ProfileModal.css";

const ProfileModal = ({ open, onClose, token }) => {
  const [userData, setUserData] = useState({
    username: "",
    points: 0,
    email: "",
  });

  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:5000/api/user/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setUserData({
            username: data.username || "",
            points: data.points || 0,
            email: data.email || "",
          });
        }
      })
      .catch(() => {
        // إذا الباك مرجعش حاجة خليها فاضية
        setUserData({ username: "", points: 0, email: "" });
      });
  }, [token]);

  const calculateLevel = (points) => Math.floor(points / 100);
  
  const calculateRank = (points) => {
    if (points >= 1000) return "Expert";
    if (points >= 500) return "Advanced";
    if (points >= 200) return "Intermediate";
    return "Beginner";
  };

  const level = calculateLevel(userData.points);
  const rank = calculateRank(userData.points);

  return (
    <div className={`profile-sidebar ${open ? "open" : ""}`}>
      <div className="sidebar-header">
        <h3>{userData.username || "User Profile"}</h3>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      <div className="user-info">
        <p><strong>Total Points:</strong> {userData.points}</p>
        <p><strong>Level:</strong> {level}</p>
        <p><strong>Rank:</strong> {rank}</p>
      </div>

      <div className="badges">
        <span>🏅</span>
        <span>🥇</span>
        <span>🔥</span>
      </div>

      <button className="logout-btn" onClick={() => alert("Logout clicked")}>
        Logout
      </button>
    </div>
  );
};

export default ProfileModal;



// import React from "react";
// import "./ProfileModal.css";

// const ProfileModal = ({ open, onClose }) => {
//   return (
//     <div className={`profile-sidebar ${open ? "open" : ""}`}>
//       <div className="sidebar-header">
//         <h3>User Profile</h3>
//         <button className="close-btn" onClick={onClose}>×</button>
//       </div>

//       <div className="user-info">
//         <p><strong>Username:</strong> JohnDoe</p>
//         <p><strong>Total Points:</strong> 1200</p>
//         <p><strong>Level:</strong> 5</p>
//       </div>

//       <div className="badges">
//         <span>🏅</span>
//         <span>🥇</span>
//         <span>🔥</span>
//       </div>

//       <button className="logout-btn" onClick={() => alert("Logout clicked")}>
//         Logout
//       </button>
//     </div>
//   );
// };

// export default ProfileModal;
