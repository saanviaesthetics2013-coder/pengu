// ---------------- TAB SYSTEM ----------------
function showTab(id) {
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// ---------------- 3D PENGUIN ----------------
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 2, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(600, 250);
document.getElementById("penguin3d").appendChild(renderer.domElement);

// body
const body = new THREE.Mesh(
  new THREE.SphereGeometry(1.2, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0x111827 })
);
scene.add(body);

// head
const head = new THREE.Mesh(
  new THREE.SphereGeometry(0.8, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0x1f2937 })
);
head.position.y = 1.5;
scene.add(head);

// light
const light = new THREE.PointLight(0x60a5fa, 2);
light.position.set(5, 5, 5);
scene.add(light);

camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);
  body.rotation.y += 0.01;
  head.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();

// ---------------- VOICE ----------------
function speak(text) {
  let s = new SpeechSynthesisUtterance(text);
  s.pitch = 1.3;
  s.rate = 0.95;
  window.speechSynthesis.speak(s);
}

// ---------------- LISTENING ----------------
function startListening() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  let rec = new SR();

  rec.start();

  rec.onstart = () => console.log("Listening...");
  
  rec.onresult = (e) => {
    let text = e.results[0][0].transcript;
    handleAI(text);
  };
}

// ---------------- AI BRAIN ----------------
function handleAI(input) {
  let chatBox = document.getElementById("chatBox");

  chatBox.innerHTML += `<p><b>You:</b> ${input}</p>`;

  let reply = brain(input);

  speak(reply);

  chatBox.innerHTML += `<p><b>Pengu:</b> ${reply}</p>`;
}

// ---------------- PENGU PERSONALITY ----------------
function brain(text) {
  text = text.toLowerCase();

  if (text.includes("hello")) return "Hiii I’m Pengu 🐧";
  if (text.includes("your name")) return "I’m Pengu, your AI buddy!";
  if (text.includes("joke")) return "Why did penguin cross ice? To chill 😂";
  if (text.includes("love")) return "I love coding with you 💙";

  return "I’m still learning human language 🐧✨";
}

// ---------------- CHAT ----------------
function sendMessage() {
  let input = document.getElementById("userInput").value;
  handleAI(input);
}

// ---------------- TRANSLATOR ----------------
async function translateText() {
  let text = document.getElementById("text").value;
  let lang = document.getElementById("lang").value;

  let res = await fetch("https://libretranslate.de/translate", {
    method: "POST",
    body: JSON.stringify({ q: text, source: "en", target: lang }),
    headers: { "Content-Type": "application/json" }
  });

  let data = await res.json();
  document.getElementById("output").innerText = data.translatedText;
}

// ---------------- CURRENCY ----------------
async function convertCurrency() {
  let amount = document.getElementById("amount").value;
  let currency = document.getElementById("country").value;

  let res = await fetch("https://api.exchangerate.host/latest?base=INR");
  let data = await res.json();

  let result = amount * data.rates[currency];
  document.getElementById("result").innerText = result.toFixed(2);
}
