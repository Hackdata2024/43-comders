const recordBtn = document.querySelector(".record"),
  result = document.querySelector(".result"),
  downloadBtn = document.querySelector(".download"),
  inputLanguage = document.querySelector("#language"),
  clearBtn = document.querySelector(".clear");
var sentence = "";
let SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition,
  recognition,
  recording = false;

function speech(textToNarrate) {
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

function tobeListened() {
  console.log("listened");
  if (!recording) {
    speechToText();
  } else {
    // console.log(sentence);
    // stopRecording();
    document.querySelector("#text").value = `${sentence}`;
    finalans();
    // sendSpeechDataToServer(sentence);
  }
  return 0;
}
document.addEventListener('DOMContentLoaded', function () {
  const value = document.querySelector("#text").value;
  if (value == "Your prompt will be displayed here") {
    speech("Jester is ready");
    tobeListened();
  } else {
    speech(value);
    tobeListened();
  }
});

function populateLanguages() {
  // Assuming you have a predefined 'languages' array
  // Add your actual array or fetch it from somewhere
  const languages = [
    { code: 'en', name: 'English' },
    // Add more languages as needed
  ];

  languages.forEach((lang) => {
    const option = document.createElement("option");
    option.value = lang.code;
    option.innerHTML = lang.name;
    inputLanguage.appendChild(option);
  });
}

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

      if (event.results[0].isFinal) {
        result.innerHTML += " " + speechResult;
        result.querySelector(".interim").remove();
      } else {
        if (!document.querySelector(".interim")) {
          console.log("reached2");
          const interim = document.createElement("p");
          interim.classList.add("interim");
          result.appendChild(interim);
        }
        document.querySelector(".interim").innerHTML = " " + speechResult;
        console.log("reached3");
        sentence = speechResult.trim();
        console.log(sentence);
        recording = true;
      }
    };

    recognition.onspeechend = async () => {
       tobeListened();
    };

    recognition.onerror = (event) => {
      stopRecording();
      handleRecognitionError(event);
    };
  } catch (error) {
    recording = false;
    console.log(error);
  }
}

function handleRecognitionError(event) {
  // Handle recognition errors
  // You can customize this based on your requirements
  stopRecording();

  switch (event.error) {
    case "no-speech":
      alert("No speech was detected. Stopping...");
      break;
    case "audio-capture":
      alert("No microphone was found. Ensure that a microphone is installed.");
      break;
    case "not-allowed":
      alert("Permission to use microphone is blocked.");
      break;
    case "aborted":
      alert("Listening Stopped.");
      break;
    default:
      alert("Error occurred in recognition: " + event.error);
  }
}

function stopRecording() {
  recognition.stop();
  recordBtn.querySelector("p").innerHTML = "Start Listening";
  recordBtn.classList.remove("recording");
  recording = false;
}

clearBtn.addEventListener("click", () => {
  result.innerHTML = "";
});
var prompting ;

function finalans(){
  var element = document.getElementById("form");
  element.submit();
}
