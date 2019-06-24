import os
import json
import pandas as pd
from pathlib import Path

# config
data_folder = Path("new-data/")
old_data = Path('../data/')

# files
one_miss_nd_file = data_folder / 'onemiss-nd.csv'
one_miss_neighbors_file = data_folder / 'onemiss-neighbors.csv'


# Converts the input JSON to a DataFrame
def convert_to_df(json_file):
    # read through the json file
    with open(json_file, 'r') as file:
        # convert the file to a dict
        data = json.load(file)
        # create a df with that json data
        return pd.DataFrame(data)


# Converts the input DataFrame to JSON
def convert_to_json(df):
    result_json = df.to_json(orient='records')
    return result_json

nodes_df = pd.read_csv(one_miss_nd_file)
links_df = pd.read_csv(one_miss_neighbors_file)

links_df = links_df.drop(columns=['missed_features', 'matched_features'])

nodes_dict = nodes_df.to_dict(orient='index').values()
links_dict = links_df.to_dict(orient='index').values()

# convert it to an array of dicts
nodes_array = [i for i in nodes_dict]
links_array = [i for i in links_dict]

graph = {
    "nodes": nodes_array,
    "links": links_array
}

graph_file_name = old_data / 'graph.json'

with open(graph_file_name, 'w') as file:
    json.dump(graph, file)
