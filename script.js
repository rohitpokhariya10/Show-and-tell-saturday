//step 1 ---> jo (elem)card open krna hai us par click karke uska full page open hojayega
function openFeatures() {
  let allElems = document.querySelectorAll(".elem");
  let fullElemPage = document.querySelectorAll(".fullElem")
  //console.log(allFullElems[3]);
  let fullElemPageBackBtn = document.querySelectorAll(".fullElem .back");




  //elem par click krne se us elem ka pura page khul jayega
  //jese todo vale pe click kra tuh todo vala page open hojayega
  allElems.forEach(function (elem, idx) {
    //forEach() islie krrsa isse har ek ekem miljayegza

    elem.addEventListener("click", function () {
      //elem = ek-ek HTML element
      //elem.id = us element ka id attribute ---> string formast me hoi 
      //jis page pe user hoga us page ki unique id bhi hogi usi id ko store kar rhe hai pageId ke andar
      //page reload hone par back na ho tabhi localStorage ka use karrge hai
      //Number---> taki elem.id contert hojaye number me
      let pageId = Number(elem.id);
      //elem.id ko index ki tarah use kar rahe hai
      //jis elem par click kenge uska full page open hojayega
      fullElemPage[pageId].style.display = "block";

      //  current page save
      //"activePage"-->key es namese localStorage me save hogi browser ke
      //pageId--->value hogi key ki jo localStorage me save hogi browser ke
      localStorage.setItem("activePage", pageId);
    });

  })
  //Jab poora page (HTML + CSS + JS) load ho jaaye, tab ye function chalega
  window.addEventListener("load", function () {
    let activePage = localStorage.getItem("activePage");
    //Agar activePage null hai, iska matlab hai ki abhi tak koi page save nahi tha
    //Agar null nahi hai, to matlab koi na koi page ID stored hai.
    if (activePage !== null) {
      document.querySelectorAll(".fullElem")[activePage].style.display = "block";
    }
  });



  fullElemPageBackBtn.forEach(function (back) {
    //console.log(back);
    back.addEventListener("click", function () {
     // e.stopPropagation(); 
      console.log("clicked");
      
      //nback button click krte hi vo page close hojayega
      fullElemPage[back.id].style.display = "none";
      //Browser ke localStorage se "activePage" naam ki entry delete kar dena
      //Yeh sirf ek specific key-value pair ko delete karta hai
      localStorage.removeItem("activePage");
    });

  })

}
openFeatures()


//todo List page
function todoList() {

  //initially koi task nhi hoga
  var currentTask = []

  //jab page load ho tab check kro ki localStorage me phele se koi  task hai ya nhi
  //agr task phele se hai tuh localStorage se task nikalke(parse) karke currentTask vale array me dalrhehai
  //localStorage --->se data string format me milta hai 
  //hum us string ko array of object me convert krte hai by using JSON.parse
  if (localStorage.getItem('currentTask')) {
    //.parse-->string to array of object me convert

    currentTask = JSON.parse(localStorage.getItem('currentTask'))
  }
  else {
    console.log("Task is empty");

  }


  //tasks ko ui me dikhana
  function renderTask() {
    let allTask = document.querySelector(".allTask");
    let sum = "";

    currentTask.forEach(function (elem, idx) {
      console.log(elem, idx);

      sum += `
    <div class="task">
      <h5>
        ${elem.task}
        ${elem.imp ? '<span >IMP</span>' : ''}
      </h5>

      <p class="task-details">${elem.details}</p>
    
   
      <div class="todolist-btns">
         <button id=${idx} class="Completed-btn">Mark as Completed</button>

      </div>
    </div>
  `
      // ek hi baar DOM update

    });
    allTask.innerHTML = sum;
    attachCompletedEvents()
  }
  renderTask();



  //step2 ---> create full todo page
  let form = document.querySelector(".addTask form");
  let taskInput = document.querySelector('.addTask form #task-input')
  let taskDetailsInput = document.querySelector('.addTask form textarea')
  let taskCheckbox = document.querySelector('.addTask form #check')


  form.addEventListener("submit", function (e) {
    // form ke submit hone ke baad page reload nhi hoga
    e.preventDefault();
    // console.log(form);
    // console.log(currentTask);
    // console.log("Input Task details =", taskInput.value, taskDetailsInput.value , taskCheckbox.checked);

    //.value se value bhi miljayegi input and textarea ki
    // console.log(taskInput.value , taskDetailsInput.value);
    //.checked-->se chekbox me tick krenge tuh true milega vrna false
    // console.log(taskCheckbox.checked);


    currentTask.push(
      {
        task: taskInput.value,
        details: taskDetailsInput.value,
        imp: taskCheckbox.checked

      }
    )
    //UI me form me input fields khali hojayengi sumbit hone ke baad
    taskInput.value = "";
    taskDetailsInput.value = "";
    taskCheckbox.checked = "";

    // essse localStorage me task store hojayega--->application me jake dekh sakta hai
    //localStorage me task store in string format--. because localStprage store data only in string format
    localStorage.setItem('currentTask', JSON.stringify(currentTask))
    //console.log(currentTask);
    //renderTask function ko call taki task UI me dikh sake submit hone ke baad
    renderTask();

  })


  //ye function gpt ki help se bnaya
  function attachCompletedEvents() {
    let completedBtn = document.querySelectorAll(".task .Completed-btn");
    //console.log(completedBtn);

    completedBtn.forEach(function (btn) {
      //console.log("hello");
      btn.addEventListener("click", function () {
        //console.log(btn.id);
        //button delete isse hoga 
        currentTask.splice(btn.id, 1);

        // localstorage me  task update karre hai delete hone ke  baad vo task localstorage se bhi delte hojayega ui me nhi dikhega
        localStorage.setItem('currentTask', JSON.stringify(currentTask));



        //console.log("clicked", btn.id);
        //console.log(completedBtn);

        renderTask();   //ui ko rerender kro
      })
    })
  }

}
todoList()


//Daily Planner page
function dailyPlanner() {


  //Daily Planner
  let dayPlanner = document.querySelector(".daily-planner");

  //|| {} ka matlab ye hota hai: Agar left side wali value null ya undefined (ya koi falsy value) ho,
  //to right side ka {} use kar lo.
  let dayPlanDta = JSON.parse(localStorage.getItem("dayPlanData")) || {};
  console.log(dayPlanDta);
  //ye ache se   samajna---->
  let hours = Array.from({ length: 18 }, function (_, idx) {
    // console.log(idx);
    //ye return krung tabhi niche forEach() se dynamically dalung
    return (`${6 + idx}:00 - ${7 + idx}:00`)
  });

  let sum = ''
  hours.forEach(function (elem, idx) {
    //console.log(elem);
    let savedData = dayPlanDta[idx] || "";
    // console.log(savedData);

    sum += `
        <div class="daily-planner-time">
        <p>${elem}</p>
        <input id=${idx} type="text" placeholder="" value="${savedData}">
       </div>
   
            `
    //console.log(sum);         
  })
  dayPlanner.innerHTML = sum;


  let dayPlannerInput = document.querySelectorAll(".daily-planner input");

  //console.log(dayPlannerInput);
  dayPlannerInput.forEach(function (elem, id) {
    // console.log(elem,id);
    elem.addEventListener("input", function () {
      //console.log(elem.value, id);
      //isse pata chal jayega ki kis input me kya likh rahe hai and dayPlanData object me save bhi hojayega data
      dayPlanDta[elem.id] = elem.value;
      console.log(dayPlanDta);
      //isse browser ke localStorage me data string ke form me save hojayega-->temorarly string bnadete hai
      localStorage.setItem('dayPlanData', JSON.stringify(dayPlanDta));
    })
  })

}
dailyPlanner()


//Motivation Page Start
function motivationPage() {
  
  let motivationQuote = document.querySelector(".motivation-2 h1");
  let motivationAuthor = document.querySelector(".motivation-3 h2");
  async function fetchQuote() {
    let response = await fetch("https://motivational-spark-api.vercel.app/api/quotes/random");

    let data = await response.json();
    // console.log(data);//ye hai readable data
    //console.log(data.content);
    motivationQuote.innerHTML = data.quote;
    //console.log(data.author);
    motivationAuthor.innerHTML = data.author;

  }
  fetchQuote()
}
motivationPage();







//Pomodoro Page
function pomodoroPage() {

  let timer = document.querySelector(".pomo-timer h1");

  const WORK_TIME = 25 * 60;
  const BREAK_TIME = 5 * 60;

  let totalSeconds = WORK_TIME;
  let workMode = true; // true = work, false = break
  let timeInterval = null;

  function updateTimer() {
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;

    if (seconds < 10) seconds = "0" + seconds;
    if (minutes < 10) minutes = "0" + minutes;

    timer.innerHTML = `${minutes}:${seconds}`;
  }

  function startTimer() {

    // 🛑 agar timer already chal raha hai → kuch mat karo
    if (timeInterval) return;

    // 🔄 agar timer 00 pe hai → mode change
    if (totalSeconds === 0) {
      if (workMode) {
        document.querySelector(".session").innerHTML="Take a Break"
        document.querySelector(".session").style.background="rgba(72, 201, 195, 0.78)"
         document.querySelector(".session").style.color="#f1e2c6"
        workMode = false;
        totalSeconds = BREAK_TIME;
        
        
      } else {
         document.querySelector(".session").innerHTML="Work Session"
         document.querySelector(".session").style.color="var(--pri)"
      
        document.querySelector(".session").style.background="linear-gradient(135deg, #F6C453, #E9A93A)"
 
        workMode = true;
        totalSeconds = WORK_TIME;
      }
      updateTimer();
    }

    // ▶ timer start
    timeInterval = setInterval(() => {
      totalSeconds--;
      updateTimer();

      if (totalSeconds <= 0) {
        clearInterval(timeInterval);
        timeInterval = null; // very important
        totalSeconds = 0;
        updateTimer();
      }
    }, 1000);
  }

  function pauseTimer() {
    clearInterval(timeInterval);
    timeInterval = null; //  allow resume
  }

  function resetTimer() {
    clearInterval(timeInterval);
    timeInterval = null;
    workMode = true;
    totalSeconds = WORK_TIME;
    updateTimer();
  }

  document.querySelector(".start-timer").addEventListener("click", startTimer);
  document.querySelector(".pause-timer").addEventListener("click", pauseTimer);
  document.querySelector(".reset-timer").addEventListener("click", resetTimer);

  updateTimer();
}
pomodoroPage();


// Landing Page
function landingPage(){
  
let header1Time = document.querySelector(".header1 h1");
let header1Date = document.querySelector(".header1 h2");
let data = null;

// WEATHER API CALL
async function weatherApiCall(city) {
  let API_KEY = "0a172f23ce3e145a09193225b2cadca7";

  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;

  let response = await fetch(url);
  data = await response.json();

  console.log(data); // check weather data
  document.querySelector(".header2 h2").innerHTML = `🌡${data.main.temp}°C`
  document.querySelector(".header2 h4").innerHTML = `💧${data.main.humidity}%`
  const windSpeedKmh = (data.wind.speed * 3.6).toFixed(1);

  document.querySelector(".header2 h3").innerHTML = `🌬 ${windSpeedKmh}km/h`

}

// CALL
weatherApiCall("Dehradun");

function dayTime() {
  const daysOfWeek = [
    "Sunday", "Monday", "Tuesday",
    "Wednesday", "Thursday", "Friday", "Saturday"
  ];
  
  const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];


  let date = new Date();
  let day = daysOfWeek[date.getDay()];

  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();
  let datee = date.getDate();
  let month = date.getMonth();
  let year = date.getFullYear();


  let ampm = "AM";

  if (hours >= 12) {
    ampm = "PM";
    if (hours > 12) hours -= 12;
  }

  // 2-digit format
  if (minutes < 10) minutes = "0" + minutes;
  if (seconds < 10) seconds = "0" + seconds;

  header1Time.innerHTML = `${day}, ${hours}:${minutes}:${seconds} ${ampm}`;
  header1Date.innerHTML=`${datee} ${months[month]} ${year}`
}

// CALL
setInterval(() => {
  dayTime();
},1000);

}
landingPage()


//Theme change on click & save into localStorage
function themeChange(){
 //button ko select kara -->Hey JS, mujhe wo button de do jiska class .theme hai
let themeBtn = document.querySelector(".theme");
//root variable ko select kara
let root = document.documentElement;


//(key,value)--->in localStorage in application
//agar theme-key nhi hai localStorage me tuh null hai value
let isDark = localStorage.getItem("theme-key") === "dark";
//yehi reload hone ke baad localStorage me se savee theme apply krega
//kyunki ye direct dekhkega theme dark true hai ya false us basis me applyTheme() ko call kardega
applyTheme();

themeBtn.addEventListener("click", () => {
  //Simple toggle : Dark → Light → Dark → Light
  isDark = !isDark;
  if (isDark) {
  localStorage.setItem("theme-key", "dark");
} else {
  localStorage.setItem("theme-key", "light");
}

  applyTheme();
});

function applyTheme() {
  //agr isDark variable true hai tuh
  if (isDark) {
    root.style.setProperty("--pri", "#EAE0CF");
    root.style.setProperty("--sec", "#213448");
    root.style.setProperty("--tri1", "#547792");
    root.style.setProperty("--tri2", "#94B4C1");
    root.style.setProperty("--nav-bg", "rgba(33, 52, 72, 0.75)");
    root.style.setProperty("--body-bg", "#0f172a");
    root.style.setProperty("--header-bg1", 'url("panda.jpg")');
  } else {
    // iDark variable is false
    root.style.setProperty("--pri", "#F8F4E1");
    root.style.setProperty("--sec", "#381c0a");
    root.style.setProperty("--tri1", "#FEBA17");
    root.style.setProperty("--tri2", "#74512D");
    root.style.setProperty("--nav-bg", "rgba(122, 90, 58, 0.75)");
    root.style.setProperty("--body-bg", "#F5EEDC");
    root.style.setProperty("--header-bg1", 'url("dark.jpg")');
  }
}

}
themeChange()