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
        { name: 'company_code', label: 'Company Code', type: 'text' },
        { name: 'name', label: 'Company Name', type: 'text', required: true },
        { name: 'email_id', label: 'Email-ID', type: 'text' },
        { name: 'address', label: 'Address', type: 'text' },
        { name: 'country', label: 'Country', type: 'text' },
        { name: 'state', label: 'State', type: 'text' },
        { name: 'city', label: 'City', type: 'text' },
        { name: 'pin_code', label: 'Pin Code', type: 'text' },
        { name: 'landline_no', label: 'Landline No', type: 'text' },
        { name: 'mobile_no', label: 'Mobile No.', type: 'text' },
        { name: 'gstin_no', label: 'GST No.', type: 'text' },
        { name: 'pan_no', label: 'PAN No.', type: 'text' },
        { name: 'bank_name', label: 'Bank', type: 'text' },
        { name: 'branch', label: 'Branch', type: 'text' },
        { name: 'account_no', label: 'Account No.', type: 'text' },
        { name: 'ifsc_code', label: 'IFSC Code', type: 'text' },
      ]}
    />
  );
};
