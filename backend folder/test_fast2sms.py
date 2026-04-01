import requests
import os

url = "https://www.fast2sms.com/dev/wallet"
api_key = "aLY7NxRbi5vQgmJTlBk2MIzDFhVE14wcPoqXWyfrCs6OZuG3pSsNgxwJknmKvZ6UlYG5rAILbVPiB2jh"

headers = {
    'authorization': api_key,
    'Cache-Control': "no-cache"
}

try:
    response = requests.get(url, headers=headers)
    print("Fast2SMS Wallet Response:", response.text)
except Exception as e:
    print("Error:", e)
