// loading voyager code 
var executed = false;
const recordBtn = document.querySelector(".record"),
  result = document.querySelector(".result"),
  downloadBtn = document.querySelector(".download"),
  inputLanguage = document.querySelector("#language"),
  clearBtn = document.querySelector(".clear");

  let SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition,
recognition,
recording = false;

// executed var checks if the disabled person has given the answer or not
function speech(textToNarrate)
{
  if ('speechSynthesis' in window) {
  var synthesis = window.speechSynthesis;
  var utterance = new SpeechSynthesisUtterance(textToNarrate);
  synthesis.speak(utterance);
  return 1;
} else {
  console.error('Web Speech API is not supported in this browser.');
  return 0;
}
}
// ... (your existing code)

async function checking() {
  if (executed == true) {
    var string = result.textContent;
    string = string.trim().toLowerCase();
    if (string == "no") {
      console.log("you have said No");
      document.querySelector(".container").textContent = "Will meet you soon";
      stopRecording();
      setTimeout(speech("Ok, no issues Will meet you soon"),2000);
    } else if (string.includes("yes")) {
      console.log('Redirecting to /yes');
      window.location.href = 'http://localhost:3000/yes';
    } else {
      var message = "you have to say only yes or no. Try again";
      executed = false;
      result.innerHTML = "";
      // first recognition object should be deleted then my messsage should be printed after that new object should be created
      stopRecording();
      speech(message);
      tobelistened();
    }
  }
}

function tobelistened() {
  if (!recording) {
    speechToText();
  } else {
    checking();
  }
  return 0;
}

const firstText = document.querySelector("#intro").textContent;
const secondText = document.querySelector("#ans").textContent;
document.addEventListener('DOMContentLoaded', async function () {
  speech(firstText);
  speech(secondText);
  tobelistened();
});

// ... (the rest of your existing code)

function populateLanguages() {
  languages.forEach((lang) => {
    const option = document.createElement("option");
    option.value = lang.code;
    option.innerHTML = lang.name;
    inputLanguage.appendChild(option);
  });
}
// no: "16",
// name: "English",
// native: "English",
// code: "en",
populateLanguages();

function speechToText() {
  try {
    recognition = new SpeechRecognition();
    recognition.lang = inputLanguage.value;
    recognition.interimResults = true;
    recordBtn.classList.add("recording");
    recordBtn.querySelector("p").innerHTML = "Listening...";
    recognition.start();
    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      //detect when intrim results
      if (event.results[0].isFinal) {
        result.innerHTML += " " + speechResult;
        result.querySelector("p").remove();
      } else {
        //creative p with class interim if not already there
        if (!document.querySelector(".interim")) {
          const interim = document.createElement("p");
          interim.classList.add("interim");
          result.appendChild(interim);
        }
        //update the interim p with the speech result
        document.querySelector(".interim").innerHTML = " " + speechResult;
        recording = true;
        executed = true;
      }
    //   downloadBtn.disabled = false;
    };
    recognition.onspeechend = async() => {
      tobelistened();
    };
    recognition.onerror = (event) => {
      stopRecording();
      if (event.error === "no-speech") {
        alert("No speech was detected. Stopping...");
      } else if (event.error === "audio-capture") {
        alert(
          "No microphone was found. Ensure that a microphone is installed."
        );
      } else if (event.error === "not-allowed") {
        alert("Permission to use microphone is blocked.");
      } else if (event.error === "aborted") {
        alert("Listening Stopped.");
      } else {
        alert("Error occurred in recognition: " + event.error);
      }
    };
  } catch (error) {
    recording = false;
    console.log(error);
  }
}


recordBtn.addEventListener("click", () => {
    result.innerHTML = "";
});

function stopRecording() {
  recognition.stop();
  recordBtn.querySelector("p").innerHTML = "Start Listening";
  recordBtn.classList.remove("recording");
  recording = false;
}

// function download() {
//   const text = result.innerText;
//   const filename = "speech.txt";

//   const element = document.createElement("a");
//   element.setAttribute(
//     "href",
//     "data:text/plain;charset=utf-8," + encodeURIComponent(text)
//   );
//   element.setAttribute("download", filename);
//   element.style.display = "none";
//   document.body.appendChild(element);
//   element.click();
//   document.body.removeChild
// (element);
// }

// downloadBtn.addEventListener("click", download);

clearBtn.addEventListener("click", () => {
  result.innerHTML = "";
//   downloadBtn.disabled = true;
});


