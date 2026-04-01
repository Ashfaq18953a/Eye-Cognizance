import requests

api_key = "aLY7NxRbi5vQgmJTlBk2MIzDFhVE14wcPoqXWyfrCs6OZuG3pSsNgxwJknmKvZ6UlYG5rAILbVPiB2jh"

# Try 4: Bulk GET with route=v3
print("--- Method 4: Bulk GET route=v3 ---")
url4 = f"https://www.fast2sms.com/dev/bulkV2?authorization={api_key}&route=v3&sender_id=TXTIND&message=Your OTP is 123&numbers=9876543210"
res4 = requests.get(url4)
print(res4.text)

# Try 5: Bulk GET with route=q (Quick SMS)
print("\n--- Method 5: Bulk GET route=q ---")
url5 = f"https://www.fast2sms.com/dev/bulkV2?authorization={api_key}&route=q&message=Your OTP is 123&numbers=9876543210"
res5 = requests.get(url5)
print(res5.text)
