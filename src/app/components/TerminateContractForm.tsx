import { useState } from 'react';

interface Award {
  id: string;
  awardNumber: string;
  awardTitle: string;
  contractorName: string;
  uei: string;
  value: string;
  popStart: string;
  popEnd: string;
}

interface TerminateContractFormProps {
  award: Award;
  onBack: () => void;
  onComplete: () => void;
}

export function TerminateContractForm({ award, onBack, onComplete }: TerminateContractFormProps) {
  const [terminationDate, setTerminationDate] = useState('');
  const [reason, setReason] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setUploadedFiles([...uploadedFiles, ...Array.from(files)]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, would submit to backend
    onComplete();
  };

  const isFormComplete = terminationDate && reason && additionalDetails.length >= 50;

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <div className="bg-white border-b border-[#dfe1e2]">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-[#005ea2] text-sm mb-4 hover:underline"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Workspace
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1b1b1b]">Terminate Contract</h1>
          <p className="text-sm text-[#71767a] mt-2">
            Complete this form to officially terminate the contract. This action will update the award status and
            notify relevant parties.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
        {/* Award Information (Read-only) */}
        <div className="bg-white border-2 border-[#a9aeb1] p-4 sm:p-6 mb-6">
          <h2 className="text-lg font-bold text-[#1b1b1b] mb-4">Contract Information</h2>
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="font-bold text-[#1b1b1b]">Award Number:</span>
                <p className="text-[#71767a]">{award.awardNumber}</p>
              </div>
              <div>
                <span className="font-bold text-[#1b1b1b]">UEI:</span>
                <p className="text-[#71767a]">{award.uei}</p>
              </div>
            </div>
            <div>
              <span className="font-bold text-[#1b1b1b]">Contractor:</span>
              <p className="text-[#71767a]">{award.contractorName}</p>
            </div>
            <div>
              <span className="font-bold text-[#1b1b1b]">Award Title:</span>
              <p className="text-[#71767a]">{award.awardTitle}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="font-bold text-[#1b1b1b]">Contract Value:</span>
                <p className="text-[#71767a]">{award.value}</p>
              </div>
              <div>
                <span className="font-bold text-[#1b1b1b]">Period of Performance:</span>
                <p className="text-[#71767a]">
                  {award.popStart} - {award.popEnd}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Termination Details */}
        <div className="bg-white border-2 border-[#a9aeb1] p-4 sm:p-6 mb-6">
          <h2 className="text-lg font-bold text-[#1b1b1b] mb-6">Termination Details</h2>

          {/* Termination Date */}
          <div className="mb-6">
            <label htmlFor="termination-date" className="block text-base font-bold text-[#1b1b1b] mb-2">
              Termination Date *
            </label>
            <input
              type="date"
              id="termination-date"
              value={terminationDate}
              onChange={(e) => setTerminationDate(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 border-2 border-[#a9aeb1] focus:outline-none focus:ring-4 focus:ring-[#2491ff] focus:border-[#005ea2]"
              required
            />
          </div>

          {/* Reason for Termination */}
          <div className="mb-6">
            <label htmlFor="reason" className="block text-base font-bold text-[#1b1b1b] mb-2">
              Reason for Termination *
            </label>
            <select
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border-2 border-[#a9aeb1] focus:outline-none focus:ring-4 focus:ring-[#2491ff] focus:border-[#005ea2]"
              required
            >
              <option value="">Select a reason</option>
              <option value="convenience">Termination for Convenience</option>
              <option value="default">Termination for Default</option>
              <option value="mutual-agreement">Mutual Agreement</option>
              <option value="non-performance">Non-Performance</option>
              <option value="integrity-violation">Integrity Violation</option>
              <option value="budget-constraints">Budget Constraints</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Additional Details */}
          <div className="mb-6">
            <label htmlFor="details" className="block text-base font-bold text-[#1b1b1b] mb-2">
              Additional Details *
            </label>
            <p className="text-sm text-[#71767a] mb-2">
              Provide a detailed explanation of the termination circumstances. Minimum 50 characters required.
            </p>
            <textarea
              id="details"
              value={additionalDetails}
              onChange={(e) => setAdditionalDetails(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border-2 border-[#a9aeb1] focus:outline-none focus:ring-4 focus:ring-[#2491ff] focus:border-[#005ea2]"
              placeholder="Describe the circumstances leading to termination, any relevant dates, communications, or other pertinent information..."
              required
            />
            <p className="text-xs text-[#71767a] mt-1">
              {additionalDetails.length} / 50 characters minimum
            </p>
          </div>
        </div>

        {/* Supporting Documentation */}
        <div className="bg-white border-2 border-[#a9aeb1] p-4 sm:p-6 mb-6">
          <h2 className="text-lg font-bold text-[#1b1b1b] mb-2">Supporting Documentation</h2>
          <p className="text-sm text-[#71767a] mb-4">
            Upload any relevant documentation (optional but recommended): termination letters, correspondence, notices,
            etc.
          </p>

          <div className="border-2 border-dashed border-[#a9aeb1] p-6 sm:p-8 text-center mb-4">
            <svg className="w-12 h-12 mx-auto text-[#71767a] mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="text-[#005ea2] underline hover:text-[#1a4480]">Choose files to upload</span>
              <span className="text-[#71767a]"> or drag and drop</span>
            </label>
            <input
              type="file"
              id="file-upload"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
            />
            <p className="text-xs text-[#71767a] mt-2">PDF, DOC, DOCX, TXT, JPG, PNG (Max 10MB per file)</p>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-bold text-[#1b1b1b]">Uploaded Files:</p>
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-[#f0f0f0] border border-[#dfe1e2]"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <svg className="w-5 h-5 text-[#71767a] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-[#1b1b1b] truncate">{file.name}</span>
                    <span className="text-xs text-[#71767a] flex-shrink-0">
                      ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="ml-2 text-[#b50909] hover:text-[#8b0a0a] flex-shrink-0"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Warning Notice */}
        <div className="bg-[#fef7e6] border-l-4 border-[#ffbe2e] p-4 mb-6">
          <div className="flex gap-3">
            <svg className="w-6 h-6 text-[#ffbe2e] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="text-sm font-bold text-[#1b1b1b] mb-1">Important Notice</p>
              <p className="text-sm text-[#1b1b1b]">
                Terminating this contract will permanently change its status to "Terminated" and notify all relevant
                parties including the contractor and contracting officer. This action cannot be undone.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto px-6 py-3 border-2 border-[#a9aeb1] bg-white text-[#1b1b1b] hover:bg-[#f0f0f0] focus:outline-none focus:ring-4 focus:ring-[#2491ff]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isFormComplete}
            className={`w-full sm:w-auto px-6 py-3 border-2 font-bold ${
              isFormComplete
                ? 'bg-[#b50909] border-[#b50909] text-white hover:bg-[#8b0a0a] focus:outline-none focus:ring-4 focus:ring-[#2491ff]'
                : 'bg-[#c9c9c9] border-[#c9c9c9] text-[#71767a] cursor-not-allowed'
            }`}
          >
            Terminate Contract
          </button>
        </div>
      </form>
    </div>
  );
}
