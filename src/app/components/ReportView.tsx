interface ReportViewProps {
  reportId: string;
  onBack: () => void;
}

// Mock data structure
interface ReportData {
  id: string;
  confirmationNumber: string;
  recordType: string;
  contractorName: string;
  uei: string;
  cage: string;
  address: string;
  awardNumber: string;
  solicitation: string;
  submittedDate: string;
  status: 'Submitted' | 'Under Review' | 'Published' | 'Returned';
  submittedBy: string;
  agency: string;
  office: string;
  effectiveDate: string;
  expirationDate: string;
  actionDate: string;
  amount: string;
  description: string;
  documents: Array<{ name: string; uploadedDate: string }>;
  auditTrail: Array<{ action: string; date: string; user: string }>;
}

const MOCK_REPORT_DATA: Record<string, ReportData> = {
  '1': {
    id: '1',
    confirmationNumber: 'IR-20240001',
    recordType: 'Administrative Agreement',
    contractorName: 'Acme Construction LLC',
    uei: 'JF4K8ZTN1234',
    cage: 'CAGE123',
    address: '1234 Construction Way, Arlington, VA 22201',
    awardNumber: 'W912DY23C0001',
    solicitation: 'W912DY23R0001',
    submittedDate: '2024-02-15T10:30:00',
    status: 'Published',
    submittedBy: 'john.smith@dod.gov',
    agency: 'Department of Defense',
    office: 'Defense Contract Management Agency',
    effectiveDate: '2024-01-15',
    expirationDate: '2026-01-15',
    actionDate: '2024-01-10',
    amount: '$50,000',
    description: 'Administrative agreement entered into due to failure to comply with contract quality assurance requirements on Contract W912DY23C0001. The contractor acknowledged deficiencies in quality control procedures and agreed to implement corrective actions including enhanced inspector training and revised quality control plans. This agreement remains in effect for 24 months during which the contractor must demonstrate consistent compliance with all quality requirements.',
    documents: [
      { name: 'administrative-agreement-signed.pdf', uploadedDate: '2024-02-14' },
      { name: 'supporting-documentation.pdf', uploadedDate: '2024-02-14' },
    ],
    auditTrail: [
      { action: 'Record Created', date: '2024-02-14T09:15:00', user: 'john.smith@dod.gov' },
      { action: 'Record Submitted', date: '2024-02-15T10:30:00', user: 'john.smith@dod.gov' },
      { action: 'Under Review', date: '2024-02-15T14:20:00', user: 'sam.gov.system' },
      { action: 'Approved and Published', date: '2024-02-18T11:45:00', user: 'reviewer@sam.gov' },
    ],
  },
  '2': {
    id: '2',
    confirmationNumber: 'IR-20240002',
    recordType: 'Material Failure to Comply',
    contractorName: 'Global Services Inc',
    uei: 'ABC123DEF456',
    cage: 'CAGE456',
    address: '5678 Service Boulevard, San Diego, CA 92101',
    awardNumber: 'N00024-23-C-4321',
    solicitation: 'N00024-23-R-4321',
    submittedDate: '2024-02-14T14:22:00',
    status: 'Under Review',
    submittedBy: 'jane.doe@navy.mil',
    agency: 'Department of the Navy',
    office: 'Naval Supply Systems Command',
    effectiveDate: '2023-12-01',
    expirationDate: '2024-12-01',
    actionDate: '2023-11-28',
    amount: '$125,000',
    description: 'The contractor materially failed to comply with delivery schedule requirements specified in Contract N00024-23-C-4321, resulting in a 45-day delay of critical supplies. Despite multiple cure notices, the contractor failed to take adequate corrective action. The delay caused operational impact and required emergency procurement from alternate sources at increased cost to the government.',
    documents: [
      { name: 'cure-notice-1.pdf', uploadedDate: '2024-02-13' },
      { name: 'cure-notice-2.pdf', uploadedDate: '2024-02-13' },
      { name: 'contractor-response.pdf', uploadedDate: '2024-02-13' },
    ],
    auditTrail: [
      { action: 'Record Created', date: '2024-02-13T16:30:00', user: 'jane.doe@navy.mil' },
      { action: 'Record Submitted', date: '2024-02-14T14:22:00', user: 'jane.doe@navy.mil' },
      { action: 'Under Review', date: '2024-02-14T15:10:00', user: 'sam.gov.system' },
    ],
  },
};

const STATUS_BADGE = {
  Submitted: 'bg-[#e7f6f8] text-[#07648d]',
  'Under Review': 'bg-[#fef0cd] text-[#936c00]',
  Published: 'bg-[#ecf3ec] text-[#216e1f]',
  Returned: 'bg-[#f4e3db] text-[#b50909]',
};

export function ReportView({ reportId, onBack }: ReportViewProps) {
  const report = MOCK_REPORT_DATA[reportId];

  if (!report) {
    return (
      <div className="min-h-screen bg-[#f0f0f0] flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-[#71767a] mb-4">Report not found</p>
          <button
            onClick={onBack}
            className="h-11 px-5 py-2 bg-[#005ea2] text-white hover:bg-[#1a4480]"
          >
            Back to Workspace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f0f0]">
      {/* Header */}
      <header className="bg-[#1b1b1b] text-white">
        <div className="max-w-[960px] mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-1">Integrity Record Details</h1>
              <p className="text-base text-[#dfe1e2]">Read-Only View</p>
            </div>
            <button
              onClick={onBack}
              className="text-base text-white hover:underline flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Workspace
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[960px] mx-auto px-8 py-8">
        {/* Status Banner */}
        <div className="mb-6 p-6 bg-white border-l-4 border-[#005ea2]">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`inline-block px-3 py-1 text-sm font-bold ${STATUS_BADGE[report.status]}`}>
                  {report.status}
                </span>
                <span className="text-lg font-bold text-[#1b1b1b]">
                  {report.confirmationNumber}
                </span>
              </div>
              <p className="text-base text-[#71767a]">
                Submitted on {new Date(report.submittedDate).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="h-11 px-5 py-2 border-2 border-[#565c65] bg-white text-[#005ea2] hover:bg-[#f0f0f0]"
            >
              Print Record
            </button>
          </div>
        </div>

        {/* Section 1: Record Type */}
        <section className="mb-6 p-8 bg-white border border-[#a9aeb1]">
          <h2 className="text-lg font-bold text-[#1b1b1b] mb-6 pb-3 border-b-2 border-[#005ea2]">
            Section 1: Record Type
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-bold text-[#1b1b1b] mb-1">Integrity Record Type</p>
              <p className="text-base text-[#1b1b1b]">{report.recordType}</p>
            </div>
          </div>
        </section>

        {/* Section 2: Award Information */}
        <section className="mb-6 p-8 bg-white border border-[#a9aeb1]">
          <h2 className="text-lg font-bold text-[#1b1b1b] mb-6 pb-3 border-b-2 border-[#005ea2]">
            Section 2: Award Information
          </h2>
          
          {/* Entity Summary Card */}
          <div className="mb-6 p-6 bg-[#e7f6f8] border border-[#00bde3]">
            <h3 className="text-base font-bold text-[#1b1b1b] mb-4">Entity Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-bold text-[#1b1b1b] mb-1">Legal Business Name</p>
                <p className="text-base text-[#1b1b1b]">{report.contractorName}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-[#1b1b1b] mb-1">UEI</p>
                <p className="text-base text-[#1b1b1b]">{report.uei}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-[#1b1b1b] mb-1">CAGE Code</p>
                <p className="text-base text-[#1b1b1b]">{report.cage}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-[#1b1b1b] mb-1">Physical Address</p>
                <p className="text-base text-[#1b1b1b]">{report.address}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-bold text-[#1b1b1b] mb-1">Award Number</p>
                <p className="text-base text-[#005ea2]">{report.awardNumber}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-[#1b1b1b] mb-1">Solicitation Number</p>
                <p className="text-base text-[#1b1b1b]">{report.solicitation}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Integrity Record Details */}
        <section className="mb-6 p-8 bg-white border border-[#a9aeb1]">
          <h2 className="text-lg font-bold text-[#1b1b1b] mb-6 pb-3 border-b-2 border-[#005ea2]">
            Section 3: Integrity Record Details
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-bold text-[#1b1b1b] mb-1">Effective Date</p>
                <p className="text-base text-[#1b1b1b]">
                  {new Date(report.effectiveDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <div>
                <p className="text-sm font-bold text-[#1b1b1b] mb-1">Expiration Date</p>
                <p className="text-base text-[#1b1b1b]">
                  {new Date(report.expirationDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <div>
                <p className="text-sm font-bold text-[#1b1b1b] mb-1">Action Date</p>
                <p className="text-base text-[#1b1b1b]">
                  {new Date(report.actionDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <div>
                <p className="text-sm font-bold text-[#1b1b1b] mb-1">Monetary Value</p>
                <p className="text-base text-[#1b1b1b]">{report.amount}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-[#1b1b1b] mb-1">Description / Narrative</p>
              <div className="p-4 bg-[#f0f0f0] border border-[#a9aeb1]">
                <p className="text-base text-[#1b1b1b] whitespace-pre-wrap">{report.description}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Supporting Documents */}
        <section className="mb-6 p-8 bg-white border border-[#a9aeb1]">
          <h2 className="text-lg font-bold text-[#1b1b1b] mb-6 pb-3 border-b-2 border-[#005ea2]">
            Section 4: Supporting Documents
          </h2>
          <div className="space-y-3">
            {report.documents.map((doc, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-[#f0f0f0] border border-[#a9aeb1]">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-[#71767a]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-base font-bold text-[#1b1b1b]">{doc.name}</p>
                    <p className="text-sm text-[#71767a]">
                      Uploaded {new Date(doc.uploadedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <button className="text-sm text-[#005ea2] hover:underline">
                  Download
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Submission Information */}
        <section className="mb-6 p-8 bg-white border border-[#a9aeb1]">
          <h2 className="text-lg font-bold text-[#1b1b1b] mb-6 pb-3 border-b-2 border-[#005ea2]">
            Submission Information
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-bold text-[#1b1b1b] mb-1">Submitted By</p>
              <p className="text-base text-[#1b1b1b]">{report.submittedBy}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-[#1b1b1b] mb-1">Submission Date</p>
              <p className="text-base text-[#1b1b1b]">
                {new Date(report.submittedDate).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div>
              <p className="text-sm font-bold text-[#1b1b1b] mb-1">Agency</p>
              <p className="text-base text-[#1b1b1b]">{report.agency}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-[#1b1b1b] mb-1">Contracting Office</p>
              <p className="text-base text-[#1b1b1b]">{report.office}</p>
            </div>
          </div>
        </section>

        {/* Audit Trail */}
        <section className="mb-6 p-8 bg-white border border-[#a9aeb1]">
          <h2 className="text-lg font-bold text-[#1b1b1b] mb-6 pb-3 border-b-2 border-[#005ea2]">
            Audit Trail
          </h2>
          <div className="space-y-3">
            {report.auditTrail.map((entry, idx) => (
              <div key={idx} className="flex items-start gap-4 pb-3 border-b border-[#dfe1e2] last:border-0">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#005ea2] text-white flex items-center justify-center text-sm font-bold">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <p className="text-base font-bold text-[#1b1b1b]">{entry.action}</p>
                  <p className="text-sm text-[#71767a]">
                    {new Date(entry.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })} by {entry.user}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={onBack}
            className="h-11 px-5 py-2 bg-[#005ea2] text-white hover:bg-[#1a4480]"
          >
            Back to Workspace
          </button>
          <button
            onClick={() => window.print()}
            className="h-11 px-5 py-2 border-2 border-[#565c65] bg-white text-[#005ea2] hover:bg-[#f0f0f0]"
          >
            Print Record
          </button>
        </div>
      </div>
    </div>
  );
}
