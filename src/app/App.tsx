/**
 * SAM.gov Integrity Records System - Application Architecture
 * 
 * This application has three main areas:
 * 
 * 1. WORKSPACE (Entry Point)
 *    - Dashboard showing all integrity records for the contracting office
 *    - Search functionality:
 *      - Search by UEI to find contractor records
 *      - Search by Contracting Office ID to see all contracts in area
 *    - Actions: View, Edit (drafts/returned), Delete (drafts), Create New
 *    - Status tracking: Draft, Submitted, Under Review, Published, Returned
 * 
 * 2. REPORT CREATION/EDITING (Form Flow)
 *    - Award Lookup: UEI search (with optional Award ID)
 *    - Record Type Selection: 8 different integrity record types
 *    - Type-specific Questions: Dynamic fields based on violation type
 *    - Review Screen: Summary before submission
 *    - Confirmation: Success message with tracking number
 * 
 * 3. REPORT VIEWING (Read-Only)
 *    - Complete record details for submitted/published reports
 *    - Audit trail showing record history
 *    - Document attachments
 *    - Print functionality
 * 
 * Access Management: Contracting Office manages user access at workspace level
 * Data Entry: Creating/editing integrity records happens in form flow
 * Report Management: View/edit/delete happens from workspace
 */

import { useState, useEffect } from 'react';
import { Workspace } from './components/Workspace';
import { IntegrityRecordForm } from './components/IntegrityRecordForm';
import { IntegrityRecordReview } from './components/IntegrityRecordReview';
import { IntegrityRecordConfirmation } from './components/IntegrityRecordConfirmation';
import { ReportView } from './components/ReportView';
import { TerminateContractForm } from './components/TerminateContractForm';

type Page = 'workspace' | 'create-report' | 'edit-report' | 'view-report' | 'form' | 'review' | 'confirmation' | 'terminate-contract';

export default function App() {
  // Set document title on mount
  useEffect(() => {
    document.title = 'Workspace';
  }, []);
  const [currentPage, setCurrentPage] = useState<Page>('workspace');
  const [currentReportId, setCurrentReportId] = useState<string | null>(null);
  const [selectedAward, setSelectedAward] = useState<any>(null);
  const [formData, setFormData] = useState({
    recordType: '',
    uei: '',
    awardNumber: '',
    solicitation: '',
    entitySummary: null as {
      legalName: string;
      address: string;
      uei: string;
      cage: string;
    } | null,
    effectiveDate: '',
    expirationDate: '',
    actionDate: '',
    amount: '',
    description: '',
    agency: '',
    office: '',
  });

  const handleFormComplete = (data: typeof formData) => {
    setFormData(data);
    setCurrentPage('review');
  };

  const handleEdit = (section: number) => {
    // In a real implementation, you would scroll to the specific section
    setCurrentPage('form');
  };

  const handleSubmit = () => {
    setCurrentPage('confirmation');
  };

  const handleConfirmationComplete = () => {
    handleBackToWorkspace();
  };

  const handleCreateNew = () => {
    setFormData({
      recordType: '',
      uei: '',
      awardNumber: '',
      solicitation: '',
      entitySummary: null,
      effectiveDate: '',
      expirationDate: '',
      actionDate: '',
      amount: '',
      description: '',
      agency: '',
      office: '',
    });
    setCurrentReportId(null);
    setCurrentPage('form');
  };

  const handleBackToWorkspace = () => {
    setCurrentPage('workspace');
    setCurrentReportId(null);
  };

  const handleViewReport = (reportId: string) => {
    setCurrentReportId(reportId);
    setCurrentPage('view-report');
  };

  const handleEditReport = (reportId: string) => {
    // In real app, would load report data here
    setCurrentReportId(reportId);
    setCurrentPage('form');
  };

  const handleSaveDraft = () => {
    alert('Draft saved successfully');
  };

  const handleTerminateContract = (awardId: string) => {
    // In real app, would fetch award details
    const mockAward = {
      id: awardId,
      awardNumber: 'W912DY-23-C-0089',
      awardTitle: 'IT Infrastructure Support Services',
      contractorName: 'Acme Defense Contractors LLC',
      uei: 'J8SXUNY8LKA3',
      value: '$2.4M',
      popStart: '2023-03-15',
      popEnd: '2025-03-14',
    };
    setSelectedAward(mockAward);
    setCurrentPage('terminate-contract');
  };

  const handleTerminateComplete = () => {
    alert('Contract terminated successfully');
    handleBackToWorkspace();
  };

  return (
    <div className="min-h-screen bg-[#f0f0f0]">
      {currentPage === 'workspace' && (
        <Workspace
          onCreateNew={handleCreateNew}
          onViewReport={handleViewReport}
          onEditReport={handleEditReport}
          onManageAward={handleTerminateContract}
        />
      )}
      {currentPage === 'terminate-contract' && selectedAward && (
        <TerminateContractForm
          award={selectedAward}
          onBack={handleBackToWorkspace}
          onComplete={handleTerminateComplete}
        />
      )}
      {currentPage === 'view-report' && currentReportId && (
        <ReportView
          reportId={currentReportId}
          onBack={handleBackToWorkspace}
        />
      )}
      {currentPage === 'form' && (
        <IntegrityRecordForm
          initialData={formData}
          onComplete={handleFormComplete}
          onSaveDraft={handleSaveDraft}
        />
      )}
      {currentPage === 'review' && (
        <IntegrityRecordReview
          formData={formData}
          onEdit={handleEdit}
          onBack={() => setCurrentPage('form')}
          onSaveDraft={handleSaveDraft}
          onSubmit={handleSubmit}
        />
      )}
      {currentPage === 'confirmation' && (
        <IntegrityRecordConfirmation onCreateNew={handleBackToWorkspace} />
      )}
    </div>
  );
}
