import sys

from nltk_docente_fisi.vader import SentimentIntensityAnalyzer

analizador = SentimentIntensityAnalyzer()

calificacion = sys.argv[1]

#calificacion = 'Muy relax, se aprueba izi . Todas tus notas dependen del proyecto, asi que no te descuides, aunque igual apruebes xd.'


score = analizador.puntajes_polaridad(calificacion) #dict -neg -neu -pos -comp

if score.get('compound') < -0.2:

    calificacion = -1
elif score.get('compound') >= -0.2 and score.get('compound') <= 0.1:

    calificacion = 0
else:
    calificacion = 1

print(calificacion)
