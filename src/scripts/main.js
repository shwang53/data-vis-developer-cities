// Put your js code here

function myFunction() {
  var x = document.getElementsByClassName("cont");
  x[0].style.backgroundColor = "red";
}

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

async function top10Chart() {
  const data = await d3.csv("/src/data/devpop.csv");
  const margin = 150;
  const height = 600;
  const width = 1000;
  const xScale = d3
    .scaleBand()
    .domain(data.map((d) => d.state))
    .range([0, width])
    .padding(0.2);
  const yScale = d3.scaleLinear().domain([0, 628414]).range([height, 0]);
  const chart = d3
    .select(".chart1-svg")
    .append("g")
    .attr("transform", `translate(${margin}, ${margin})`);
  //x axis
  d3.select(".chart1-svg")
    .append("g")
    .attr("transform", "translate(" + margin + "," + margin + ")")
    .call(d3.axisLeft(yScale))
    .selectAll("text")
    .style("text-anchor", "end")
    .style("font-size", 23);
  //y axis
  d3.select(".chart1-svg")
    .append("g")
    .attr("transform", "translate(" + margin + "," + (height + margin) + ")")
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .attr("transform", "translate(-10,10)rotate(-45)")
    .style("text-anchor", "end")
    .style("font-size", 23);

  var svg = d3
    .select(".chart1-svg")
    .attr("width", width + 2 * margin)
    .attr("height", height + 2 * margin)
    .append("g")
    .attr("transform", "translate(" + margin + "," + margin + ")");

  const svgGroups = chart.selectAll().data(data).enter().append("g");

  //x,y labels
  svg
    .append("text")
    .attr("text-anchor", "end")
    .attr("x", 500)
    .attr("y", height + 80)
    .text("States")
    .style("font-size", 23);

  svg
    .append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("x", -200)
    .attr("y", -120)
    .text("Number of Developers")
    .style("font-size", 23);

  //Added grid for fancy
  svg
    .append("g")
    .attr("class", "grid")
    .call(d3.axisLeft().scale(yScale).tickSize(-width, 0, 0).tickFormat(""));

  //ANNOTATIONS
  function drawAnnotation() {
    var annotation = svg.append("g");
    annotation
      .append("text")
      .attr("x", 110)
      .attr("y", 20)
      .attr("class", "annotation")
      .classed("annotation", true)
      .text("<- The highest population of developers in CALIFORNIA !");
  }

  const drawTop10Chart = () => {
    svgGroups
      .append("rect")
      .attr("x", function (d, i) {
        return xScale(d.state);
      })
      .attr("y", function (d) {
        return yScale(d.dev_pop);
      })
      .attr("width", xScale.bandwidth())
      .attr("height", function (d) {
        return height - yScale(d.dev_pop);
      })
      .on("mouseenter", function (actual, i) {
        d3.selectAll(".dev_pop").attr("opacity", 0);

        d3.select(this)
          .transition()
          .duration(300)
          .attr("opacity", 0.6)
          .attr("x", (d) => xScale(d.state) - 5)
          .attr("width", xScale.bandwidth() + 10);

        const y = yScale(actual.dev_pop);

        line = chart
          .append("line")
          .attr("id", "limit")
          .attr("x1", 0)
          .attr("y1", y)
          .attr("x2", width)
          .attr("y2", y);

        svgGroups
          .append("text")
          .attr("class", "divergence")
          .attr("x", (d) => xScale(d.state) + xScale.bandwidth() / 2)
          .attr("y", (d) => yScale(d.dev_pop) + 30)
          .attr("fill", "rgb(0, 0, 153)")
          .attr("text-anchor", "middle")
          .text((d, idx) => {
            const divergence = (d.dev_pop - actual.dev_pop).toFixed(1);

            let text = "";
            if (divergence > 0) text += "+";
            text += `${divergence}`;

            return idx !== i ? text : "";
          });
      })
      .on("mouseleave", function () {
        d3.selectAll(".dev_pop").attr("opacity", 1);

        d3.select(this)
          .transition()
          .duration(300)
          .attr("opacity", 1)
          .attr("x", (d) => xScale(d.state))
          .attr("width", xScale.bandwidth());

        chart.selectAll("#limit").remove();
        chart.selectAll(".divergence").remove();
      });

    svgGroups
      .append("text")
      .attr("class", "dev_pop")
      .attr("x", (a) => xScale(a.state) + xScale.bandwidth() / 2)
      .attr("y", (a) => yScale(a.dev_pop) + 30)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .text((a) => `${a.dev_pop}`);
  };

  drawTop10Chart();
  drawAnnotation();
  // var legend = svg.append("g");
  // legend.append("text").attr("x", 10).attr("y", -70).text("Top 10");
  // legend.append("text").attr("x", 210).attr("y", -70).text("Top 3");
}

async function top3Chart() {
  const data = await d3.csv("/src/data/devpop.csv");
  const margin = 150;
  const height = 600;
  const width = 1000;
  const xScale = d3
    .scaleBand()
    .domain(data.map((d) => d.state))
    .range([0, width])
    .padding(0.2);
  const yScale = d3.scaleLinear().domain([0, 628414]).range([height, 0]);
  const chart = d3
    .select(".top3-chart1-svg")
    .append("g")
    .attr("transform", `translate(${margin}, ${margin})`);
  //x axis
  d3.select(".top3-chart1-svg")
    .append("g")
    .attr("transform", "translate(" + margin + "," + margin + ")")
    .call(d3.axisLeft(yScale))
    .selectAll("text")
    .style("text-anchor", "end")
    .style("font-size", 23);
  //y axis
  d3.select(".top3-chart1-svg")
    .append("g")
    .attr("transform", "translate(" + margin + "," + (height + margin) + ")")
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .attr("transform", "translate(-10,10)rotate(-45)")
    .style("text-anchor", "end")
    .style("font-size", 23);

  var svg = d3
    .select(".top3-chart1-svg")
    .attr("width", width + 2 * margin)
    .attr("height", height + 2 * margin)
    .append("g")
    .attr("transform", "translate(" + margin + "," + margin + ")");

  const svgGroups = chart.selectAll().data(data).enter().append("g");

  //x,y labels
  svg
    .append("text")
    .attr("text-anchor", "end")
    .attr("x", 500)
    .attr("y", height + 80)
    .text("States")
    .style("font-size", 23);

  svg
    .append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("x", -200)
    .attr("y", -120)
    .text("Number of Developers")
    .style("font-size", 23);

  //Added grid for fancy
  svg
    .append("g")
    .attr("class", "grid")
    .call(d3.axisLeft().scale(yScale).tickSize(-width, 0, 0).tickFormat(""));

  //ANNOTATIONS
  function drawAnnotation() {
    var annotation = svg.append("g");
    annotation
      .append("text")
      .attr("x", 110)
      .attr("y", 20)
      .attr("class", "annotation")
      .classed("annotation", true)
      .text("<- The highest population of developers in CALIFORNIA !");
  }

  const drawTop3Chart = () => {
    svgGroups
      .append("rect")
      .attr("x", function (d, i) {
        return xScale(d.state);
      })
      .attr("y", function (d) {
        return yScale(d.top3_dev_pop);
      })
      .attr("width", xScale.bandwidth())
      .attr("height", function (d) {
        return height - yScale(d.top3_dev_pop);
      })
      .on("mouseenter", function (actual, i) {
        d3.selectAll(".dev_pop").attr("opacity", 0);

        d3.select(this)
          .transition()
          .duration(300)
          .attr("opacity", 0.6)
          .attr("x", (d) => xScale(d.state) - 5)
          .attr("width", xScale.bandwidth() + 10);

        const y = yScale(actual.top3_dev_pop);

        line = chart
          .append("line")
          .attr("id", "limit")
          .attr("x1", 0)
          .attr("y1", y)
          .attr("x2", width)
          .attr("y2", y);

        svgGroups
          .append("text")
          .attr("class", "divergence")
          .attr("x", (d) => xScale(d.state) + xScale.bandwidth() / 2)
          .attr("y", (d) => yScale(d.top3_dev_pop) + 30)
          .attr("fill", "rgb(0, 0, 153)")
          .attr("text-anchor", "middle")
          .text((d, idx) => {
            let text = "";
            if (d.top3_dev_pop != 0) {
              const divergence = d.top3_dev_pop - actual.top3_dev_pop;

              if (divergence > 0) text += "+";
              text += `${divergence}`;

              return idx !== i ? text : "";
            }
            return text;
          });
      })
      .on("mouseleave", function () {
        d3.selectAll(".dev_pop").attr("opacity", 1);

        d3.select(this)
          .transition()
          .duration(300)
          .attr("opacity", 1)
          .attr("x", (d) => xScale(d.state))
          .attr("width", xScale.bandwidth());

        chart.selectAll("#limit").remove();
        chart.selectAll(".divergence").remove();
      });

    svgGroups
      .append("text")
      .attr("class", "dev_pop")
      .attr("x", (a) => xScale(a.state) + xScale.bandwidth() / 2)
      .attr("y", (a) => yScale(a.top3_dev_pop) + 30)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .text((a) => `${a.top3_dev_pop}`);
  };

  drawTop3Chart();
  drawAnnotation();
  // var legend = svg.append("g");
  // legend.append("text").attr("x", 10).attr("y", -70).text("Top 10");
  // legend.append("text").attr("x", 210).attr("y", -70).text("Top 3");
}

function chart1_top10() {
  demo13.style.display = "none";
  demo110.style.display = "none";
  demo110.style.display = "block";
  top10Chart();
}
function chart1_top3() {
  demo110.style.display = "none";
  demo13.style.display = "none";
  demo13.style.display = "block";
  top3Chart();
}

async function top10Chart2() {
  const data = await d3.csv("/src/data/devpop.csv");
  const margin = 150;
  const height = 600;
  const width = 1000;
  const xScale = d3
    .scaleBand()
    .domain(data.map((d) => d.state))
    .range([0, width])
    .padding(0.2);
  const yScale = d3.scaleLinear().domain([0, 131790]).range([height, 0]);
  const chart = d3
    .select(".chart2-svg")
    .append("g")
    .attr("transform", `translate(${margin}, ${margin})`);

  d3.select(".chart2-svg")
    .append("g")
    .attr("transform", "translate(" + margin + "," + margin + ")")
    .call(d3.axisLeft(yScale))
    .selectAll("text")
    .style("text-anchor", "end")
    .style("font-size", 23);

  d3.select(".chart2-svg")
    .append("g")
    .attr("transform", "translate(" + margin + "," + (height + margin) + ")")
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .attr("transform", "translate(-10,10)rotate(-45)")
    .style("text-anchor", "end")
    .style("font-size", 23);

  var svg = d3
    .select(".chart2-svg")
    .attr("width", width + 2 * margin)
    .attr("height", height + 2 * margin)
    .append("g")
    .attr("transform", "translate(" + margin + "," + margin + ")");

  svg
    .append("text")
    .attr("text-anchor", "end")
    .attr("x", 500)
    .attr("y", height + 80)
    .text("States")
    .style("font-size", 23);

  svg
    .append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("x", -200)
    .attr("y", -120)
    .text("Annual Average Salary ($)")
    .style("font-size", 23);

  svg
    .append("g")
    .attr("class", "grid")
    .call(d3.axisLeft().scale(yScale).tickSize(-width, 0, 0).tickFormat(""));

  const svgGroups = chart.selectAll().data(data).enter().append("g");

  function drawTop10Chart() {
    svgGroups
      .append("rect")
      .attr("x", function (d, i) {
        return xScale(d.state);
      })
      .attr("y", function (d) {
        return yScale(d.salary);
      })
      .attr("width", xScale.bandwidth())
      .attr("height", function (d) {
        return height - yScale(d.salary);
      })
      .on("mouseenter", function (actual, i) {
        d3.selectAll(".salary").attr("opacity", 0);

        d3.select(this)
          .transition()
          .duration(300)
          .attr("opacity", 0.6)
          .attr("x", (d) => xScale(d.state) - 5)
          .attr("width", xScale.bandwidth() + 10);

        const y = yScale(actual.salary);

        line = chart
          .append("line")
          .attr("id", "limit")
          .attr("x1", 0)
          .attr("y1", y)
          .attr("x2", width)
          .attr("y2", y);

        svgGroups
          .append("text")
          .attr("class", "divergence")
          .attr("x", (d) => xScale(d.state) + xScale.bandwidth() / 2)
          .attr("y", (d) => yScale(d.salary) + 30)
          .attr("fill", "red")
          .attr("text-anchor", "middle")
          .text((d, idx) => {
            const divergence = (d.salary - actual.salary).toFixed(1);

            let text = "";
            if (divergence > 0) text += "+";
            text += `$${divergence}`;

            return idx !== i ? text : "";
          });
      })
      .on("mouseleave", function () {
        d3.selectAll(".salary").attr("opacity", 1);

        d3.select(this)
          .transition()
          .duration(300)
          .attr("opacity", 1)
          .attr("x", (d) => xScale(d.state))
          .attr("width", xScale.bandwidth());

        chart.selectAll("#limit").remove();
        chart.selectAll(".divergence").remove();
      });

    svgGroups
      .append("text")
      .attr("class", "salary")
      .attr("x", (a) => xScale(a.state) + xScale.bandwidth() / 2)
      .attr("y", (a) => yScale(a.salary) + 30)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .text((a) => `$${a.salary}`);
  }

  function drawAnnotation() {
    var annotation = svg.append("g");
    annotation
      .append("text")
      .attr("x", 430)
      .attr("y", 20)
      .attr("class", "annotation")
      .classed("annotation", true)
      .text("The highest salary of developers in WASHINGTON ! ->");
  }

  drawAnnotation();
  drawTop10Chart();
}

async function top3Chart2() {
  const data = await d3.csv("/src/data/devpop.csv");
  const margin = 150;
  const height = 600;
  const width = 1000;
  const xScale = d3
    .scaleBand()
    .domain(data.map((d) => d.state))
    .range([0, width])
    .padding(0.2);
  const yScale = d3.scaleLinear().domain([0, 131790]).range([height, 0]);
  const chart = d3
    .select(".top3-chart2-svg")
    .append("g")
    .attr("transform", `translate(${margin}, ${margin})`);

  d3.select(".top3-chart2-svg")
    .append("g")
    .attr("transform", "translate(" + margin + "," + margin + ")")
    .call(d3.axisLeft(yScale))
    .selectAll("text")
    .style("text-anchor", "end")
    .style("font-size", 23);

  d3.select(".top3-chart2-svg")
    .append("g")
    .attr("transform", "translate(" + margin + "," + (height + margin) + ")")
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .attr("transform", "translate(-10,10)rotate(-45)")
    .style("text-anchor", "end")
    .style("font-size", 23);

  var svg = d3
    .select(".top3-chart2-svg")
    .attr("width", width + 2 * margin)
    .attr("height", height + 2 * margin)
    .append("g")
    .attr("transform", "translate(" + margin + "," + margin + ")");

  svg
    .append("text")
    .attr("text-anchor", "end")
    .attr("x", 500)
    .attr("y", height + 80)
    .text("States")
    .style("font-size", 23);

  svg
    .append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("x", -200)
    .attr("y", -120)
    .text("Annual Average Salary ($)")
    .style("font-size", 23);

  svg
    .append("g")
    .attr("class", "grid")
    .call(d3.axisLeft().scale(yScale).tickSize(-width, 0, 0).tickFormat(""));

  const svgGroups = chart.selectAll().data(data).enter().append("g");

  function drawTop3Chart() {
    svgGroups
      .append("rect")
      .attr("x", function (d, i) {
        return xScale(d.state);
      })
      .attr("y", function (d) {
        return yScale(d.top3_salary);
      })
      .attr("width", xScale.bandwidth())
      .attr("height", function (d) {
        return height - yScale(d.top3_salary);
      })
      .on("mouseenter", function (actual, i) {
        d3.selectAll(".top3_salary").attr("opacity", 0);

        d3.select(this)
          .transition()
          .duration(300)
          .attr("opacity", 0.6)
          .attr("x", (d) => xScale(d.state) - 5)
          .attr("width", xScale.bandwidth() + 10);

        const y = yScale(actual.top3_salary);

        line = chart
          .append("line")
          .attr("id", "limit")
          .attr("x1", 0)
          .attr("y1", y)
          .attr("x2", width)
          .attr("y2", y);

        svgGroups
          .append("text")
          .attr("class", "divergence")
          .attr("x", (d) => xScale(d.state) + xScale.bandwidth() / 2)
          .attr("y", (d) => yScale(d.top3_salary) + 30)
          .attr("fill", "red")
          .attr("text-anchor", "middle")
          .text((d, idx) => {
            let text = "";
            if (d.top3_dev_pop != 0) {
              const divergence = d.top3_dev_pop - actual.top3_dev_pop;

              if (divergence > 0) text += "+";
              text += `${divergence}`;

              return idx !== i ? text : "";
            }
            return text;
          });
      })
      .on("mouseleave", function () {
        d3.selectAll(".top3_salary").attr("opacity", 1);

        d3.select(this)
          .transition()
          .duration(300)
          .attr("opacity", 1)
          .attr("x", (d) => xScale(d.state))
          .attr("width", xScale.bandwidth());

        chart.selectAll("#limit").remove();
        chart.selectAll(".divergence").remove();
      });

    svgGroups
      .append("text")
      .attr("class", "top3_salary")
      .attr("x", (a) => xScale(a.state) + xScale.bandwidth() / 2)
      .attr("y", (a) => yScale(a.top3_salary) + 30)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .text((a) => `$${a.top3_salary}`);
  }

  function drawAnnotation() {
    var annotation = svg.append("g");
    annotation
      .append("text")
      .attr("x", 430)
      .attr("y", 20)
      .attr("class", "annotation")
      .classed("annotation", true)
      .text("The highest salary of developers in WASHINGTON ! ->");
  }

  drawAnnotation();
  drawTop3Chart();
}

function chart2_top10() {
  demo23.style.display = "none";
  demo210.style.display = "none";
  demo210.style.display = "block";
  top10Chart2();
}
function chart2_top3() {
  demo210.style.display = "none";
  demo23.style.display = "none";
  demo23.style.display = "block";
  top3Chart2();
}

async function top10Chart3() {
  const data = await d3.csv("/src/data/devpop.csv");
  const margin = 150;
  const height = 600;
  const width = 1000;
  const xScale = d3
    .scaleBand()
    .domain(data.map((d) => d.state))
    .range([0, width])
    .padding(0.2);
  const yScale = d3.scaleLinear().domain([0, 151.7]).range([height, 0]);
  const chart = d3
    .select(".chart3-svg")
    .append("g")
    .attr("transform", `translate(${margin}, ${margin})`);

  d3.select(".chart3-svg")
    .append("g")
    .attr("transform", "translate(" + margin + "," + margin + ")")
    .call(d3.axisLeft(yScale))
    .selectAll("text")
    .style("text-anchor", "end")
    .style("font-size", 23);

  d3.select(".chart3-svg")
    .append("g")
    .attr("transform", "translate(" + margin + "," + (height + margin) + ")")
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .attr("transform", "translate(-10,10)rotate(-45)")
    .style("text-anchor", "end")
    .style("font-size", 23);

  var svg = d3
    .select(".chart3-svg")
    .attr("width", width + 2 * margin)
    .attr("height", height + 2 * margin)
    .append("g")
    .attr("transform", "translate(" + margin + "," + margin + ")");

  const svgGroups = chart.selectAll().data(data).enter().append("g");

  svg
    .append("text")
    .attr("text-anchor", "end")
    .attr("x", 500)
    .attr("y", height + 80)
    .text("States")
    .style("font-size", 23);

  svg
    .append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("x", -200)
    .attr("y", -60)
    .text("Cost of Living Index")
    .style("font-size", 23);

  svg
    .append("g")
    .attr("class", "grid")
    .call(d3.axisLeft().scale(yScale).tickSize(-width, 0, 0).tickFormat(""));

  function drawTop10Chart() {
    svgGroups
      .append("rect")
      .attr("x", function (d, i) {
        return xScale(d.state);
      })
      .attr("y", function (d) {
        return yScale(d.cost_of_living_index);
      })
      .attr("width", xScale.bandwidth())
      .attr("height", function (d) {
        return height - yScale(d.cost_of_living_index);
      })
      .on("mouseenter", function (actual, i) {
        d3.selectAll(".cost_of_living_index").attr("opacity", 0);

        d3.select(this)
          .transition()
          .duration(300)
          .attr("opacity", 0.6)
          .attr("x", (d) => xScale(d.state) - 5)
          .attr("width", xScale.bandwidth() + 10);

        const y = yScale(actual.cost_of_living_index);

        line = chart
          .append("line")
          .attr("id", "limit")
          .attr("x1", 0)
          .attr("y1", y)
          .attr("x2", width)
          .attr("y2", y);

        svgGroups
          .append("text")
          .attr("class", "divergence")
          .attr("x", (d) => xScale(d.state) + xScale.bandwidth() / 2)
          .attr("y", (d) => yScale(d.cost_of_living_index) + 30)
          .attr("fill", "red")
          .attr("text-anchor", "middle")
          .text((d, idx) => {
            const divergence = (
              d.cost_of_living_index - actual.cost_of_living_index
            ).toFixed(1);

            let text = "";
            if (divergence > 0) text += "+";
            text += `${divergence}`;

            return idx !== i ? text : "";
          });
      })
      .on("mouseleave", function () {
        d3.selectAll(".cost_of_living_index").attr("opacity", 1);

        d3.select(this)
          .transition()
          .duration(300)
          .attr("opacity", 1)
          .attr("x", (d) => xScale(d.state))
          .attr("width", xScale.bandwidth());

        chart.selectAll("#limit").remove();
        chart.selectAll(".divergence").remove();
      });

    svgGroups
      .append("text")
      .attr("class", "cost_of_living_index")
      .attr("x", (a) => xScale(a.state) + xScale.bandwidth() / 2)
      .attr("y", (a) => yScale(a.cost_of_living_index) + 30)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .text((a) => `${a.cost_of_living_index}`);
  }

  function drawAnnotation() {
    var annotation = svg.append("g");
    annotation
      .append("text")
      .attr("x", 110)
      .attr("y", 20)
      .attr("class", "annotation")
      .classed("annotation", true)
      .text("<- The highest cost of living index in CALIFORNIA again !");
  }

  drawAnnotation();
  drawTop10Chart();
}

async function top3Chart3() {
  const data = await d3.csv("/src/data/devpop.csv");
  const margin = 150;
  const height = 600;
  const width = 1000;
  const xScale = d3
    .scaleBand()
    .domain(data.map((d) => d.state))
    .range([0, width])
    .padding(0.2);
  const yScale = d3.scaleLinear().domain([0, 151.7]).range([height, 0]);
  const chart = d3
    .select(".top3-chart3-svg")
    .append("g")
    .attr("transform", `translate(${margin}, ${margin})`);

  d3.select(".top3-chart3-svg")
    .append("g")
    .attr("transform", "translate(" + margin + "," + margin + ")")
    .call(d3.axisLeft(yScale))
    .selectAll("text")
    .style("text-anchor", "end")
    .style("font-size", 23);

  d3.select(".top3-chart3-svg")
    .append("g")
    .attr("transform", "translate(" + margin + "," + (height + margin) + ")")
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .attr("transform", "translate(-10,10)rotate(-45)")
    .style("text-anchor", "end")
    .style("font-size", 23);

  var svg = d3
    .select(".top3-chart3-svg")
    .attr("width", width + 2 * margin)
    .attr("height", height + 2 * margin)
    .append("g")
    .attr("transform", "translate(" + margin + "," + margin + ")");

  const svgGroups = chart.selectAll().data(data).enter().append("g");

  svg
    .append("text")
    .attr("text-anchor", "end")
    .attr("x", 500)
    .attr("y", height + 80)
    .text("States")
    .style("font-size", 23);

  svg
    .append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("x", -200)
    .attr("y", -60)
    .text("Cost of Living Index")
    .style("font-size", 23);

  svg
    .append("g")
    .attr("class", "grid")
    .call(d3.axisLeft().scale(yScale).tickSize(-width, 0, 0).tickFormat(""));

  function drawTop3Chart() {
    svgGroups
      .append("rect")
      .attr("x", function (d, i) {
        return xScale(d.state);
      })
      .attr("y", function (d) {
        return yScale(d.top3_cost_of_living_index);
      })
      .attr("width", xScale.bandwidth())
      .attr("height", function (d) {
        return height - yScale(d.top3_cost_of_living_index);
      })
      .on("mouseenter", function (actual, i) {
        d3.selectAll(".top3_cost_of_living_index").attr("opacity", 0);

        d3.select(this)
          .transition()
          .duration(300)
          .attr("opacity", 0.6)
          .attr("x", (d) => xScale(d.state) - 5)
          .attr("width", xScale.bandwidth() + 10);

        const y = yScale(actual.top3_cost_of_living_index);

        line = chart
          .append("line")
          .attr("id", "limit")
          .attr("x1", 0)
          .attr("y1", y)
          .attr("x2", width)
          .attr("y2", y);

        svgGroups
          .append("text")
          .attr("class", "divergence")
          .attr("x", (d) => xScale(d.state) + xScale.bandwidth() / 2)
          .attr("y", (d) => yScale(d.top3_cost_of_living_index) + 30)
          .attr("fill", "red")
          .attr("text-anchor", "middle")
          .text((d, idx) => {
            let text = "";
            if (d.top3_cost_of_living_index != 0) {
              const divergence = (
                d.top3_cost_of_living_index - actual.top3_cost_of_living_index
              ).toFixed(1);

              if (divergence > 0) text += "+";
              text += `${divergence}`;

              return idx !== i ? text : "";
            }
            return text;
          });
      })
      .on("mouseleave", function () {
        d3.selectAll(".top3_cost_of_living_index").attr("opacity", 1);

        d3.select(this)
          .transition()
          .duration(300)
          .attr("opacity", 1)
          .attr("x", (d) => xScale(d.state))
          .attr("width", xScale.bandwidth());

        chart.selectAll("#limit").remove();
        chart.selectAll(".divergence").remove();
      });

    svgGroups
      .append("text")
      .attr("class", "top3_cost_of_living_index")
      .attr("x", (a) => xScale(a.state) + xScale.bandwidth() / 2)
      .attr("y", (a) => yScale(a.top3_cost_of_living_index) + 30)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .text((a) => `${a.top3_cost_of_living_index}`);
  }

  function drawAnnotation() {
    var annotation = svg.append("g");
    annotation
      .append("text")
      .attr("x", 110)
      .attr("y", 20)
      .attr("class", "annotation")
      .classed("annotation", true)
      .text("<- The highest cost of living index in CALIFORNIA again !");
  }

  drawAnnotation();
  drawTop3Chart();
}

function chart3_top10() {
  demo33.style.display = "none";
  demo310.style.display = "none";
  demo310.style.display = "block";
  top10Chart3();
}
function chart3_top3() {
  demo310.style.display = "none";
  demo33.style.display = "none";
  demo33.style.display = "block";
  top3Chart3();
}
