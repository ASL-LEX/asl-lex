import pandas as pd
import config as CONFIG
import nd.neighbors as nd
import createGraph as CG

import sys
import argparse

from itertools import product

""" Script to automate/update Nodes + edges JSON csv files which will be reflected on the website """

# command line arguments for calculating neighbor density
parser = argparse.ArgumentParser(description='Filter arguments to run in order to create neighbor density values, nodes and edges')
parser.add_argument(dest="feature_list", type=lambda s:[str(feature).strip() for feature in s.split(",")], help="A list of strings containing features. This should be the exact same as the columns feed into pyND")
parser.add_argument(dest="num_pynd", type=int, help="an integer indicating how many features are allowed to differ between the target word and the candidate")
parser.add_argument(dest="export_file", type=str, help="string that will be the file name of the nodes + edges csv files generated from pyND package")

args = parser.parse_args()

# need to use the PyND package to get the onemiss_neighbors + onemiss_nd files
"""sign_df contains all properies of each sign"""
sign_df = pd.read_csv(CONFIG.sign_data_file)
subset_df = pd.read_csv(CONFIG.subset_data_file)

# get rid of the video columns
sign_df = sign_df.drop(columns=['ClipLength(ms)'], axis=1)

def create_nd(data_df, feature_list, allowed_misses, file_name):
    """
        Helper function to convert data nodes + edges files
        Args:
            data_df: Pandas dataframe containing the data
            feature_list: (List of str) a list of features that edges will be generated from
            allowed_misses: (Int) - look at pynd Neighbors documentation
            file_name: The name of the nodes + edges file that will be generated from the features

        returns:
            Creates two csv files in the data folder named file_name-neighbors and file_name-nd
    """

    print(f"Creating nodes & edges csv files for {file_name} features.")
    print("This will take awhile...")

    # remove uneed columns
    # uneeded_cols = [
    #         'HandshapeM2.2.0',
    #         'MarkedHandshapeM2.2.0',
    #         'SelectedFingersM2.2.0',
    #         'FlexionM2.2.0',
    #         'FlexionChangeM2.2.0',
    #         'SpreadM2.2.0',
    #         'SpreadChangeM2.2.0',
    #         'SpreadChangeM2.2.0',
    #         'ThumbContactM2.2.0',
    #         'SignTypeM2.2.0',
    #         'MovementM2.2.0',
    #         'MajorLocationM2.2.0',
    #         'MinorLocationM2.2.0',
    #         'SecondMinorLocationM2.2.0',
    #         'ContactM2.2.0',
    #         'NonDominantHandshapeM2.2.0',
    #         'UlnarRotationM2.2.0',
    #         'UlnarRotationM2.2.0',
    #         'MarkedHandshapeM3.2.0',
    #         'SelectedFingersM3.2.0',
    #         'FlexionM3.2.0',
    #         'FlexionChangeM3.2.0',
    #         'SpreadM3.2.0',
    #         'SpreadChangeM3.2.0',
    #         'ThumbPositionM3.2.0',
    #         'ThumbContactM3.2.0',
    #         'SignTypeM3.2.0',
    #         'MovementM3.2.0',
    #         'MajorLocationM3.2.0',
    #         'MinorLocationM3.2.0',
    #         'SecondMinorLocationM3.2.0',
    #         'ContactM3.2.0',
    #         'NonDominantHandshapeM3.2.0',
    #         'UlnarRotationM3.2.0',
    #         'HandshapeM4.2.0',
    #         'MarkedHandshapeM4.2.0',
    #         'SelectedFingersM4.2.0',
    #         'FlexionM4.2.0',
    #         'FlexionChangeM4.2.0',
    #         'SpreadM4.2.0',
    #         'SpreadChangeM4.2.0',
    #         'ThumbPositionM4.2.0',
    #         'ThumbContactM4.2.0',
    #         'SignTypeM4.2.0',
    #         'MovementM4.2.0',
    #         'MajorLocationM4.2.0',
    #         'MinorLocationM4.2.0',
    #         'SecondMinorLocationM4.2.0',
    #         'ContactM4.2.0',
    #         'NonDominantHandshapeM4.2.0',
    #         'UlnarRotationM4.2.0',
    #         'HandshapeM5.2.0',
    #         'MarkedHandshapeM5.2.0',
    #         'SelectedFingersM5.2.0',
    #         'FlexionM5.2.0',
    #         'FlexionChangeM5.2.0',
    #         'SpreadM5.2.0',
    #         'SpreadChangeM5.2.0',
    #         'ThumbPositionM5.2.0',
    #         'ThumbContactM5.2.0',
    #         'SignTypeM5.2.0',
    #         'MovementM5.2.0',
    #         'MajorLocationM5.2.0',
    #         'MinorLocationM5.2.0',
    #         'SecondMinorLocationM5.2.0',
    #         'ContactM5.2.0',
    #         'NonDominantHandshapeM5.2.0',
    #         'UlnarRotationM5.2.0',
    #         'HandshapeM6.2.0',
    #         'MarkedHandshapeM6.2.0',
    #         'SelectedFingersM6.2.0',
    #         'FlexionM6.2.0',
    #         'FlexionChangeM6.2.0',
    #         'SpreadM6.2.0',
    #         'SpreadChangeM6.2.0',
    #         'ThumbPositionM6.2.0',
    #         'ThumbContactM6.2.0',
    #         'SignTypeM6.2.0',
    #         'MovementM6.2.0',
    #         'MajorLocationM6.2.0',
    #         'MinorLocationM6.2.0',
    #         'SecondMinorLocationM6.2.0',
    #         'ContactM6.2.0',
    #         'NonDominantHandshapeM6.2.0',
    #         'UlnarRotationM6.2.0',
    #         'Batch',
    #         'Item',
    #         'List'
    #     ]
    # data_df = data_df.drop(columns=uneeded_cols)

    # create the neighbors object
    feature_nd = nd.Neighbors(data_df, feature_list, allowed_misses)

    # compute the neighbor density and edges
    nodes_df, edges_df = feature_nd._Compute()

    # write the nodes and edges to CSVs
    feature_nd.WriteCSVs(CONFIG.new_data_folder, file_name)

    print("Nodes and edges files created! ")


"""
    feature set is a list of tuples -- needed for the parallel processing
    tuple[0]: string - which represents a string, .split(",")
    tuple[1]: number
    tuple[2]: string

    running the script has to be executed as
    python3 col_name_1 col_name_2 col_name_3..etc num file_name

    example: python3 "EntryID,LemmaID,Code" 1 default
"""

# args that are passed into the command line once the script is run
features = args.feature_list
pynd_num = args.num_pynd
export_file = args.export_file


def main():
    # subset for testing
    create_nd(sign_df, features, pynd_num, export_file)

    # create_nd(sign_df, features, pynd_num, export_file)

    """Make sure you add the csv extension"""
    nodes_df = pd.read_csv(CONFIG.new_data_folder / f"{export_file + '-nd.csv'}")
    links_df = pd.read_csv(CONFIG.new_data_folder / f"{export_file + '-neighbors.csv'}")

    # create the graph file from the two csv
    g_export_name = export_file + '.json'

    # creating a dataframe with the a community and color
    nodes_df_with_group_and_color = CG.community_graph(links_df, nodes_df, g_export_name)

    # creating the graph file
    CG.generate_graph(nodes_df_with_group_and_color, links_df, g_export_name)


if __name__ == '__main__':
    main()
