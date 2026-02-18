interface ConfirmationProps {
  onCreateNew: () => void;
}

export function IntegrityRecordConfirmation({ onCreateNew }: ConfirmationProps) {
  const confirmationNumber = `IR-${Date.now().toString().slice(-8)}`;
  const timestamp = new Date().toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div className="w-full max-w-[960px] mx-auto px-8 py-12">
      {/* Success Alert */}
      <div className="mb-8 p-8 bg-[#ecf3ec] border-l-4 border-[#00a91c]">
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-4">
            <svg className="w-8 h-8 text-[#00a91c]" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1b1b1b] mb-2">Integrity Record Submitted</h1>
            <p className="text-base text-[#1b1b1b]">
              Your integrity record has been successfully submitted and is now in the SAM.gov system.
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation Details */}
      <section className="mb-8 p-8 border border-[#a9aeb1] bg-white">
        <h2 className="text-lg font-bold text-[#1b1b1b] mb-6">Submission Details</h2>
        <div className="space-y-4">
          <div>
            <p className="text-base font-bold text-[#1b1b1b] mb-1">Confirmation Number</p>
            <p className="text-xl text-[#005ea2] font-bold">{confirmationNumber}</p>
          </div>
          <div>
            <p className="text-base font-bold text-[#1b1b1b] mb-1">Submission Date and Time</p>
            <p className="text-base text-[#1b1b1b]">{timestamp}</p>
          </div>
          <div>
            <p className="text-base font-bold text-[#1b1b1b] mb-1">Status</p>
            <p className="text-base text-[#1b1b1b]">Submitted — Processing</p>
          </div>
        </div>
      </section>

      {/* What Happens Next */}
      <section className="mb-8 p-8 border border-[#a9aeb1] bg-white">
        <h2 className="text-lg font-bold text-[#1b1b1b] mb-6">What Happens Next</h2>
        <ul className="space-y-3 list-none">
          <li className="flex items-start">
            <span className="inline-block w-6 h-6 rounded-full bg-[#005ea2] text-white text-center mr-3 flex-shrink-0">
              1
            </span>
            <p className="text-base text-[#1b1b1b] pt-0.5">
              Your record will be reviewed by the SAM.gov integrity team within 3-5 business days.
            </p>
          </li>
          <li className="flex items-start">
            <span className="inline-block w-6 h-6 rounded-full bg-[#005ea2] text-white text-center mr-3 flex-shrink-0">
              2
            </span>
            <p className="text-base text-[#1b1b1b] pt-0.5">
              You will receive an email notification when the record is published or if additional information is needed.
            </p>
          </li>
          <li className="flex items-start">
            <span className="inline-block w-6 h-6 rounded-full bg-[#005ea2] text-white text-center mr-3 flex-shrink-0">
              3
            </span>
            <p className="text-base text-[#1b1b1b] pt-0.5">
              You can track the status of your submission in your workspace dashboard.
            </p>
          </li>
        </ul>
      </section>

      {/* Important Information */}
      <section className="mb-8 p-6 bg-[#f0f0f0]">
        <h3 className="text-base font-bold text-[#1b1b1b] mb-3">Important Information</h3>
        <ul className="space-y-2 text-base text-[#1b1b1b] list-disc pl-6">
          <li>Save your confirmation number for future reference.</li>
          <li>A copy of this confirmation has been sent to your email address.</li>
          <li>
            If you need to make changes, contact SAM.gov support at{' '}
            <a href="tel:1-866-606-8220" className="text-[#005ea2] underline">
              1-866-606-8220
            </a>
            .
          </li>
        </ul>
      </section>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={onCreateNew}
          className="h-11 px-5 py-2 bg-[#005ea2] text-white hover:bg-[#1a4480] focus:outline-none focus:ring-4 focus:ring-[#2491ff]"
        >
          Back to Workspace
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="h-11 px-5 py-2 border-2 border-[#565c65] bg-white text-[#005ea2] hover:bg-[#f0f0f0] focus:outline-none focus:ring-4 focus:ring-[#2491ff]"
        >
          Print Confirmation
        </button>
      </div>
    </div>
  );
}
