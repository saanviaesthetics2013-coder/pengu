
// ================= TAB SYSTEM =================
function showTab(id) {
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// ================= 3D PENGUIN =================
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

// ================= EMOTIONS =================
function setMood(mood) {
  const el = document.getElementById("penguin3d");
  el.classList.remove("idle","happy","thinking","talking");
  el.classList.add(mood);
}

// ================= VOICE =================
function speak(text) {
  let s = new SpeechSynthesisUtterance(text);
  s.pitch = 1.3;
  s.rate = 0.95;
  window.speechSynthesis.speak(s);
}

// ================= LISTEN =================
function startListening() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  let rec = new SR();

  rec.start();
  setMood("thinking");

  rec.onresult = (e) => {
    let text = e.results[0][0].transcript;
    handleAI(text);
  };
}

// ================= AI CORE =================
async function handleAI(input) {
  let chatBox = document.getElementById("chatBox");

  chatBox.innerHTML += `<p><b>You:</b> ${input}</p>`;

  setMood("thinking");

  let reply = await getAIResponse(input);

  chatBox.innerHTML += `<p><b>Pengu:</b> ${reply}</p>`;

  speak(reply);

  setMood("talking");

  setTimeout(() => setMood("idle"), 1500);
}

// ================= REAL AI + FALLBACK =================
async function getAIResponse(text) {
  text = text.toLowerCase();

  // ===== REAL AI MODE (if API key added) =====
  const API_KEY = ""; // <-- put key here if you want real AI

  if (API_KEY) {
    try {
      let res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + API_KEY
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are Pengu, a cute friendly AI penguin assistant."
            },
            {
              role: "user",
              content: text
            }
          ]
        })
      });

      let data = await res.json();
      return data.choices[0].message.content;
    } catch (e) {
      return fallbackBrain(text);
    }
  }

  // ===== OFFLINE MODE =====
  return fallbackBrain(text);
}

// ================= OFFLINE PENGU BRAIN =================
function fallbackBrain(text) {

  if (text.includes("hello") || text.includes("hi"))
    return "Hii I'm Pengu 🐧✨";

  if (text.includes("name"))
    return "I'm Pengu, your AI penguin buddy 🐧";

  if (text.includes("love"))
    return "I love coding with you 💙";

  if (text.includes("joke"))
    return "Why don't penguins get lost? Because they always follow ice maps 😂";

  if (text.includes("you smart"))
    return "I'm getting smarter every day 🧠❄️";

  return "I'm still learning... but I'm always with you 🐧✨";
}

// ================= CHAT INPUT =================
function sendMessage() {
  let input = document.getElementById("userInput").value;
  if (!input) return;
  handleAI(input);
}

// ================= TRANSLATOR =================
async function translateText() {
  let text = document.getElementById("text").value;
  let lang = document.getElementById("lang").value;

  let res = await fetch("https://libretranslate.de/translate", {
    method: "POST",
    body: JSON.stringify({
      q: text,
      source: "en",
      target: lang
    }),
    headers: { "Content-Type": "application/json" }
  });

  let data = await res.json();
  document.getElementById("output").innerText = data.translatedText;
}

// ================= CURRENCY =================
async function convertCurrency() {
  let amount = document.getElementById("amount").value;
  let currency = document.getElementById("country").value;

  let res = await fetch("https://api.exchangerate.host/latest?base=INR");
  let data = await res.json();

  let result = amount * data.rates[currency];
  document.getElementById("result").innerText = result.toFixed(2);
}
