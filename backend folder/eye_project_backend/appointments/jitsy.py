import uuid

def create_jitsi_meet(booking_id):
    room_name = f"eye-consult-{booking_id}"
    return f"https://meet.jit.si/{room_name}"
