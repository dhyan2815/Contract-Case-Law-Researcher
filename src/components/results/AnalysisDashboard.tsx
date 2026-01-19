import { FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LegalDocument } from '@/types/legal';
import RiskScoreCard from './RiskScoreCard';
import ComplianceFlags from './ComplianceFlags';
import ExtractedClauses from './ExtractedClauses';
import PrecedentCases from './PrecedentCases';
import RecommendedActions from './RecommendedActions';

interface AnalysisDashboardProps {
  document: LegalDocument;
}

const AnalysisDashboard = ({ document }: AnalysisDashboardProps) => {
  const { results } = document;
  const isContract = document.document_type === 'contract';
  const isCaseLaw = document.document_type === 'case_law';

  if (!results) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No results available for this document.</p>
        </CardContent>
      </Card>
    );
  }

  // Determine the summary title based on document type
  const summaryTitle = isCaseLaw ? 'Research Summary' : 'Executive Summary';

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {document.file_name || document.document_id}
              </CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                {document.client_name} • {document.client_email} • {isContract ? 'Contract' : 'Case Law'}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Summary (Executive for Contract, Research for Case Law) */}
      <Card>
        <CardHeader>
          <CardTitle>{summaryTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-foreground">{results.executive_summary}</p>
        </CardContent>
      </Card>

      {/* Scores - Always show (Risk Score for Contract, Applicability Score for Case Law) */}
      <RiskScoreCard
        riskScore={results.risk_score}
        confidenceScore={results.confidence_score}
        documentType={document.document_type}
      />

      {/* Contract-specific sections */}
      {isContract && (
        <>
          {/* Compliance Flags */}
          <ComplianceFlags flags={results.compliance_flags} />

          {/* Extracted Clauses */}
          <ExtractedClauses clauses={results.extracted_clauses} />

          {/* Precedent Cases */}
          <PrecedentCases cases={results.precedent_cases} />
        </>
      )}

      {/* Recommended Actions - Always show */}
      <RecommendedActions actions={results.recommended_actions} />
    </div>
  );
};

export default AnalysisDashboard;
