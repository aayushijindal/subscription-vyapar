import { GenericMasterPage } from '@/components/ui/GenericMasterPage';
import { masterApi } from '@/services/api/master';

export const FinancialYearsPage = () => {
  return (
    <GenericMasterPage
      title="Financial Years"
      description="Manage your financial years."
      queryKey="financialYears"
      apiService={masterApi.financialYears}
      searchKey="financial_year"
      columns={[
        { key: 'financial_year', header: 'Financial Year', sortable: true },
        { key: 'start_date', header: 'Start Date' },
        { key: 'end_date', header: 'End Date' },
      ]}
      formFields={[
        { name: 'financial_year', label: 'Financial Year (e.g. 2026-2027)', type: 'text', required: true },
        { name: 'start_date', label: 'Start Date', type: 'date', required: true },
        { name: 'end_date', label: 'End Date', type: 'date', required: true },
      ]}
    />
  );
};
