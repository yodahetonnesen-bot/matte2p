"""Lager et nytt tilfeldig passord og hashen til netlify/lib/brukere.mjs.

    python3 netlify/nytt-passord.py elev03

Skriver ut passordet (gi det til eleven) og en linje du limer inn i
brukere.mjs i stedet for den gamle. Passordet lagres ingen steder.
"""
import base64, hashlib, secrets, sys

A = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789"
ITERASJONER = 600000

bruker = (sys.argv[1] if len(sys.argv) > 1 else input("Brukernavn: ")).strip().lower()
passord = "-".join("".join(secrets.choice(A) for _ in range(4)) for _ in range(3))
salt = secrets.token_bytes(16)
h = hashlib.pbkdf2_hmac("sha256", passord.encode(), salt, ITERASJONER, 32)
print(f"Passord for {bruker}: {passord}\n")
print("Linje til netlify/lib/brukere.mjs:")
print(f'  {bruker}: {{ salt: "{base64.b64encode(salt).decode()}", hash: "{base64.b64encode(h).decode()}" }},')
