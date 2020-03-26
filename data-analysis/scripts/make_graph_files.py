import pandas as pd
import json
import community
import networkx as nx
import matplotlib.pyplot as plt
import pandas as pd
import random
import numpy as np
import randomcolor
import config as CONFIG


df_default = pd.read_csv(CONFIG.default_nodes_file)
print(df_default.shape)

df_sign = pd.read_csv(CONFIG.sign_data_file)
print(df_sign.shape)

print(df_sign['SignBankEnglishTranslations'].value_counts())
print(df_default["Code"].values)

edges_df = pd.read_csv(CONFIG.default_neighbors_file)
edges_df = edges_df.rename(columns={"neighbor": "source"})
print(edges_df.head())
print(edges_df.shape)

g = nx.from_pandas_edgelist(edges_df, source='source', target='target')
G = g

#Two methods for community analysis
c = networkx.algorithms.community.greedy_modularity_communities(G)
partition = community.best_partition(G)
values = [partition.get(node) for node in G.nodes()]

num_nodes = 0
for community in c:
    num_nodes += len(community)
print(num_nodes)

list = partition.items()
print(len(list))
df_with_groupids = pd.DataFrame(list, columns=['Code', 'group_id'])
print(df_with_groupids.head())

# get edges only where source and target nodes belong to a valid community for now. This is to assign them group ids.
nodes_in_communities = df_with_groupids['Code'].unique()
edges_for_community_nodes_df = edges_df.loc[edges_df['source'].isin(nodes_in_communities) & edges_df['target'].isin(nodes_in_communities)]
print(len(edges_for_community_nodes_df['source'].unique()))
print(edges_df.shape)
print(edges_for_community_nodes_df.shape)
edges_for_community_nodes_df.head()

df_merged = pd.merge(df_default, df_with_groupids,how='left', on=['Code'])
print(df_merged.shape)
# print(df_merged.columns.values)
df_merged.head()

values = {'group_id': 1000}
df_merged = df_merged.fillna(value=values)

print(df_merged['group_id'])
unique_community_ids = df_merged['group_id'].unique()
print(unique_community_ids)

import random

def colors(n):
    if(n == 0):
        n = 600
    r = int(random.random() * 256)
    g = int(random.random() * 256)
    b = int(random.random() * 256)

    step = 256 / n
    #     print(n,r,g,b,step)

    r += step
    g += step
    b += step
    r = int(r) % 256
    g = int(g) % 256
    b = int(b) % 256

    colorstr = str(r)+","+str(b)+"," + str(g)
    return '#%02x%02x%02x' % (r, g, b)

color_dict = []
color_dictionary = {}
for groupid in unique_community_ids:
    #generate a random color
    color = colors(groupid)
    if(groupid == 1000):
        color_dict.append({'group_id': 1000, 'color_code': color})
        color_dictionary['island'] = color
    else:
        color_dict.append({'group_id':groupid , 'color_code': color})
        color_dictionary[str(int(groupid))] = color

print(color_dict)

color_df = pd.DataFrame(color_dict)
df_merged_with_color = pd.merge(df_merged, color_df,how='left', on=['group_id'])
print(df_merged_with_color.shape)
print(df_merged_with_color.head())

#Need only 5 columns for now
df_node_graph_json_data = df_merged_with_color[["EntryID", "Code", "group_id", "color_code", "SignFrequency(Z)"]]
print(df_node_graph_json_data.shape)
df_node_graph_json_data.head(20)
not_need_edge_cols = ['num_matched_features', 'matched_features', 'num_missed_features', 'missed_features']
links_df = edges_df.drop(columns=not_need_edge_cols)

edges_json_str = links_df.to_json(orient="records")
edges_json = json.loads(edges_json_str)
print(edges_json[0])

print(len(df_default.columns.values))
df_sign = df_sign[['YouTube Video','Code','SignBankEnglishTranslations']]
df_sign = df_sign.rename(columns={"YouTube Video": "video"}, errors="raise")
df_sign.head()
df_default = pd.merge(df_default, df_sign,how='left', on=['Code'])

test_df = df_default
filtered = test_df.filter(regex='M..2.0|Video')
no_morphemes_df = test_df[test_df.columns.drop(filtered.columns.values)]
print(len(no_morphemes_df.columns.values))


numerical_attr = no_morphemes_df.select_dtypes(include=['float', 'int']).columns.values
categorical_attr = []
for column in no_morphemes_df.columns.values:
    if column not in numerical_attr:
        categorical_attr.append(column)
import math
import pprint

constraints = {}
for attr in categorical_attr:
    if attr not in ['EntryID', 'LemmaID', 'Code', 'Iconicity_ID']:
        columnsData = no_morphemes_df.loc[ : , attr ].dropna()
        values_set = set(columnsData.values)
        constraints[attr] = [*values_set, ]

for attr in numerical_attr:
    #drop nan values 
    columnsData = no_morphemes_df.loc[ : , attr ].dropna()
    constraints[attr] = {}
    #print(math.floor(min(list(columnsData))), math.ceil(max(list(columnsData))), attr)
    constraints[attr]['min'] = math.floor(min(columnsData.values))
    constraints[attr]['max'] = math.ceil(max(columnsData.values))

pprint.pprint(constraints)

nodes_json_str = df_node_graph_json_data.to_json(orient="records")
nodes_json = json.loads(nodes_json_str)
print(nodes_json[0])


graph = {
    "nodes" : nodes_json,
    "links": edges_json
}

# Save files
with open(CONFIG.graph_json_file, 'w') as file:
    json.dump(graph, file)


with open(CONFIG.constraints_json_file, 'w') as fp:
    json.dump(constraints, fp)

no_morphemes_df.reset_index().to_json(CONFIG.sign_props_json_file, orient='records')


