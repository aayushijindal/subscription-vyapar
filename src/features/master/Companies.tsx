import { GenericMasterPage } from '@/components/ui/GenericMasterPage';
import { masterApi } from '@/services/api/master';

export const CompaniesPage = () => {
  return (
    <GenericMasterPage
      title="Company Master"
      description="Manage companies and their details."
      queryKey="companies"
      apiService={masterApi.companies}
      searchKey="name"
      columns={[
        { key: 'name', header: 'Company Name', sortable: true },
        { key: 'gstin_no', header: 'GSTIN' },
        { key: 'city', header: 'City' },
        { key: 'state', header: 'State' },
      ]}
      formFields={[
        { name: 'name', label: 'Company Name', type: 'text', required: true },
        { name: 'gstin_no', label: 'GSTIN', type: 'text', required: true },
        { name: 'state', label: 'State', type: 'text' },
        { name: 'state_code', label: 'State Code', type: 'text' },
        { name: 'city', label: 'City', type: 'text' },
        { name: 'pin_code', label: 'Pincode', type: 'text' },
        { name: 'bank_name', label: 'Bank Name', type: 'text' },
        { name: 'account_no', label: 'Account No', type: 'text' },
        { name: 'ifsc_code', label: 'IFSC Code', type: 'text' },
      ]}
    />
  );
};
