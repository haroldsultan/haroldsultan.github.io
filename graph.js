// Get canvas element and 2D context
var canvas = document.getElementById('graph');
canvas.width = 3000;  // Increase canvas resolution
canvas.height = 1000;  // Increase canvas resolution
var ctx = canvas.getContext('2d');

// Define variables for graph configuration
var nodeRadius = 20;  // Radius of nodes
var nodeColor = '#42f557';  // Color of nodes
var edgeColor = '#4287f5';  // Color of edges

// Define arrays to hold nodes and edges
var nodes = [];
var edges = [];

function rand_int(min, max) {
  return Math.floor(
    Math.random() * (max - min) + min
  );
}

// Define function to generate the graph
function generateGraph(numIcs, numM0, numM1, numM2, numM3, minBranchM0, maxBranchM0, minBranchM, maxBranchM, maxBranchM) {
  nodes = [];
  edges = [];
  var ic_index = 0;
  // add M0s
  for (var i =0; i<numM0; i++){
    var reports = rand_int(minBranchM0, maxBranchM0+1);
    var m0_label = `m0_${i}(${reports})`;
    var m0_node = {
        x: 20+i*50,
        y: 200,
        label: m0_label,
        color: nodeColor
      };
    nodes.push(m0_node);
    for (var j=0; j<reports; j++){
        var ic_label = `ic_${ic_index}`;
        var node = {
          x: 20+ic_index*50,
          y: 40,
          label: ic_label,
          color: nodeColor
        };
        ic_index += 1;
        nodes.push(node);
        var edge = {
          source: m0_label,
          target: ic_label,
          color: edgeColor
        };
        edges.push(edge);
    }
  }

  // add m1s
  var m0s_per_m1 = Math.ceil(numM0/numM1);
  var m0_counter = 0;
  var ic2_offset = numM0 + 1;
  for (var j=0; j<numM1; j++){
    var reports = rand_int(minBranchM, maxBranchM+1);
    var m1_label = `m1_${j}(${reports})`;
    var m1_node = {
        x: 20+j*50,
        y: 400,
        label: m1_label,
        color: nodeColor
      };
    nodes.push(m1_node);

    var m0_reports = 0;
    for (var k=0; k< m0s_per_m1; k++){
      if (m0_counter<numM0){
        var m0_label = `m0_${m0_counter}`;
        m0_counter += 1;
        var edge = {
          source: m1_label,
          target: m0_label,
          color: edgeColor
        };
        edges.push(edge);
        m0_reports += 1;
      }
    }
    var remaining_reports = reports - m0_reports;
    for (var k=0; k< remaining_reports; k++){
      var ic_label = `ic_${ic_index}`;
      var node = {
        x: 20+(ic2_offset)*50,
        y: 200,
        label: ic_label,
        color: nodeColor
      };
      ic_index += 1;
      ic2_offset += 1;
      nodes.push(node);
      var edge = {
        source: m1_label,
        target: ic_label,
        color: edgeColor
      };
      edges.push(edge);
    }
  }

  // add m2s
  var m1s_per_m2 = Math.ceil(numM1/numM2);
  var m1_counter = 0;
  var ic3_offset = numM1 + 1;
  // use up all ics except those needed by m3s
  var ics_to_use = numIcs - ((numM3 * minBranchM)-numM2) - ic_index -1;
  var ics_per_m2 = Math.ceil(ics_to_use/numM2);
  for (var j=0; j<numM2; j++){
    var reports_projection = m1s_per_m2 + ics_per_m2;
    var reports = 0;
    var m2_label = `m2_${j}`;

    for (var k=0; k< m1s_per_m2; k++){
      if (m1_counter<numM1){
        var m1_label = `m1_${m1_counter}`;
        m1_counter += 1;
        var edge = {
          source: m2_label,
          target: m1_label,
          color: edgeColor
        };
        edges.push(edge);
        reports += 1;
      }
    }
    var remaining_reports = reports_projection - reports;
    for (var k=0; k< remaining_reports; k++){
      if (reports<ics_to_use){
        var ic_label = `ic_${ic_index}`;
        var node = {
          x: 20+(ic3_offset)*50,
          y: 400,
          label: ic_label,
          color: nodeColor
        };
        ic_index += 1;
        ic3_offset += 1;
        nodes.push(node);
        var edge = {
          source: m2_label,
          target: ic_label,
          color: edgeColor
        };
        edges.push(edge);
        reports += 1;
      }
    }
    if (reports < minBranchM || reports > maxBranchM){
      throw new Error(`Incorrect number of ICs for manager ${reports}`);
    }
    var m2_label = `m2_${j}(${reports})`;
    var m2_node = {
        x: 20+j*50,
        y: 600,
        label: m2_label,
        color: nodeColor
      };
    nodes.push(m2_node);
  }

  // add m3s
  var m2s_per_m3 = Math.ceil(numM2/numM3);
  var m2_counter = 0;
  var ic4_offset = numM2 + 1;
  for (var j=0; j<numM3; j++){
    var reports = (numIcs - ic_index) + numM2;
    if (reports < minBranchM || reports > maxBranchM){
      throw new Error(`Incorrect number of ICs for manager ${reports}`);
    }
    var m3_label = `m3_${j}(${reports})`;
    var m3_node = {
        x: 20+j*50,
        y: 800,
        label: m3_label,
        color: nodeColor
      };
    nodes.push(m3_node);

    var m2_reports = 0;
    for (var k=0; k< m2s_per_m3; k++){
      if (m2_counter<numM2){
        var m2_label = `m2_${m2_counter}`;
        m2_counter += 1;
        var edge = {
          source: m3_label,
          target: m2_label,
          color: edgeColor
        };
        edges.push(edge);
        m2_reports += 1;
      }
    }
    var remaining_reports = reports - m2_reports;
    for (var k=0; k< remaining_reports; k++){
      var ic_label = `ic_${ic_index}`;
      var node = {
        x: 20+(ic4_offset)*50,
        y: 600,
        label: ic_label,
        color: nodeColor
      };
      ic_index += 1;
      ic4_offset += 1;
      nodes.push(node);
      var edge = {
        source: m3_label,
        target: ic_label,
        color: edgeColor
      };
      edges.push(edge);
    }
  }
  if (ic_index!= numIcs){
    throw new Error(`Incorrect number of ICs! used: ${ic_index}, expected: ${numIcs}`);
  }
  redraw();
}

// Define function to reset the graph
function resetGraph() {
  // Clear nodes and edges
  nodes = [];
  edges = [];

  // Redraw the graph
  redraw();
}

// Define function to redraw the graph
function redraw() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw edges
  for (var i = 0; i < edges.length; i++) {
    var source = nodes.find(node => {
        var parenIndexNode = node.label.indexOf('(');
        var node_id = parenIndexNode == -1 ? node.label : node.label.slice(0,parenIndexNode);
        var parenIndexSource = edges[i].source.indexOf('(');
        var source_id = parenIndexSource == -1 ? edges[i].source : edges[i].source.slice(0,parenIndexSource);
        return node_id == source_id;
    });
    var target = nodes.find(node => {
        var parenIndexNode = node.label.indexOf('(');
        var node_id = parenIndexNode == -1 ? node.label : node.label.slice(0,parenIndexNode);
        var parenIndexTarget = edges[i].target.indexOf('(');
        var target_id = parenIndexTarget == -1 ? edges[i].target : edges[i].target.slice(0,parenIndexTarget);
        return node_id == target_id;
    });

    ctx.beginPath();
    ctx.moveTo(source.x, source.y);
    ctx.lineTo(target.x, target.y);
    ctx.strokeStyle = edges[i].color;
    ctx.stroke();
  }

  // Draw nodes
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    ctx.fillStyle = node.color;
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
    ctx.fillStyle = node.color;
    ctx.fill();

    ctx.font = '7pt Calibri';
    ctx.fillStyle = "black";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(node.label, node.x, node.y);
  }
}

function showError(message) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = '20pt Calibri';
  ctx.fillStyle = "black";
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(message, 400,400);
}

// Add event listeners to buttons
document.getElementById('draw-graph-button').addEventListener('click', function() {
  resetGraph();
   var numIcs = parseInt(document.getElementById('num-ics').value);
   var numM0 = parseInt(document.getElementById('num-m0').value);
   var numM1 = parseInt(document.getElementById('num-m1').value);
   var numM2 = parseInt(document.getElementById('num-m2').value);
   var numM3 = parseInt(document.getElementById('num-m3').value);
   var minBranchM0 = parseInt(document.getElementById('min-branch-ic').value);
   var maxBranchM0 = parseInt(document.getElementById('max-branch-ic').value);
   var minBranchM = parseInt(document.getElementById('min-branch-m').value);
   var maxBranchM = parseInt(document.getElementById('max-branch-m').value);
   var tries = 0;
   const max_tries = 1000;
   while (tries < max_tries){
     tries +=1;
     try{
       generateGraph(
         numIcs, numM0, numM1, numM2, numM3, minBranchM0, maxBranchM0, minBranchM, maxBranchM, maxBranchM
       );
       break;
     }catch (error) {
    //    console.error(error);
     }
   }
   if (tries == max_tries){
     var message = `Could not produce a valid org tree within ${tries} attempts`;
     showError(message);
    //  throw new Error();
   }
});

document.getElementById('reset-button').addEventListener('click', function() {
  resetGraph();
});
