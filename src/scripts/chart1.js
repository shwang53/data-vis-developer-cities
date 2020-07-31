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
