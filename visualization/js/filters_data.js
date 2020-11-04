var filters_data = {
    "unknown_percentage": [
        {
            "category": "percent_unknown",
            "label_name": "Sign Unknown (%)",
            "definition": "Percentage of deaf signing participants who did not know the sign (out of all deaf ASL signers)",
            "data_attribute": "PercentUnknown",
            "type": "range",
            "range": {
                "slider_id": "percent_unknown_slider",
                "slider_label_id": "percent_unknown_slider_label",
                "min_value": "0.0",
                "max_value": "1.0"
            }
        }
    ],
    "duration": [
        {
            "category": "sign_length",
            "label_name": "Duration (ms)",
            "definition": "Duration of sign (milliseconds)",
            "data_attribute": "SignDuration(ms)",
            "type": "range",
            "range": {
                "slider_id": "sign_length_slider",
                "slider_label_id": "sign_length_slider_label",
                "min_value": "200",
                "max_value": "2603.0"
            }
        },
        {
            "category": "clip_length",
            "label_name": "Video Length (ms)",
            "definition": "Duration of video clip (milliseconds)",
            "data_attribute": "ClipDuration(ms)",
            "type": "range",
            "range": {
                "slider_id": "clip_length_slider",
                "slider_label_id": "clip_length_slider_label",
                "min_value": "701.0",
                "max_value": "3737.0"

            }
        }
    ],
    "phonological_probability": [
        /*{
          "category": "complexity",
          "label_name": "Complexity",
          "data_attribute": "Complexity",
          "type": "range",
          "range": {
            "slider_id": "complexity_slider",
            "slider_label_id": "complexity_slider_label",
            "min_value": "0.0",
            "max_value": "6.0"
          }
        },*/
        {
            "category": "neighborhood_density",
            "label_name": "Neighborhood Density",
            "definition": "The number of signs that share all but at most one of the phonological properties",
            "data_attribute": "Neighborhood Density 2.0",
            "type": "range",
            "range": {
                "slider_id": "neighborhood_density_slider",
                "slider_label_id": "neighborhood_density_slider_label",
                "min_value": "0.0",
                "max_value": "50.0"
            }
        },
        {
            "category": "complexity",
            "label_name": "Complexity",
            "definition": "Complexity is calculated as described in Morgan, Novogrodsky, and Sandler (2019) which incremented complexity by 1 if the sign is asymmetrical with a different handshape, violates the symmetry or dominance conditions, uses selected fingers other than index or index middle ring and pinky, uses stacked or crossed flexion, has two types of movement, has three types of movement",
            "data_attribute": "Complexity",
            "type": "range",
            "range": {
                "slider_id": "complexity_slider",
                "slider_label_id": "complexity_slider_label",
                "min_value": "0.0",
                "max_value": "6.0"
            }
        },
        {
            "category": "phonotactic_probability",
            "label_name": "Phonotactic Probability",
            "definition": "The sum of the sublexical fequencies",
            "data_attribute": "PhonotacticProbability",
            "type": "range",
            "range": {
                "slider_id": "phonotactic_probability_slider",
                "slider_label_id": "phonotactic_probability_slider_label",
                "min_value": "-2.0",
                "max_value": "1.0"
            }
        },
        {
            "category": "parameter_neighborhood_density",
            "label_name": "Parameter Neighborhood Density",
            "definition": "The number of signs in the lexicon that share all but at most one of the following phonological features: Handshape, Major Location, and Path Movement",
            "data_attribute": "Parameter.Neighborhood.Density.2.0",
            "type": "range",
            "range": {
                "slider_id": "parameter_neighborhood_density_slider",
                "slider_label_id": "parameter_neighborhood_density_slider_label",
                "min_value": "1.0",
                "max_value": "563"
            }
        }
    ],
    "phonological": [
        {
            "category": "hand_shape",
            "label_name": "Hand Shape",
            "definition": "The unique combination of selected fingers, flexion, spread, thumb position, and thumb contact",
            "data_attribute": "Handshape.2.0",
            "type": "categorical",
            "values": [
                {
                    "value": "curved_v",
                    "ID": "curved_v"
                },
                {
                    "value": "i",
                    "ID": "i"
                },
                {
                    "value": "closed_e",
                    "ID": "closed_e"
                },
                {
                    "value": "flat_b",
                    "ID": "flat_b"
                },
                {
                    "value": "closed_b",
                    "ID": "closed_b"
                },
                {
                    "value": "y",
                    "ID": "y"
                },
                {
                    "value": "open_8",
                    "ID": "open_8"
                },
                {
                    "value": "s",
                    "ID": "s"
                },
                {
                    "value": "flat_v",
                    "ID": "flat_v"
                },
                {
                    "value": "o",
                    "ID": "o"
                },
                {
                    "value": "open_h",
                    "ID": "open_h"
                },
                {
                    "value": "flatspread_5",
                    "ID": "flatspread_5"
                },
                {
                    "value": "flat_1",
                    "ID": "flat_1"
                },
                {
                    "value": "f",
                    "ID": "f"
                },
                {
                    "value": "4",
                    "ID": "4"
                },
                {
                    "value": "8",
                    "ID": "8"
                },
                {
                    "value": "e",
                    "ID": "e"
                },
                {
                    "value": "goody_goody",
                    "ID": "goody_goody"
                },
                {
                    "value": "w",
                    "ID": "w"
                },
                {
                    "value": "flat_h",
                    "ID": "flat_h"
                },
                {
                    "value": "horns",
                    "ID": "horns"
                },
                {
                    "value": "3",
                    "ID": "3"
                },
                {
                    "value": "baby_o",
                    "ID": "baby_o"
                },
                {
                    "value": "k",
                    "ID": "k"
                },
                {
                    "value": "bent_l",
                    "ID": "bent_l"
                },
                {
                    "value": "7",
                    "ID": "7"
                },
                {
                    "value": "p",
                    "ID": "p"
                },
                {
                    "value": "r",
                    "ID": "r"
                },
                {
                    "value": "curved_5",
                    "ID": "curved_5"
                },
                {
                    "value": "open_b",
                    "ID": "open_b"
                },
                {
                    "value": "curved_b",
                    "ID": "curved_b"
                },
                {
                    "value": "l",
                    "ID": "l"
                },
                {
                    "value": "curved_4",
                    "ID": "curved_4"
                },
                {
                    "value": "flat_m",
                    "ID": "flat_m"
                },
                {
                    "value": "stacked_5",
                    "ID": "stacked_5"
                },
                {
                    "value": "spread_e",
                    "ID": "spread_e"
                },
                {
                    "value": "bent_v",
                    "ID": "bent_v"
                },
                {
                    "value": "flat_o",
                    "ID": "flat_o"
                },
                {
                    "value": "trip",
                    "ID": "trip"
                },
                {
                    "value": "v",
                    "ID": "v"
                },
                {
                    "value": "ily",
                    "ID": "ily"
                },
                {
                    "value": "c",
                    "ID": "c"
                },
                {
                    "value": "d",
                    "ID": "d"
                },
                {
                    "value": "bent_1",
                    "ID": "bent_1"
                },
                {
                    "value": "1",
                    "ID": "1"
                },
                {
                    "value": "flat_4",
                    "ID": "flat_4"
                },
                {
                    "value": "g",
                    "ID": "g"
                },
                {
                    "value": "curved_l",
                    "ID": "curved_l"
                },
                {
                    "value": "flat_ily",
                    "ID": "flat_ily"
                },
                {
                    "value": "open_e",
                    "ID": "open_e"
                },
                {
                    "value": "spread_open_e",
                    "ID": "spread_open_e"
                },
                {
                    "value": "flat_n",
                    "ID": "flat_n"
                },
                {
                    "value": "flat_horns",
                    "ID": "flat_horns"
                },
                {
                    "value": "5",
                    "ID": "5"
                },
                {
                    "value": "a",
                    "ID": "a"
                },
                {
                    "value": "curved_1",
                    "ID": "curved_1"
                },
                {
                    "value": "h",
                    "ID": "h"
                },
                {
                    "value": "curved_h",
                    "ID": "curved_h"
                }
            ]
        },
        {
            "category": "non_dominant_hand_shape",
            "label_name": "Nondominant Handshape",
            "definition": "The handshape of the nondominant hand",
            "data_attribute": "NonDominantHandshape.2.0",
            "type": "categorical",
            "values": [
                {
                    "value": "curved_v",
                    "ID": "curved_v_ndhs"
                },
                {
                    "value": "closed_e",
                    "ID": "closed_e_ndhs"
                },
                {
                    "value": "flat_b",
                    "ID": "flat_b_ndhs"
                },
                {
                    "value": "closed_b",
                    "ID": "closed_b_ndhs"
                },
                {
                    "value": "y",
                    "ID": "y_ndhs"
                },
                {
                    "value": "open_8",
                    "ID": "open_8_ndhs"
                },
                {
                    "value": "s",
                    "ID": "s_ndhs"
                },
                {
                    "value": "flat_v",
                    "ID": "flat_v_ndhs"
                },
                {
                    "value": "o",
                    "ID": "o_ndhs"
                },
                {
                    "value": "DominanceConditionViolation",
                    "ID": "dominance_condition_violation_ndhs"
                },
                {
                    "value": "open_h",
                    "ID": "open_h_ndhs"
                },
                {
                    "value": "flatspread_5",
                    "ID": "flatspread_5_ndhs"
                },
                {
                    "value": "flat_1",
                    "ID": "flat_1_ndhs"
                },
                {
                    "value": "f",
                    "ID": "f_ndhs"
                },
                {
                    "value": "4",
                    "ID": "4_ndhs"
                },
                {
                    "value": "8",
                    "ID": "8_ndhs"
                },
                {
                    "value": "e",
                    "ID": "e_ndhs"
                },
                {
                    "value": "w",
                    "ID": "w_ndhs"
                },
                {
                    "value": "S",
                    "ID": "S_ndhs"
                },
                {
                    "value": "flat_h",
                    "ID": "flat_h_ndhs"
                },
                {
                    "value": "horns",
                    "ID": "horns_ndhs"
                },
                {
                    "value": "A",
                    "ID": "A_ndhs"
                },
                {
                    "value": "3",
                    "ID": "3_ndhs"
                },
                {
                    "value": "baby_o",
                    "ID": "baby_o_ndhs"
                },
                {
                    "value": "bent_l",
                    "ID": "bent_l_ndhs"
                },
                {
                    "value": "O",
                    "ID": "O_ndhs"
                },
                {
                    "value": "p",
                    "ID": "p_ndhs"
                },
                {
                    "value": "r",
                    "ID": "r_ndhs"
                },
                {
                    "value": "curved_5",
                    "ID": "curved_5_ndhs"
                },
                {
                    "value": "open_b",
                    "ID": "open_b_ndhs"
                },
                {
                    "value": "curved_b",
                    "ID": "curved_b_ndhs"
                },
                {
                    "value": "l",
                    "ID": "l_ndhs"
                },
                {
                    "value": "SymmetryViolation",
                    "ID": "symmetry_violation_ndhs"
                },
                {
                    "value": "curved_4",
                    "ID": "curved_4_ndhs"
                },
                {
                    "value": "flat_m",
                    "ID": "flat_m_ndhs"
                },
                {
                    "value": "stacked_5",
                    "ID": "stacked_5_ndhs"
                },
                {
                    "value": "spread_e",
                    "ID": "spread_e_ndhs"
                },
                {
                    "value": "bent_v",
                    "ID": "bent_v_ndhs"
                },
                {
                    "value": "C",
                    "ID": "C_ndhs"
                },
                {
                    "value": "flat_o",
                    "ID": "flat_o_ndhs"
                },
                {
                    "value": "Lax",
                    "ID": "Lax_ndhs"
                },
                {
                    "value": "trip",
                    "ID": "trip_ndhs"
                },
                {
                    "value": "v",
                    "ID": "v_ndhs"
                },
                {
                    "value": "ily",
                    "ID": "ily_ndhs"
                },
                {
                    "value": "c",
                    "ID": "c_ndhs"
                },
                {
                    "value": "d",
                    "ID": "d_ndhs"
                },
                {
                    "value": "bent_1",
                    "ID": "bent_1_ndhs"
                },
                {
                    "value": "1",
                    "ID": "1_ndhs"
                },
                {
                    "value": "flat_4",
                    "ID": "flat_4_ndhs"
                },
                {
                    "value": "g",
                    "ID": "g_ndhs"
                },
                {
                    "value": "curved_l",
                    "ID": "curved_l_ndhs"
                },
                {
                    "value": "open_e",
                    "ID": "open_e_ndhs"
                },
                {
                    "value": "spread_open_e",
                    "ID": "spread_open_e_ndhs"
                },
                {
                    "value": "flat_n",
                    "ID": "flat_n_ndhs"
                },
                {
                    "value": "B",
                    "ID": "B_ndhs"
                },
                {
                    "value": "flat_horns",
                    "ID": "flat_horns_ndhs"
                },
                {
                    "value": "5",
                    "ID": "5_ndhs"
                },
                {
                    "value": "a",
                    "ID": "a_ndhs"
                },
                {
                    "value": "curved_1",
                    "ID": "curved_1_ndhs"
                },
                {
                    "value": "h",
                    "ID": "h_ndhs"
                }
            ]
        },
        {
            "category": "flexion_change",
            "label_name": "Flexion Change",
            "definition": "Whether or not the aperture changes",
            "data_attribute": "FlexionChange.2.0",
            "type": "boolean",
            "true_id": "flexion_change_true",
            "false_id": "flexion_change_false"
        },
        {
            "category": "spread",
            "label_name": "Spread",
            "definition": "Spread of the selected fingers",
            "data_attribute": "Spread.2.0",
            "type": "boolean",
            "true_id": "spread_true",
            "false_id": "spread_false"
        },
        {
            "category": "spread_change",
            "label_name": "Spread Change",
            "definition": "Whether or not the spread changes",
            "data_attribute": "SpreadChange.2.0",
            "type": "boolean",
            "true_id": "spread_change_true",
            "false_id": "spread_change_false"
        },
        {
            "category": "thumb_position",
            "label_name": "Thumb Position",
            "definition": "Position of the thumb",
            "data_attribute": "ThumbPosition.2.0",
            "type": "categorical",
            "values": [
                {
                    "value": "Open",
                    "ID": "open"
                },
                {
                    "value": "Closed",
                    "ID": "closed"
                }
            ]
        },
        {
            "category": "thumb_contact",
            "label_name": "Thumb Contact",
            "definition": "Whether or not the thumb contacts the selected fingers",
            "data_attribute": "ThumbContact.2.0",
            "type": "boolean",
            "true_id": "thumb_contact_true",
            "false_id": "thumb_contact_false"
        },
        {
            "category": "sing_type",
            "label_name": "Sign Type",
            "definition": "Symmetry of the hands according to Battison's sign types",
            "data_attribute": "SignType.2.0",
            "type": "categorical",
            "values": [
                {
                    "value": "OneHanded",
                    "ID": "onehanded"
                },
                {
                    "value": "SymmetricalOrAlternating",
                    "ID": "symmetricaloralternating"
                },
                {
                    "value": "AsymmetricalSameHandshape",
                    "ID": "asymmetricalsamehandshape"
                },
                {
                    "value": "AsymmetricalDifferentHandshape",
                    "ID": "asymmetricaldiffhandshape"
                },
                {
                    "value": "DominanceViolation",
                    "ID": "dominanceviolation"
                },
                {
                    "value": "SymmetryViolation",
                    "ID": "symmetryviolation"
                }
            ]
        },
        {
            "category": "fingers",
            "label_name": "Selected Fingers",
            "definition": "Fingers that are moving or foregrounded in the first morpheme of the sign; Thumb is ignored unless it is the only selected finger in the sign",
            "data_attribute": "SelectedFingers.2.0",
            "type": "categorical",
            "values": [
                {
                    "value": "Index",
                    "ID": "index",
                    "filter_by": "i"
                },
                {
                    "value": "Middle",
                    "ID": "middle",
                    "filter_by": "m"
                },
                {
                    "value": "Ring",
                    "ID": "ring",
                    "filter_by": "r"

                },
                {
                    "value": "Pinky",
                    "ID": "pinky",
                    "filter_by": "p"

                },
                {
                    "value": "Thumb",
                    "ID": "thumb",
                    "filter_by": "t"

                },
                {
                    "value": "Middle and Ring",
                    "ID": "mr",
                    "filter_by": "mr"

                },
                {
                    "value": "Middle, Ring and Pinky",
                    "ID": "mrp",
                    "filter_by": "mrp"

                },
                {
                    "value": "Index, Middle, Ring and Pinky",
                    "ID": "imrp",
                    "filter_by": "imrp"

                },
                {
                    "value": "Index and Pinky",
                    "ID": "ip",
                    "filter_by": "ip"

                },
                {
                    "value": "Index, Middle and Pinky",
                    "ID": "imp",
                    "filter_by": "imp"

                },
                {
                    "value": "Index and Middle",
                    "ID": "im",
                    "filter_by": "im"

                },
                {
                    "value": "Index, Middle and Ring",
                    "ID": "imr",
                    "filter_by": "imr"

                },
            ]
        },
        {
            "category": "flexion",
            "label_name": "Flexion",
            "definition": "Aperture of the selected fingers of the dominant hand at sign onset",
            "data_attribute": "Flexion.2.0",
            "type": "categorical",
            "values": [
                {
                    "value": "Curved",
                    "ID": "curved_flexion"
                },
                {
                    "value": "Stacked",
                    "ID": "stacked"
                },
                {
                    "value": "FullyClosed",
                    "ID": "fullyclosed"
                },
                {
                    "value": "Flat",
                    "ID": "FullyOpen"
                },
                {
                    "value": "Crossed",
                    "ID": "corssed"
                },
                {
                    "value": "Bent",
                    "ID": "bents"
                }
            ]
        },
        {
            "category": "major_location",
            "label_name": "Major Location",
            "definition": "General location of the dominant hand at sign onset",
            "data_attribute": "MajorLocation.2.0",
            "type": "categorical",
            "values": [
                {
                    "value": "Head",
                    "ID": "head"
                },
                {
                    "value": "Arm",
                    "ID": "arm"
                },
                {
                    "value": "Body",
                    "ID": "body"
                },
                {
                    "value": "Hand",
                    "ID": "hand"
                },
                {
                    "value": "Neutral",
                    "ID": "neutral_major_location"
                },
                {
                    "value": "Other",
                    "ID": "other_major_location"
                }
            ]
        },
        // {
        //   "category": "minor_location",
        //   "label_name": "Minor Location",
        //   "definition": "Specific location of the dominant hand at sign onset",
        //   "data_attribute": "MinorLocation.2.0",
        //   "type": "categorical",
        //   "values": [
        //     {
        //       "value": "ForeHead",
        //       "ID": "forehead"
        //     },
        //     {
        //       "value": "FingerUlnar",
        //       "ID": "fingerulnar"
        //     },
        //     {
        //       "value": "ForearmBack",
        //       "ID": "forearmback"
        //     },
        //     {
        //       "value": "FingerRadial",
        //       "ID": "fingerradial"
        //     },
        //     {
        //       "value": "FingerFront",
        //       "ID": "fingerfront"
        //     },
        //     {
        //       "value": "Shoulder",
        //       "ID": "shoulder"
        //     },
        //     {
        //       "value": "ForearmFront",
        //       "ID": "forearmfront"
        //     },
        //     {
        //       "value": "TorsoTop",
        //       "ID": "torsotop"
        //     },
        //     {
        //       "value": "FingerBack",
        //       "ID": "fingerback"
        //     },
        //     {
        //       "value": "UpperArm",
        //       "ID": "upperarm"
        //     },
        //     {
        //       "value": "UnderChin",
        //       "ID": "underchin"
        //     },
        //     {
        //       "value": "Neck",
        //       "ID": "neck"
        //     },
        //     {
        //       "value": "ArmAway",
        //       "ID": "armaway"
        //     },
        //     {
        //       "value": "UpperLip",
        //       "ID": "upperlip"
        //     },
        //     {
        //       "value": "PalmBack",
        //       "ID": "palmback"
        //     },
        //     {
        //       "value": "Palm",
        //       "ID": "palm"
        //     },
        //     {
        //       "value": "ElbowBack",
        //       "ID": "elbowback"
        //     },
        //     {
        //       "value": "WristFront",
        //       "ID": "wristfront"
        //     },
        //     {
        //       "value": "TorsoBottom",
        //       "ID": "torsobottom"
        //     },
        //     {
        //       "value": "Other",
        //       "ID": "other_minor_location"
        //     },
        //     {
        //       "value": "CheekNose",
        //       "ID": "cheeknose"
        //     },
        //     {
        //       "value": "Waist",
        //       "ID": "waist"
        //     },
        //     {
        //       "value": "HeadTop",
        //       "ID": "headtop"
        //     },
        //     {
        //       "value": "WristBack",
        //       "ID": "wristback"
        //     },
        //     {
        //       "value": "Hips",
        //       "ID": "hips"
        //     },
        //     {
        //       "value": "ForearmUlnar",
        //       "ID": "forearmulnar"
        //     },
        //     {
        //       "value": "FingerTip",
        //       "ID": "fingertip"
        //     },
        //     {
        //       "value": "Eye",
        //       "ID": "eye"
        //     },
        //     {
        //       "value": "Heel",
        //       "ID": "heel"
        //     },
        //     {
        //       "value": "BodyAway",
        //       "ID": "bodyaway"
        //     },
        //     {
        //       "value": "TorsoMid",
        //       "ID": "torsomid"
        //     },
        //     {
        //       "value": "Neutral",
        //       "ID": "neutral_minor_location"
        //     }
        //   ]
        // },
        {
            "category": "second_minor_location",
            "label_name": "Second Minor Location",
            "definition": "Second specific location of the dominant hand in signs with a setting change",
            "data_attribute": "SecondMinorLocation.2.0",
            "type": "categorical",
            "values": [
                {
                    "value": "Forehead",
                    "ID": "forehead_sml"
                },
                {
                    "value": "FingerUlnar",
                    "ID": "fingerulnar_sml"
                },
                {
                    "value": "ForearmBack",
                    "ID": "forearmback_sml"
                },
                {
                    "value": "Chin",
                    "ID": "chin_sml"
                },
                {
                    "value": "FingerFront",
                    "ID": "fingerfront_sml"
                },
                {
                    "value": "FingerRadial",
                    "ID": "fingerradial_sml"
                },
                {
                    "value": "ForearmFront",
                    "ID": "forearmfront_sml"
                },
                {
                    "value": "Shoulder",
                    "ID": "shoulder_sml"
                },
                {
                    "value": "TorsoTop",
                    "ID": "torsotop_sml"
                },
                {
                    "value": "FingerBack",
                    "ID": "fingerback_sml"
                },
                {
                    "value": "Mouth",
                    "ID": "mouth_sml"
                },
                {
                    "value": "UpperArm",
                    "ID": "upperarm_sml"
                },
                {
                    "value": "HeadAway",
                    "ID": "headaway_sml"
                },
                {
                    "value": "UnderChin",
                    "ID": "underchin_sml"
                },
                {
                    "value": "Neck",
                    "ID": "neck_sml"
                },
                {
                    "value": "ArmAway",
                    "ID": "armaway_sml"
                },
                {
                    "value": "UpperLip",
                    "ID": "upperlip_sml"
                },
                {
                    "value": "PalmBack",
                    "ID": "palmback_sml"
                },
                {
                    "value": "Palm",
                    "ID": "palm_sml"
                },
                {
                    "value": "HandAway",
                    "ID": "handaway_sml"
                },
                {
                    "value": "TorsoBottom",
                    "ID": "torsobottom_sml"
                },
                {
                    "value": "Other",
                    "ID": "other_sml"
                },
                {
                    "value": "OtherAway",
                    "ID": "otheraway_sml"
                },
                {
                    "value": "CheekNose",
                    "ID": "cheeknose_sml"
                },
                {
                    "value": "ForearmUlnar",
                    "ID": "forearmulnar_sml"
                },
                {
                    "value": "Heel",
                    "ID": "heel_sml"
                },
                {
                    "value": "Eye",
                    "ID": "eye_sml"
                },
                {
                    "value": "BodyAway",
                    "ID": "bodyaway_sml"
                },
                {
                    "value": "TorsoMid",
                    "ID": "torsomid_sml"
                },
                {
                    "value": "Neutral",
                    "ID": "neutral_sml"
                },
                {
                    "value": "ForearmRadial",
                    "ID": "forearmradial_sml"
                }
            ]
        },
        {
            "category": "movement",
            "label_name": "Path Movement",
            "definition": "Path movement of the first morpheme in the sign",
            "data_attribute": "Movement.2.0",
            "type": "categorical",
            "values": [
                {
                    "value": "Straight",
                    "ID": "straight"
                },
                {
                    "value": "Curved",
                    "ID": "curved_movement"
                },
                {
                    "value": "BackAndForth",
                    "ID": "backandforth"
                },
                {
                    "value": "Circular",
                    "ID": "circular"
                },
                {
                    "value": "None",
                    "ID": "none"
                },
                {
                    "value": "Other",
                    "ID": "other_movement"
                },
                {
                    "value": "X-shaped",
                    "ID": "X-shaped"
                },
                {
                    "value": "Z-shaped",
                    "ID": "Z-shaped"
                }
            ]
        },
        {
            "category": "repeated_movement",
            "label_name": "Repeated Movement",
            "definition": "Whether or not the movement (path movement, wrist twist, handshape change) repeats",
            "data_attribute": "RepeatedMovement.2.0",
            "type": "boolean",
            "true_id": "repeated_movement_true",
            "false_id": "repeated_movement_false"
        },
        {
            "category": "contact",
            "label_name": "Contact",
            "definition": "Whether or not the dominant contacts the major location (or the other hand in symmetrical signs)",
            "data_attribute": "Contact.2.0",
            "type": "boolean",
            "true_id": "contact_true",
            "false_id": "contact_false"
        },
        {
            "category": "ulnar_rotation",
            "label_name": "Wrist Twist",
            "definition": "Whether or not the wrist twists",
            "data_attribute": "UlnarRotation.2.0",
            "type": "boolean",
            "true_id": "ulnar_rotation_true",
            "false_id": "ulnar_rotation_false"
        }
    ],
    "sign_frequency": [
        {
            "category": "frequency_M",
            "label_name": "Frequency",
            "definition": "Mean subjective frequency rating for all deaf ASL signers (1 = very infrequent, 7=very frequent)",
            "data_attribute": "SignFrequency(M)",
            "type": "range",
            "range": {
                "slider_id": "frequency_M_slider",
                "slider_label_id": "frequency_M_slider_label",
                "min_value": "1.0",
                "max_value": "7.0"
            }
        }
    ],
    "lexical": [
        {
            "category": "lexical_class",
            "label_name": "Lexical Class",
            "definition": "The sign's lexical class (Adjective, Adverb, Name, Noun, Number, Verb, and Minor: Preposition, Pronoun, Conjunction)",
            "data_attribute": "LexicalClass",
            "type": "categorical",
            "values": [
                {
                    "value": "Name",
                    "ID": "name"
                },
                {
                    "value": "Verb",
                    "ID": "verb"
                },
                {
                    "value": "Noun",
                    "ID": "noun"
                },
                {
                    "value": "Adjective",
                    "ID": "adjective"
                },
                {
                    "value": "Gesture",
                    "ID": "gesture"
                },
                {
                    "value": "Adverb",
                    "ID": "adverb"
                },
                {
                    "value": "Minor",
                    "ID": "minor"
                },
                {
                    "value": "Number",
                    "ID": "number"
                },
                {
                    "value": "Noun/Adjective",
                    "ID": "noun-adjective"
                }
            ]
        },
        {
            "category": "compound",
            "label_name": "Compound",
            "definition": "Whether or not the sign is a compound. Compounds are signs that include more than one free morpheme, and morpheme boundaries are often indicated by a change in selected fingers or major location",
            "data_attribute": "Compound.2.0",
            "type": "boolean",
            "true_id": "compound_true",
            "false_id": "compound_false"
        },
        {
            "category": "initialized",
            "label_name": "Initialized Sign",
            "definition": "Whether or not handshape of the sign is the first letter of the English translation",
            "data_attribute": "Initialized.2.0",
            "type": "boolean",
            "true_id": "initialized_true",
            "false_id": "initialized_false"
        },
        {
            "category": "fingerspelled_load_sign",
            "label_name": "Fingerspelled Loan Sign",
            "definition": "Whether or not sign includes more than one letter of the manual alphabet",
            "data_attribute": "FingerspelledLoanSign.2.0",
            "type": "boolean",
            "true_id": "fingerspelled_load_sign_true",
            "false_id": "fingerspelled_load_sign_false"
        }
    ],
    "iconicity": [
        {
            "category": "iconicity_M",
            "label_name": "Non-Signer Iconicity",
            "definition": "Mean iconicity rating from hearing non-signers (1=not iconic at all; 7=very iconic)",
            "data_attribute": "Iconicity(M)",
            "type": "range",
            "range": {
                "slider_id": "iconicity_M_slider",
                "slider_label_id": "iconicity_M_slider_label",
                "min_value": "1.0",
                "max_value": "7.0"
            }
        },
        {
            "category": "iconicity_M_D_all",
            "label_name": "Deaf Signer Iconicity",
            "definition": "Mean iconicity rating from all deaf ASL signers (1=not iconic at all; 7=very iconic)",
            "data_attribute": "D.Iconicity(M) all",
            "type": "range",
            "range": {
                "slider_id": "iconicity_M_D_all_slider",
                "slider_label_id": "iconicity_M_D_all_slider_label",
                "min_value": "1.0",
                "max_value": "7.0"
            }
        },
        {
            "category": "transparency_M",
            "label_name": "Transparency",
            "definition": "Mean transparency rating from hearing non-signers; participants guessed the meaning of the sign and rated how obvious the meaning would be to others (1=not obvious at all; 7=very obvious)",
            "data_attribute": "Transparency(M)",
            "type": "range",
            "range": {
                "slider_id": "transparency_M_slider",
                "slider_label_id": "transparency_M_slider_label",
                "min_value": "1.0",
                "max_value": "7.0"
            }
        }
    ],
    "aoa": [
        {
            "category": "age_of_acquisition",
            "label_name": "Age Of Acquisition",
            "definition": "The age (in months) at which children in Caselli, Lieberman, & Pyers (2020) learned a sign as predicted using a Bayesian Generalized Linear Model",
            "data_attribute": "bglm_aoa",
            "type": "range",
            "range": {
                "slider_id": "age_of_acquisition_slider",
                "slider_label_id": "age_of_acquisition_label",
                "min_value": "14.0",
                "max_value": "67.0"
            }
        },
        {
            "category": "age_of_acquisition_empirical",
            "label_name": "Age Of Acquisition (Empirical)",
            "definition": "The age (in months) at which a sign is expected to be acquired estimated by identifying the minimum age (rounded to whole months) at which all children in an age group can produce the sign, see Caselli, Lieberman, & Pyers (2020)",
            "data_attribute": "empirical_aoa",
            "type": "range",
            "range": {
                "slider_id": "age_of_acquisition_empirical_slider",
                "slider_label_id": "age_of_acquisition_empirical_label",
                "min_value": "9.0",
                "max_value": "60.0"
            }
        }
    ],
    "english_translation": [
        {
            "category": "h_index",
            "label_name": "English Translation Agreement",
            "definition": "A measure of naming agreement (naming diversity) among hearing non-signers for each sign, where value of zero indicates perfect agreement",
            "data_attribute": "H statistic",
            "type": "range",
            "range": {
                "slider_id": "english_translation_slider",
                "slider_label_id": "english_translation_label",
                "min_value": "0.0",
                "max_value": "1.0"
            }
        }
    ]
    /*"density": [
      {
        "category": "minimal_density",
        "label_name": "Minimal Density",
        "data_attribute": "MinimalNeighborhoodDensity",
        "type": "range",
        "range": {
          "slider_id": "minimal_density_slider",
          "slider_label_id": "minimal_density_slider_label",
          "min_value": "352.0",
          "max_value": "943.0"
        }
      },
      {
        "category": "maximal_density",
        "label_name": "Maximal Density",
        "data_attribute": "MaximalNeighborhoodDensity",
        "type": "range",
        "range": {
          "slider_id": "maximal_density_slider",
          "slider_label_id": "maximal_density_slider_label",
          "min_value": "0.0",
          "max_value": "118.0"
        }
      },
      {
        "category": "parameter_based_density",
        "label_name": "Parameter-Based Density",
        "data_attribute": "Parameter-BasedNeighborhoodDensity",
        "type": "range",
        "range": {
          "slider_id": "parameter_based_density_slider",
          "slider_label_id": "parameter_based_density_slider_label",
          "min_value": "0.0",
          "max_value": "32.0"
        }
      }
    ]*/

}
