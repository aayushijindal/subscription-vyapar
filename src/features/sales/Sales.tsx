import { GenericMasterPage } from '@/components/ui/GenericMasterPage';
import { salesApi } from '@/services/api/sales';

export const SalesPage = () => {
  return (
    <GenericMasterPage
      title="Sales Invoices"
      description="Manage sales invoices."
      queryKey="sales"
      apiService={salesApi.sales}
      searchKey="invoice_no"
      columns={[
        { key: 'invoice_no', header: 'Invoice No', sortable: true },
        { key: 'bill_date', header: 'Bill Date', sortable: true },
        { key: 'grand_total', header: 'Grand Total' },
      ]}
      formFields={[
        { name: 'bill_date', label: 'Bill Date', type: 'date', required: true },
        { name: 'invoice_no', label: 'Invoice No', type: 'text', required: true },
        { name: 'grand_total', label: 'Grand Total', type: 'number' },
      ]}
    />
  );
};
