var filters_data = {     
               
                   "phonological": [
                                {"category": "sing_type",
                                "label_name":"Sign Type",
                                "data_attribute":"SignType.2.0",
                                "type":"categorical",
                                 "values":[ 
                                 {"value":"OneHanded", "ID":"onehanded"},
                                 {"value":"SymmetricalOrAlternating", "ID":"symmetricaloralternating"},
                                 {"value":"AsymmetricalSameHandshape", "ID":"asymmetricalsamehandshape"},
                                 {"value":"AsymmetricalDifferentHandshape", "ID":"asymmetricaldiffhandshape"},
                                 {"value":"DominanceViolation", "ID":"dominanceviolation"},
                                 {"value":"SymmetryViolation", "ID":"symmetryviolation"}
                                 ]},
                              {"category": "fingers",
                              "label_name":"Fingers",
                              "data_attribute":"SelectedFingers.2.0",                              
                              "type":"categorical",
                              "values":[ 
                                 {"value":"Index", "ID":"index"},
                                 {"value":"Middle", "ID":"middle"},
                                 {"value":"Ring", "ID":"ring"},
                                 {"value":"Pinky", "ID":"pinky"},
                                 {"value":"Thumb", "ID":"thumb"}
                             ]},
                            {"category":"flexion",
                            "label_name":"Flexion",
                            "data_attribute":"Flexion.2.0",
                             "type":"categorical",
                             "values":[ 
                                 {"value":"Curved", "ID":"curved"},
                                 {"value":"Stacked", "ID":"stacked"},
                                 {"value":"FullyClosed", "ID":"fullyclosed"},
                                 {"value":"Flat", "ID":"FullyOpen"},
                                 {"value":"Crossed", "ID":"corssed"},
                                 {"value":"Bent", "ID":"bents"}
                                 //{"value":"Null", "ID":"null"}
                             ]},
                             {"category": "major_location",
                              "label_name":"Major Location",
                              "data_attribute":"MajorLocation.2.0",
                              "type":"categorical",
                              "values":[
                                       {"value":"Head", "ID":"head"},
                                       {"value":"Arm", "ID":"arm"},
                                       {"value":"Body", "ID":"body"},
                                       {"value":"Hand", "ID":"hand"},
                                       {"value":"Neutral", "ID":"neutral"},
                                       {"value":"Other", "ID":"other"}
                              ]},
                              {"category": "minor_location",
                               "label_name":"Minor Location",
                              "data_attribute":"MinorLocation.2.0",
                              "type":"categorical",
                               "values":[
                                       {"value":"ForeHead", "ID":"forehead"},
                                       {"value":"FingerUlnar", "ID":"fingerulnar"},
                                       {"value":"ForearmBack", "ID":"forearmback"},
                                       {"value":"FingerRadial", "ID":"fingerradial"},
                                       {"value":"FingerFront", "ID":"fingerfront"},
                                       {"value":"Shoulder", "ID":"shoulder"},
                                       {"value":"ForearmFront", "ID":"forearmfront"},
                                       {"value":"TorsoTop", "ID":"torsotop"},
                                       {"value":"FingerBack", "ID":"fingerback"},
                                       {"value":"UpperArm", "ID":"upperarm"},
                                       {"value":"UnderChin", "ID":"underchin"},
                                       {"value":"Neck", "ID":"neck"},
                                       {"value":"ArmAway", "ID":"armaway"},
                                       {"value":"UpperLip", "ID":"upperlip"},
                                       {"value":"PalmBack", "ID":"palmback"},
                                       {"value":"Palm", "ID":"palm"},
                                       {"value":"ElbowBack", "ID":"elbowback"},
                                       {"value":"WristFront", "ID":"wristfront"},
                                       {"value":"TorsoBottom", "ID":"torsobottom"},
                                       {"value":"Other", "ID":"other"},
                                       {"value":"CheekNose", "ID":"cheeknose"},
                                       {"value":"Waist", "ID":"waist"},
                                       {"value":"HeadTop", "ID":"headtop"},
                                       {"value":"WristBack", "ID":"wristback"},
                                       {"value":"Hips", "ID":"hips"},
                                       {"value":"ForearmUlnar", "ID":"forearmulnar"},
                                       {"value":"FingerTip", "ID":"fingertip"},
                                       {"value":"Eye", "ID":"eye"},
                                       {"value":"Heel", "ID":"heel"},
                                       {"value":"BodyAway", "ID":"bodyaway"},
                                       {"value":"TorsoMid", "ID":"torsomid"},
                                       {"value":"Neutral", "ID":"neutral"}
                                    ]},
                              {"category":"movement",
                               "label_name":"Movement",
                              "data_attribute":"Movement.2.0",
                              "type":"categorical",
                               "values":[
                                       {"value":"Straight", "ID":"straight"},
                                       {"value":"Curved", "ID":"curved"},
                                       {"value":"BackAndForth", "ID":"backandforth"},
                                       {"value":"Circular", "ID":"circular"},
                                       {"value":"None", "ID":"none"},
                                       {"value":"Other", "ID":"other"},
                                       {"value":"X-shaped", "ID":"X-shaped"},
                                       {"value":"Z-shaped", "ID":"Z-shaped"}
                                    ]}
                ],
                "sign_frequency": [
                           {"category":"frequency_M",
                           "label_name":"Sign Frequency(M)",
                           "data_attribute":"SignFrequency(M)",
                            "type":"range",
                            "range":{
                                "min_id":"frequency_M_slider_min",
                                "max_id": "frequency_M_slider_max",
                                "min_value": "0.0",
                                "max_value": "7.0"                                     
                            }},
                           {"category":"frequency_M_native",
                           "label_name":"Sign Frequency(M Native)",
                           "data_attribute":"SignFrequency(M-Native)",
                           "type":"range",
                           "range":{
                              "min_id":"frequency_M_native_slider_min",
                              "max_id": "frequency_M_native_slider_max",
                              "min_value": "1.0",
                              "max_value": "7.0"                                       
                            }},
                           {"category":"frequency_Z",
                           "label_name":"Sign Frequency(Z)",
                           "data_attribute":"SignFrequency(Z)",
                           "type":"range",
                            "range":{
                                "min_id":"frequency_Z_slider_min",
                                "max_id": "frequency_Z_slider_max",
                                "min_value": "-3.0",
                                "max_value": "2.0"                                       
                            }},
                           {"category":"frequency_SD",
                           "label_name":"Sign Frequency(SD)",
                           "data_attribute":"SignFrequency(SD)",
                           "type":"range",
                            "range":{
                                "min_id":"frequency_SD_slider_min",
                                "max_id": "frequency_SD_slider_max",
                                "min_value": "0.0",
                                "max_value": "3.0"                                       
                          }}
                ],

                "lexical": [
                                {"category": "lexical_class",
                                "label_name":"Lexical Class",
                                "data_attribute":"LexicalClass",
                                "type":"categorical",
                                 "values":[ 
                                 {"value":"Name", "ID":"name"},
                                 {"value":"Verb", "ID":"verb"},
                                 {"value":"Noun", "ID":"noun"},
                                 {"value":"Adjective", "ID":"adjective"},
                                 {"value":"Gesture", "ID":"gesture"},
                                 {"value":"Adverb", "ID":"adverb"},
                                 {"value":"Minor", "ID":"minor"},
                                 {"value":"Number", "ID":"number"},
                                 {"value":"Noun/Adjective", "ID":"noun-adjective"}]
                                 //{"value":"None", "ID":"none"}
                                 },
                                 {"category": "compound",
                                 "label_name":"Compound",
                                 "data_attribute":"Compound.2.0",                              
                                 "type":"boolean",
                                 "true_id":"compound_true",
                                 "false_id":"compound_false"                            
                                },
                                {"category":"initialized",
                                "label_name":"Initialized",
                                "data_attribute":"Initialized.2.0",
                                "type":"boolean",
                                "true_id":"initialized_true",
                                 "false_id":"initialized_false"
                                },
                               {"category": "fingerspelled_load_sign",
                              "label_name":"Fingerspelled Loan Sign",
                              "data_attribute":"FingerspelledLoanSign.2.0",
                              "type":"boolean",
                              "true_id":"fingerspelled_load_sign_true",
                              "false_id":"fingerspelled_load_sign_true"                             
                              }
                      ],
                "iconicity": [
                           {"category":"iconicity_M",
                           "label_name":"Iconicity(M)",
                           "data_attribute":"Iconicity(M)",
                            "type":"range",
                            "range":{
                                "min_id":"iconicity_M_slider_min",
                                "max_id": "iconicity_M_slider_max",
                                "min_value": "1.0",
                                "max_value": "9.0"                                       
                            }},
                            {"category":"iconicity_N",
                           "label_name":"Iconicity(N)",
                           "data_attribute":"Iconicity(N)",
                            "type":"range",
                            "range":{
                                "min_id":"iconicity_N_slider_min",
                                "max_id": "iconicity_N_slider_max",
                                "min_value": "2.0",
                                "max_value": "403.0"                                       
                            }},
                            {"category":"iconicity_Z",
                           "label_name":"Iconicity(Z)",
                           "data_attribute":"Iconicity(Z)",
                            "type":"range",
                            "range":{
                                "min_id":"iconicity_Z_slider_min",
                                "max_id": "iconicity_Z_slider_max",
                                "min_value": "-2.0",
                                "max_value": "3.0"                                        
                            }}, 
                            {"category":"iconicity_SD",
                           "label_name":"Iconicity(SD)",
                           "data_attribute":"Iconicity(SD)",
                            "type":"range",
                            "range":{
                                "min_id":"iconicity_SD_slider_min",
                                "max_id": "iconicity_SD_slider_max",
                                "min_value": "0.0",
                                "max_value": "3.0"                                        
                            }},                            
                           
                ]   
                
          }