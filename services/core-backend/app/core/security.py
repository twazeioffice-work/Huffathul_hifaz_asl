from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
import uuid
import datetime
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
import os
import json
from jose import jwt

ph = PasswordHasher(
    memory_cost=65536,
    time_cost=3,
    parallelism=4
)

def get_password_hash(password: str) -> str:
    return ph.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return ph.verify(hashed_password, plain_password)
    except VerifyMismatchError:
        return False

# MFA Encryption helpers
AES_KEY = os.getenv("AES_SECRET_KEY", "0123456789abcdef0123456789abcdef").encode('utf-8')

def encrypt_totp_secret(secret: str) -> tuple[str, str]:
    cipher = AES.new(AES_KEY, AES.MODE_GCM)
    ciphertext, tag = cipher.encrypt_and_digest(secret.encode('utf-8'))
    iv = cipher.nonce
    return ciphertext.hex() + tag.hex(), iv.hex()

def decrypt_totp_secret(encrypted_hex: str, iv_hex: str) -> str:
    iv = bytes.fromhex(iv_hex)
    encrypted_data = bytes.fromhex(encrypted_hex)
    ciphertext = encrypted_data[:-16]
    tag = encrypted_data[-16:]
    cipher = AES.new(AES_KEY, AES.MODE_GCM, nonce=iv)
    return cipher.decrypt_and_verify(ciphertext, tag).decode('utf-8')

# JWT Helpers
PRIVATE_KEY_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../packages/security-config/keys/private_key.pem"))
PUBLIC_KEY_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../packages/security-config/keys/public_key.pem"))

with open(PRIVATE_KEY_PATH, "r") as f:
    PRIVATE_KEY = f.read()

with open(PUBLIC_KEY_PATH, "r") as f:
    PUBLIC_KEY = f.read()

def generate_tokens(user_id: uuid.UUID, family_id: uuid.UUID, tenants: list):
    now = datetime.datetime.now(datetime.timezone.utc)
    access_exp = now + datetime.timedelta(minutes=15)
    refresh_exp = now + datetime.timedelta(days=7)
    
    access_payload = {
        "sub": str(user_id),
        "iss": "auth.suffat.org",
        "aud": "erp.suffat.org",
        "iat": int(now.timestamp()),
        "exp": int(access_exp.timestamp()),
        "tenants": tenants
    }
    
    refresh_payload = {
        "sub": str(user_id),
        "family_id": str(family_id),
        "user_id": str(user_id),
        "tenants": tenants,
        "exp": int(refresh_exp.timestamp())
    }
    
    access_token = jwt.encode(access_payload, PRIVATE_KEY, algorithm="EdDSA")
    refresh_token = jwt.encode(refresh_payload, PRIVATE_KEY, algorithm="EdDSA")
    
    return access_token, refresh_token, refresh_exp

def decode_refresh_jwt(token: str):
    return jwt.decode(token, PUBLIC_KEY, algorithms=["EdDSA"], audience="erp.suffat.org")
