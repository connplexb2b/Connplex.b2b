import type { InvestorFileType } from '@/lib/media-utils';

export interface PredefinedSection {
  id?: string;
  title: string;
  parent: string;
  type: InvestorFileType;
  description?: string;
}

export interface SectionCategoryGroup {
  category: string;
  icon: string;
  description: string;
  sections: PredefinedSection[];
}

export const INVESTOR_SECTION_GROUPS: SectionCategoryGroup[] = [
  {
    category: 'Announcements',
    icon: '📢',
    description: 'Board meetings, notices, general meetings, and public disclosures',
    sections: [
      { id: '6805e8297f482b5677025882', title: 'Board Meeting', parent: 'Announcements', type: 'pdf' },
      { id: '4887120f-272d-4780-852b-9620e1f4e1ef', title: 'Other Announcements', parent: 'Announcements', type: 'pdf' },
      { id: '6805e8297f482b5677025884', title: 'General Meeting', parent: 'Announcements', type: 'pdf' },
      { id: '6805e8297f482b5677025883', title: 'Compliances', parent: 'Announcements', type: 'pdf' },
      { id: '6805e8297f482b5677025899', title: 'Others', parent: 'Announcements', type: 'pdf' },
    ],
  },
  {
    category: 'General / Standalone Sections',
    icon: '📊',
    description: 'Top-level investor relations sections, financial filings, and reports',
    sections: [
      { id: '6805e8297f482b5677025898', title: 'Preferential Issue', parent: '', type: 'pdf' },
      { id: '6805e8297f482b567702588c', title: 'Financial Results', parent: '', type: 'pdf' },
      { id: '6805e8297f482b5677025886', title: 'Annual Report', parent: '', type: 'pdf' },
      { id: '6805e8297f482b5677025887', title: 'Annual Returns', parent: '', type: 'pdf' },
      { id: '6805e8297f482b56770258a3', title: 'Shareholding Patterns', parent: '', type: 'pdf' },
      { id: '68ea24cbb1ee9afbc84e63e0', title: 'ESOP', parent: '', type: 'pdf' },
      { id: '691566462f160e22a62cca15', title: 'Monitoring Agency Report', parent: '', type: 'pdf' },
      { id: '689199bb21a4eb2ae02fdfa6', title: 'Board Of Directors', parent: '', type: 'pdf' },
      { id: '6805e8297f482b5677025897', title: 'investor Grievances', parent: '', type: 'pdf' },
      { id: '6805e8297f482b56770258a5', title: 'Meetings', parent: '', type: 'pdf' },
      { id: '6805e8297f482b56770258a6', title: 'CSR', parent: '', type: 'pdf' },
      { id: '68554634ed916e2ba1503c47', title: 'PR/MEDIA', parent: '', type: 'pdf' },
      { id: '6846e210cfff5e445b898ef1', title: 'Advice to Shareholders', parent: '', type: 'pdf' },
      { id: '6846e25bcfff5e445b898ef7', title: 'Link to ODR', parent: '', type: 'pdf' },
    ],
  },
  {
    category: 'Policies',
    icon: '📜',
    description: 'Corporate governance policies and statutory documentation',
    sections: [
      { id: '685541c4ed916e2ba1503a87', title: 'POSH Policy', parent: 'Policies', type: 'pdf' },
      { id: '689089535a8966a59a3bd4a2', title: 'MOA AOA', parent: 'Policies', type: 'pdf' },
      { id: '68554304ed916e2ba1503b2e', title: 'Vigil Mechanism(Whistle Blower) Policy', parent: 'Policies', type: 'pdf' },
      { id: '68554350ed916e2ba1503b3d', title: 'Policy on Related Party Transaction', parent: 'Policies', type: 'pdf' },
      { id: '685543abed916e2ba1503b5f', title: 'Policy for Determination of Materiality', parent: 'Policies', type: 'pdf' },
      { id: '68554424ed916e2ba1503b6c', title: 'Policies on Payments to Non-Executive Directors', parent: 'Policies', type: 'pdf' },
      { id: '68554448ed916e2ba1503b7b', title: 'NRC Policy', parent: 'Policies', type: 'pdf' },
      { id: '68554481ed916e2ba1503b8e', title: 'Familarisation Programme', parent: 'Policies', type: 'pdf' },
      { id: '685544b2ed916e2ba1503bc4', title: 'Dividend Distribution Policy', parent: 'Policies', type: 'pdf' },
      { id: '685544dced916e2ba1503bd3', title: 'CSR Policy', parent: 'Policies', type: 'pdf' },
      { id: '6855450ced916e2ba1503bf8', title: 'CODE OF PRACTICES AND PROCEDURES FOR FAIR DISCLOSURE OF UNPUBLISHED PRICE SENSITIVE INFORMATION', parent: 'Policies', type: 'pdf' },
      { id: '6855455ded916e2ba1503c09', title: 'COC for Dir_KMP', parent: 'Policies', type: 'pdf' },
      { id: '6847b68391159534e38ac79e', title: 'Board Diversity Policy', parent: 'Policies', type: 'pdf' },
      { id: '6847b69a91159534e38ac7a5', title: 'Brief Profile of Board of Directors including Directorship', parent: 'Policies', type: 'pdf' },
      { id: '6847b6b091159534e38ac7e0', title: 'Code of conduct for prevention of Insider Trading', parent: 'Policies', type: 'pdf' },
      { id: '6847b6c791159534e38ac80c', title: 'Code of Conduct Independent Director', parent: 'Policies', type: 'pdf' },
      { id: '6847b6dc91159534e38ac813', title: 'Code of Conduct of Employee', parent: 'Policies', type: 'pdf' },
      { id: '6847b6f091159534e38ac81a', title: 'Leak of UPSI', parent: 'Policies', type: 'pdf' },
      { id: '6847b70491159534e38ac821', title: 'Policy for determining Material Subsidiary', parent: 'Policies', type: 'pdf' },
      { id: '6847b71991159534e38ac828', title: 'Policy of Preservation of Documents', parent: 'Policies', type: 'pdf' },
      { id: '6847b73591159534e38ac82f', title: 'Term Condition of Appointment of ID', parent: 'Policies', type: 'pdf' },
      { id: '6847b74c91159534e38ac836', title: 'Website Content Archival Policy', parent: 'Policies', type: 'pdf' },
    ],
  },
  {
    category: 'Committees',
    icon: '👥',
    description: 'Committees of the Board of Directors',
    sections: [
      { id: '6805e8297f482b5677025889', title: 'POSH', parent: 'Committees', type: 'pdf' },
      { id: '6843db33163055f75350da0a', title: 'VARIOUS COMMITEE FOR BOARD', parent: 'Committees', type: 'pdf' },
    ],
  },
  {
    category: 'Initial Public Offer',
    icon: '📈',
    description: 'Prospectus, IPO filings, and public issue documentation',
    sections: [
      { id: '6805e8297f482b567702588f', title: 'Draft Red Herring Prospectus', parent: 'Initial Public Offer', type: 'pdf' },
      { id: '6805e8297f482b5677025896', title: 'RedHerring Prospectus', parent: 'Initial Public Offer', type: 'pdf' },
      { id: '6805e8297f482b5677025894', title: 'Pre-Issue Advertisement', parent: 'Initial Public Offer', type: 'pdf' },
      { id: '6805e8297f482b5677025895', title: 'Prospectus', parent: 'Initial Public Offer', type: 'pdf' },
      { id: '6805e8297f482b5677025890', title: 'GID (General issue Disclosures)', parent: 'Initial Public Offer', type: 'pdf' },
      { id: '6805e8297f482b567702588d', title: 'Abridged Prospectus', parent: 'Initial Public Offer', type: 'pdf' },
      { id: '6805e8297f482b567702588e', title: 'Basis Of Allotment Advertisement', parent: 'Initial Public Offer', type: 'pdf' },
      { id: '6805e8297f482b5677025891', title: 'IPO Application Form', parent: 'Initial Public Offer', type: 'pdf' },
      { id: '6805e8297f482b5677025892', title: 'Material Contracts To The Issue', parent: 'Initial Public Offer', type: 'pdf' },
      { id: '6805e8297f482b5677025893', title: 'Material Documents', parent: 'Initial Public Offer', type: 'pdf' },
    ],
  },
];

export const ALL_PREDEFINED_SECTIONS: PredefinedSection[] = INVESTOR_SECTION_GROUPS.flatMap(
  (g) => g.sections
);

/**
 * Normalizes title for consistent matching across aliases and variations
 */
export function normalizeSectionTitle(title: string): string {
  const clean = (title || '').toLowerCase().trim();
  if (clean === 'other announcements' || clean === 'other announcement' || clean === 'other annoucment') {
    return 'other annoucment';
  }
  if (clean === 'shareholding pattern' || clean === 'shareholding patterns') {
    return 'shareholding pattern';
  }
  return clean;
}

/**
 * Checks if two section titles match (handling synonyms/aliases)
 */
export function doSectionTitlesMatch(titleA: string, titleB: string): boolean {
  if (!titleA || !titleB) return false;
  return normalizeSectionTitle(titleA) === normalizeSectionTitle(titleB);
}
