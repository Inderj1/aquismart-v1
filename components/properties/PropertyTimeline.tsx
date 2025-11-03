"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Clock, AlertCircle } from "lucide-react";

export interface TimelineTask {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in_progress' | 'pending' | 'blocked';
  dueDate?: string;
  completedDate?: string;
  assignedTo?: string;
  documents?: string[];
}

export interface PropertyTransaction {
  id: string;
  propertyId: string;
  propertyAddress: string;
  status: 'offer_made' | 'under_contract' | 'inspection' | 'financing' | 'closing' | 'completed';
  startDate: string;
  estimatedClosingDate: string;
  actualClosingDate?: string;
  offerPrice: number;
  tasks: TimelineTask[];
}

interface PropertyTimelineProps {
  transaction: PropertyTransaction;
  onTaskUpdate?: (taskId: string, status: TimelineTask['status']) => void;
}

const PHASE_LABELS = {
  offer_made: 'Offer Made',
  under_contract: 'Under Contract',
  inspection: 'Inspection Period',
  financing: 'Financing',
  closing: 'Closing Process',
  completed: 'Completed'
};

const PHASE_ORDER = ['offer_made', 'under_contract', 'inspection', 'financing', 'closing', 'completed'];

export function PropertyTimeline({ transaction, onTaskUpdate }: PropertyTimelineProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusIcon = (status: TimelineTask['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'blocked':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: TimelineTask['status']) => {
    const variants = {
      completed: 'default',
      in_progress: 'secondary',
      pending: 'outline',
      blocked: 'destructive'
    };

    const labels = {
      completed: 'Completed',
      in_progress: 'In Progress',
      pending: 'Pending',
      blocked: 'Blocked'
    };

    return (
      <Badge variant={variants[status] as any}>
        {labels[status]}
      </Badge>
    );
  };

  const currentPhaseIndex = PHASE_ORDER.indexOf(transaction.status);

  return (
    <div className="space-y-6">
      {/* Transaction Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl mb-2">{transaction.propertyAddress}</CardTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Offer: {formatCurrency(transaction.offerPrice)}</span>
                <span>•</span>
                <span>Started: {formatDate(transaction.startDate)}</span>
                <span>•</span>
                <span>Est. Closing: {formatDate(transaction.estimatedClosingDate)}</span>
              </div>
            </div>
            <Badge className="text-sm">{PHASE_LABELS[transaction.status]}</Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Progress Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Transaction Progress</span>
              <span className="text-muted-foreground">
                {currentPhaseIndex + 1} of {PHASE_ORDER.length} phases
              </span>
            </div>

            <div className="relative">
              <div className="absolute left-0 top-1/2 h-0.5 w-full bg-muted -translate-y-1/2" />
              <div
                className="absolute left-0 top-1/2 h-0.5 bg-primary -translate-y-1/2 transition-all"
                style={{ width: `${(currentPhaseIndex / (PHASE_ORDER.length - 1)) * 100}%` }}
              />

              <div className="relative flex justify-between">
                {PHASE_ORDER.map((phase, index) => {
                  const isCompleted = index <= currentPhaseIndex;
                  const isCurrent = index === currentPhaseIndex;

                  return (
                    <div key={phase} className="flex flex-col items-center gap-2">
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center border-2 bg-background
                        ${isCompleted ? 'border-primary bg-primary text-primary-foreground' : 'border-muted'}
                        ${isCurrent ? 'ring-4 ring-primary/20' : ''}
                      `}>
                        {isCompleted ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <span className="text-xs">{index + 1}</span>
                        )}
                      </div>
                      <span className={`text-xs text-center max-w-[80px] ${isCurrent ? 'font-medium' : 'text-muted-foreground'}`}>
                        {PHASE_LABELS[phase as keyof typeof PHASE_LABELS]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Tasks & Milestones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transaction.tasks.map((task, index) => (
              <div key={task.id} className="relative">
                {index < transaction.tasks.length - 1 && (
                  <div className="absolute left-2.5 top-10 bottom-0 w-0.5 bg-border" />
                )}

                <div className="flex gap-4">
                  <div className="relative z-10 bg-background">
                    {getStatusIcon(task.status)}
                  </div>

                  <div className="flex-1 pb-8">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{task.title}</h4>
                          {getStatusBadge(task.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {task.description}
                        </p>

                        {task.dueDate && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Due: {formatDate(task.dueDate)}
                          </p>
                        )}

                        {task.completedDate && (
                          <p className="text-xs text-green-600 mt-2">
                            Completed: {formatDate(task.completedDate)}
                          </p>
                        )}

                        {task.documents && task.documents.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {task.documents.map((doc, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {doc}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      {task.status === 'pending' && onTaskUpdate && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onTaskUpdate(task.id, 'in_progress')}
                        >
                          Start Task
                        </Button>
                      )}

                      {task.status === 'in_progress' && onTaskUpdate && (
                        <Button
                          size="sm"
                          onClick={() => onTaskUpdate(task.id, 'completed')}
                        >
                          Mark Complete
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
