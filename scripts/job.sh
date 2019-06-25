#!/bin/bash -l

# time limit from job
#$ -l h_rt=24:00:00

# Send an email when the job finishes or if it is aborted (by default no email is sent).
#$ -m fanonxr@bu.edu

# project nme
#$ -P hariri

# job name
#$ -N asl_lex

#$ -pe omp 8
#$ -l mem_per_core=8G

# module version to be used
module load python/3.7.0

DEFAULT_FEATURES = "SelectedFingers.2.0,Flexion.2.0,FlexionChange.2.0,Spread.2.0,SpreadChange.2.0,ThumbPosition.2.0,ThumbContact.2.0,SignType.2.0 Movement.2.0,MajorLocation.2.0,MinorLocation.2.0,SecondMinorLocation.2.0,Contact.2.0,NonDominantHandshape.2.0,UlnarRotation.2.0"
LEXICAL_FEATURES = "SignFrequency(M),SignFrequency(SD),SignFrequency(Z),SignFrequency(N),PercentUnknown,SignFrequency(M-Native),SignFrequency(SD-Native),SignFreq(Z-native),SignFrequency(N-Native),PercentUnknown(Native),PercentGlossAgreement,PercentGlossAgreement(Native),Iconicity(M),Iconicity(SD),Iconicity(Z),Iconicity(N),Iconicity_ID,SubtLexUSLog10WF,LexicalClass,SignOnset(ms),SignOffset(ms),SignLength(ms),MinimalNeighborhoodDensity,MaximalNeighborhoodDensity,Parameter-BasedNeighborhoodDensity,D.Iconicity(M) all,D.Iconicity(SD) all,D.Iconicity(N) all,D.Iconicity(Z) all,D.Iconicity(M) native,D.Iconicity(SD) native,D.Iconicity(N) native,D.Iconicity(Z) native,Complexity,RightWristX,RightWristcentroidY,DistanceRightWristCentroid2Nose,IconicityType,Initialized.2.0,FingerspelledLoanSign.2.0,Compound.2.0,NumberOfMorphemes.2.0,Handshape.2.0"
MAJOR_FEATURES = "MajorLocation.2.0,MajorLocationM2.2.0,MajorLocationM3.2.0,MajorLocationM4.2.0,MajorLocationM5.2.0,MajorLocationM6.2.0"
MINOR_FEATURES = "MinorLocationM2.2.0,SecondMinorLocationM2.2.0,MinorLocationM3.2.0,SecondMinorLocationM3.2.0,MinorLocationM4.2.0,SecondMinorLocationM4.2.0,MinorLocationM5.2.0,SecondMinorLocationM5.2.0,MinorLocationM6.2.0,SecondMinorLocationM6.2.0"
ALLOWED_MISSES = 1
EXPORT_FILE_NAME = "default"

# executing script
# default parameters to create neighborhood density & edges
python app.py -V DEFAULT_FEATURES ALLOWED_MISSES EXPORT_FILE_NAME



