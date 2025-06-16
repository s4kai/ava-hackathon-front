"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { useState } from "react";

import Image from "next/image";
import logo from "@/public/images/logo.png"

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (role: "student" | "teacher") => {
    localStorage.setItem("userRole", role);
    localStorage.setItem("userEmail", email);
    router.push(`/${role}/dashboard`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Image src={logo}  width={100} height={100} alt="Logo" />
            <h1 className="text-4xl font-bold text-primary-foreground">Acad<span className="text-primary">IA</span></h1>
          </div>
        </div>

        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Escolha seu perfil e faça login para continuar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="student" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="student">Aluno</TabsTrigger>
                <TabsTrigger value="teacher">Professor</TabsTrigger>
              </TabsList>

              <TabsContent value="student" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="student-email">Email</Label>
                  <Input
                    id="student-email"
                    type="email"
                    placeholder="estudante@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-password">Senha</Label>
                  <Input
                    id="student-password"
                    type="password"
                    placeholder="Insira sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={() => handleLogin("student")}
                >
                  Entrar como Aluno
                </Button>
              </TabsContent>

              <TabsContent value="teacher" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="teacher-email">Email</Label>
                  <Input
                    id="teacher-email"
                    type="email"
                    placeholder="professor@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teacher-password">Senha</Label>
                  <Input
                    id="teacher-password"
                    type="password"
                    placeholder="Insira sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={() => handleLogin("teacher")}
                >
                  Entrar como Professor
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
