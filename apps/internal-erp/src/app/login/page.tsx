"use client";

import { useState } from "react";
import { Card, CardHeader, CardBody, Input, Button, Divider } from "@nextui-org/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [totp, setTotp] = useState("");
  const [mfaChallenge, setMfaChallenge] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      // Proxy through Next.js to avoid CORS issues
      const res = await fetch("/api/auth/proxy-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid credentials");

      if (data.mfa_token) {
        setMfaChallenge(data.mfa_token);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMFA = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/proxy-verify-mfa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, totp, mfa_token: mfaChallenge }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid MFA code");

      // Success! Cookies are set.
      // Redirect to the HQ branch for the logged-in user's default dashboard.
      // In a real app, this path comes from the JWT claims.
      router.push("/app/suh01/mn01/erp/students");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950 px-4">
      <Card className="w-full max-w-md bg-slate-900 border border-slate-800 p-4">
        <CardHeader className="flex flex-col items-center gap-2 pb-6">
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-2">
            <span className="text-primary font-bold text-xl">SH</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Suffat-ul Huffaz</h1>
          <p className="text-slate-400 text-sm text-center">
            Zero-Trust Enterprise Resource Portal
          </p>
        </CardHeader>

        <Divider className="bg-slate-800 mb-6" />

        <CardBody className="flex flex-col gap-4">
          {error && (
            <div className="p-3 rounded-md bg-danger-500/10 border border-danger-500/20 text-danger-500 text-sm">
              {error}
            </div>
          )}

          {!mfaChallenge ? (
            <>
              <Input
                label="Organization Email"
                variant="bordered"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                classNames={{ input: "text-white" }}
              />
              <Input
                label="Master Password"
                variant="bordered"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                classNames={{ input: "text-white" }}
              />
              <Button 
                color="primary" 
                className="mt-4 font-bold"
                isLoading={loading}
                onPress={handleLogin}
              >
                Authenticate Identity
              </Button>
            </>
          ) : (
            <>
              <div className="text-center mb-2">
                <p className="text-white font-medium">MFA Challenge</p>
                <p className="text-slate-400 text-xs">Enter the 6-digit code from your authenticator app.</p>
              </div>
              <Input
                label="TOTP Code"
                variant="bordered"
                type="text"
                maxLength={6}
                value={totp}
                onChange={(e) => setTotp(e.target.value)}
                classNames={{ input: "text-white text-center tracking-widest text-lg font-mono" }}
              />
              <Button 
                color="primary" 
                className="mt-4 font-bold"
                isLoading={loading}
                onPress={handleMFA}
              >
                Verify & Establish Session
              </Button>
              <Button 
                variant="light" 
                className="mt-2 text-slate-400"
                onPress={() => setMfaChallenge(null)}
              >
                Cancel
              </Button>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
