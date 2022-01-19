import nltk 
import sys

from nltk.sentiment.vader import SentimentIntensityAnalyzer

analizador = SentimentIntensityAnalyzer()

calificacion = sys.argv[1]

score = analizador.polarity_scores(calificacion) #dict

# if score.get('compound') <= -0.6:

#     calificacion = -1
# elif score.get('compound') >= -0.6 and score.get('compound') <= 0.4:

#     calificacion = 0
# else:
#     calificacion = 1

print(score.get('compound'))

sys.stdout.flush()

