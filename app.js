const myImg = document.getElementById("prompt");
const log1 = document.getElementById("log1");
const log2 = document.getElementById("log2");

document.getElementById("copyText").style.visibility = "hidden";
document.getElementById("download").style.visibility = "hidden";
document.getElementById("log1").style.visibility = "visible";

myImg.style.height = "220px";
myImg.style.width = "720px";

let count = 0;
let sTime = 0;
let showingFixation = 0;
let counter = 0;
let k;
let confirmParaTest = false;

let testInstructionsArr = [
  `1. Contrary to popular belief, Lorem Ipsum is not simply random text.`,
  `2. It has roots in a piece of classical Latin literature from 45 BC.`,
  `3. The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested.`,
];

let testParagraph = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. t is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like). Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.`;
let lastSelectedIndex = 0;
let sessionActive = 0;

let fileName = "username";

let coordinates = new Array();
let csvOutput = new Array();
let keyPressed;
let totalScore = 0;
let paraTestStartTime = 0;

let promptDesc = [
  { name: "1", level: "G", target: "H", answer: "z", score: 0, reactTime: 0 },
  { name: "2", level: "L", target: "E", answer: "m", score: 0, reactTime: 0 },
  { name: "3", level: "L", target: "E", answer: "m", score: 0, reactTime: 0 },
  { name: "4", level: "L", target: "E", answer: "m", score: 0, reactTime: 0 },
  { name: "5", level: "G", target: "E", answer: "m", score: 0, reactTime: 0 },
  { name: "6", level: "G", target: "E", answer: "m", score: 0, reactTime: 0 },
  { name: "7", level: "G", target: "E", answer: "m", score: 0, reactTime: 0 },
  { name: "8", level: "G", target: "H", answer: "z", score: 0, reactTime: 0 },
  { name: "9", level: "G", target: "H", answer: "z", score: 0, reactTime: 0 },
  { name: "10", level: "L", target: "H", answer: "z", score: 0, reactTime: 0 },
  { name: "11", level: "L", target: "H", answer: "z", score: 0, reactTime: 0 },
  { name: "12", level: "L", target: "H", answer: "z", score: 0, reactTime: 0 },
];

const promptLog = promptDesc.slice();

let imgId = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
shuffleImgId();

// For outputs
let scoreCorrect = 0;
let scoreIncorrect = 0;
let avgRT = 0;
let avgGE = 0;
let avgLE = 0;
let avgGH = 0;
let avgLH = 0;
let avgL = 0;
let avgG = 0;
let readableOutput;

window.addEventListener("keypress", (e) => {
  switch (e.key) {
    case "z":
      if (showingFixation == 1 || sessionActive == 0) {
        break;
      } else {
        keyPressed = "z";
        logPrompt();
      }
      break;
    case "m":
      if (showingFixation == 1 || sessionActive == 0) {
        break;
      } else {
        keyPressed = "m";
        logPrompt();
      }
  }
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// step 1: show the fixation for x ms
async function fixation() {
  myImg.src = "./img/fixation.png";
  myImg.style.height = "420px";
  myImg.style.width = "420px";
  sessionActive = 1;

  document.getElementById("start").disabled = true;
  document.getElementById("log1").style.visibility = "hidden";
  document.getElementById("designedBy").style.visibility = "hidden";
  document.getElementById("navon").style.visibility = "hidden";
  showingFixation = 1; // system stops accepting input
  // console.log("Fixation starts:");
  await sleep(0);
  //   console.log("Fixation ends");
  showingFixation = 0; //system will  start accepting keyboard input
  showPrompt();
}

function launchParagraphTest() {
  document.getElementById("taskContainer1").style.visibility = "hidden";
  document.getElementById("log1").style.visibility = "hidden";
  document.getElementById("taskContainer2").style.visibility = "visible";
  document.getElementById("launchParagraphTest").style.visibility = "hidden";
  document.getElementById("exitParagraphTest").style.visibility = "visible";

  document.getElementById("paragraphDetailsId").innerHTML = testInstructionsArr
    .map((instruction, index) => {
      return `
            <div>
            <p>${instruction}</p>
            ${
              index === testInstructionsArr.length - 1
                ? `<button id="start" type=button onclick="startParagraphTest()"> Start Test</button>`
                : ``
            }
            </div>`;
    })
    .join("");
}

function getSelectedText() {
  let selection = window.getSelection();
  let start = selection.anchorOffset;
  let end = selection.focusOffset;
  if (lastSelectedIndex > 0) {
    let markedSubStr = testParagraph.substring(0, lastSelectedIndex);
    remainedStr = testParagraph.substring(
      lastSelectedIndex,
      testParagraph.length
    );
    if (
      selection.anchorNode.wholeText.includes(remainedStr) &&
      selection.focusNode.wholeText.includes(remainedStr) &&
      start === 0
    ) {
      lastSelectedIndex = markedSubStr.length + end;
    }
    if (
      markedSubStr &&
      selection.anchorNode.wholeText.includes(markedSubStr) &&
      selection.focusNode.wholeText.includes(remainedStr)
    ) {
      lastSelectedIndex = markedSubStr.length + end;
    }
  } else if (start === 0) {
    lastSelectedIndex = end;
  }
  updateDom();
}

function updateDom() {
  let markedSubStr = "";
  let remainedStr = testParagraph;

  markedSubStr = testParagraph.substring(0, lastSelectedIndex);
  remainedStr = testParagraph.substring(
    lastSelectedIndex,
    testParagraph.length
  );
  if (
    !remainedStr &&
    markedSubStr.length === testParagraph.length &&
    lastSelectedIndex === testParagraph.length
  ) {
    alert(`RESULT::: Time Taken - ${new Date() - paraTestStartTime} ms`);
  }

  document.getElementById(
    "paragraphDetailsId"
  ).innerHTML = `<p onmouseup="getSelectedText()"><mark>${markedSubStr}</mark>${remainedStr}</p>`;
}

function startParagraphTest() {
  paraTestStartTime = new Date();
  document.getElementById(
    "paragraphDetailsId"
  ).innerHTML = `<p onmouseup="getSelectedText()">${testParagraph}</p>`;
}

function exitParagraphTest() {
  document.getElementById("taskContainer1").style.visibility = "visible";
  document.getElementById("log1").style.visibility = "visible";
  document.getElementById("taskContainer2").style.visibility = "hidden";
  document.getElementById("launchParagraphTest").style.visibility = "visible";
  document.getElementById("exitParagraphTest").style.visibility = "hidden";
  confirmParaTest = false;
}

// step 2: prompt1 shows up; timer starts
function showPrompt() {
  sTime = Date.now();
  if (counter > 11) {
    taskOver();
  } else {
    myImg.src = "./img/" + imgId[counter] + ".png";
  }
}

// step 3: wait for the key press, as soon as it is pressed, log the reaction time
function logPrompt() {
  console.log(keyPressed);
  k = imgId[counter] - 1;
  if (counter > 11) {
    taskOver();
  } else {
    let diff = Date.now() - sTime;
    coordinates.push("(" + diff + "," + k + ")");
    // console.log("value of k"+k);
    //console.log("value of diff"+diff);
    promptLog[k].reactTime = diff;
    //console.log("Previous Reaction Time:"+promptLog[k].reactTime);
    if (promptLog[k].answer === keyPressed) {
      promptDesc[k].score = 1;
      totalScore += promptDesc[k].score;
    }
    // for logging value continuously
    //log1.innerHTML=coordinates;
    // this calls the next prompt after showing fixation for x
    counter++;
    fixation();
  }
}

function taskOver() {
  console.log("Thanks for participating");
  console.log("Total Score" + totalScore);
  console.log(promptLog);
  myImg.style.height = "220px";
  myImg.style.width = "720px";
  myImg.src = "./img/keyboard.png";
  sessionActive = 0;
  document.getElementById("copyText").style.visibility = "visible";
  document.getElementById("download").style.visibility = "visible";
  document.getElementById("designedBy").style.visibility = "visible";
  calOutput();
}

function shuffleImgId() {
  let newId = [];
  while (imgId.length !== 0) {
    let randomIndex = Math.floor(Math.random() * imgId.length);
    newId.push(imgId[randomIndex]);
    imgId.splice(randomIndex, 1);
  }
  imgId = newId;
}

function toDisplay() {
  for (let i = 0; i < 12; i++) {
    csvOutput.push(
      promptLog[i].name +
        "," +
        imgId[i] +
        "," +
        promptLog[i].level +
        "," +
        promptLog[i].target +
        "," +
        promptLog[i].answer +
        "," +
        promptLog[i].score +
        "," +
        promptLog[i].reactTime +
        ";"
    );
  }
}

function generateCSV() {
  toDisplay();
  let csv_data = csvOutput;
  downloadCSV(csv_data);
}

function downloadCSV(csv_data) {
  // Create CSV file object
  CSVFile = new Blob([csv_data], {
    type: "text/csv",
  });

  // Create to temporary link to initiate download process
  var temp_link = document.createElement("a");

  // Download csv file
  let t = moment().format("YYYY-MM-DD-HHmm-ss");
  temp_link.download = t + "-" + fileName + ".csv";
  var url = window.URL.createObjectURL(CSVFile);
  temp_link.href = url;

  // This link should not be displayed
  temp_link.style.display = "none";
  document.body.appendChild(temp_link);

  // Automatically click the link to trigger download
  temp_link.click();
  document.body.removeChild(temp_link);
}

function copyMyText(id) {
  var str = document.getElementById(id);
  window.getSelection().selectAllChildren(str);
  document.execCommand("Copy");
}

function calOutput() {
  for (let i = 0; i < 12; i++) {
    if (promptLog[i].score == 1) {
      scoreCorrect += promptDesc[i].score;
    }
    avgRT += promptDesc[i].reactTime;
    if (promptLog[i].level === "G" && promptLog[i].target === "E") {
      avgGE += promptDesc[i].reactTime;
    }
    if (promptLog[i].level === "G" && promptLog[i].target === "H") {
      avgGH += promptDesc[i].reactTime;
    }
    if (promptLog[i].level === "L" && promptLog[i].target === "E") {
      avgLE += promptDesc[i].reactTime;
    }
    if (promptLog[i].level === "L" && promptLog[i].target === "H") {
      avgLH += promptDesc[i].reactTime;
    }
    if (promptLog[i].level === "L") {
      avgL += promptDesc[i].reactTime;
    }
    if (promptLog[i].level === "G") {
      avgG += promptDesc[i].reactTime;
    }
  }
  scoreIncorrect = 12 - scoreCorrect;

  avgRT = Math.round(avgRT / 12, 0);
  avgL = Math.round(avgL / 6, 0);
  avgG = Math.round(avgG / 6, 0);
  avgGE = Math.round(avgGE / 3, 0);
  avgGH = Math.round(avgGH / 3, 0);
  avgLE = Math.round(avgLE / 3, 0);
  avgLH = Math.round(avgLH / 3, 0);

  console.log("Total Correct " + scoreCorrect);
  console.log("Incorrect " + scoreIncorrect);
  console.log("Average Reaction Time " + avgRT);
  console.log("Average Global Reaction Time " + avgG);
  console.log("Average Local Reaction Time " + avgL);
  console.log("Average Global E Reaction Time " + avgGE);
  console.log("Average Local E Reaction Time " + avgLE);
  console.log("Average Global H Reaction Time " + avgGH);
  console.log("Average Local H Reaction Time " + avgLH);

  readableOutput =
    "Total Correct: " +
    scoreCorrect +
    "," +
    "<br>" +
    "Incorrect " +
    scoreIncorrect +
    "," +
    "<br>" +
    "Average Reaction Time: " +
    avgRT +
    "," +
    "<br>" +
    "Average Global Reaction Time: " +
    avgG +
    "," +
    "<br>" +
    "Average Local Reaction Time: " +
    avgL +
    "," +
    "<br>" +
    "Average Global E Reaction Time: " +
    avgGE +
    "," +
    "<br>" +
    "Average Local E Reaction Time: " +
    avgLE +
    "," +
    "<br>" +
    "Average Global H Reaction Time: " +
    avgGH +
    "," +
    "<br>" +
    "Average Local H Reaction Time: " +
    avgLH;
  +"<br>";

  console.log(readableOutput);
  log2.innerHTML = readableOutput;
}

/*
  function preloadImage()
{
    var img=new Image();
    for(var z=1; z<13;z++){
        img.src="./img/"+z+".png"; 
    }
   
}
*/

function preloadImages(array) {
  if (!preloadImages.list) {
    preloadImages.list = [];
  }
  var list = preloadImages.list;
  for (var i = 0; i < array.length; i++) {
    var img = new Image();
    img.onload = function () {
      var index = list.indexOf(this);
      if (index !== -1) {
        list.splice(index, 1);
      }
    };
    list.push(img);
    img.src = array[i];
  }
}

preloadImages([
  "./img/1.png",
  "./img/2.png",
  "./img/3.png",
  "./img/4.png",
  "./img/5.png",
  "./img/6.png",
  "./img/7.png",
  "./img/8.png",
  "./img/9.png",
  "./img/10.png",
  "./img/11.png",
  "./img/12.png",
  "./img/fixation.png",
]);
