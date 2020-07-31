// Put your js code here

let sliderImages = document.querySelectorAll(".slide");
let arrowLeft = document.querySelector(".arrow-left");
let arrowRight = document.querySelector(".arrow-right");
let current = 0;

//clear all images
function reset() {
  for (let i = 0; i < sliderImages.length; i++) {
    sliderImages[i].style.display = "none";
  }
}

function startSlide() {
  reset();
  sliderImages[0].style.display = "block";
}

//show prev
function slideLeft() {
  reset();
  sliderImages[current - 1].style.display = "block";
  current--;
}

//show next
function slideRight() {
  reset();
  sliderImages[current + 1].style.display = "block";
  current++;
}

//Left arrow click
arrowLeft.addEventListener("click", function () {
  if (current === 0) {
    current = sliderImages.length;
  }
  slideLeft();
});

//Right arrow click
arrowRight.addEventListener("click", function () {
  if (current === sliderImages.length - 1) {
    current = -1;
  }
  slideRight();
});

startSlide();

//NavBar -Header- resizing
var prev = window.pageYOffset;
window.onscroll = function () {
  var curr = window.pageYOffset;
  var temp = document.getElementsByClassName("header-main");

  if (prev >= curr) {
    temp[0].style.top = "0";
  } else {
    temp[0].style.top = "-20px";
  }
  prev = curr;
  var introPosT = document.querySelector(".intro").getBoundingClientRect().top;
  var introPos = document.querySelector(".intro").getBoundingClientRect()
    .bottom;
  var chart1Pos = document.querySelector(".chart1").getBoundingClientRect()
    .bottom;
  var chart2Pos = document.querySelector(".chart2").getBoundingClientRect()
    .bottom;
  var chart3Pos = document.querySelector(".chart3").getBoundingClientRect()
    .bottom;

  if (introPosT < curr && curr < chart1Pos) {
    document.querySelector(".intro-a").style.color = "coral";
  } else {
    document.querySelector(".intro-a").style.color = "white";
  }

  if (chart1Pos < curr && curr < chart2Pos) {
    document.querySelector(".chart1-a").style.color = "coral";
  } else {
    document.querySelector(".chart1-a").style.color = "white";
  }

  if (chart2Pos < curr && curr < chart3Pos) {
    document.querySelector(".chart2-a").style.color = "coral";
  } else {
    document.querySelector(".chart2-a").style.color = "white";
  }

  if (chart3Pos < curr) {
    document.querySelector(".chart3-a").style.color = "coral";
  } else {
    document.querySelector(".chart3-a").style.color = "white";
  }
};
