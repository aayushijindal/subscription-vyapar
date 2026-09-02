import { GenericMasterPage } from '@/components/ui/GenericMasterPage';
import { masterApi } from '@/services/api/master';

export const TransportsPage = () => {
  return (
    <GenericMasterPage
      title="Transport Master"
      description="Manage transport providers and vehicles."
      queryKey="transports"
      apiService={masterApi.transports}
      searchKey="transport_name"
      columns={[
        { key: 'transport_name', header: 'Transport Name', sortable: true },
        { key: 'contact_person', header: 'Contact Person' },
        { key: 'contact_number', header: 'Contact Number' },
      ]}
      formFields={[
        { name: 'transport_name', label: 'Transport Name', type: 'text', required: true },
        { name: 'contact_person', label: 'Contact Person', type: 'text' },
        { name: 'contact_number', label: 'Contact Number', type: 'text' },
      ]}
    />
  );
};
