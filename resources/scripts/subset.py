import json
import pandas as pd

import config

onemiss_nd_df = pd.read_csv(config.onemiss_nd_file)
onemiss_neighbors_df = pd.read_csv(config.onemiss_neighbors_file)

def generate_subset(set_size, nodes_df, links_df):
    """
    Generate a subset of nodes and edges
    graph = {
        "nodes" : [...],
        "links": [...]
    }

    returns a dict containing nodes + links arrays
    """

    # select how many rows you want to get from the column
    nodes_dict = nodes_df[:set_size].to_dict(orient='index').values()
    links_dict = links_df[:set_size].to_dict(orient='index').values()

    # convert it to an array of dicts
    nodes_array = [i for i in nodes_dict]
    links_array = [i for i in links_dict]

    # setup format for json later
    graph = {
        'nodes': nodes_array,
        'links': links_array
    }


    graph_file_name = config.old_data_folder / 'subsetGraph.json'

    with open(graph_file_name, 'w') as file:
        json.dump(graph, file)

generate_subset(100, onemiss_nd_df, onemiss_nd_df)



