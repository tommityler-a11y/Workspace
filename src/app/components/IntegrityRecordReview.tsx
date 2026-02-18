import { useState } from 'react';

interface ReviewProps {
  formData: {
    recordType: string;
    uei: string;
    awardNumber: string;
    solicitation: string;
    entitySummary: {
      legalName: string;
      address: string;
      uei: string;
      cage: string;
    } | null;
    effectiveDate: string;
    expirationDate: string;
    actionDate: string;
    amount: string;
    description: string;
    agency: string;
    office: string;
  };
  onEdit: (section: number) => void;
  onBack: () => void;
  onSaveDraft: () => void;
  onSubmit: () => void;
}

const recordTypeLabels: Record<string, string> = {
  'administrative-agreement': 'Administrative Agreement',
  'defective-pricing': 'Defective Pricing',
  'dod-determination': 'DoD Determination of Contractor Fault',
  'trafficking': 'Information on Trafficking in Persons',
  'material-failure': 'Material Failure to Comply with Closeout Requirements',
  'non-responsibility': 'Non-Responsibility Determination',
  'recipient-not-qualified': 'Recipient Not-Qualified Determination',
  'subcontractor-payment': 'Subcontractor Payment Issues',
  'termination': 'Termination for Cause or Default',
};

export function IntegrityRecordReview({ formData, onEdit, onBack, onSaveDraft, onSubmit }: ReviewProps) {
  const [certified, setCertified] = useState(false);

  const formatDate = (dateString: string) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  };

  const handleSubmit = () => {
    if (!certified) {
      alert('Please certify that the information is accurate and complete.');
      return;
    }
    onSubmit();
  };

  return (
    <div className="w-full max-w-[960px] mx-auto px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1b1b1b] mb-3">Review Integrity Record</h1>
        <p className="text-base text-[#71767a]">
          Review the information below before submitting. You can edit any section if changes are needed.
        </p>
      </div>

      {/* Section 1: Record Type */}
      <section className="mb-8 p-8 border border-[#a9aeb1] bg-white">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-lg font-bold text-[#1b1b1b]">SECTION 1: Record Type</h2>
          <button
            type="button"
            onClick={() => onEdit(1)}
            className="text-[#005ea2] underline hover:text-[#1a4480] text-base font-bold"
          >
            Edit
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-base font-bold text-[#1b1b1b] mb-1">Record Type</p>
            <p className="text-base text-[#1b1b1b]">
              {recordTypeLabels[formData.recordType] || '—'}
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Award Information */}
      <section className="mb-8 p-8 border border-[#a9aeb1] bg-white">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-lg font-bold text-[#1b1b1b]">SECTION 2: Award Information</h2>
          <button
            type="button"
            onClick={() => onEdit(2)}
            className="text-[#005ea2] underline hover:text-[#1a4480] text-base font-bold"
          >
            Edit
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-base font-bold text-[#1b1b1b] mb-1">UEI</p>
            <p className="text-base text-[#1b1b1b]">{formData.uei || '—'}</p>
          </div>
          <div>
            <p className="text-base font-bold text-[#1b1b1b] mb-1">Award Number</p>
            <p className="text-base text-[#1b1b1b]">{formData.awardNumber || '—'}</p>
          </div>
          <div>
            <p className="text-base font-bold text-[#1b1b1b] mb-1">Solicitation</p>
            <p className="text-base text-[#1b1b1b]">{formData.solicitation || '—'}</p>
          </div>
          {formData.entitySummary && (
            <>
              <div className="pt-4 border-t border-[#dfe1e2]">
                <p className="text-base font-bold text-[#1b1b1b] mb-1">Legal Business Name</p>
                <p className="text-base text-[#1b1b1b]">{formData.entitySummary.legalName}</p>
              </div>
              <div>
                <p className="text-base font-bold text-[#1b1b1b] mb-1">Address</p>
                <p className="text-base text-[#1b1b1b]">{formData.entitySummary.address}</p>
              </div>
              <div>
                <p className="text-base font-bold text-[#1b1b1b] mb-1">CAGE Code</p>
                <p className="text-base text-[#1b1b1b]">{formData.entitySummary.cage}</p>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Section 3: Action Details */}
      <section className="mb-8 p-8 border border-[#a9aeb1] bg-white">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-lg font-bold text-[#1b1b1b]">SECTION 3: Action Details</h2>
          <button
            type="button"
            onClick={() => onEdit(3)}
            className="text-[#005ea2] underline hover:text-[#1a4480] text-base font-bold"
          >
            Edit
          </button>
        </div>
        <div className="space-y-4">
          {/* Administrative Agreement */}
          {formData.recordType === 'administrative-agreement' && (
            <>
              <div>
                <p className="text-base font-bold text-[#1b1b1b] mb-1">Agreement Effective Date</p>
                <p className="text-base text-[#1b1b1b]">{formatDate(formData.effectiveDate)}</p>
              </div>
              <div>
                <p className="text-base font-bold text-[#1b1b1b] mb-1">Agreement Expiration Date</p>
                <p className="text-base text-[#1b1b1b]">{formatDate(formData.expirationDate)}</p>
              </div>
              <div>
                <p className="text-base font-bold text-[#1b1b1b] mb-1">Summary / Description of Agreement</p>
                <p className="text-base text-[#1b1b1b] whitespace-pre-wrap">{formData.description || '—'}</p>
              </div>
            </>
          )}

          {/* Defective Pricing */}
          {formData.recordType === 'defective-pricing' && (
            <>
              <div>
                <p className="text-base font-bold text-[#1b1b1b] mb-1">Final Action Date</p>
                <p className="text-base text-[#1b1b1b]">{formatDate(formData.actionDate)}</p>
              </div>
              <div>
                <p className="text-base font-bold text-[#1b1b1b] mb-1">Amount Involved (Dollar Value)</p>
                <p className="text-base text-[#1b1b1b]">{formData.amount || '—'}</p>
              </div>
              <div>
                <p className="text-base font-bold text-[#1b1b1b] mb-1">Description of Pricing Issue</p>
                <p className="text-base text-[#1b1b1b] whitespace-pre-wrap">{formData.description || '—'}</p>
              </div>
            </>
          )}

          {/* DoD Determination */}
          {formData.recordType === 'dod-determination' && (
            <>
              <div>
                <p className="text-base font-bold text-[#1b1b1b] mb-1">Determination Date</p>
                <p className="text-base text-[#1b1b1b]">{formatDate(formData.actionDate)}</p>
              </div>
              <div>
                <p className="text-base font-bold text-[#1b1b1b] mb-1">Description of Fault</p>
                <p className="text-base text-[#1b1b1b] whitespace-pre-wrap">{formData.description || '—'}</p>
              </div>
            </>
          )}

          {/* Trafficking */}
          {formData.recordType === 'trafficking' && (
            <>
              <div>
                <p className="text-base font-bold text-[#1b1b1b] mb-1">Date of Determination or Finding</p>
                <p className="text-base text-[#1b1b1b]">{formatDate(formData.actionDate)}</p>
              </div>
              <div>
                <p className="text-base font-bold text-[#1b1b1b] mb-1">Description of Violation</p>
                <p className="text-base text-[#1b1b1b] whitespace-pre-wrap">{formData.description || '—'}</p>
              </div>
            </>
          )}

          {/* Material Failure */}
          {formData.recordType === 'material-failure' && (
            <>
              <div>
                <p className="text-base font-bold text-[#1b1b1b] mb-1">Date of Material Failure</p>
                <p className="text-base text-[#1b1b1b]">{formatDate(formData.actionDate)}</p>
              </div>
              <div>
                <p className="text-base font-bold text-[#1b1b1b] mb-1">Description of Failure</p>
                <p className="text-base text-[#1b1b1b] whitespace-pre-wrap">{formData.description || '—'}</p>
              </div>
            </>
          )}

          {/* Non-Responsibility */}
          {formData.recordType === 'non-responsibility' && (
            <>
              <div>
                <p className="text-base font-bold text-[#1b1b1b] mb-1">Determination Date</p>
                <p className="text-base text-[#1b1b1b]">{formatDate(formData.actionDate)}</p>
              </div>
              <div>
                <p className="text-base font-bold text-[#1b1b1b] mb-1">Basis for Non-Responsibility</p>
                <p className="text-base text-[#1b1b1b] whitespace-pre-wrap">{formData.description || '—'}</p>
              </div>
            </>
          )}

          {/* Recipient Not Qualified */}
          {formData.recordType === 'recipient-not-qualified' && (
            <>
              <div>
                <p className="text-base font-bold text-[#1b1b1b] mb-1">Determination Date</p>
                <p className="text-base text-[#1b1b1b]">{formatDate(formData.actionDate)}</p>
              </div>
              <div>
                <p className="text-base font-bold text-[#1b1b1b] mb-1">Basis for Not Qualified Finding</p>
                <p className="text-base text-[#1b1b1b] whitespace-pre-wrap">{formData.description || '—'}</p>
              </div>
            </>
          )}

          {/* Subcontractor Payment */}
          {formData.recordType === 'subcontractor-payment' && (
            <>
              <div>
                <p className="text-base font-bold text-[#1b1b1b] mb-1">Date of Finding</p>
                <p className="text-base text-[#1b1b1b]">{formatDate(formData.actionDate)}</p>
              </div>
              <div>
                <p className="text-base font-bold text-[#1b1b1b] mb-1">Description of Payment Issue</p>
                <p className="text-base text-[#1b1b1b] whitespace-pre-wrap">{formData.description || '—'}</p>
              </div>
            </>
          )}

          {/* Termination */}
        </div>
      </section>

      {/* Section 4: Supporting Documents */}
      <section className="mb-8 p-8 border border-[#a9aeb1] bg-white">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-lg font-bold text-[#1b1b1b]">SECTION 4: Supporting Documents</h2>
          <button
            type="button"
            onClick={() => onEdit(4)}
            className="text-[#005ea2] underline hover:text-[#1a4480] text-base font-bold"
          >
            Edit
          </button>
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-base font-bold text-[#1b1b1b] mb-2">Uploaded Documents</p>
            <ul className="list-disc pl-6 space-y-1">
              <li className="text-base text-[#71767a]">agreement_signed.pdf</li>
              <li className="text-base text-[#71767a]">determination_letter.docx</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Certification */}
      <div className="mb-8 p-6 bg-[#f0f0f0] border-l-4 border-[#005ea2]">
        <label className="flex items-start cursor-pointer">
          <input
            type="checkbox"
            checked={certified}
            onChange={(e) => setCertified(e.target.checked)}
            className="mt-1 mr-3 w-5 h-5 border-2 border-[#565c65] focus:ring-2 focus:ring-[#0050d8]"
          />
          <span className="text-base text-[#1b1b1b]">
            I certify that the information provided is accurate and complete to the best of my knowledge.
          </span>
        </label>
      </div>

      {/* Bottom Buttons */}
      <div className="flex justify-between gap-4 mt-10">
        <button
          type="button"
          onClick={onBack}
          className="h-11 px-5 py-2 border-2 border-[#565c65] bg-white text-[#005ea2] hover:bg-[#f0f0f0] focus:outline-none focus:ring-4 focus:ring-[#2491ff]"
        >
          Back
        </button>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={onSaveDraft}
            className="h-11 px-5 py-2 border-2 border-[#565c65] bg-white text-[#005ea2] hover:bg-[#f0f0f0] focus:outline-none focus:ring-4 focus:ring-[#2491ff]"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!certified}
            className={`h-11 px-5 py-2 ${
              certified
                ? 'bg-[#005ea2] text-white hover:bg-[#1a4480] focus:outline-none focus:ring-4 focus:ring-[#2491ff]'
                : 'bg-[#c9c9c9] text-[#71767a] cursor-not-allowed'
            }`}
          >
            Submit Record
          </button>
        </div>
      </div>
    </div>
  );
}
