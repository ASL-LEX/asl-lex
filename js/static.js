var color = d3.scaleOrdinal(d3.schemeCategory10);

d3.json("../data/graph.json")
    // result = contents of the json file
    .then((graph) => {
        // testing
        console.log('testing');

        // store data into sperate objects may need for certain functionality
        var graphObj = {
            nodes: [],
            links: []
        }

        graph.nodes.forEach((node) => {
            // create an object and store the contents thats in node

            // can probably do this using destructuring
            node_obj = {
                "EntryID": node['EntryID'],
                "Code": node['Code'],
                "NeighborhoodDensity": node['NeighborhoodDensity']
            };

            // push the object to the graphObj
            graphObj.nodes.push(node_obj);
        });

        graph.links.forEach((link) => {
            // create an link obj and store the contents of Link
            link_obj = {
                "target": link['target'],
                "source": link['source']
            };

            // push the obj into the graph obj
            graphObj.links.push(link_obj);
        })

        console.log(graphObj.nodes[0]);
        console.log(graphObj.links[0]);

        // rendering the nodes and links using svg
        var svg = d3.select("svg"),
            width = +svg.attr("width"),
            height = +svg.attr("height"),
            g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        var simulation = d3.forceSimulation(graph.nodes)
            .force("charge", d3.forceManyBody().strength(-300))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("link", d3.forceLink(graph.links).id(function (d) {
                return d.Code;
            }).distance(20).strength(1).iterations(10))
            .force("x", d3.forceX())
            .force("y", d3.forceY())
            .stop();

        var center_force = d3.forceCenter(width / 2, height / 2);

        //add zoom capabilities
        var zoom_handler = d3.zoom()
            .on("zoom", zoom_actions);

        zoom_handler(svg);

        d3.timeout(function () {

            // See https://github.com/d3/d3-force/blob/master/README.md#simulation_tick
            for (var i = 0, n = Math.ceil(Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())); i < n; ++i) {
                simulation.tick();
            }

            g.append("g")
                .attr("stroke", "#aaa")
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
                .attr("fill", function (d) {
                    return color(d.NeighborhoodDensity);
                })
                .attr("r", 20);
        });


        // functions
        //Zoom functions
        function zoom_actions() {
            g.attr("transform", d3.event.transform)
        }

    }).catch((err) => {
        console.log(`$Error: ${err}`);
    });