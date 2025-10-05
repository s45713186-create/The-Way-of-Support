async function loadQuotes() {
  try {
    const res = await fetch('support_quotes.json');
    return await res.json();
  } catch {
    return ["Patience is the way forward."];
  }
}

let currentIndex = 0;

function nextQuote(quotes) {
  const q = quotes[currentIndex];
  currentIndex = (currentIndex + 1) % quotes.length; // move to next, wrap at end
  return q;
}


document.addEventListener("DOMContentLoaded", async () => {
  const quoteElem = document.getElementById("quote");
  const btn = document.getElementById("new-quote");

  const quotes = await loadQuotes();

  function showQuote() {
    const q = nextQuote(quotes);
    quoteElem.classList.remove("visible");
    setTimeout(() => {
      quoteElem.textContent = q;
      quoteElem.classList.add("visible");
    }, 200);
  }


  btn.addEventListener("click", showQuote);
  showQuote();

  // Sakura petals
  const layer = document.querySelector(".sakura-layer");
  function createPetal() {
    const petal = document.createElement("div");
    petal.className = "sakura";
    petal.textContent = "🌸";
    const left = Math.random() * 100;
    petal.style.left = left + "vw";
    const duration = 10 + Math.random() * 10;
    petal.style.animationDuration = duration + "s";
    petal.style.fontSize = (0.8 + Math.random() * 0.6) + "rem";
    layer.appendChild(petal);

    setTimeout(() => petal.remove(), duration * 1000);
  }

  setInterval(createPetal, 2100);
  for (let i = 0; i < 6; i++) createPetal();
});
