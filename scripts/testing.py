import pandas as pd
import config as CONFIG
import re
import json

sign_df = pd.read_csv(CONFIG.sign_data_file)

# sign_dict = sign_df.apply(lambda x: x.dropna(), axis=1).to_dict(orient='index').values()
sign_series = sign_df.apply(lambda x: x.dropna().to_dict(), 1).groupby(sign_df.index // 2).apply(lambda x: x.to_dict())

sign_array = [i for i in sign_series]
# drop_morps = [
#     'HandshapeM2.2.0',
#     'HandshapeM3.2.0',
#     'HandshapeM4.2.0',
#     'HandshapeM5.2.0',
#     'HandshapeM6.2.0',
#     'MarkedHandshapeM2.2.0',
#     'MarkedHandshapeM3.2.0',
#     'MarkedHandshapeM4.2.0',
#     'MarkedHandshapeM5.2.0',
#     'MarkedHandshapeM6.2.0',
#     'SelectedFingersM2.2.0',
#     'SelectedFingersM3.2.0',
#     'SelectedFingersM4.2.0',
#     'SelectedFingersM5.2.0',
#     'SelectedFingersM6.2.0',
#     'FlexionM2.2.0',
#     'FlexionM3.2.0',
#     'FlexionM4.2.0',
#     'FlexionM5.2.0',
#     'FlexionM6.2.0',
#     'FlexionChangeM2.2.0',
#     'FlexionChangeM3.2.0',
#     'FlexionChangeM4.2.0',
#     'FlexionChangeM5.2.0',
#     'FlexionChangeM6.2.0',
#     'SpreadM2.2.0',
#     'SpreadM3.2.0',
#     'SpreadM4.2.0',
#     'SpreadM5.2.0',
#     'SpreadM6.2.0',
#     'SpreadChangeM2.2.0',
#     'SpreadChangeM3.2.0',
#     'SpreadChangeM4.2.0',
#     'SpreadChangeM5.2.0',
#     'SpreadChangeM6.2.0',
#     'ThumbPositionM2.2.0',
#     'ThumbPositionM3.2.0',
#     'ThumbPositionM4.2.0',
#     'ThumbPositionM5.2.0',
#     'ThumbPositionM6.2.0',
#     'ThumbContactM2.2.0',
#     'ThumbContactM3.2.0',
#     'ThumbContactM4.2.0',
#     'ThumbContactM5.2.0',
#     'ThumbContactM6.2.0',
#     'SignTypeM2.2.0',
#     'SignTypeM3.2.0',
#     'SignTypeM4.2.0',
#     'SignTypeM5.2.0',
#     'SignTypeM6.2.0',
#     'MovementM2.2.0',
#     'MovementM3.2.0',
#     'MovementM4.2.0',
#     'MovementM5.2.0',
#     'MovementM6.2.0',
#     'MajorLocationM2.2.0',
#     'MajorLocationM3.2.0',
#     'MajorLocationM4.2.0',
#     'MajorLocationM5.2.0',
#     'MajorLocationM6.2.0',
#     'MinorLocationM2.2.0',
#     'MinorLocationM3.2.0',
#     'MinorLocationM4.2.0',
#     'MinorLocationM5.2.0',
#     'MinorLocationM6.2.0',
#     'SecondMinorLocationM2.2.0',
#     'SecondMinorLocationM3.2.0',
#     'SecondMinorLocationM4.2.0',
#     'SecondMinorLocationM5.2.0',
#     'SecondMinorLocationM6.2.0',
#     'ContactM2.2.0',
#     'ContactM3.2.0',
#     'ContactM4.2.0',
#     'ContactM5.2.0',
#     'ContactM6.2.0',
#     'NonDominantHandshapeM2.2.0',
#     'NonDominantHandshapeM3.2.0',
#     'NonDominantHandshapeM4.2.0',
#     'NonDominantHandshapeM5.2.0',
#     'NonDominantHandshapeM6.2.0',
#     'UlnarRotationM2.2.0',
#     'UlnarRotationM3.2.0',
#     'UlnarRotationM4.2.0',
#     'UlnarRotationM5.2.0',
#     'UlnarRotationM6.2.0',
#     'Batch',
#     'Item',
#     'List',
# ]

# sign_df = pd.read_csv(CONFIG.sign_data_file)
# sign_df = sign_df.drop(columns=drop_morps)

# nodes_dict = sign_df.to_dict(orient='index').values()
# nodes_array = [i for i in nodes_dict]

# x = {
#     'nodes': nodes_array
# }

# g = CONFIG.new_data_folder / 'check-size.json'

# with open(g, 'w') as file:
#         json.dump(x, file)

