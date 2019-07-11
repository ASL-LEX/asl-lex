import json
import pandas as pd

import config

"""When calling this function make sure you give it a .json extension for g_export argument"""
def generate_subset(nodes_df, links_df, g_export='graph.json', set_size=None):
    """
    Args:
        nodes_df: dataframe representing the nodes
        links_df: dataframe representing the links
        set_size: num representing a subset amount of the data frames
        g_export: str representing the name of the exported json - placed here to name the graph based on features

    Generate a subset of nodes and edges
    graph = {
        "nodes" : [...],
        "links": [...]
    }

    returns a json file structured as the dict graph
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

    g = ''

    if set_size != None:
        print(f"Generating graph.json with of size {set_size} ")
        # naming of the graph json file
        graph_file_name = config.new_data_folder / 'subsetGraph.json'
        g = graph_file_name

    else:
        print("Generating graph json")
        # naming of the graph json file
        graph_file_name = config.new_data_folder / g_export
        print("Completed! check your DIR")
        g = graph_file_name

    # write the dataframe to json
    with open(g, 'w') as file:
        json.dump(graph, file)




