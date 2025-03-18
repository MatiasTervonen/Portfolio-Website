// Show leaderboardlist on HTML

function getLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  return leaderboard;
}

function displayLeaderboard() {
  const leaderboard = getLeaderboard();


  const leaderboardList = document.getElementById("leaderboard-list");

  leaderboardList.innerHTML = "";

  if (!leaderboardList) {
    console.error("Leaderboard list element not found on this page!");
    return;
  }

  if (leaderboard.length === 0) {
    leaderboardList.innerHTML = "<li>No scores available</li>";
  } else {
    // add every score to list
    leaderboard.forEach((entry, index) => {
      const { score, level, timeElapsed } = entry;
      const minutes = Math.floor(timeElapsed / 60);
      const seconds = timeElapsed % 60;
      const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
        seconds
      ).padStart(2, "0")}`;
      const li = document.createElement("li");
      li.textContent = `${
        index + 1
      }: Score: ${score}, Level: ${level}, Time: ${formattedTime}`;
      leaderboardList.appendChild(li);
    });
  }
}

document.addEventListener("DOMContentLoaded", displayLeaderboard);
