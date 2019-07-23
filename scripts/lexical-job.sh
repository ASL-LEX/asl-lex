#!/bin/bash -l

# time limit from job
#$ -l h_rt=24:00:00

# Send an email when the job finishes or if it is aborted (by default no email is sent).
#$ -M fanonxr@bu.edu

# project nme
#$ -P hariri

# job name
#$ -N asl_lex_lexical

# Combine output and error files into a single file
#$ -j y

#$ -pe omp 8
#$ -l mem_per_core=8G

# module version to be used
module load python3/3.7.3

LEXICAL_FEATURES="SignFrequency(M),SignFrequency(SD),SignFrequency(Z),SignFrequency(N),PercentUnknown,SignFrequency(M-Native),SignFrequency(SD-Native),SignFreq(Z-native),SignFrequency(N-Native),PercentUnknown(Native),PercentGlossAgreement,PercentGlossAgreement(Native),Iconicity(M),Iconicity(SD),Iconicity(Z),Iconicity(N),Iconicity_ID,SubtLexUSLog10WF,LexicalClass,SignOnset(ms),SignOffset(ms),SignLength(ms),MinimalNeighborhoodDensity,MaximalNeighborhoodDensity,Parameter-BasedNeighborhoodDensity,D.Iconicity(M) all,D.Iconicity(SD) all,D.Iconicity(N) all,D.Iconicity(Z) all,D.Iconicity(M) native,D.Iconicity(SD) native,D.Iconicity(N) native,D.Iconicity(Z) native,Complexity,RightWristX,RightWristcentroidY,DistanceRightWristCentroid2Nose,IconicityType,Initialized.2.0,FingerspelledLoanSign.2.0,Compound.2.0,NumberOfMorphemes.2.0,Handshape.2.0"
LEX_MISS=0
LEX_FILE_NAME="lexical"

# executing script
python app.py "$LEXICAL_FEATURES" $LEX_MISS $LEX_FILE_NAME


