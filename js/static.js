var width = 1200;
var height = 900;
var color = d3.scaleOrdinal(d3.schemeCategory10);

d3.json("../data/graph.json")
    // result = contents of the json file
    .then((graph) => {
        // testing
        console.log('testing');

        var svg = d3.select("#viz").attr("width", width).attr("height", height);

        var svg = d3.select("svg"),
            width = +svg.attr("width", width),
            height = +svg.attr("height", height),
            g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        var simulation = d3.forceSimulation(graph.nodes)
            .force("charge", d3.forceManyBody().strength(-80))
            .force("link", d3.forceLink(graph.links).id(function (d) {
                return d.Code;
            }).distance(20).strength(1).iterations(10))
            .force("x", d3.forceX())
            .force("y", d3.forceY())
            .stop();

        var loading = svg.append("text")
            .attr("dy", "0.35em")
            .attr("text-anchor", "middle")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .text("Simulating. One moment please…");

        d3.timeout(function () {
            loading.remove();

            // See https://github.com/d3/d3-force/blob/master/README.md#simulation_tick
            for (var i = 0, n = Math.ceil(Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())); i < n; ++i) {
                simulation.tick();
            }

            g.append("g")
                .attr("stroke", "#000")
                .attr("stroke-width", 1.5)
            .selectAll("line")
            .data(graph.links)
            .enter().append("line")
                .attr("x1", function (d) {
                    return d.source.x;
                })
                .attr("y1", function (d) {
                    return d.source.y;
                })
                .attr("x2", function (d) {
                    return d.target.x;
                })
                .attr("y2", function (d) {
                    return d.target.y;
                });

            g.append("g")
                .attr("stroke", "#fff")
                .attr("stroke-width", 1.5)
            .selectAll("circle")
            .data(graph.nodes)
            .enter().append("circle")
                .attr("cx", function (d) {
                    return d.x;
                })
                .attr("cy", function (d) {
                    return d.y;
                })
                .attr("r", 4.5);
        });

    }).catch((err) => {
        console.log(`$Error: ${err}`);
    });