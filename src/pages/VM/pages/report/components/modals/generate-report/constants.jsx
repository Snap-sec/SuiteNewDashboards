import {
  CircleDot,
  RefreshCw,
  Diamond,
  ShieldAlert,
  Triangle,
  Circle,
} from 'lucide-react';

export const KIND_ICON_MAP = {
  vulnerability: CircleDot,
  revalidation: RefreshCw,
  executive: Diamond,
  allvulns: ShieldAlert,
};

export const SCOPE_ICON_MAP = {
  assessment: CircleDot,
  'change-request': Triangle,
  full: Circle,
};

export const SCOPE_LABEL_MAP = {
  assessment: 'Assessment',
  'change-request': 'Change Request',
  full: 'Full',
};

export const FORMAT_DESCRIPTION_MAP = {
  pdf: 'Formatted document',
  csv: 'Raw spreadsheet data',
  xlsx: 'Excel workbook',
};
