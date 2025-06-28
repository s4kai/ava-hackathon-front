// src/app/(authorized)/custom-material/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingComponent } from "@/components/loading";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const EditorComp = dynamic(() => import("@/components/markdown"), {
  ssr: false,
  loading: () => <LoadingComponent />,
});

const CustomMaterialPage = () => {
  const { id } = useParams();
  const [customMaterial, setCustomMaterial] = useState<CustomMaterial | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomMaterial = async () => {
      try {
        const response = await api.get(`/custom-material/${id}`);
        setCustomMaterial(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomMaterial();
  }, [id]);

  if (loading) {
    return <LoadingComponent />;
  }

  if (!customMaterial) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Custom Material Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The requested custom material could not be found.</p>
          <p>Please try again later.</p>
          <Link href="/student/dashboard">Go back to dashboard</Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 w-full">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link href={`/student/subject/${customMaterial.subject}`}>
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Painel
            </Button>
          </Link>

          <div className="space-y-6"></div>
          <Card>
            <CardHeader>
              <CardTitle>{customMaterial.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <EditorComp markdown={customMaterial.content} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CustomMaterialPage;
