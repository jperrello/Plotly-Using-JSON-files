//seperate function for creating the layout of the graph
function createBarChartLayout(headers, values) {
    var maxValue = Math.max(...values);
    var numCategories = headers.length - 1;
  
    // Calculate the desired width and height based on the number of categories
    // With these variables, no matter how many events, each graph should be the same 
    // size and format
    var desiredWidth = Math.max(800, 80 * numCategories);
    var desiredHeight = Math.max(600, 40 * values.length);
  
    // Basic layout formatting
    return {
      title: 'Event Occurrences',
      barmode: 'stack',
      bargap: 0.5,
      bargroupwidth: 0.9,
      autosize: true,
      width: desiredWidth,
      height: desiredHeight,
      plot_bgcolor: 'rgba(0,0,0,0)', 
      paper_bgcolor: 'rgba(0,0,0,0)', 
      xaxis: {
        title: 'Count',
        fixedrange: true,
        zeroline: false,
        showgrid: false,
      },
      yaxis: {
        title: {
            text: 'Event',
            standoff: 30,
        },
        automargin: true,
        showgrid: false,
        gridwidth: 3,
        zeroline: false,
        tickfont: {
          size: 10,
        },
      },
      margin: {
        l: 150, 
      },
    };
  }
  
// parse the json data and log to console if it is successful
function readJSONFile(inputFile) {
    const fileReader = new FileReader();
  
    fileReader.onload = function(event) {
      try {
        const jsonData = JSON.parse(event.target.result);
        console.log("JSON file successfully parsed:", jsonData);
        createBarChart(jsonData); 
      } catch (error) {
        console.error("Error parsing JSON file:", error);
      }
    };
  
    fileReader.readAsText(inputFile);
  }

  function createBarChart(jsonData) {
    // Count the occurrences of each event
    const eventCounts = {};
    jsonData.forEach(item => {
      const event = item.event;
      eventCounts[event] = (eventCounts[event] || 0) + 1;
    });
  
    // Sort events by their values
    const sortedEvents = Object.keys(eventCounts).sort((a, b) => {
      return eventCounts[b] - eventCounts[a];
    });
  
    // Reverse the sorted order because small comes before large when sorting
    const reversedEvents = sortedEvents.reverse();
  
    // Prepare data for the bar chart
    const chartData = [{
      x: reversedEvents.map(event => eventCounts[event]),
      y: reversedEvents,
      type: 'bar',
      orientation: 'h',
      text: reversedEvents.map(event => eventCounts[event]), // Add the text with the bar values
      textposition: 'auto',
      textfont_size: 20,
      textposition: 'outside',
      cliponaxis: false,
      marker: {
        color: 'rgba(31, 119, 180, 0.8)', // Set initial color for all bars
      },
      hoverinfo: 'none', 
    }];
  
    // Set layout options for the bar chart
    const layout = createBarChartLayout('Event', 'Count')
  
    // Create the bar chart
    Plotly.newPlot('chartContainer', chartData, layout).then(function () {
        // initialize all bars to have the same colors
      var colors = Array(reversedEvents.length).fill('rgba(31, 119, 180, 0.8)'); 
      var clickedIndex = null;
  
      // get clicked bar's index
      chartContainer.on('plotly_click', function (data) {
        var currentClickedIndex = data.points[0].pointIndex;
  
        // set clicked bar to blue, other bars to gray
        if (clickedIndex === currentClickedIndex) {
          colors.fill('rgba(31, 119, 180, 0.8)'); 
          clickedIndex = null;
        } else {
          colors.fill('gray');
          colors[currentClickedIndex] = 'rgba(31, 119, 180, 0.8)'; 
          clickedIndex = currentClickedIndex;
        }
        // update graph to contain new color format
        var update = {
          marker: { color: colors }
        };
  
        Plotly.update('chartContainer', update);
  
        // display bar's data on page when clicked
        if (clickedIndex !== null) {
          var clickedBarData = data.points[0]; 
          var clickedBarName = clickedBarData.y;
          var clickedBarValue = clickedBarData.x;
  
          var statement = "Selected Information: " + clickedBarName + "<br>Value: " + clickedBarValue;
          outputInfo.innerHTML = statement;
          outputInfo.style.border = "2px solid rgb(173, 216, 230)";
        } else {
          outputInfo.innerHTML = "";
          outputInfo.style.border = "none";
        }
      });
    });
  }
  

  

  

