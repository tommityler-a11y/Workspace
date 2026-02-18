import { useState, useEffect } from 'react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { UswdsInput, UswdsTextarea, UswdsSelect } from './UswdsFormField';
import { ReviewScreen } from './ReviewScreen';

type RecordType = 
  | 'administrative-agreement'
  | 'defective-pricing'
  | 'dod-determination'
  | 'trafficking'
  | 'material-failure'
  | 'non-responsibility'
  | 'recipient-not-qualified'
  | 'subcontractor-payment'
  | '';

interface EntitySummary {
  legalName: string;
  address: string;
  uei: string;
  cage: string;
  awardId?: string;
  awardStatus?: 'Active' | 'Terminated' | 'Completed';
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

interface IntegrityRecordFormProps {
  initialData?: FormData;
  onComplete: (data: FormData) => void;
  onSaveDraft: () => void;
}

export function IntegrityRecordForm({ initialData, onComplete, onSaveDraft }: IntegrityRecordFormProps) {
  const [recordType, setRecordType] = useState<RecordType>(initialData?.recordType as RecordType || '');
  const [uei, setUei] = useState(initialData?.uei || '');
  const [awardNumber, setAwardNumber] = useState(initialData?.awardNumber || '');
  const [solicitation, setSolicitation] = useState(initialData?.solicitation || '');
  const [showEntityCard, setShowEntityCard] = useState(!!initialData?.entitySummary);
  const [entitySummary, setEntitySummary] = useState<EntitySummary | null>(initialData?.entitySummary || null);

  // Point of Contact fields
  const [agency, setAgency] = useState(initialData?.agency || '');
  const [office, setOffice] = useState(initialData?.office || '');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Dynamic fields for different record types
  // Dynamic fields for different record types
  const [effectiveDate, setEffectiveDate] = useState(initialData?.effectiveDate || '');
  const [expirationDate, setExpirationDate] = useState(initialData?.expirationDate || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [actionDate, setActionDate] = useState(initialData?.actionDate || '');
  const [amount, setAmount] = useState(initialData?.amount || '');
  
  // Additional dynamic fields
  const [closeoutDate, setCloseoutDate] = useState('');
  const [requirementType, setRequirementType] = useState('');
  const [investigationStatus, setInvestigationStatus] = useState('');
  const [numberOfViolations, setNumberOfViolations] = useState('');
  const [subcontractorsAffected, setSubcontractorsAffected] = useState('');
  const [totalAmountWithheld, setTotalAmountWithheld] = useState('');
  const [determinationType, setDeterminationType] = useState('');
  const [disqualificationReason, setDisqualificationReason] = useState('');

  // Search results state
  const [searchResults, setSearchResults] = useState<EntitySummary[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Progressive disclosure flags
  const [section1Complete, setSection1Complete] = useState(false);
  const [section2Complete, setSection2Complete] = useState(false);
  const [section3Complete, setSection3Complete] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [showReviewScreen, setShowReviewScreen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Mock user data - in real app would come from auth context
  const currentUser = {
    agency: 'Department of Defense',
    office: 'Defense Contract Management Agency',
  };

  const handleUseMyInfo = () => {
    setAgency(currentUser.agency);
    setOffice(currentUser.office);
  };

  const handleSection1Continue = () => {
    setSection1Complete(true);
  };

  const handleSection2Continue = () => {
    setSection2Complete(true);
  };

  const handleSection3Continue = () => {
    setSection3Complete(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles([...uploadedFiles, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleContinueToReview = () => {
    setShowReviewScreen(true);
  };

  // Show section 2 when section 1 is complete
  const showSection2 = section1Complete;
  // Show section 3 when record type is selected and section 2 is complete
  const showSection3 = recordType !== '' && section2Complete;
  // Show section 4 (documents) when section 3 is complete
  const showSection4 = section3Complete;

  // Mock search function - in reality this would call SAM.gov API
  const handleSearch = () => {
    // If Award ID is provided: direct lookup to single award
    if (awardNumber.trim()) {
      const mockAwardData: EntitySummary = {
        legalName: 'Acme Defense Contractors LLC',
        address: '1234 Contract Way, Arlington, VA 22202',
        uei: uei,
        cage: '6TL95',
        awardId: awardNumber,
        awardStatus: 'Terminated',
      };
      setEntitySummary(mockAwardData);
      setShowEntityCard(true);
      setShowResults(false);
    } 
    // If only UEI: show list of awards for that contractor
    else {
      const mockAwardsList: EntitySummary[] = [
        {
          legalName: 'Acme Defense Contractors LLC',
          address: '1234 Contract Way, Arlington, VA 22202',
          uei: uei,
          cage: '6TL95',
          awardId: 'W912DY-19-C-0045',
          awardStatus: 'Terminated',
        },
        {
          legalName: 'Acme Defense Contractors LLC',
          address: '1234 Contract Way, Arlington, VA 22202',
          uei: uei,
          cage: '6TL95',
          awardId: 'W912DY-21-C-0112',
          awardStatus: 'Completed',
        },
        {
          legalName: 'Acme Defense Contractors LLC',
          address: '1234 Contract Way, Arlington, VA 22202',
          uei: uei,
          cage: '6TL95',
          awardId: 'W912DY-23-C-0089',
          awardStatus: 'Active',
        },
      ];
      setSearchResults(mockAwardsList);
      setShowResults(true);
      setShowEntityCard(false);
    }
  };

  const handleSelectAward = (award: EntitySummary) => {
    setEntitySummary(award);
    setShowEntityCard(true);
    setShowResults(false);
    setAwardNumber(award.awardId || '');
  };

  const handleChangeSelection = () => {
    setShowEntityCard(false);
    setEntitySummary(null);
    setSearchResults([]);
    setShowResults(false);
    setAwardNumber('');
  };

  const handleSubmit = () => {
    const formData: FormData = {
      recordType,
      uei,
      awardNumber,
      solicitation,
      entitySummary,
      effectiveDate,
      expirationDate,
      actionDate,
      amount,
      description,
      agency,
      office,
    };
    setSubmitted(true);
    onComplete(formData);
  };

  const handleCancel = () => {
    // Reset or navigate away
    window.history.back();
  };

  const renderDynamicFields = () => {
    switch (recordType) {
      case 'administrative-agreement':
        return (
          <div className="space-y-6">
            <UswdsInput
              label="Effective Date"
              type="date"
              value={effectiveDate}
              onChange={setEffectiveDate}
            />
            <UswdsInput
              label="Expiration Date"
              type="date"
              value={expirationDate}
              onChange={setExpirationDate}
            />
            <UswdsTextarea
              label="Terms of Agreement"
              value={description}
              onChange={setDescription}
              placeholder="Describe the specific terms, conditions, and obligations of this administrative agreement"
            />
            <UswdsTextarea
              label="Circumstances Leading to Agreement"
              value={amount}
              onChange={setAmount}
              placeholder="Explain the circumstances or violations that led to this administrative agreement"
            />
          </div>
        );

      case 'defective-pricing':
        return (
          <div className="space-y-6">
            <UswdsInput
              label="Date of Discovery"
              type="date"
              value={actionDate}
              onChange={setActionDate}
            />
            <UswdsInput
              label="Amount of Defective Pricing"
              type="text"
              value={amount}
              onChange={setAmount}
              placeholder="$0.00"
            />
            <UswdsTextarea
              label="Description of Pricing Defect"
              value={description}
              onChange={setDescription}
              placeholder="Describe the nature of the defective pricing (e.g., failure to disclose cost or pricing data, inaccurate certified cost data)"
            />
            <UswdsTextarea
              label="Impact on Contract Price"
              value={requirementType}
              onChange={setRequirementType}
              placeholder="Explain how the defective pricing affected the contract price and what adjustments were made"
            />
          </div>
        );

      case 'dod-determination':
        return (
          <div className="space-y-6">
            <UswdsInput
              label="Determination Date"
              type="date"
              value={actionDate}
              onChange={setActionDate}
            />
            <UswdsSelect
              label="Type of Contractor Fault"
              value={determinationType}
              onChange={setDeterminationType}
              placeholder="Select fault type"
              options={[
                { value: 'cost-overrun', label: 'Cost Overrun or Schedule Delay' },
                { value: 'quality-deficiency', label: 'Quality Deficiency' },
                { value: 'performance-failure', label: 'Performance Failure' },
                { value: 'other', label: 'Other Contractor Fault' },
              ]}
            />
            <UswdsTextarea
              label="Description of Contractor Fault"
              value={description}
              onChange={setDescription}
              placeholder="Provide detailed description of the contractor fault determination and its impact on the program"
            />
            <UswdsInput
              label="Financial Impact (if applicable)"
              type="text"
              value={amount}
              onChange={setAmount}
              placeholder="$0.00"
            />
          </div>
        );

      case 'trafficking':
        return (
          <div className="space-y-6">
            <UswdsInput
              label="Date of Violation/Discovery"
              type="date"
              value={actionDate}
              onChange={setActionDate}
            />
            <UswdsSelect
              label="Investigation Status"
              value={investigationStatus}
              onChange={setInvestigationStatus}
              placeholder="Select investigation status"
              options={[
                { value: 'ongoing', label: 'Investigation Ongoing' },
                { value: 'completed', label: 'Investigation Completed' },
                { value: 'referred', label: 'Referred to Law Enforcement' },
                { value: 'substantiated', label: 'Substantiated' },
              ]}
            />
            <UswdsTextarea
              label="Description of Trafficking Violation"
              value={description}
              onChange={setDescription}
              placeholder="Describe the trafficking in persons violation, including the nature of the violation and any victims involved"
            />
            <UswdsTextarea
              label="Corrective Actions Taken"
              value={requirementType}
              onChange={setRequirementType}
              placeholder="Describe any corrective actions taken or remedial measures implemented"
            />
          </div>
        );

      case 'material-failure':
        return (
          <div className="space-y-6">
            <UswdsInput
              label="Closeout Date"
              type="date"
              value={closeoutDate}
              onChange={setCloseoutDate}
            />
            <UswdsInput
              label="Date of Failure Determination"
              type="date"
              value={actionDate}
              onChange={setActionDate}
            />
            <UswdsSelect
              label="Type of Closeout Requirement Not Met"
              value={requirementType}
              onChange={setRequirementType}
              placeholder="Select requirement type"
              options={[
                { value: 'financial-reporting', label: 'Final Financial Reporting' },
                { value: 'property-disposition', label: 'Property Disposition' },
                { value: 'patent-reporting', label: 'Patent/Invention Reporting' },
                { value: 'final-deliverables', label: 'Final Deliverables' },
                { value: 'closeout-documentation', label: 'Closeout Documentation' },
                { value: 'other', label: 'Other Requirement' },
              ]}
            />
            <UswdsTextarea
              label="Description of Material Failure"
              value={description}
              onChange={setDescription}
              placeholder="Describe the specific closeout requirement(s) not met and why this constitutes a material failure"
            />
          </div>
        );

      case 'non-responsibility':
        return (
          <div className="space-y-6">
            <UswdsInput
              label="Determination Date"
              type="date"
              value={actionDate}
              onChange={setActionDate}
            />
            <UswdsSelect
              label="Basis for Non-Responsibility"
              value={determinationType}
              onChange={setDeterminationType}
              placeholder="Select basis"
              options={[
                { value: 'financial', label: 'Lack of Financial Resources' },
                { value: 'technical', label: 'Lack of Technical Qualification' },
                { value: 'integrity', label: 'Lack of Integrity/Business Ethics' },
                { value: 'performance', label: 'Unsatisfactory Performance Record' },
                { value: 'capability', label: 'Lack of Necessary Organization/Equipment' },
                { value: 'other', label: 'Other Basis' },
              ]}
            />
            <UswdsTextarea
              label="Detailed Basis for Non-Responsibility Determination"
              value={description}
              onChange={setDescription}
              placeholder="Provide detailed explanation of why the contractor was determined to be non-responsible, including specific evidence and circumstances"
            />
            <UswdsTextarea
              label="Supporting Evidence/Documentation"
              value={requirementType}
              onChange={setRequirementType}
              placeholder="Describe any supporting evidence, investigations, or documentation that supports this determination"
            />
          </div>
        );

      case 'recipient-not-qualified':
        return (
          <div className="space-y-6">
            <UswdsInput
              label="Determination Date"
              type="date"
              value={actionDate}
              onChange={setActionDate}
            />
            <UswdsSelect
              label="Reason for Not Qualified Finding"
              value={disqualificationReason}
              onChange={setDisqualificationReason}
              placeholder="Select reason"
              options={[
                { value: 'mismanagement', label: 'History of Mismanaging Grant Funds' },
                { value: 'non-compliance', label: 'Failure to Comply with Reporting Requirements' },
                { value: 'fraud', label: 'Evidence of Fraud or Abuse' },
                { value: 'performance', label: 'Poor Performance on Previous Awards' },
                { value: 'suspension', label: 'Suspension or Debarment Action' },
                { value: 'other', label: 'Other Disqualifying Factor' },
              ]}
            />
            <UswdsTextarea
              label="Detailed Basis for Not Qualified Finding"
              value={description}
              onChange={setDescription}
              placeholder="Provide detailed explanation of why the recipient is not qualified for assistance awards, including specific incidents and evidence"
            />
            <UswdsTextarea
              label="Impact on Grant Programs"
              value={requirementType}
              onChange={setRequirementType}
              placeholder="Describe how this finding impacts current or future grant programs and any restrictions imposed"
            />
          </div>
        );

      case 'subcontractor-payment':
        return (
          <div className="space-y-6">
            <UswdsInput
              label="Date of Finding"
              type="date"
              value={actionDate}
              onChange={setActionDate}
            />
            <UswdsInput
              label="Number of Unjustified Payment Issues"
              type="number"
              value={numberOfViolations}
              onChange={setNumberOfViolations}
              placeholder="Must be 3 or more within 12 months"
            />
            <UswdsInput
              label="Number of Small Business Subcontractors Affected"
              type="number"
              value={subcontractorsAffected}
              onChange={setSubcontractorsAffected}
              placeholder="Enter number"
            />
            <UswdsInput
              label="Total Amount Reduced or Withheld"
              type="text"
              value={totalAmountWithheld}
              onChange={setTotalAmountWithheld}
              placeholder="$0.00"
            />
            <UswdsTextarea
              label="Description of Payment Issues"
              value={description}
              onChange={setDescription}
              placeholder="Describe the specific payment issues, including dates, amounts, subcontractors affected, and reasons payments were unjustifiably reduced or delayed"
            />
            <UswdsTextarea
              label="Subcontractor Details"
              value={requirementType}
              onChange={setRequirementType}
              placeholder="Provide names, UEI numbers, and contact information for affected small business subcontractors"
            />
          </div>
        );

      default:
        return null;
    }
  };

  if (submitted) {
    return (
      <div className="w-full max-w-[960px] mx-auto px-8 py-12">
        <div className="p-12 border border-[#00a91c] bg-[#e7f6e7] text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#00a91c] flex items-center justify-center">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-[#1b1b1b] mb-4">Record Submitted Successfully</h1>
          <p className="text-lg text-[#1b1b1b] mb-2">
            Your integrity record has been submitted and will be reviewed by the appropriate authorities.
          </p>
          <p className="text-base text-[#71767a] mb-8">
            Reference Number: <span className="font-bold text-[#1b1b1b]">IPI-2026-{Math.floor(Math.random() * 100000).toString().padStart(5, '0')}</span>
          </p>
          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="h-11 px-5 py-2 bg-[#005ea2] text-white hover:bg-[#1a4480] focus:outline-none focus:ring-4 focus:ring-[#2491ff]"
            >
              Create Another Record
            </button>
            <button
              type="button"
              onClick={() => {}}
              className="h-11 px-5 py-2 border-2 border-[#005ea2] bg-white text-[#005ea2] hover:bg-[#f0f0f0] focus:outline-none focus:ring-4 focus:ring-[#2491ff]"
            >
              View My Records
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[960px] mx-auto px-8 py-12">
      {!showReviewScreen ? (
        <>
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#1b1b1b] mb-2">Create Integrity Record</h1>
            <p className="text-[#71767a] text-base">Complete all sections below to submit a new integrity record.</p>
          </div>

      {/* Progress Indicator - USWDS Step Indicator */}
      <div className="mb-8">
        <div className="bg-white border-l-[0.5rem] border-[#005ea2] px-4 py-4">
          <ol className="flex items-center justify-between list-none m-0 p-0">
            {/* Step 1 */}
            <li className="flex-1 relative">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-bold relative z-10 ${
                  section1Complete 
                    ? 'bg-[#00a91c] text-white' 
                    : 'bg-[#005ea2] text-white border-4 border-white'
                }`}>
                  {section1Complete ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : '1'}
                </div>
                <span className={`text-xs font-bold mt-2 ${section1Complete ? 'text-[#1b1b1b]' : 'text-[#005ea2]'}`}>
                  Award
                </span>
              </div>
              {/* Connector line */}
              <div className={`absolute top-5 left-[50%] w-full h-1 ${section1Complete ? 'bg-[#00a91c]' : 'bg-[#dfe1e2]'}`}></div>
            </li>

            {/* Step 2 */}
            <li className="flex-1 relative">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-bold relative z-10 ${
                  section2Complete 
                    ? 'bg-[#00a91c] text-white' 
                    : showSection2 
                    ? 'bg-[#005ea2] text-white border-4 border-white' 
                    : 'bg-white border-2 border-[#dfe1e2] text-[#71767a]'
                }`}>
                  {section2Complete ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : '2'}
                </div>
                <span className={`text-xs font-bold mt-2 ${
                  section2Complete ? 'text-[#1b1b1b]' : showSection2 ? 'text-[#005ea2]' : 'text-[#71767a]'
                }`}>
                  Record Type
                </span>
              </div>
              {/* Connector line */}
              <div className={`absolute top-5 left-[50%] w-full h-1 ${section2Complete ? 'bg-[#00a91c]' : 'bg-[#dfe1e2]'}`}></div>
            </li>

            {/* Step 3 */}
            <li className="flex-1 relative">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-bold relative z-10 ${
                  section3Complete 
                    ? 'bg-[#00a91c] text-white' 
                    : showSection3 
                    ? 'bg-[#005ea2] text-white border-4 border-white' 
                    : 'bg-white border-2 border-[#dfe1e2] text-[#71767a]'
                }`}>
                  {section3Complete ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : '3'}
                </div>
                <span className={`text-xs font-bold mt-2 ${
                  section3Complete ? 'text-[#1b1b1b]' : showSection3 ? 'text-[#005ea2]' : 'text-[#71767a]'
                }`}>
                  Details
                </span>
              </div>
              {/* Connector line */}
              <div className={`absolute top-5 left-[50%] w-full h-1 ${section3Complete ? 'bg-[#00a91c]' : 'bg-[#dfe1e2]'}`}></div>
            </li>

            {/* Step 4 - Documents */}
            <li className="flex-1 relative">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-bold relative z-10 ${
                  showSection4 
                    ? 'bg-[#005ea2] text-white border-4 border-white' 
                    : 'bg-white border-2 border-[#dfe1e2] text-[#71767a]'
                }`}>
                  4
                </div>
                <span className={`text-xs font-bold mt-2 ${showSection4 ? 'text-[#005ea2]' : 'text-[#71767a]'}`}>
                  Documents
                </span>
              </div>
            </li>
          </ol>
        </div>
      </div>

      {/* Persistent Award Info Bar - Shows after award is selected */}
      {showEntityCard && entitySummary && showSection2 && (
        <div className="mb-6 p-4 bg-[#e7f6e7] border-l-4 border-[#00a91c]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-[#1b1b1b]">Selected Award</p>
              <p className="text-sm text-[#1b1b1b]">{entitySummary.legalName} • UEI: {entitySummary.uei} • CAGE: {entitySummary.cage}</p>
            </div>
            <button
              type="button"
              onClick={handleChangeSelection}
              className="text-sm text-[#005ea2] hover:underline focus:outline-none"
            >
              Change
            </button>
          </div>
        </div>
      )}

      {/* Section 1: Identify the Award */}
      <section className="mb-8 p-8 border border-[#a9aeb1] bg-white">
        <h2 className="text-lg font-bold text-[#1b1b1b] mb-2">SECTION 1: Identify the entity and award</h2>
        <p className="text-base text-[#71767a] mb-6">
          Integrity records are filed against a contractor (UEI) related to a specific contract or grant. Both are required.
        </p>
        
        {!showEntityCard && (
          <div className="space-y-6 mb-6">
            <div>
              <label className="block text-base font-bold text-[#1b1b1b] mb-2">
                Unique Entity Identifier (UEI) <span className="text-[#b50909]">*</span>
              </label>
              <input
                type="text"
                value={uei}
                onChange={(e) => setUei(e.target.value.toUpperCase())}
                placeholder="Enter 12-character UEI"
                maxLength={12}
                className="w-full h-11 px-3 py-2 border border-[#565c65] bg-white text-[#1b1b1b] focus:outline-none focus:border-[#0050d8] focus:ring-2 focus:ring-[#0050d8]"
              />
              <p className="text-sm text-[#71767a] mt-1">Enter the Unique Entity ID of the awardee for the record being entered.</p>
            </div>
            <div>
              <label className="block text-base font-bold text-[#1b1b1b] mb-2">
                Contract Award ID Number
              </label>
              <input
                type="text"
                value={awardNumber}
                onChange={(e) => setAwardNumber(e.target.value)}
                placeholder="Optional - leave blank to see all awards"
                className="w-full h-11 px-3 py-2 border border-[#565c65] bg-white text-[#1b1b1b] focus:outline-none focus:border-[#0050d8] focus:ring-2 focus:ring-[#0050d8]"
              />
              <p className="text-sm text-[#71767a] mt-1">Optional: Enter the Contract Number to go directly to that award. Leave blank to see all awards for this UEI.</p>
            </div>
            <button
              type="button"
              onClick={handleSearch}
              disabled={!uei}
              className="h-11 px-5 py-2 bg-[#005ea2] text-white hover:bg-[#1a4480] disabled:bg-[#c9c9c9] disabled:text-[#71767a] disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-[#2491ff]"
            >
              Look Up
            </button>
          </div>
        )}

        {showResults && searchResults.length > 0 && (
          <div className="mt-6 space-y-4">
            <p className="text-base font-bold text-[#1b1b1b] mb-4">Select an award:</p>
            {searchResults.map((award, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSelectAward(award)}
                className="w-full p-6 border-2 border-[#a9aeb1] bg-white text-left hover:border-[#005ea2] hover:bg-[#f0f0f0] focus:outline-none focus:ring-4 focus:ring-[#2491ff]"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-base font-bold text-[#1b1b1b]">{award.awardId}</p>
                    <span className={`px-3 py-1 text-sm font-bold ${
                      award.awardStatus === 'Terminated' ? 'bg-[#f4e3db] text-[#b50909]' :
                      award.awardStatus === 'Completed' ? 'bg-[#e7f6e7] text-[#00a91c]' :
                      'bg-[#d9e8f6] text-[#005ea2]'
                    }`}>
                      {award.awardStatus}
                    </span>
                  </div>
                  <p className="text-sm text-[#71767a]">{award.legalName}</p>
                  <p className="text-sm text-[#71767a]">{award.address}</p>
                  <div className="flex gap-6 text-sm">
                    <span className="text-[#1b1b1b]"><span className="font-bold">UEI:</span> {award.uei}</span>
                    <span className="text-[#1b1b1b]"><span className="font-bold">CAGE:</span> {award.cage}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {showEntityCard && entitySummary && (
          <>
            <div className="mt-6 p-6 border-2 border-[#00a91c] bg-[#e7f6e7]">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <p className="text-base font-bold text-[#1b1b1b]">Selected Award</p>
                  {entitySummary.awardStatus && (
                    <span className={`px-3 py-1 text-sm font-bold ${
                      entitySummary.awardStatus === 'Terminated' ? 'bg-[#f4e3db] text-[#b50909]' :
                      entitySummary.awardStatus === 'Completed' ? 'bg-white text-[#00a91c]' :
                      'bg-[#d9e8f6] text-[#005ea2]'
                    }`}>
                      {entitySummary.awardStatus}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleChangeSelection}
                  className="h-11 px-4 py-2 border-2 border-[#005ea2] bg-white text-[#005ea2] hover:bg-[#f0f0f0] focus:outline-none focus:ring-4 focus:ring-[#2491ff]"
                >
                  Change Selection
                </button>
              </div>
              <div className="space-y-3 text-base text-[#1b1b1b]">
                {entitySummary.awardId && (
                  <div>
                    <span className="font-bold">Award ID:</span> {entitySummary.awardId}
                  </div>
                )}
                <div>
                  <span className="font-bold">Legal Business Name:</span> {entitySummary.legalName}
                </div>
                <div>
                  <span className="font-bold">Address:</span> {entitySummary.address}
                </div>
                <div>
                  <span className="font-bold">UEI:</span> {entitySummary.uei}
                </div>
                <div>
                  <span className="font-bold">CAGE:</span> {entitySummary.cage}
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-8">
              <button
                type="button"
                onClick={handleSection1Continue}
                disabled={!showEntityCard || !entitySummary}
                className="h-11 px-5 py-2 bg-[#005ea2] text-white hover:bg-[#1a4480] disabled:bg-[#c9c9c9] disabled:text-[#71767a] disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-[#2491ff]"
              >
                Continue
              </button>
            </div>
          </>
        )}
      </section>

      {/* Section 2: Select Record Type */}
      {showSection2 && (
        <section className="mb-8 p-8 border border-[#a9aeb1] bg-white">
          <h2 className="text-lg font-bold text-[#1b1b1b] mb-2">SECTION 2: What are you reporting?</h2>
          <p className="text-base text-[#71767a] mb-6">
            Select the type of integrity action or determination you are reporting. This determines which fields will appear in Section 3.
          </p>
          <RadioGroup value={recordType} onValueChange={(value) => setRecordType(value as RecordType)}>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <RadioGroupItem value="administrative-agreement" id="administrative-agreement" className="mt-0.5" />
                <div className="flex-1">
                  <Label htmlFor="administrative-agreement" className="text-[#1b1b1b] cursor-pointer text-base font-normal block mb-1">
                    Administrative Agreement
                  </Label>
                  <p className="text-sm text-[#71767a]">
                    Formal agreement between a government agency and a contractor, often used as an alternative to suspension or debarment, outlining specific actions to address issues and ensure future compliance. Reporting timeframe: Within 3 working days.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <RadioGroupItem value="defective-pricing" id="defective-pricing" className="mt-0.5" />
                <div className="flex-1">
                  <Label htmlFor="defective-pricing" className="text-[#1b1b1b] cursor-pointer text-base font-normal block mb-1">
                    Defective Pricing
                  </Label>
                  <p className="text-sm text-[#71767a]">
                    Contractor submitted cost or pricing data that was not accurate, complete, or current during contract negotiations, resulting in overstated contract price. Often results from audits or investigations. Reporting timeframe: Within 3 calendar days.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <RadioGroupItem value="dod-determination" id="dod-determination" className="mt-0.5" />
                <div className="flex-1">
                  <Label htmlFor="dod-determination" className="text-[#1b1b1b] cursor-pointer text-base font-normal block mb-1">
                    DoD Determination of Contractor Fault
                  </Label>
                  <p className="text-sm text-[#71767a]">
                    Formal determination by the Department of Defense that a contractor was at fault for a specific issue related to product quality, safety, or other aspects of contract performance. Reporting timeframe: Within 3 days.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <RadioGroupItem value="trafficking" id="trafficking" className="mt-0.5" />
                <div className="flex-1">
                  <Label htmlFor="trafficking" className="text-[#1b1b1b] cursor-pointer text-base font-normal block mb-1">
                    Information on Trafficking in Persons
                  </Label>
                  <p className="text-sm text-[#71767a]">
                    Violations related to the prohibition of trafficking in persons, as outlined in the FAR. Example: Contractor subjected employees to forced labor conditions. Reporting timeframe: Within 3 calendar days.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <RadioGroupItem value="material-failure" id="material-failure" className="mt-0.5" />
                <div className="flex-1">
                  <Label htmlFor="material-failure" className="text-[#1b1b1b] cursor-pointer text-base font-normal block mb-1">
                    Material Failure to Comply with Closeout Requirement
                  </Label>
                  <p className="text-sm text-[#71767a]">
                    Recipient has not followed the regulatory requirements for closing out a grant (e.g., failed to submit final financial or performance reports).
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <RadioGroupItem value="non-responsibility" id="non-responsibility" className="mt-0.5" />
                <div className="flex-1">
                  <Label htmlFor="non-responsibility" className="text-[#1b1b1b] cursor-pointer text-base font-normal block mb-1">
                    Non-Responsibility Determination
                  </Label>
                  <p className="text-sm text-[#71767a]">
                    Determination that a vendor is not qualified to receive a contract award due to past performance, integrity issues, or other factors. Reporting timeframe: Within 3 working days.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <RadioGroupItem value="recipient-not-qualified" id="recipient-not-qualified" className="mt-0.5" />
                <div className="flex-1">
                  <Label htmlFor="recipient-not-qualified" className="text-[#1b1b1b] cursor-pointer text-base font-normal block mb-1">
                    Recipient Not Qualified Determination
                  </Label>
                  <p className="text-sm text-[#71767a]">
                    Determination that a grant recipient is not qualified to receive a grant award due to past performance, integrity issues, or other factors (e.g., history of mismanaging grant funds or failing to comply with reporting requirements).
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <RadioGroupItem value="subcontractor-payment" id="subcontractor-payment" className="mt-0.5" />
                <div className="flex-1">
                  <Label htmlFor="subcontractor-payment" className="text-[#1b1b1b] cursor-pointer text-base font-normal block mb-1">
                    Subcontractor Payment Issues
                  </Label>
                  <p className="text-sm text-[#71767a]">
                    Three or more unjustified reduced or untimely payments to small business subcontractors under a single contract within 12 months. Reporting timeframe: Within 3 calendar days.
                  </p>
                </div>
              </div>
            </div>
          </RadioGroup>
          <div className="flex justify-end mt-8">
            <button
              type="button"
              onClick={handleSection2Continue}
              disabled={recordType === ''}
              className="h-11 px-5 py-2 bg-[#005ea2] text-white hover:bg-[#1a4480] disabled:bg-[#c9c9c9] disabled:text-[#71767a] disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-[#2491ff]"
            >
              Continue
            </button>
          </div>
        </section>
      )}

      {/* Section 3: Action Details (Dynamic) */}
      {showSection3 && (
        <section className="mb-8 p-8 border border-[#a9aeb1] bg-white">
          <h2 className="text-lg font-bold text-[#1b1b1b] mb-6">SECTION 3: Action Details</h2>
          {renderDynamicFields()}
          <div className="flex justify-end mt-8">
            <button
              type="button"
              onClick={handleSection3Continue}
              className="h-11 px-5 py-2 bg-[#005ea2] text-white hover:bg-[#1a4480] focus:outline-none focus:ring-4 focus:ring-[#2491ff]"
            >
              Continue
            </button>
          </div>
        </section>
      )}

      {/* Section 4: Upload Documents */}
      {showSection4 && (
        <section className="mb-8 p-8 border border-[#a9aeb1] bg-white">
          <h2 className="text-lg font-bold text-[#1b1b1b] mb-2">SECTION 4: Upload Documents</h2>
          <p className="text-base text-[#71767a] mb-6">
            Attach supporting documentation such as determination letters, termination notices, agreements, or audit reports.
          </p>
          
          <div className="border-2 border-dashed border-[#a9aeb1] bg-[#f0f0f0] p-16 text-center">
            <input
              type="file"
              id="file-upload"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              accept=".pdf,.doc,.docx,.xls,.xlsx"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <p className="text-[#1b1b1b] text-base font-bold mb-2">Drag files here or click to browse</p>
              <p className="text-base text-[#71767a] mb-1">Accepted formats: PDF, DOC, DOCX, XLS, XLSX</p>
              <p className="text-sm text-[#71767a]">Maximum file size: 10 MB per document</p>
            </label>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="mt-6 space-y-3">
              <p className="text-base font-bold text-[#1b1b1b]">Uploaded Files ({uploadedFiles.length})</p>
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-[#f0f0f0] border border-[#a9aeb1]">
                  <div>
                    <p className="text-base text-[#1b1b1b] font-bold">{file.name}</p>
                    <p className="text-sm text-[#71767a]">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="text-[#b50909] hover:underline text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
      </section>
      )}

      {/* Contract Termination Option */}
      {showSection4 && entitySummary?.awardStatus === 'Active' && (
        <div className="bg-[#fef7e6] border-l-4 border-[#ffbe2e] p-4 sm:p-6 mb-6">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="also-terminate"
              className="mt-1 h-5 w-5 border-2 border-[#a9aeb1] rounded focus:ring-4 focus:ring-[#2491ff]"
            />
            <div className="flex-1">
              <label htmlFor="also-terminate" className="block">
                <span className="text-base font-bold text-[#1b1b1b]">Also terminate this contract</span>
                <p className="text-sm text-[#71767a] mt-1">
                  Check this box if this integrity violation requires contract termination. You'll be able to complete
                  the termination form after submitting this integrity record.
                </p>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Buttons */}
      {showSection4 && (
        <div className="flex justify-end gap-4 mt-10">
          <button
            type="button"
            onClick={handleCancel}
            className="h-11 px-5 py-2 border-2 border-[#565c65] bg-white text-[#005ea2] hover:bg-[#f0f0f0] focus:outline-none focus:ring-4 focus:ring-[#2491ff]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSaveDraft}
            className="h-11 px-5 py-2 border-2 border-[#565c65] bg-white text-[#005ea2] hover:bg-[#f0f0f0] focus:outline-none focus:ring-4 focus:ring-[#2491ff]"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={handleContinueToReview}
            className="h-11 px-5 py-2 bg-[#005ea2] text-white hover:bg-[#1a4480] focus:outline-none focus:ring-4 focus:ring-[#2491ff]"
          >
            Continue to Review
          </button>
        </div>
      )}
        </>
      ) : (
        <ReviewScreen
          formData={{
            recordType,
            uei,
            awardNumber,
            solicitation,
            entitySummary,
            effectiveDate,
            expirationDate,
            actionDate,
            amount,
            description,
            agency,
            office,
            contactName,
            phone,
            email,
          }}
          uploadedFiles={uploadedFiles}
          onEdit={() => setShowReviewScreen(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
