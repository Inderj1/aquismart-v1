"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface Document {
  id: string;
  name: string;
  status: string;
  uploadedAt: Date;
  type?: string;
  confidence?: number;
  extractedFields?: ExtractedField[];
  companyId?: string;
}

interface ExtractedField {
  key: string;
  value: string;
  confidence: number;
  page: number;
}

interface Company {
  id: string;
  name: string;
  sector: string;
  revenue: number;
  ebitda: number;
  documents: string[];
  lastValuation?: number;
  lastValuationDate?: Date;
}

interface AppContextType {
  documents: Document[];
  companies: Company[];
  addDocument: (doc: Document) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  getDocument: (id: string) => Document | undefined;
  getCompany: (id: string) => Company | undefined;
  addExtractedFields: (docId: string, fields: ExtractedField[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [companies, setCompanies] = useState<Company[]>([
    {
      id: "techco",
      name: "TechCo Inc",
      sector: "Software",
      revenue: 125,
      ebitda: 35,
      documents: [],
      lastValuation: 525,
      lastValuationDate: new Date("2024-10-15")
    },
    {
      id: "mediaco",
      name: "MediaCo Ltd",
      sector: "Media",
      revenue: 98,
      ebitda: 28,
      documents: [],
      lastValuation: 420,
      lastValuationDate: new Date("2024-09-30")
    },
    {
      id: "retailco",
      name: "RetailCo Group",
      sector: "Retail",
      revenue: 156,
      ebitda: 42,
      documents: [],
      lastValuation: 630,
      lastValuationDate: new Date("2024-10-01")
    }
  ]);

  const addDocument = (doc: Document) => {
    setDocuments(prev => [...prev, doc]);
  };

  const updateDocument = (id: string, updates: Partial<Document>) => {
    setDocuments(prev =>
      prev.map(doc => (doc.id === id ? { ...doc, ...updates } : doc))
    );
  };

  const getDocument = (id: string) => {
    return documents.find(doc => doc.id === id);
  };

  const getCompany = (id: string) => {
    return companies.find(co => co.id === id);
  };

  const addExtractedFields = (docId: string, fields: ExtractedField[]) => {
    updateDocument(docId, { extractedFields: fields });
  };

  return (
    <AppContext.Provider
      value={{
        documents,
        companies,
        addDocument,
        updateDocument,
        getDocument,
        getCompany,
        addExtractedFields
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
