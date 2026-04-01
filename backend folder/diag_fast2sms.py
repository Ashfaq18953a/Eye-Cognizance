import requests

api_key = "aLY7NxRbi5vQgmJTlBk2MIzDFhVE14wcPoqXWyfrCs6OZuG3pSsNgxwJknmKvZ6UlYG5rAILbVPiB2jh"

# Try 1: Wallet GET
print("--- Method 1: Wallet GET ---")
url1 = "https://www.fast2sms.com/dev/wallet"
res1 = requests.get(url1, headers={'authorization': api_key})
print(res1.text)

# Try 2: Bulk GET (Simulation)
print("\n--- Method 2: Bulk GET ---")
url2 = f"https://www.fast2sms.com/dev/bulkV2?authorization={api_key}&route=otp&variables_values=123&numbers=9876543210"
res2 = requests.get(url2)
print(res2.text)

# Try 3: Different Header case
print("\n--- Method 3: Authorization (Capital A) ---")
res3 = requests.get(url1, headers={'Authorization': api_key})
print(res3.text)
