## ASL-LEX

#### About
ASL-LEX is a database of lexical and phonological properties of nearly 3,000 signs in American Sign Language. This project is a collaboration between [the Laboratory for Language and Cognitive Neuroscience at San Diego State](http://emmoreylab.sdsu.edu/) University and the [Psycholinguistics and Linguistics Lab at Tufts University](http://ase.tufts.edu/psychology/psycholinglab/). ASL-LEX is a searchable database of subjective frequency ratings, iconicity ratings, lexical properties (e.g., initialized signs; lexical class), and six phonological features from which neighborhood densities have been calculated. ASL-LEX also provides, reference video clips, English translations and, for a subset of signs, alternative translations.

#### Accessing the ASL-LEX 2.0 web interface

- The visualization is currently hosted on [Github Pages](https://asl-lex.github.io/asl-lex/). 


- View the older interface at the [ASL 1.0 Link](https://ase.tufts.edu/psychology/psycholinglab/asl-lex/visualization.html)


- It consists of two visualizations, a Network Graph that depicts the lexicon as a network graph where nodes are connected if they have phonological and lexical similarities. Hover on a node to view it's neighbors
![Network graph](/images/see-edges.png)


- Click on it for more information about that sign. 
![About a sign](/images/about-sign.png)


- You can also filter the network by applying various filtering criteria.
![Filtering signs](/images/apply-a-filter.png)


- Hover over any property to view more info about that property
![About a sign](/images/hover-over-toottip.png)


- Hover over a sign to view more quick info about that sign
![Tooltips](/images/tootlips.png)


- There is also a Pair Plots visualization which depcits distribution of signs across various pairs of properties such as Lexical Class, Neighborhood Density, Iconicity and Frequency.

- You can drag to select a subset of signs on either visualization and view the subset in the other view.


- For more ways to explore the data, please reach out to the team at hicsail@bu.edu

#### Custom Development

##### Starting the project locally
- Clone the repo and in the root folder, start the server using MAMP or python Simpleserver
- Go to http://localhost:8000/visualization to view the interface

##### Running the script to generate the network graph and preparing a new visualization
We use BU's Shared Computing cluster to run the graoh generation scripts. 
To run it on the SCC:
- login into a compute node
- cd into /project/hariri/asl-lex/
- Run make-pipeline.sh using qsub
- Note that by default, it runs graph creation with the default edge criterion:
` qsub -o /project/hariri/asl-lex/logs/ -N RUN_PYND /project/hariri/asl-lex/data-analysis/scripts/default-job.sh
`
You can change this by using another edge criterion file from the scripts folder.
- The pipeline should provide CS◊ files to be used for the visualization under the generated-data folder
- Now, using `asl-playground.ipynb` file under notebooks, run the notebook to obtain the JSON files for the visualization, namely graph.json, constraints.json and sign-props.json
- Copy these over to the visualization/data folder, removing older files with the same name
- Run the D3 Force Layout Visualization by going to http://localhost:8000/visualization/force-layout-rendering.html. 
- Wait for the graph to stablize and download the graph.json file using "Download Coordinates File" link, now with x,y coordinates attached with each node.
- Replace the graph json file with the new one obtained with coordinates in the previous step.
- View the updated visualization at http://localhost:8000/visualization/

#### Deployment
- Once changes are done, remove everything except the visualization folder.
- Move all files from visualization folder to the root level
- Push to gh-pages branch
- The new interface will be up on the [Github Pages Link](https://asl-lex.github.io/asl-lex/)


#### License

The content on this website is available under a CC-By-NC license, meaning you can reuse and remix this content with attribution for non-commercial purposes. If you would like to cite it, please use the following: Caselli, N., Sevcikova, Z., Cohen-Goldberg, A., Emmorey, K. (in prep). ASL-LEX: A Lexical Database for ASL.

This work is licensed under a [Creative Commons Attribution-NonCommercial 4.0 International License](http://creativecommons.org/licenses/by-nc/4.0/).
