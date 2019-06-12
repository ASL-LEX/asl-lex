import os
import json
import pandas as pd

# config

CURR_DIR = os.getcwd()

# files
phonology_coding_file = CURR_DIR + '/data/osfstorage-archive/PhonologyCoding.csv'
sign_file = CURR_DIR + '/data/osfstorage-archive/Sign-Level Data/SignData.csv'
nodes_file = CURR_DIR + '/data/nodes.json'
edges_file = CURR_DIR + '/data/edges.json'
one_miss_file = CURR_DIR + '/data/osfstorage-archive/onemiss-neighbors.csv'


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
