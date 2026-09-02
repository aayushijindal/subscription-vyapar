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
      ]}
      formFields={[
        { name: 'financial_year', label: 'Financial Year (e.g. 2026-2027)', type: 'text', required: true },
      ]}
    />
  );
};
