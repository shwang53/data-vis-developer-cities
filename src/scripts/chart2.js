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
