import { GenericMasterPage } from '@/components/ui/GenericMasterPage';
import { masterApi } from '@/services/api/master';

export const ItemsPage = () => {
  return (
    <GenericMasterPage
      title="Items Master"
      description="Manage your raw materials and finished goods."
      queryKey="items"
      apiService={masterApi.items}
      searchKey="name"
      columns={[
        { key: 'name', header: 'Item Name', sortable: true },
        { key: 'category', header: 'Category', sortable: true },
        { key: 'hsn', header: 'HSN Code' },
        { key: 'unit', header: 'Unit' },
        { key: 'rate', header: 'Rate' },
        { key: 'opening', header: 'Opening Stock' },
      ]}
      formFields={[
        { name: 'name', label: 'Item Name', type: 'text', required: true },
        { name: 'category', label: 'Category', type: 'select', required: true, options: [
          { label: 'Raw Material (RAW)', value: 'RAW' },
          { label: 'Finished Good (FINISH)', value: 'FINISH' }
        ]},
        { name: 'hsn', label: 'HSN Code', type: 'text' },
        { name: 'unit', label: 'Unit (e.g. KGS, NOS)', type: 'text', required: true },
        { name: 'rate', label: 'Rate', type: 'number' },
        { name: 'opening', label: 'Opening Stock', type: 'number' },
      ]}
    />
  );
};
