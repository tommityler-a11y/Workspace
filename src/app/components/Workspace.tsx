import { useState, useEffect, useRef } from 'react';
import { Badge } from './ui/badge';

interface Award {
  id: string;
  awardNumber: string;
  awardTitle: string;
  contractorName: string;
  uei: string;
  awardType: string;
  popStart: string;
  popEnd: string;
  value: string;
  status: 'Active' | 'Terminated';
  assignedTo: string; // COR assigned to this contract
  integrityRecords: number;
  needsIntegrityReport: boolean; // Only some contracts require integrity reporting
}

interface IntegrityRecord {
  id: string;
  documentNumber: string;
  recordType: string;
  awardNumber: string;
  contractorName: string;
  status: 'Draft' | 'Under Review' | 'Published';
  assignedTo: string;
  createdDate: string;
  lastModified: string;
  createdBy: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  officeId: string;
  role: 'Contracting Officer' | 'COR' | 'Reviewer';
  accessLevel: 'All Office Contracts' | 'Assigned Contracts Only';
  contractsAssigned: number;
}

interface WorkspaceProps {
  onCreateNew: () => void;
  onViewReport: (reportId: string) => void;
  onEditReport: (reportId: string) => void;
  onManageAward?: (awardId: string) => void;
}

// Current user context
const CURRENT_USER = {
  name: 'John Smith',
  email: 'john.smith@dcma.mil',
  role: 'COR' as const,
};

// User's accessible offices
const USER_OFFICES = [
  {
    id: 'DCMA-2024',
    name: 'Defense Contract Management Agency',
    contractCount: 5,
    role: 'COR',
  },
  {
    id: 'NAVSUP-1142',
    name: 'Naval Supply Systems Command',
    contractCount: 3,
    role: 'COR',
  },
  {
    id: 'GSA-9876',
    name: 'General Services Administration',
    contractCount: 0,
    role: 'Reviewer',
  },
];

// Pending access requests
interface AccessRequest {
  id: string;
  officeId: string;
  officeName: string;
  requestedRole: string;
  requestedDate: string;
  status: 'Pending' | 'Approved' | 'Denied';
  approver?: string;
}

const PENDING_REQUESTS: AccessRequest[] = [
  {
    id: 'req-001',
    officeId: 'DLA-5432',
    officeName: 'Defense Logistics Agency',
    requestedRole: 'COR',
    requestedDate: '02/12/2025',
    status: 'Pending',
  },
  {
    id: 'req-002',
    officeId: 'AFSPC-8899',
    officeName: 'Air Force Space Command',
    requestedRole: 'Reviewer',
    requestedDate: '02/10/2025',
    status: 'Pending',
  },
];

// All contracts in the office - COR sees only their assigned contracts by default
// Only showing awards that need integrity reports (not all contracts require reporting)
const MOCK_AWARDS: Award[] = [
  {
    id: '1',
    awardNumber: 'W912DY23C0001',
    awardTitle: 'Base Construction Services',
    contractorName: 'Acme Construction LLC',
    uei: 'JF4K8ZTN1234',
    awardType: 'Fixed Price',
    popStart: 'Mar 2023',
    popEnd: 'Mar 2025',
    value: '$2,450,000',
    status: 'Active',
    assignedTo: 'John Smith',
    integrityRecords: 2, // Has termination record + administrative agreement
    needsIntegrityReport: true, // Performance issues require reporting
  },
  {
    id: '2',
    awardNumber: 'N00024-23-C-4321',
    awardTitle: 'IT Support Services',
    contractorName: 'Global Services Inc',
    uei: 'ABC123DEF456',
    awardType: 'Cost Plus',
    popStart: 'Jan 2023',
    popEnd: 'Dec 2024',
    value: '$890,000',
    status: 'Active',
    assignedTo: 'John Smith',
    integrityRecords: 1, // Has 1 draft performance issue record
    needsIntegrityReport: true, // Quality concerns
  },
  {
    id: '3',
    awardNumber: 'W912DY22C0089',
    awardTitle: 'Infrastructure Repair',
    contractorName: 'Acme Construction LLC',
    uei: 'JF4K8ZTN1234',
    awardType: 'Cost Plus',
    popStart: 'Jan 2022',
    popEnd: 'Dec 2023',
    value: '$1,800,000',
    status: 'Terminated',
    assignedTo: 'John Smith',
    integrityRecords: 1, // Has termination record
    needsIntegrityReport: true,
  },
  {
    id: '4',
    awardNumber: 'FA8621-22-C-9876',
    awardTitle: 'Engineering Support',
    contractorName: 'TechCorp Solutions',
    uei: 'XYZ789GHI012',
    awardType: 'Time & Materials',
    popStart: 'Jun 2022',
    popEnd: 'Jun 2024',
    value: '$1,250,000',
    status: 'Terminated',
    assignedTo: 'John Smith',
    integrityRecords: 1, // Has termination record
    needsIntegrityReport: true,
  },
  // Office has other contracts, but not all require integrity reports
  // This one is assigned to another COR
  {
    id: '5',
    awardNumber: 'GS-35F-0119Y',
    awardTitle: 'Facility Maintenance',
    contractorName: 'ProService Corp',
    uei: 'DEF456GHI789',
    awardType: 'Fixed Price',
    popStart: 'Sep 2023',
    popEnd: 'Sep 2025',
    value: '$675,000',
    status: 'Active',
    assignedTo: 'Sarah Johnson',
    integrityRecords: 0,
    needsIntegrityReport: false, // No issues, no reporting needed
  },
];

const MOCK_RECORDS: IntegrityRecord[] = [
  {
    id: '1',
    documentNumber: 'DRAFT-2025-001',
    recordType: 'Performance Issue',
    awardNumber: 'N00024-23-C-4321',
    contractorName: 'Global Services Inc',
    status: 'Draft',
    assignedTo: 'John Smith',
    createdDate: '02/15/2025',
    lastModified: '02/17/2025',
    createdBy: 'John Smith',
  },
  {
    id: '2',
    documentNumber: 'NEWPSC24C0011',
    recordType: 'Termination for Default',
    awardNumber: 'W912DY23C0001',
    contractorName: 'Acme Construction LLC',
    status: 'Published',
    assignedTo: 'John Smith',
    createdDate: '01/15/2024',
    lastModified: '01/20/2024',
    createdBy: 'John Smith',
  },
  {
    id: '3',
    documentNumber: 'NEWPSC24C0012',
    recordType: 'Administrative Agreement',
    awardNumber: 'W912DY23C0001',
    contractorName: 'Acme Construction LLC',
    status: 'Published',
    assignedTo: 'John Smith',
    createdDate: '03/20/2024',
    lastModified: '03/25/2024',
    createdBy: 'John Smith',
  },
  {
    id: '4',
    documentNumber: 'NEWPSC22C0089',
    recordType: 'Termination for Cause',
    awardNumber: 'W912DY22C0089',
    contractorName: 'Acme Construction LLC',
    status: 'Published',
    assignedTo: 'John Smith',
    createdDate: '12/10/2023',
    lastModified: '12/15/2023',
    createdBy: 'John Smith',
  },
];

const MOCK_TEAM: TeamMember[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@dcma.mil',
    officeId: 'DCMA-2024',
    role: 'COR',
    accessLevel: 'Assigned Contracts Only',
    contractsAssigned: 4,
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@dcma.mil',
    officeId: 'DCMA-2024',
    role: 'COR',
    accessLevel: 'Assigned Contracts Only',
    contractsAssigned: 1,
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'michael.chen@dcma.mil',
    officeId: 'DCMA-2024',
    role: 'Contracting Officer',
    accessLevel: 'All Office Contracts',
    contractsAssigned: 5,
  },
];

export function Workspace({ onCreateNew, onViewReport, onEditReport, onManageAward }: WorkspaceProps) {
  // Check if we're on mobile on initial load - sidebar closed on mobile, open on desktop
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState<'overview' | 'my-awards' | 'office-awards' | 'records' | 'team'>(
    'my-awards'
  );
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'terminated'>('all');
  const [sortBy, setSortBy] = useState<'date-latest' | 'date-oldest' | 'title-az' | 'title-za'>('date-latest');
  const [manageMenuOpen, setManageMenuOpen] = useState<string | null>(null);
  const [currentOfficeId, setCurrentOfficeId] = useState('DCMA-2024');
  const [officeMenuOpen, setOfficeMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Set sidebar open on desktop by default
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    // Set initial state
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const currentOffice = USER_OFFICES.find((office) => office.id === currentOfficeId) || USER_OFFICES[0];

  // Close manage dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.manage-dropdown-container')) {
        setManageMenuOpen(null);
      }
      if (!target.closest('.office-switcher-container')) {
        setOfficeMenuOpen(false);
      }
    };

    if (manageMenuOpen || officeMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [manageMenuOpen, officeMenuOpen]);

  // Filter to show only current user's contracts vs all office contracts
  // Only show awards that need integrity reports
  const myAwards = MOCK_AWARDS.filter(
    (award) => award.assignedTo === CURRENT_USER.name && award.needsIntegrityReport
  );
  const officeAwards = MOCK_AWARDS.filter((award) => award.needsIntegrityReport);

  const displayedAwards = activeSection === 'my-awards' ? myAwards : officeAwards;

  const filteredAwards = displayedAwards.filter((award) => {
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && award.status === 'Active') ||
      (filterStatus === 'terminated' && award.status === 'Terminated');

    return matchesStatus;
  });

  // Sort awards based on selected sort option
  const sortedAwards = [...filteredAwards].sort((a, b) => {
    switch (sortBy) {
      case 'date-latest':
        return new Date(b.popStart).getTime() - new Date(a.popStart).getTime();
      case 'date-oldest':
        return new Date(a.popStart).getTime() - new Date(b.popStart).getTime();
      case 'title-az':
        return a.awardTitle.localeCompare(b.awardTitle);
      case 'title-za':
        return b.awardTitle.localeCompare(a.awardTitle);
      default:
        return 0;
    }
  });

  const awardCounts = {
    all: displayedAwards.length,
    active: displayedAwards.filter((a) => a.status === 'Active').length,
    terminated: displayedAwards.filter((a) => a.status === 'Terminated').length,
  };

  const myRecords = MOCK_RECORDS.filter((record) => record.createdBy === CURRENT_USER.name);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Top Navigation */}
      <nav className="bg-[#1f2937] text-white">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded"></div>
            <div>
              <h1 className="text-base font-bold">SAM.gov</h1>
              <p className="text-xs text-[#9ca3af]">System for Award Management</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button type="button" className="p-2 hover:bg-[#374151] rounded relative">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#dc2626] text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>
            <button type="button" className="flex items-center gap-2 p-2 hover:bg-[#374151] rounded">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">{CURRENT_USER.name}</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Secondary Navigation */}
      <div className="bg-white border-b border-[#dfe1e2] overflow-x-auto">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 py-3">
            <div className="flex items-center gap-4 sm:gap-8 min-w-max">
              <button type="button" className="text-sm text-[#71767a] hover:text-[#1b1b1b] whitespace-nowrap">
                Home
              </button>
              <button type="button" className="text-sm font-medium text-[#005ea2] border-b-2 border-[#005ea2] whitespace-nowrap pb-3 -mb-3">
                Workspace
              </button>
              <button type="button" className="text-sm text-[#71767a] hover:text-[#1b1b1b] whitespace-nowrap">
                Data Services
              </button>
              <button type="button" className="text-sm text-[#71767a] hover:text-[#1b1b1b] whitespace-nowrap">
                Help
              </button>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search awards by UEI, CAGE, award #..."
                  className="w-64 lg:w-80 px-3 py-1.5 pl-9 text-sm border border-[#a9aeb1] rounded focus:outline-none focus:ring-2 focus:ring-[#2491ff]"
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71767a]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <button
                type="button"
                className="px-3 py-1.5 text-sm font-medium bg-[#005ea2] text-white rounded hover:bg-[#0a4480] transition-colors whitespace-nowrap"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Page Layout */}
      <div className="flex relative min-h-screen">
        {/* Mobile Sidebar Overlay - only on mobile when sidebar is open */}
        {isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Sidebar */}
        <aside
          className={`fixed lg:relative top-0 bottom-0 left-0 z-50 bg-white border-r border-[#dfe1e2] transition-transform duration-300 w-64 flex-shrink-0 overflow-y-auto ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0`}
        >
          <div className="p-4 w-64">
            {/* Office Switcher */}
            <div className="mb-6 pb-4 border-b border-[#dfe1e2] office-switcher-container relative">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-[#71767a]">Contracting Office</p>
                {PENDING_REQUESTS.length > 0 && (
                  <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-[#fef3c7] text-[#92400e] rounded">
                    {PENDING_REQUESTS.length} pending
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setOfficeMenuOpen(!officeMenuOpen)}
                className="w-full flex items-center justify-between p-3 bg-[#f9f9f9] hover:bg-[#f0f0f0] rounded transition-colors relative"
              >
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-[#1b1b1b]">{currentOffice.name}</p>
                  <p className="text-xs text-[#71767a] font-mono">{currentOffice.id}</p>
                </div>
                <div className="flex items-center gap-2">
                  {PENDING_REQUESTS.length > 0 && (
                    <span className="w-2 h-2 bg-[#f59e0b] rounded-full"></span>
                  )}
                  <svg
                    className={`w-4 h-4 text-[#71767a] transition-transform ${officeMenuOpen ? 'rotate-180' : ''}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </button>

              {/* Office Switcher Dropdown */}
              {officeMenuOpen && (
                <div className="absolute top-full left-4 right-4 mt-1 bg-white border border-[#dfe1e2] rounded shadow-lg z-30 max-h-96 overflow-y-auto">
                  <div className="py-2">
                    <p className="px-4 py-2 text-xs font-medium text-[#71767a] uppercase tracking-wider">
                      Your Offices
                    </p>
                    {USER_OFFICES.map((office) => (
                      <button
                        key={office.id}
                        type="button"
                        onClick={() => {
                          setCurrentOfficeId(office.id);
                          setOfficeMenuOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-left hover:bg-[#f9f9f9] transition-colors flex items-center justify-between ${
                          office.id === currentOfficeId ? 'bg-[#e7f6f8]' : ''
                        }`}
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[#1b1b1b]">{office.name}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <p className="text-xs text-[#71767a] font-mono">{office.id}</p>
                            <span className="text-xs text-[#71767a]">•</span>
                            <p className="text-xs text-[#71767a]">{office.contractCount} contracts</p>
                            <span className="text-xs text-[#71767a]">•</span>
                            <p className="text-xs text-[#71767a]">{office.role}</p>
                          </div>
                        </div>
                        {office.id === currentOfficeId && (
                          <svg className="w-5 h-5 text-[#005ea2]" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Pending Requests */}
                  {PENDING_REQUESTS.length > 0 && (
                    <div className="border-t border-[#dfe1e2] py-2">
                      <p className="px-4 py-2 text-xs font-medium text-[#71767a] uppercase tracking-wider">
                        Pending Requests ({PENDING_REQUESTS.length})
                      </p>
                      {PENDING_REQUESTS.map((request) => (
                        <div
                          key={request.id}
                          className="px-4 py-3 hover:bg-[#f9f9f9] transition-colors border-l-4 border-[#f59e0b]"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-[#1b1b1b]">{request.officeName}</p>
                              <div className="flex items-center gap-3 mt-1">
                                <p className="text-xs text-[#71767a] font-mono">{request.officeId}</p>
                                <span className="text-xs text-[#71767a]">•</span>
                                <p className="text-xs text-[#71767a]">{request.requestedRole}</p>
                              </div>
                              <p className="text-xs text-[#71767a] mt-1">Requested {request.requestedDate}</p>
                            </div>
                            <div className="ml-2">
                              <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-[#fef3c7] text-[#92400e] rounded">
                                Pending
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="border-t border-[#dfe1e2] py-2">
                    <button
                      type="button"
                      onClick={() => {
                        setOfficeMenuOpen(false);
                        // TODO: Open add office modal
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-[#005ea2] hover:bg-[#f9f9f9] flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Add New Office
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setOfficeMenuOpen(false);
                        // TODO: Open request access modal
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-[#005ea2] hover:bg-[#f9f9f9] flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Request Office Access
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation */}
            <nav className="space-y-1">
              <button
                type="button"
                onClick={() => setActiveSection('overview')}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded transition-colors ${
                  activeSection === 'overview'
                    ? 'bg-[#e7f6f8] text-[#005ea2]'
                    : 'text-[#71767a] hover:bg-[#f9f9f9] hover:text-[#1b1b1b]'
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
                Overview
              </button>

              <button
                type="button"
                onClick={() => setActiveSection('my-awards')}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded transition-colors ${
                  activeSection === 'my-awards'
                    ? 'bg-[#e7f6f8] text-[#005ea2]'
                    : 'text-[#71767a] hover:bg-[#f9f9f9] hover:text-[#1b1b1b]'
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                    clipRule="evenodd"
                  />
                </svg>
                My Contracts
                <span className="ml-auto text-xs bg-[#f0f0f0] px-2 py-0.5 rounded">{myAwards.length}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSection('office-awards')}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded transition-colors ${
                  activeSection === 'office-awards'
                    ? 'bg-[#e7f6f8] text-[#005ea2]'
                    : 'text-[#71767a] hover:bg-[#f9f9f9] hover:text-[#1b1b1b]'
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm11-1a1 1 0 00-1 1v8a1 1 0 001 1h2a1 1 0 001-1V8a1 1 0 00-1-1h-2z"
                    clipRule="evenodd"
                  />
                </svg>
                Office Contracts
                <span className="ml-auto text-xs bg-[#f0f0f0] px-2 py-0.5 rounded">{officeAwards.length}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSection('records')}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded transition-colors ${
                  activeSection === 'records'
                    ? 'bg-[#e7f6f8] text-[#005ea2]'
                    : 'text-[#71767a] hover:bg-[#f9f9f9] hover:text-[#1b1b1b]'
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Integrity Records
                <span className="ml-auto text-xs bg-[#f0f0f0] px-2 py-0.5 rounded">{myRecords.length}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSection('team')}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded transition-colors ${
                  activeSection === 'team'
                    ? 'bg-[#e7f6f8] text-[#005ea2]'
                    : 'text-[#71767a] hover:bg-[#f9f9f9] hover:text-[#1b1b1b]'
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
                Team & Access
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 lg:ml-0">
          {/* Content Header */}
          <div className="bg-white border-b border-[#dfe1e2] sticky top-0 z-10">
            <div className="px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Hamburger Menu - Only on mobile */}
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="lg:hidden p-2 hover:bg-[#f0f0f0] rounded"
                  >
                    <svg className="w-6 h-6 text-[#1b1b1b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-[#1b1b1b]">
                      {activeSection === 'overview' && 'Overview'}
                      {activeSection === 'my-awards' && 'My Contracts'}
                      {activeSection === 'office-awards' && 'Office Contracts'}
                      {activeSection === 'records' && 'Integrity Records'}
                      {activeSection === 'team' && 'Team & Access'}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#71767a]">
                      {activeSection === 'my-awards' &&
                        `${myAwards.length} contracts needing integrity reports assigned to you`}
                      {activeSection === 'office-awards' &&
                        `${officeAwards.length} contracts needing integrity reports in ${currentOffice.id}`}
                      {activeSection === 'records' && `${myRecords.length} records created by you`}
                      {activeSection === 'team' && `${MOCK_TEAM.length} members in ${currentOffice.id}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Overview Section */}
            {activeSection === 'overview' && (
              <div className="space-y-6">
                {/* Pending Access Requests Alert */}
                {PENDING_REQUESTS.length > 0 && (
                  <div className="bg-[#fffbeb] border-l-4 border-[#f59e0b] p-4 rounded">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-[#f59e0b] mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div className="ml-3 flex-1">
                        <h3 className="text-sm font-medium text-[#92400e]">
                          {PENDING_REQUESTS.length} Pending Office Access{' '}
                          {PENDING_REQUESTS.length === 1 ? 'Request' : 'Requests'}
                        </h3>
                        <div className="mt-2 text-sm text-[#92400e]">
                          <p>
                            You have requested access to:{' '}
                            {PENDING_REQUESTS.map((req, idx) => (
                              <span key={req.id}>
                                <strong>{req.officeName}</strong>
                                {idx < PENDING_REQUESTS.length - 1 && ', '}
                              </span>
                            ))}
                          </p>
                        </div>
                        <div className="mt-3">
                          <button
                            type="button"
                            onClick={() => setOfficeMenuOpen(true)}
                            className="text-sm font-medium text-[#92400e] hover:text-[#78350f] underline"
                          >
                            View requests in office switcher
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button
                    type="button"
                    onClick={() => setActiveSection('my-awards')}
                    className="bg-white border border-[#dfe1e2] rounded p-6 hover:border-[#005ea2] hover:shadow-md transition-all text-left"
                  >
                    <p className="text-sm text-[#71767a] mb-1">Contracts Needing Reports</p>
                    <p className="text-3xl font-bold text-[#1b1b1b]">{myAwards.length}</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSection('my-awards');
                      setFilterStatus('active');
                    }}
                    className="bg-white border border-[#dfe1e2] rounded p-6 hover:border-[#005ea2] hover:shadow-md transition-all text-left"
                  >
                    <p className="text-sm text-[#71767a] mb-1">Active</p>
                    <p className="text-3xl font-bold text-[#16a34a]">
                      {myAwards.filter((a) => a.status === 'Active').length}
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSection('my-awards');
                      setFilterStatus('terminated');
                    }}
                    className="bg-white border border-[#dfe1e2] rounded p-6 hover:border-[#005ea2] hover:shadow-md transition-all text-left"
                  >
                    <p className="text-sm text-[#71767a] mb-1">Terminated</p>
                    <p className="text-3xl font-bold text-[#dc2626]">
                      {myAwards.filter((a) => a.status === 'Terminated').length}
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSection('records')}
                    className="bg-white border border-[#dfe1e2] rounded p-6 hover:border-[#005ea2] hover:shadow-md transition-all text-left"
                  >
                    <p className="text-sm text-[#71767a] mb-1">Reports Submitted</p>
                    <p className="text-3xl font-bold text-[#1b1b1b]">
                      {myAwards.filter((a) => a.integrityRecords > 0).length}
                    </p>
                  </button>
                </div>

                <div className="bg-white border border-[#dfe1e2] rounded p-6">
                  <h3 className="text-sm font-medium text-[#71767a] uppercase tracking-wider mb-4">
                    Recent Activity
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 pb-3 border-b border-[#f0f0f0]">
                      <div className="w-2 h-2 bg-[#16a34a] rounded-full mt-1.5"></div>
                      <div className="flex-1">
                        <p className="text-sm text-[#1b1b1b]">
                          Integrity record <span className="font-mono font-medium">NEWPSC24C0012</span> published
                        </p>
                        <p className="text-xs text-[#71767a]">03/20/2024</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 pb-3 border-b border-[#f0f0f0]">
                      <div className="w-2 h-2 bg-[#f59e0b] rounded-full mt-1.5"></div>
                      <div className="flex-1">
                        <p className="text-sm text-[#1b1b1b]">
                          Draft record for contract <span className="font-mono font-medium">N00024-23-C-4321</span>{' '}
                          needs completion
                        </p>
                        <p className="text-xs text-[#71767a]">02/15/2025</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* My Awards / Office Awards Section */}
            {(activeSection === 'my-awards' || activeSection === 'office-awards') && (
              <div>
                <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setFilterStatus('all')}
                      className={`px-3 py-1.5 text-sm font-medium rounded transition-colors whitespace-nowrap ${
                        filterStatus === 'all'
                          ? 'bg-[#005ea2] text-white'
                          : 'bg-white text-[#71767a] hover:bg-[#f0f0f0] border border-[#dfe1e2]'
                      }`}
                    >
                      All ({awardCounts.all})
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterStatus('active')}
                      className={`px-3 py-1.5 text-sm font-medium rounded transition-colors whitespace-nowrap ${
                        filterStatus === 'active'
                          ? 'bg-[#005ea2] text-white'
                          : 'bg-white text-[#71767a] hover:bg-[#f0f0f0] border border-[#dfe1e2]'
                      }`}
                    >
                      Active ({awardCounts.active})
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterStatus('terminated')}
                      className={`px-3 py-1.5 text-sm font-medium rounded transition-colors whitespace-nowrap ${
                        filterStatus === 'terminated'
                          ? 'bg-[#005ea2] text-white'
                          : 'bg-white text-[#71767a] hover:bg-[#f0f0f0] border border-[#dfe1e2]'
                      }`}
                    >
                      Terminated ({awardCounts.terminated})
                    </button>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <label htmlFor="sort-select" className="text-sm text-[#71767a] whitespace-nowrap">
                      Sort by:
                    </label>
                    <select
                      id="sort-select"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="px-3 py-2 text-sm border border-[#a9aeb1] rounded focus:outline-none focus:ring-2 focus:ring-[#2491ff] bg-white"
                    >
                     <option value="date-latest">Date: Latest</option>
                      <option value="date-oldest">Date: Oldest</option>
                      <option value="title-az">Title: A-Z</option>
                      <option value="title-za">Title: Z-A</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  {sortedAwards.map((award) => (
                    <div
                      key={award.id}
                      className="bg-white border border-[#dfe1e2] rounded p-4 sm:p-6 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                        <div className="flex-1 w-full sm:w-auto">
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                            <h3 className="text-base font-medium text-[#005ea2] font-mono">{award.awardNumber}</h3>
                            <Badge
                              variant={
                                award.status === 'Active'
                                  ? 'success'
                                  : award.status === 'Terminated'
                                  ? 'destructive'
                                  : 'secondary'
                              }
                            >
                              {award.status}
                            </Badge>
                            {award.integrityRecords > 0 && (
                              <button
                                type="button"
                                onClick={() => setActiveSection('records')}
                                className="text-xs text-[#005ea2] hover:underline font-medium"
                              >
                                {award.integrityRecords} integrity{' '}
                                {award.integrityRecords === 1 ? 'record' : 'records'}
                              </button>
                            )}
                          </div>
                          <p className="text-sm text-[#1b1b1b] mb-1">{award.awardTitle}</p>
                          <p className="text-sm text-[#71767a] mb-3">{award.contractorName}</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:items-center gap-2 sm:gap-4 lg:gap-6 text-xs text-[#71767a]">
                            <div>
                              <span className="font-medium">Type:</span> {award.awardType}
                            </div>
                            <div>
                              <span className="font-medium">Period:</span> {award.popStart} - {award.popEnd}
                            </div>
                            <div>
                              <span className="font-medium">Value:</span> {award.value}
                            </div>
                            <div>
                              <span className="font-medium">UEI:</span> {award.uei}
                            </div>
                            {activeSection === 'office-awards' && (
                              <div>
                                <span className="font-medium">COR:</span> {award.assignedTo}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="relative w-full sm:w-auto sm:ml-4 manage-dropdown-container">
                          <button
                            type="button"
                            onClick={() => setManageMenuOpen(manageMenuOpen === award.id ? null : award.id)}
                            className="w-full sm:w-auto px-3 py-1.5 text-sm text-[#005ea2] font-medium hover:bg-[#e7f6f8] border border-[#a9aeb1] rounded transition-colors whitespace-nowrap flex items-center justify-center gap-2"
                          >
                            Manage
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>

                          {/* Manage Dropdown Menu */}
                          {manageMenuOpen === award.id && (
                            <div className="absolute top-full right-0 mt-1 w-full sm:w-56 bg-white border border-[#dfe1e2] rounded shadow-lg z-20">
                              <button
                                type="button"
                                onClick={() => {
                                  onCreateNew();
                                  setManageMenuOpen(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-[#1b1b1b] hover:bg-[#f9f9f9] flex items-center gap-2"
                              >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path
                                    fillRule="evenodd"
                                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                Add Integrity Record
                              </button>
                              {award.status === 'Active' && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (onManageAward) onManageAward(award.id);
                                    setManageMenuOpen(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-[#b50909] hover:bg-[#fef2f2] flex items-center gap-2 border-t border-[#f0f0f0]"
                                >
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                      fillRule="evenodd"
                                      d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  Terminate Contract
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  if (onManageAward) onManageAward(award.id);
                                  setManageMenuOpen(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-[#1b1b1b] hover:bg-[#f9f9f9] flex items-center gap-2 border-t border-[#f0f0f0]"
                              >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                </svg>
                                Share Access
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (onManageAward) onManageAward(award.id);
                                  setManageMenuOpen(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-[#1b1b1b] hover:bg-[#f9f9f9] flex items-center gap-2 border-t border-[#f0f0f0]"
                              >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path
                                    fillRule="evenodd"
                                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                View Award Details
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Integrity Records Section */}
            {activeSection === 'records' && (
              <div className="bg-white border border-[#dfe1e2] rounded">
                <table className="w-full">
                  <thead className="bg-[#f9f9f9] border-b border-[#dfe1e2]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#71767a] uppercase tracking-wider">
                        Document Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#71767a] uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#71767a] uppercase tracking-wider">
                        Contract
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#71767a] uppercase tracking-wider">
                        Contractor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#71767a] uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#71767a] uppercase tracking-wider">
                        Last Modified
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#71767a] uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#dfe1e2]">
                    {myRecords.map((record) => (
                      <tr key={record.id} className="hover:bg-[#f9f9f9] transition-colors">
                        <td className="px-6 py-4">
                          <button
                            type="button"
                            onClick={() =>
                              record.status === 'Draft' ? onEditReport(record.id) : onViewReport(record.id)
                            }
                            className="text-sm font-medium text-[#005ea2] font-mono hover:underline"
                          >
                            {record.documentNumber || '(Draft)'}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-sm text-[#1b1b1b]">{record.recordType}</td>
                        <td className="px-6 py-4 text-sm text-[#71767a] font-mono">{record.awardNumber}</td>
                        <td className="px-6 py-4 text-sm text-[#1b1b1b]">{record.contractorName}</td>
                        <td className="px-6 py-4">
                          <Badge
                            variant={
                              record.status === 'Published'
                                ? 'success'
                                : record.status === 'Under Review'
                                ? 'secondary'
                                : 'default'
                            }
                          >
                            {record.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-[#71767a]">{record.lastModified}</td>
                        <td className="px-6 py-4">
                          {record.status === 'Draft' ? (
                            <button
                              type="button"
                              onClick={() => onEditReport(record.id)}
                              className="text-xs text-[#005ea2] font-medium hover:underline"
                            >
                              Continue Editing
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => onViewReport(record.id)}
                              className="text-xs text-[#005ea2] font-medium hover:underline"
                            >
                              View
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Team & Access Section */}
            {activeSection === 'team' && (
              <div>
                <div className="mb-4">
                  <p className="text-sm text-[#71767a]">
                    Manage contract access for team members in <strong>{currentOffice.id}</strong>
                  </p>
                </div>

                <div className="bg-white border border-[#dfe1e2] rounded">
                  <table className="w-full">
                    <thead className="bg-[#f9f9f9] border-b border-[#dfe1e2]">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#71767a] uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#71767a] uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#71767a] uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#71767a] uppercase tracking-wider">
                          Access Level
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#71767a] uppercase tracking-wider">
                          Contracts
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#71767a] uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#dfe1e2]">
                      {MOCK_TEAM.map((member) => (
                        <tr key={member.id} className="hover:bg-[#f9f9f9] transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-[#1b1b1b]">{member.name}</td>
                          <td className="px-6 py-4 text-sm text-[#71767a]">{member.email}</td>
                          <td className="px-6 py-4">
                            <Badge variant={member.role === 'Contracting Officer' ? 'default' : 'secondary'}>
                              {member.role}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-sm text-[#71767a]">{member.accessLevel}</td>
                          <td className="px-6 py-4 text-sm text-[#71767a]">{member.contractsAssigned}</td>
                          <td className="px-6 py-4">
                            <div className="flex gap-3">
                              <button type="button" className="text-xs text-[#005ea2] font-medium hover:underline">
                                Manage Access
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
