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
      const { score, level, linesCleared} = entry;
      const li = document.createElement("li");
      li.textContent = `${
        index + 1
      }: Score: ${score}, Level: ${level}, Lines: ${linesCleared}`;
      leaderboardList.appendChild(li);
    });
  }
}

document.addEventListener("DOMContentLoaded", displayLeaderboard);

function clearLeaderboard() {
  localStorage.removeItem("leaderboard");
  displayLeaderboard();
}

document.getElementById("clearLeaderboard").addEventListener("click", () => {
  if (confirm("Are you sure you want to reset the leaderboard?")) {
    clearLeaderboard();
  }
});
