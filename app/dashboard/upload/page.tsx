"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useApp } from "@/lib/context/AppContext";

export default function UploadPage() {
  const router = useRouter();
  const { addDocument } = useApp();
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<any[]>([]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setUploading(true);

    for (const file of selectedFiles) {
      const docId = `doc-${Date.now()}-${Math.random()}`;
      const newFile = {
        id: docId,
        name: file.name,
        size: (file.size / 1024).toFixed(2) + " KB",
        status: "processing",
        progress: 0
      };

      setFiles(prev => [...prev, newFile]);

      // Simulate AI processing stages
      await simulateProcessing(docId, newFile);
    }

    setUploading(false);
  };

  const simulateProcessing = async (docId: string, fileInfo: any) => {
    // Stage 1: Classification
    await new Promise(resolve => setTimeout(resolve, 1000));
    setFiles(prev => prev.map(f => 
      f.id === docId ? { ...f, progress: 25, stage: "Classifying..." } : f
    ));

    // Stage 2: OCR
    await new Promise(resolve => setTimeout(resolve, 1000));
    setFiles(prev => prev.map(f => 
      f.id === docId ? { ...f, progress: 50, stage: "OCR Processing..." } : f
    ));

    // Stage 3: Extraction
    await new Promise(resolve => setTimeout(resolve, 1000));
    setFiles(prev => prev.map(f => 
      f.id === docId ? { ...f, progress: 75, stage: "Extracting Fields..." } : f
    ));

    // Stage 4: Complete
    await new Promise(resolve => setTimeout(resolve, 1000));
    const docType = fileInfo.name.toLowerCase().includes("capital") ? "Capital Account" :
                    fileInfo.name.toLowerCase().includes("financial") ? "Quarterly Financials" :
                    "Loan Agreement";
    
    setFiles(prev => prev.map(f => 
      f.id === docId ? { 
        ...f, 
        status: "completed", 
        progress: 100, 
        confidence: 94,
        type: docType,
        companyId: "techco"
      } : f
    ));

    // Add to global context
    addDocument({
      id: docId,
      name: fileInfo.name,
      status: "completed",
      uploadedAt: new Date(),
      type: docType,
      confidence: 94,
      companyId: "techco",
      extractedFields: [
        { key: "Revenue Q3 2024", value: "$12.5M", confidence: 96, page: 3 },
        { key: "EBITDA Margin", value: "28%", confidence: 94, page: 3 },
        { key: "YoY Growth", value: "23%", confidence: 92, page: 3 }
      ]
    });
  };

  const viewDocument = (docId: string) => {
    router.push(`/dashboard/documents/${docId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-6 py-4">
          <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold mt-2">Document Upload</h1>
          <p className="text-muted-foreground mt-1">Upload GP documents for AI-powered extraction</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Upload Documents</CardTitle>
                <CardDescription>
                  Supported: Capital accounts, quarterly financials, loan agreements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed rounded-lg p-12 text-center hover:border-primary transition-colors cursor-pointer">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.xlsx,.xls,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium mb-2">Drop files here or click to browse</p>
                    <p className="text-sm text-muted-foreground">PDF, Excel, or Word documents</p>
                  </label>
                </div>

                <div className="mt-6 space-y-3">
                  <h3 className="font-semibold">AI Processing Pipeline:</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>1. Document Classification (LayoutLM)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>2. OCR & Table Extraction (PaddleOCR)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>3. Field Extraction (LayoutLMv3)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>4. Entity Resolution (XGBoost)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Processing Queue</CardTitle>
                <CardDescription>{files.length} document(s)</CardDescription>
              </CardHeader>
              <CardContent>
                {files.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No documents uploaded yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {files.map((file) => (
                      <div key={file.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-muted-foreground">{file.size}</p>
                          </div>
                          {file.status === "processing" && (
                            <Loader2 className="h-5 w-5 animate-spin text-primary" />
                          )}
                          {file.status === "completed" && (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          )}
                        </div>

                        {file.status === "processing" && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>{file.stage}</span>
                              <span>{file.progress}%</span>
                            </div>
                            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary transition-all duration-500"
                                style={{ width: `${file.progress}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {file.status === "completed" && (
                          <div className="mt-3 space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-green-600">✓ {file.type} extracted</span>
                              <span className="font-medium">{file.confidence}% confident</span>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1"
                                onClick={() => viewDocument(file.id)}
                              >
                                View Extracted Fields
                              </Button>
                              <Button 
                                variant="default" 
                                size="sm" 
                                className="flex-1"
                                onClick={() => router.push(`/dashboard/valuation?company=${file.companyId}`)}
                              >
                                Run Valuation
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
