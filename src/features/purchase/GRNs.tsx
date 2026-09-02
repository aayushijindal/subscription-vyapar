import { GenericMasterPage } from '@/components/ui/GenericMasterPage';
import { purchaseApi } from '@/services/api/purchase';

export const GRNsPage = () => {
  return (
    <GenericMasterPage
      title="Goods Receipt Notes (GRN)"
      description="Manage inward materials."
      queryKey="grns"
      apiService={purchaseApi.grns}
      searchKey="challan_no"
      columns={[
        { key: 'challan_no', header: 'Challan No', sortable: true },
        { key: 'date', header: 'Date', sortable: true },
        { key: 'vehicle_no', header: 'Vehicle No' },
      ]}
      formFields={[
        { name: 'date', label: 'Date', type: 'date', required: true },
        { name: 'party', label: 'Party ID', type: 'number', required: true },
        { name: 'challan_no', label: 'Challan No', type: 'text' },
        { name: 'vehicle_no', label: 'Vehicle No', type: 'text' },
      ]}
    />
  );
};
