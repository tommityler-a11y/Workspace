interface EntitySummary {
  legalName: string;
  address: string;
  uei: string;
  cage: string;
}

interface FormData {
  recordType: string;
  uei: string;
  awardNumber: string;
  solicitation: string;
  entitySummary: EntitySummary | null;
  effectiveDate: string;
  expirationDate: string;
  actionDate: string;
  amount: string;
  description: string;
  agency: string;
  office: string;
}

interface ReviewScreenProps {
  formData: FormData;
  uploadedFiles: File[];
  onEdit: () => void;
  onSubmit: () => void;
}

const recordTypeLabels: { [key: string]: string } = {
  'administrative-agreement': 'Administrative Agreement',
  'defective-pricing': 'Defective Pricing',
  'dod-determination': 'DoD Determination of Contractor Fault',
  'trafficking': 'Trafficking in Persons',
  'material-failure': 'Material Failure to Comply',
  'non-responsibility': 'Non-Responsibility Determination',
  'recipient-not-qualified': 'Recipient Not Qualified',
  'subcontractor-payment': 'Subcontractor Payment Issues',
  'termination': 'Termination for Cause or Default',
};

export function ReviewScreen({ formData, uploadedFiles, onEdit, onSubmit }: ReviewScreenProps) {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1b1b1b] mb-2">Review and Submit</h1>
        <p className="text-[#71767a] text-base">Review your integrity record before submitting. Click Edit to make changes.</p>
      </div>

      {/* Success Banner */}
      <div className="mb-8 p-4 bg-[#e7f6e7] border-l-4 border-[#00a91c]">
        <p className="text-base text-[#1b1b1b]">
          <span className="font-bold">Ready to submit.</span> Please review all information below for accuracy.
        </p>
      </div>

      {/* Award Information */}
      <section className="mb-6 p-8 border border-[#a9aeb1] bg-white">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-[#1b1b1b]">Award Information</h2>
          <button
            type="button"
            onClick={onEdit}
            className="text-[#005ea2] hover:underline text-sm font-bold"
          >
            Edit
          </button>
        </div>
        {formData.entitySummary && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-bold text-[#71767a] mb-1">Legal Business Name</p>
                <p className="text-base text-[#1b1b1b]">{formData.entitySummary.legalName}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-[#71767a] mb-1">UEI</p>
                <p className="text-base text-[#1b1b1b]">{formData.entitySummary.uei}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-bold text-[#71767a] mb-1">Award Number</p>
                <p className="text-base text-[#1b1b1b]">{formData.awardNumber}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-[#71767a] mb-1">CAGE Code</p>
                <p className="text-base text-[#1b1b1b]">{formData.entitySummary.cage}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-[#71767a] mb-1">Address</p>
              <p className="text-base text-[#1b1b1b]">{formData.entitySummary.address}</p>
            </div>
          </div>
        )}
      </section>

      {/* Record Type */}
      <section className="mb-6 p-8 border border-[#a9aeb1] bg-white">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-[#1b1b1b]">Record Type</h2>
          <button
            type="button"
            onClick={onEdit}
            className="text-[#005ea2] hover:underline text-sm font-bold"
          >
            Edit
          </button>
        </div>
        <p className="text-base text-[#1b1b1b]">{recordTypeLabels[formData.recordType] || formData.recordType}</p>
      </section>

      {/* Action Details */}
      <section className="mb-6 p-8 border border-[#a9aeb1] bg-white">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-[#1b1b1b]">Action Details</h2>
          <button
            type="button"
            onClick={onEdit}
            className="text-[#005ea2] hover:underline text-sm font-bold"
          >
            Edit
          </button>
        </div>
        <div className="space-y-4">
          {formData.effectiveDate && (
            <div>
              <p className="text-sm font-bold text-[#71767a] mb-1">Effective Date</p>
              <p className="text-base text-[#1b1b1b]">{formData.effectiveDate}</p>
            </div>
          )}
          {formData.expirationDate && (
            <div>
              <p className="text-sm font-bold text-[#71767a] mb-1">Expiration Date</p>
              <p className="text-base text-[#1b1b1b]">{formData.expirationDate}</p>
            </div>
          )}
          {formData.actionDate && (
            <div>
              <p className="text-sm font-bold text-[#71767a] mb-1">Action Date</p>
              <p className="text-base text-[#1b1b1b]">{formData.actionDate}</p>
            </div>
          )}
          {formData.amount && (
            <div>
              <p className="text-sm font-bold text-[#71767a] mb-1">Amount</p>
              <p className="text-base text-[#1b1b1b]">{formData.amount}</p>
            </div>
          )}
          {formData.description && (
            <div>
              <p className="text-sm font-bold text-[#71767a] mb-1">Description</p>
              <p className="text-base text-[#1b1b1b] whitespace-pre-wrap">{formData.description}</p>
            </div>
          )}
        </div>
      </section>

      {/* Submitting Agency Information */}
      <section className="mb-6 p-8 border border-[#a9aeb1] bg-white">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-[#1b1b1b]">Submitting Agency</h2>
          <button
            type="button"
            onClick={onEdit}
            className="text-[#005ea2] hover:underline text-sm font-bold"
          >
            Edit
          </button>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-bold text-[#71767a] mb-1">Agency</p>
              <p className="text-base text-[#1b1b1b]">{formData.agency || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-[#71767a] mb-1">Office</p>
              <p className="text-base text-[#1b1b1b]">{formData.office || 'Not provided'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Uploaded Documents */}
      <section className="mb-6 p-8 border border-[#a9aeb1] bg-white">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-[#1b1b1b]">Uploaded Documents</h2>
          <button
            type="button"
            onClick={onEdit}
            className="text-[#005ea2] hover:underline text-sm font-bold"
          >
            Edit
          </button>
        </div>
        {uploadedFiles.length > 0 ? (
          <div className="space-y-3">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-[#f0f0f0]">
                <div>
                  <p className="text-base text-[#1b1b1b] font-bold">{file.name}</p>
                  <p className="text-sm text-[#71767a]">{(file.size / 1024).toFixed(2)} KB</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-base text-[#71767a]">No documents uploaded</p>
        )}
      </section>

      {/* Certification */}
      <section className="mb-8 p-8 border border-[#a9aeb1] bg-white">
        <h2 className="text-lg font-bold text-[#1b1b1b] mb-4">Certification</h2>
        <div className="p-4 bg-[#f0f0f0] border-l-4 border-[#565c65]">
          <p className="text-base text-[#1b1b1b] mb-4">
            I certify that the information provided in this integrity record is accurate and complete to the best of my knowledge. 
            I understand that this information will be made available to federal agencies and the public through SAM.gov.
          </p>
          <label className="flex items-start cursor-pointer">
            <input
              type="checkbox"
              className="mt-1 mr-3 w-5 h-5"
            />
            <span className="text-base text-[#1b1b1b]">
              I certify that the information in this record is accurate and complete
            </span>
          </label>
        </div>
      </section>

      {/* Bottom Buttons */}
      <div className="flex justify-end gap-4 mt-10">
        <button
          type="button"
          onClick={onEdit}
          className="h-11 px-5 py-2 border-2 border-[#565c65] bg-white text-[#005ea2] hover:bg-[#f0f0f0] focus:outline-none focus:ring-4 focus:ring-[#2491ff]"
        >
          Back to Edit
        </button>
        <button
          type="button"
          onClick={onSubmit}
          className="h-11 px-5 py-2 bg-[#00a91c] text-white hover:bg-[#008817] focus:outline-none focus:ring-4 focus:ring-[#2491ff]"
        >
          Submit Integrity Record
        </button>
      </div>
    </div>
  );
}
