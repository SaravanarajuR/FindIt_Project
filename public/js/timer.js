const end = 5;
const totalSeconds = 5 * 60;

setTimeout(() => {
  totalSeconds = totalSeconds - 1;
  document.getElementById("timer").innerText = `${Math.floor(
    totalSeconds / 60
  )}:${(totalSeconds / 60) % (1000 * 60)}`;
  console.log(
    `${Math.floor(totalSeconds / 60)}:${(totalSeconds / 60) % (1000 * 60)}`
  );
}, 1000);
