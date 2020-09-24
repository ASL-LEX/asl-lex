// Tooltip text descriptions for info buttons on the sidebar.
// keys = element ID in html
// values = descriptions
let tooltips_text = {
  "downloadDataInfo": "Download a spreadsheet of information on the current active nodes",
  "searchWordInfo": "Type an English word to find the corresponding sign on the graph",
  // "resetGraphInfo": "Return to full graph, remove all filters and brushing",
  "filtersInfo": "Limit the number of nodes displayed on the graph based on linguistic features",
  "seeTutorialInfo": "Go to network graph tutorial on asl-lex.org"
};

//These columns are the one which will show up in the sign data pane, in the order below
let ordered_property_list = ["EntryID","LemmaID","Code","Batch","List","Item","YouTube Video","VimeoVideoHTML","VimeoVideo","SubtLexUSLog10WF","SignFrequency(M)","SignFrequency(SD)","SignFrequency(Z)","SignFrequency(N)","SignFrequency(M-Native)","SignFrequency(SD-Native)","SignFreq(Z-native)","SignFrequency(N-Native)","SignFrequency(M-Nonnative)","SignFrequency(SD-Nonnative)","SignFrequency(N-Nonnative)","SignFreq(Z-Nonnative)","DominantTranslation","PercentUnknown","PercentGlossAgreement","PercentUnknown(Native)","PercentGlossAgreement(Native)","PercentUnknown(Nonnative)","PercentGlossAgreement(Nonnative)","Iconicity(M)","Iconicity(SD)","Iconicity(Z)","Iconicity(N)","Iconicity_ID","IconicityType","D.Iconicity(M) all","D.Iconicity(SD) all","D.Iconicity(N) all","D.Iconicity(Z) all","D.Iconicity(M) native","D.Iconicity(SD) native","D.Iconicity(Z) native","D.Iconicity(N) native","H statistic","Transparency(M)","Transparency SD","Transparency Z","LexicalClass","SignOnset(ms)","SignOffset(ms)","SignDuration(ms)","ClipDuration(ms)","InCDI","CDI Semantic Category","Initialized.2.0","FingerspelledLoanSign.2.0","Compound.2.0","NumberOfMorphemes.2.0","Handshape.2.0","MarkedHandshape.2.0","SelectedFingers.2.0","Flexion.2.0","FlexionChange.2.0","SpreadChange.2.0","ThumbPosition.2.0","ThumbContact.2.0","SignType.2.0","Movement.2.0","RepeatedMovement.2.0","MajorLocation.2.0","MinorLocation.2.0","SecondMinorLocation.2.0","Contact.2.0","NonDominantHandshape.2.0","UlnarRotation.2.0","HandshapeM2.2.0","MarkedHandshapeM2.2.0","SelectedFingersM2.2.0","FlexionM2.2.0","FlexionChangeM2.2.0","SpreadM2.2.0","SpreadChangeM2.2.0","ThumbPositionM2.2.0","ThumbContactM2.2.0","SignTypeM2.2.0","MovementM2.2.0","RepeatedMovementM2.2.0","MajorLocationM2.2.0","MinorLocationM2.2.0","SecondMinorLocationM2.2.0","ContactM2.2.0","NonDominantHandshapeM2.2.0","UlnarRotationM2.2.0","HandshapeM3.2.0","MarkedHandshapeM3.2.0","SelectedFingersM3.2.0","FlexionM3.2.0","FlexionChangeM3.2.0","SpreadM3.2.0","SpreadChangeM3.2.0","ThumbPositionM3.2.0","ThumbContactM3.2.0","SignTypeM3.2.0","MovementM3.2.0","RepeatedMovementM3.2.0","MajorLocationM3.2.0","MinorLocationM3.2.0","SecondMinorLocationM3.2.0","ContactM3.2.0","NonDominantHandshapeM3.2.0","UlnarRotationM3.2.0","HandshapeM4.2.0","MarkedHandshapeM4.2.0","SelectedFingersM4.2.0","FlexionM4.2.0","FlexionChangeM4.2.0","SpreadM4.2.0","SpreadChangeM4.2.0","ThumbPositionM4.2.0","ThumbContactM4.2.0","SignTypeM4.2.0","MovementM4.2.0","RepeatedMovementM4.2.0","MajorLocationM4.2.0","MinorLocationM4.2.0","SecondMinorLocationM4.2.0","ContactM4.2.0","NonDominantHandshapeM4.2.0","UlnarRotationM4.2.0","HandshapeM5.2.0","MarkedHandshapeM5.2.0","SelectedFingersM5.2.0","FlexionM5.2.0","FlexionChangeM5.2.0","SpreadM5.2.0","SpreadChangeM5.2.0","ThumbPositionM5.2.0","ThumbContactM5.2.0","SignTypeM5.2.0","MovementM5.2.0","RepeatedMovementM5.2.0","MajorLocationM5.2.0","MinorLocationM5.2.0","SecondMinorLocationM5.2.0","ContactM5.2.0","NonDominantHandshapeM5.2.0","UlnarRotationM5.2.0","HandshapeM6.2.0","MarkedHandshapeM6.2.0","SelectedFingersM6.2.0","FlexionM6.2.0","FlexionChangeM6.2.0","SpreadM6.2.0","SpreadChangeM6.2.0","ThumbPositionM6.2.0","ThumbContactM6.2.0","SignTypeM6.2.0","MovementM6.2.0","RepeatedMovementM6.2.0","MajorLocationM6.2.0","MinorLocationM6.2.0","SecondMinorLocationM6.2.0","ContactM6.2.0","NonDominantHandshapeM6.2.0","UlnarRotationM6.2.0","SignType.2.0Frequency","MajorLocation.2.0Frequency","MinorLocation.2.0Frequency","SecondMinorLocation.2.0Frequency","Movement.2.0Frequency","SelectedFingers.2.0Frequency","Flexion.2.0Frequency","FlexionChange.2.0Frequency","RepeatedMovement.2.0Frequency","Contact.2.0Frequency","SpreadChange.2.0Frequency","ThumbContact.2.0Frequency","ThumbPosition.2.0Frequency","UlnarRotation.2.0Frequency","PhonotacticProbability","Parameter.Neighborhood.Density.2.0","Neighborhood Density 2.0","SignBankAnnotationID","SignBankEnglishTranslations","SignBankLemmaID","SignBankSemanticField","SignBankReferenceID","bglm_aoa","empirical_aoa", "GuessAccuracy","Spread.2.0Frequency"];

let property_display_names = {
  "bglm_aoa": "Age Of Acquisition",
  "empirical_aoa": "Age Of Acquisition (Empirical)",
  "Code": "Code",
  "SignDuration(ms)": "Duration (ms)",
  "ClipDuration(ms)": "Video Length (ms)",
  "SignOnset(ms)": "Sign Onset (ms)",
  "SignOffset(ms)": "Sign Offset (ms)",
  "EntryID": "Entry ID",
  "LemmaID": "Lemma ID",
  "GuessAccuracy":"Guess accuracy",
  "PhonotacticProbability" : "Phonotactic Probability",
  "PercentGlossAgreement": "English Translation Agreement (%)",
  "PercentGlossAgreement(Nonnative)": "English Name Agreement (%) (Nonnative)",
  "DominantTranslation": "Dominant English Translation",
  "H statistic": "English Translation Agreement",
  "PercentUnknown(Nonnative)": "Unknown To Participant (%) (Nonnative)",
  "SignFrequency(SD)": "Frequency SD",
  "SignFrequency(Z)": "Frequency Z",
  "SignFrequency(N)": "Frequency N",
  "SubtLexUSLog10WF": "English Word Frequency",
  "SignFrequency(M)": "Frequency",
  "PercentUnknown": "Sign Unknown (%)",
  "Iconicity(SD)": "Non-Signer Iconicity SD",
  "Iconicity(Z)": "Non-Signer Iconicity Z",
  "Iconicity(N)": "Non-Signer Iconicity N",
  "Iconicity_ID": "Non-Signer Iconicity SD",
  "D.Iconicity(SD) all": "Deaf Signer Iconicity SD (Native)",
  "D.Iconicity(Z) all": "Deaf Signer Iconicity Z",
  "D.Iconicity(N) all": "Deaf Signer Iconicity N",
  "D.Iconicity(M) native": "Deaf Signer Iconicity (Native)",
  "D.Iconicity(SD) native": "Deaf Signer Iconicity SD (Native)",
  "D.Iconicity(Z) native": "Deaf Signer Iconicity Z (Native)",
  "D.Iconicity(N) native": "Deaf Signer Iconicity N (Native)",
  "Transparency SD": "Transparency SD",
  "Transparency Z": "Transparency Z",
  "Iconicity(M)": "Non-Signer Iconicity",
  "D.Iconicity(M) all": "Deaf Signer Iconicity",
  "Transparency(M)": "Transparency",
  "LexicalClass": "Lexical Class",
  "Initialized.2.0": "Initialized Sign",
  "FingerspelledLoanSign.2.0": "Fingerspelled Loan Sign",
  "NumberOfMorphemes.2.0": "Number Of Morphemes",
  "Compound.2.0": "Compound",
  "Complexity": "Complexity",
  "Neighborhood Density 2.0": "Neighborhood Density",
  "Parameter.NeighborhooDeafDensity.2.0": "Parameter Neighborhood Density",
  "Handshape.2.0": "Handshape",
  "MarkedHandshape.2.0": "Marked Handshape",
  "SelectedFingers.2.0": "Selected Fingers",
  "Flexion.2.0": "Flexion",
  "FlexionChange.2.0": "Flexion Change",
  "Spread.2.0Frequency": "Spread Frequency",
  "SpreadChange.2.0": "Spread Change",
  "ThumbPosition.2.0": "Thumb Position",
  "ThumbContact.2.0": "Thumb Contact",
  "MinorLocation.2.0": "Minor Location",
  "SignType.2.0": "Sign Type",
  "Movement.2.0": "Path Movement",
  "RepeatedMovement.2.0": "Repeated Movement",
  "MajorLocation.2.0": "Major Location",
  "SecondMinorLocation.2.0": "Second Minor Location",
  "Contact.2.0": "Contact",
  "NonDominantHandshape.2.0": "Nondominant Handshape",
  "UlnarRotation.2.0": "Wrist Twist",
  "HandshapeM2.2.0": "Handshape M2",
  "MarkedHandshapeM2.2.0": "Marked Handshape M2",
  "SelectedFingersM2.2.0": "Selected Fingers M2",
  "FlexionM2.2.0": "Flexion M2",
  "FlexionChangeM2.2.0": "Flexion Change M2",
  "SpreadM2.2.0": "Spread M2",
  "SpreadChangeM2.2.0": "Spread Change M2",
  "ThumbPositionM2.2.0": "Thumb Position M2",
  "ThumbContactM2.2.0": "Thumb Contact M2",
  "SignTypeM2.2.0": "Sign Type M2",
  "MovementM2.2.0": "Movement M2",
  "RepeatedMovementM2.2.0": "Repeated Movement M2",
  "MajorLocationM2.2.0": "Major Location M2",
  "MinorLocationM2.2.0": "Minor Location M2",
  "SecondMinorLocationM2.2.0": "Second Minor Location M2",
  "ContactM2.2.0": "Contact M2",
  "NonDominantHandshapeM2.2.0": "Nondominant Handshape M2",
  "UlnarRotationM2.2.0": "Wrist Twist M2",
  "HandshapeM3.2.0": "Handshape M3",
  "MarkedHandshapeM3.2.0": "Marked Handshape M3",
  "SelectedFingersM3.2.0": "Selected Fingers M3",
  "FlexionM3.2.0": "Flexion M3",
  "FlexionChangeM3.2.0": "Flexion Change M3",
  "SpreadM3.2.0": "Spread M3",
  "SpreadChangeM3.2.0": "Spread Change M3",
  "ThumbPositionM3.2.0": "Thumb Position M3",
  "ThumbContactM3.2.0": "Thumb Contact M3",
  "SignTypeM3.2.0": "Signtype M3",
  "MovementM3.2.0": "Movement M3",
  "RepeatedMovementM3.2.0": "Repeated Movement M3",
  "MajorLocationM3.2.0": "Major Location M3",
  "MinorLocationM3.2.0": "Minor Location M3",
  "SecondMinorLocationM3.2.0": "Second Minor Location M3",
  "ContactM3.2.0": "Contact M3",
  "NonDominantHandshapeM3.2.0": "Nondominant Handshape M3",
  "UlnarRotationM3.2.0": "Wrist Twist M3",
  "HandshapeM4.2.0": "Handshape M4",
  "MarkedHandshapeM4.2.0": "Marked Handshape M4",
  "SelectedFingersM4.2.0": "Selected Fingers M4",
  "FlexionM4.2.0": "Flexion M4",
  "FlexionChangeM4.2.0": "Flexion Change M4",
  "SpreadM4.2.0": "Spread M4",
  "SpreadChangeM4.2.0": "Spread Change M4",
  "ThumbPositionM4.2.0": "Thumb Position M4",
  "ThumbContactM4.2.0": "Thumb Contact M4",
  "SignTypeM4.2.0": "Sign Type M4",
  "MovementM4.2.0": "Movement M4",
  "RepeatedMovementM4.2.0": "Repeated Movement M4",
  "MajorLocationM4.2.0": "Major Location M4",
  "MinorLocationM4.2.0": "Minor Location M4",
  "SecondMinorLocationM4.2.0": "Second Minor Location M4",
  "ContactM4.2.0": "Contact M4",
  "NonDominantHandshapeM4.2.0": "Nondominant Handshape M4",
  "UlnarRotationM4.2.0": "Wrist Twist M4",
  "HandshapeM5.2.0": "Handshape M5",
  "MarkedHandshapeM5.2.0": "Marked Handshape M5",
  "SelectedFingersM5.2.0": "Selected Fingers M5",
  "FlexionM5.2.0": "Flexion M5",
  "FlexionChangeM5.2.0": "Flexion Change M5",
  "SpreadM5.2.0": "Spread M5",
  "SpreadChangeM5.2.0": "Spread Change M5",
  "ThumbPositionM5.2.0": "Thumb Position M5",
  "ThumbContactM5.2.0": "Thumb Contact M5",
  "SignTypeM5.2.0": "Signtype M5",
  "MovementM5.2.0": "Movement M5",
  "RepeatedMovementM5.2.0": "Repeated Movement M5",
  "MajorLocationM5.2.0": "Major Location M5",
  "MinorLocationM5.2.0": "Minor Location M5",
  "SecondMinorLocationM5.2.0": "Second Minor Location M5",
  "ContactM5.2.0": "Contact M5",
  "NonDominantHandshapeM5.2.0": "Nondominant Handshape M5",
  "UlnarRotationM5.2.0": "Wrist Twist M5",
  "HandshapeM6.2.0": "Handshape M6",
  "MarkedHandshapeM6.2.0": "Marked Handshape M6",
  "SelectedFingersM6.2.0": "Selected Fingers M6",
  "FlexionM6.2.0": "Flexion M6",
  "FlexionChangeM6.2.0": "Flexion Change M6",
  "SpreadM6.2.0": "Spread M6",
  "SpreadChangeM6.2.0": "Spread Change M6",
  "ThumbPositionM6.2.0": "Thumb Position M6",
  "ThumbContactM6.2.0": "Thumb Contact M6",
  "SignTypeM6.2.0": "Sign Type M6",
  "MovementM6.2.0": "Movement M6",
  "RepeatedMovementM6.2.0": "Repeated Movement M6",
  "MajorLocationM6.2.0": "Major Location M6",
  "MinorLocationM6.2.0": "Minor Location M6",
  "SecondMinorLocationM6.2.0": "Second Minor Location M6",
  "ContactM6.2.0": "Contact M6",
  "NonDominantHandshapeM6.2.0": "Nondominant Handshape M6",
  "UlnarRotationM6.2.0": "Wrist Twist M6",
  "SignBankReferenceID": "SignBank Reference ID",
  "SignBankLemmaID": "SignBank Lemma ID",
  "SignBankAnnotationID": "SignBank Annotation ID",
  "SignBankSemanticField": "SignBank Semantic Field",
  "SignBankEnglishTranslations": "SignBank English Translations",
  "SignType.2.0Frequency": "Sign Type Frequency",
  "MajorLocation.2.0Frequency": "Major Location Frequency",
  "MinorLocation.2.0Frequency": "Minor Location Frequency",
  "SecondMinorLocation.2.0Frequency": "Second Minor Location Frequency",
  "Movement.2.0Frequency": "Movement Frequency",
  "SelectedFingers.2.0Frequency": "Selected Fingers Frequency",
  "Flexion.2.0Frequency": "Flexion Frequency",
  "FlexionChange.2.0Frequency": "Flexion Change Frequency",
  "RepeatedMovement.2.0Frequency": "Repeated Movement Frequency",
  "Contact.2.0Frequency": "Contact Frequency",
  "SpreaDeaf2.0Frequency": "Spread Frequency",
  "SpreadChange.2.0Frequency": "Spread Change Frequency",
  "ThumbContact.2.0Frequency": "Thumb Contact Frequency",
  "ThumbPosition.2.0Frequency": "Thumb Position Frequency",
  "UlnarRotation.2.0Frequency": "Ulnar Rotatio Nfrequency",
  "YouTube Video": "Sign Video",
  "VimeoVideo": "Sign Video",
  "Delete?": "Delete This Column",
  "SignFrequency(M-Native)": "Frequency (Native)",
  "SignFrequency(SD-Native)": "Frequency Sd (Native) ",
  "SignFreq(Z-native)": "Frequency Z (Native) ",
  "SignFrequency(N-Native)": "Frequency N (Native) ",
  "PercentUnknown(Native)": "Unknown To Participant (%) (Native)",
  "PercentGlossAgreement(Native)": "English Name Agreement (%) (Native)",
  "SignFrequency(M-Nonnative)": "Frequency (Nonnative)",
  "SignFrequency(SD-Nonnative)": "Frequency SD (Nonnative)",
  "SignFreq(Z-Nonnative)": "Frequency Z (Nonnative)",
  "SignFrequency(N-Nonnative)": "Frequency N (Nonnative)",
  "SignType 1.0": "",
  "MajorLocation 1.0": "",
  "MinorLocation 1.0": "",
  "SelectedFingers 1.0": "",
  "Compound 1.0": "",
  "Flexion 1.0": "",
  "Initialized 1.0": "",
  "Movement 1.0": "",
  "MinimalNeighborhoodDensity": "",
  "MaximalNeighborhoodDensity": "",
  "Parameter-BasedNeighborhoodDensity": "",
  "SignTypeFrequency": "",
  "MajorLocationFrequency": "",
  "MinorLocationFrequency": "",
  "SelectedFingersFrequency": "",
  "FlexionFrequency": "",
  "MovementFrequency": "",
  "HandshapeFrequency": "",
  "Batch": "Batch",
  "Item": "Item",
  "List": "List",
  "Source": "Source",
  "InCDI": "In CDI",
  "CDI_A": "",
  "CDI_B": "",
  "CDI_C": "",
  "CDIGloss": "",
  "CDI Semantic Category": "CDI Semantic Category",
  "CDIDuplicate": "",
  "GlossConfirmation": "",
  "CDIComment": "",
  "In Frequency Rating Survey (FRS)?": "",
  "FRS_A": "",
  "FRS_B": "",
  "FRS_C": "",
  "FRS-Low Frequency item?": "",
  "InPPVT": "",
  "InEOWPVT": "",
  "PPVTTargetFoil": "",
  "PPVTPictureSource": "",
  "FingerspelledLoanSign 1.0": "",
  "Repeat.1": "",
  "BatesPicture": "",
  "BatesPicture: URL": "",
  "ASLVocabPicture": "",
  "ASLVocabPicture: URL": "",
  "Possible Picture?": "",
  "Possible Picture Comments": "",
  "ASLVocab Picture Google Drive": "",
  "ArtistInstructions": "",
  "IssuesWithItemsAndGlosses": "",
  "Brittany-Freq Comments": "",
  "PPVT with Pictures": "",
  "PPVT-Age Group": "",
  "PPVT-Expressive ": "",
  "PPVT-Receptive": "",
  "Entry ID": "",
  "Bizarre Sign or Problematic Video": "",
  "InUconnPPVT": "",
  "CheckCompleteCoding": "",
  "Video File": "",
  "Video File: URL": "",
  "IconicityTypeShannon": "",
  "IconicityTypeClaire": "",
  "IconicityTypeLindsay": "",
  "IconicityTypeRotceh": "",
  "In ASL-LEX 2.0": "",
  "DraftIconicityID": "",
  "DraftIconicityM": "",
  "RightWristX": "",
  "RightWristcentroidY": "",
  "DistanceRightWristCentroid2Nose": "",
  "IconicityType": "Iconicity Type",
  " ChelseaCoded": "",
  "HandshapeManualCorrections": "",
  "FormerKnackGloss": "",
  "SignBankID": "",
  "CodingSignBank": "",
  "InZed": "",
  "Checked Vimeo": "",
  "Parameter.Neighborhood.Density.2.0": "Parameter Neighborhood Density"
};
