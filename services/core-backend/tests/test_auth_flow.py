import sys
import unittest
from app.core.security import hash_password, verify_password, create_access_token, decode_token
from app.routers.auth import calculate_landing_route

class TestDigiDarsUnifiedAuthFlow(unittest.TestCase):
    
    def test_scrypt_password_hashing(self):
        print("Running Password Hash Validation...")
        pw = "MyS3cret_Pass!"
        hashed = hash_password(pw)
        self.assertTrue(hashed.startswith("$scrypt$"))
        self.assertTrue(verify_password(pw, hashed))
        self.assertFalse(verify_password("wrong_password", hashed))
        print("  └─ Hashed password format: ", hashed[:50] + "...")
        print("  └─ [✓] Passwords match and hash safely.")
        
    def test_jwt_claims_and_decoding(self):
        print("Running JWT Claims Validation...")
        claims = {
            "sub": "user-uuid-123",
            "role": "USTAD",
            "tenant_id": "tenant-uuid-456",
            "institution_code": "aim-kerala",
            "branch_code": "trv-main"
        }
        token = create_access_token(claims)
        decoded = decode_token(token)
        self.assertEqual(decoded["sub"], "user-uuid-123")
        self.assertEqual(decoded["role"], "USTAD")
        self.assertEqual(decoded["tenant_id"], "tenant-uuid-456")
        print("  └─ [✓] Custom multi-tenant claims are signed and decoded successfully.")
        
    def test_dynamic_redirection_routes(self):
        print("Running Redirection Mapping Validation...")
        
        # Super Admin - Static bypass
        self.assertEqual(
            calculate_landing_route("SUPER_ADMIN"),
            "/app/suffat-hq/main/erp"
        )
        
        # Nazim - Dynamic Formatting
        self.assertEqual(
            calculate_landing_route("NAZIM", "aim-kerala", "trv-main"),
            "/app/aim-kerala/trv-main/erp"
        )
        
        # Ustad - Dynamic Formatting with custom subheads
        self.assertEqual(
            calculate_landing_route("USTAD", "aim-kerala", "trv-main"),
            "/app/aim-kerala/trv-main/erp/academics"
        )
        
        # Failure case - missing routing codes
        with self.assertRaises(Exception):
            calculate_landing_route("USTAD")
            
        print("  └─ [✓] Dynamic redirection mappings route cleanly based on user roles.")

if __name__ == "__main__":
    unittest.main()
