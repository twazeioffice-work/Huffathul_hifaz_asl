export async function getSessionClaims() {
  return {
    sub: "mock-user-id",
    tenants: [
      {
        inst_code: "suh01",
        br_code: "mn01",
        permissions: [
          "academic:syllabus:create",
          "academic:syllabus:read",
          "academic:syllabus:update",
          "student:profile:read"
        ]
      }
    ]
  };
}
