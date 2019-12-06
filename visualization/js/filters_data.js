var filters_data = {
  "unknown_percentage": [
    {
      "category": "percent_unknown",
      "label_name": "Percent Unknown",
      "data_attribute": "PercentUnknown",
      "type": "range",
      "range": {
        "slider_id": "percent_unknown_slider",
        "slider_label_id": "percent_unknown_slider_label",
        "min_value": "0.0",
        "max_value": "44.0"
      }
    }
  ],
  "duration": [
    {
      "category": "sign_length",
      "label_name": "Sign Length(ms)",
      "data_attribute": "SignLength(ms)",
      "type": "range",
      "range": {
        "slider_id": "sign_length_slider",
        "slider_label_id": "sign_length_slider_label",
        "min_value": "-434.0",
        "max_value": "2603.0"
      }
    },
    {
      "category": "clip_length",
      "label_name": "Clip Length(ms)",
      "data_attribute": "ClipLength(ms)",
      "type": "range",
      "range": {
        "slider_id": "clip_length_slider",
        "slider_label_id": "clip_length_slider_label",
        "min_value": "901.0",
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
      "data_attribute": "Neighborhood Density 2.0",
      "type": "range",
      "range": {
        "slider_id": "neighborhood_density_slider",
        "slider_label_id": "neighborhood_density_slider_label",
        "min_value": "0.0",
        "max_value": "32.0"
      }
    }
  ],
  "phonological": [
     {
      "category": "hand_shape",
      "label_name": "Hand Shape",
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
      "label_name": "Non Dominant Hand Shape",
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
      "category": "marked_hand_shape",
      "label_name": "Marked Hand Shape",
      "data_attribute": "MarkedHandshape.2.0",
      "type": "boolean",
      "true_id": "marked_hand_shape_true",
      "false_id": "marked_hand_shape_false"
    },
    {
      "category": "flexion_change",
      "label_name": "Flexion Change",
      "data_attribute": "FlexionChange.2.0",
      "type": "boolean",
      "true_id": "flexion_change_true",
      "false_id": "flexion_change_false"
    },
    {
      "category": "spread",
      "label_name": "Spread",
      "data_attribute": "Spread.2.0",
      "type": "boolean",
      "true_id": "spread_true",
      "false_id": "spread_false"
    },
    {
      "category": "spread_change",
      "label_name": "Spread Change",
      "data_attribute": "SpreadChange.2.0",
      "type": "boolean",
      "true_id": "spread_change_true",
      "false_id": "spread_change_false"
    },
    {
      "category": "thumb_position",
      "label_name": "Thumb Position",
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
      "data_attribute": "ThumbContact.2.0",
      "type": "boolean",
      "true_id": "thumb_contact_true",
      "false_id": "thumb_contact_false"
    },
    {
      "category": "sing_type",
      "label_name": "Sign Type",
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
      "label_name": "Fingers",
      "data_attribute": "SelectedFingers.2.0",
      "type": "categorical",
      "values": [
        {
          "value": "Index",
          "ID": "index"
        },
        {
          "value": "Middle",
          "ID": "middle"
        },
        {
          "value": "Ring",
          "ID": "ring"
        },
        {
          "value": "Pinky",
          "ID": "pinky"
        },
        {
          "value": "Thumb",
          "ID": "thumb"
        }
      ]
    },
    {
      "category": "flexion",
      "label_name": "Flexion",
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
    {
      "category": "minor_location",
      "label_name": "Minor Location",
      "data_attribute": "MinorLocation.2.0",
      "type": "categorical",
      "values": [
        {
          "value": "ForeHead",
          "ID": "forehead"
        },
        {
          "value": "FingerUlnar",
          "ID": "fingerulnar"
        },
        {
          "value": "ForearmBack",
          "ID": "forearmback"
        },
        {
          "value": "FingerRadial",
          "ID": "fingerradial"
        },
        {
          "value": "FingerFront",
          "ID": "fingerfront"
        },
        {
          "value": "Shoulder",
          "ID": "shoulder"
        },
        {
          "value": "ForearmFront",
          "ID": "forearmfront"
        },
        {
          "value": "TorsoTop",
          "ID": "torsotop"
        },
        {
          "value": "FingerBack",
          "ID": "fingerback"
        },
        {
          "value": "UpperArm",
          "ID": "upperarm"
        },
        {
          "value": "UnderChin",
          "ID": "underchin"
        },
        {
          "value": "Neck",
          "ID": "neck"
        },
        {
          "value": "ArmAway",
          "ID": "armaway"
        },
        {
          "value": "UpperLip",
          "ID": "upperlip"
        },
        {
          "value": "PalmBack",
          "ID": "palmback"
        },
        {
          "value": "Palm",
          "ID": "palm"
        },
        {
          "value": "ElbowBack",
          "ID": "elbowback"
        },
        {
          "value": "WristFront",
          "ID": "wristfront"
        },
        {
          "value": "TorsoBottom",
          "ID": "torsobottom"
        },
        {
          "value": "Other",
          "ID": "other_minor_location"
        },
        {
          "value": "CheekNose",
          "ID": "cheeknose"
        },
        {
          "value": "Waist",
          "ID": "waist"
        },
        {
          "value": "HeadTop",
          "ID": "headtop"
        },
        {
          "value": "WristBack",
          "ID": "wristback"
        },
        {
          "value": "Hips",
          "ID": "hips"
        },
        {
          "value": "ForearmUlnar",
          "ID": "forearmulnar"
        },
        {
          "value": "FingerTip",
          "ID": "fingertip"
        },
        {
          "value": "Eye",
          "ID": "eye"
        },
        {
          "value": "Heel",
          "ID": "heel"
        },
        {
          "value": "BodyAway",
          "ID": "bodyaway"
        },
        {
          "value": "TorsoMid",
          "ID": "torsomid"
        },
        {
          "value": "Neutral",
          "ID": "neutral_minor_location"
        }
      ]
    },
    {
      "category": "second_minor_location",
      "label_name": "Second Minor Location",
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
      "label_name": "Movement",
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
      "data_attribute": "RepeatedMovement.2.0",
      "type": "boolean",
      "true_id": "repeated_movement_true",
      "false_id": "repeated_movement_false"
    },
    {
      "category": "contact",
      "label_name": "Contact",
      "data_attribute": "Contact.2.0",
      "type": "boolean",
      "true_id": "contact_true",
      "false_id": "contact_false"
    },
    {
      "category": "ulnar_rotation",
      "label_name": "Ulnar Rotation",
      "data_attribute": "UlnarRotation.2.0",
      "type": "boolean",
      "true_id": "ulnar_rotation_true",
      "false_id": "ulnar_rotation_false"
    }
  ],
  "sign_frequency": [
    {
      "category": "frequency_M",
      "label_name": "Sign Frequency(M)",
      "data_attribute": "SignFrequency(M)",
      "type": "range",
      "range": {
        "slider_id": "frequency_M_slider",
        "slider_label_id": "frequency_M_slider_label",
        "min_value": "0.0",
        "max_value": "7.0"
      }
    }
    /*{
      "category": "frequency_M_native",
      "label_name": "Sign Frequency(M Native)",
      "data_attribute": "SignFrequency(M-Native)",
      "type": "range",
      "range": {
        "slider_id": "frequency_M_native_slider",
        "slider_label_id": "frequency_M_native_slider_label",
        "min_value": "1.0",
        "max_value": "7.0"
      }
    },
    {
      "category": "frequency_Z",
      "label_name": "Sign Frequency(Z)",
      "data_attribute": "SignFrequency(Z)",
      "type": "range",
      "range": {
        "slider_id": "frequency_Z_slider_slider",
        "slider_label_id": "frequency_Z_slider_label",
        "min_value": "-3.0",
        "max_value": "2.0"
      }
    },
    {
      "category": "frequency_SD",
      "label_name": "Sign Frequency(SD)",
      "data_attribute": "SignFrequency(SD)",
      "type": "range",
      "range": {
        "slider_id": "frequency_SD_slider",
        "slider_label_id": "frequency_SD_slider_label",
        "min_value": "0.0",
        "max_value": "3.0"
      }
    }*/
  ],
  "lexical": [
    {
      "category": "lexical_class",
      "label_name": "Lexical Class",
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
      "data_attribute": "Compound.2.0",
      "type": "boolean",
      "true_id": "compound_true",
      "false_id": "compound_false"
    },
    {
      "category": "initialized",
      "label_name": "Initialized",
      "data_attribute": "Initialized.2.0",
      "type": "boolean",
      "true_id": "initialized_true",
      "false_id": "initialized_false"
    },
    {
      "category": "fingerspelled_load_sign",
      "label_name": "Fingerspelled Loan Sign",
      "data_attribute": "FingerspelledLoanSign.2.0",
      "type": "boolean",
      "true_id": "fingerspelled_load_sign_true",
      "false_id": "fingerspelled_load_sign_true"
    }
  ],
  "iconicity": [
    {
      "category": "iconicity_M",
      "label_name": "Iconicity(M)",
      "data_attribute": "Iconicity(M)",
      "type": "range",
      "range": {
        "slider_id": "iconicity_M_slider",
        "slider_label_id": "iconicity_M_slider_label",
        "min_value": "1.0",
        "max_value": "9.0"
      }
    },
    {
      "category": "iconicity_N",
      "label_name": "Iconicity(N)",
      "data_attribute": "Iconicity(N)",
      "type": "range",
      "range": {
        "slider_id": "iconicity_N_slider",
        "slider_label_id": "iconicity_N_slider_label",
        "min_value": "2.0",
        "max_value": "403.0"
      }
    },
    {
      "category": "iconicity_Z",
      "label_name": "Iconicity(Z)",
      "data_attribute": "Iconicity(Z)",
      "type": "range",
      "range": {
        "slider_id": "iconicity_Z_slider",
        "slider_label_id": "iconicity_Z_slider_label",
        "min_value": "-2.0",
        "max_value": "3.0"
      }
    },       
    {
      "category": "iconicity_SD",
      "label_name": "Iconicity(SD)",
      "data_attribute": "Iconicity(SD)",
      "type": "range",
      "range": {
        "slider_id": "iconicity_SD_slider",
        "slider_label_id": "iconicity_SD_slider_label",
        "min_value": "0.0",
        "max_value": "3.0"
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