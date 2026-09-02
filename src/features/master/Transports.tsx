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
        { key: 'transport_id', header: 'Transport ID' },
        { key: 'vehicle_no', header: 'Vehicle No' },
      ]}
      formFields={[
        { name: 'transport_name', label: 'Transport Name', type: 'text', required: true },
        { name: 'transport_id', label: 'Transport ID', type: 'text' },
        { name: 'vehicle_no', label: 'Vehicle No', type: 'text', required: true },
      ]}
    />
  );
};
