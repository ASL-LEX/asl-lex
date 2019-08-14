import pandas as pd
from pandas.io.json import json_normalize

from gephistreamer import graph
from gephistreamer import streamer


import config

"""Convert the csv files into data frames """
# phonology files
phonology_coding_df = pd.read_csv(config.phonology_coding_file).reset_index()
# sign file
sign_df = pd.read_csv(config.sign_file).reset_index()
one_miss_df = pd.read_csv(config.one_miss_file).reset_index()
# convert the json file to a pandas data frame
nodes_df = config.convert_to_df(config.nodes_file).reset_index()
edges_df = config.convert_to_df(config.edges_file).reset_index()

# asl_merge_1 = pd.merge(sign_df, phonology_coding_df, on=['EntryID', 'index'], how="outer")
asl_merge = pd.merge(sign_df, phonology_coding_df, on=['EntryID', 'index'], how='outer', sort=False, copy=True)

# list of all the column names
col_names = [col for col in asl_merge.columns]

""" Creating a streamer obj for gephi """
stream = streamer.Streamer(streamer.GephiWS(hostname='localhost', port='8080', workspace='workspace2'))

# loop over the nodes data frame
for row in nodes_df.itertuples(index=True, name="Pandas"):
    # get all needed properties
    entryID = getattr(row, "EntryID")
    size = getattr(row, 'size')
    x_cord = getattr(row, 'x')
    y_cord = getattr(row, 'y')
    color = getattr(row, 'color')

    # create a new node that will be added to the Gephi graph
    node = graph.Node(eid=entryID, label=entryID, size=size, x=x_cord, y=y_cord)

    # add the node to the stream
    stream.add_node(node)

for row in edges_df.itertuples(index=True, name="Pandas"):
    source = getattr(row, "source")
    target = getattr(row, "target")
    weight = getattr(row, "size")
    label = getattr(row, "label")

    # create the edge
    edge = graph.Edge(source=source, target=target, directed=False, weight=weight, label=label)

    # add the edge between the nodes
    stream.add_edge(edge)



