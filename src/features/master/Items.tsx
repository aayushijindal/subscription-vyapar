import { useQuery } from '@tanstack/react-query';
import { GenericMasterPage } from '@/components/ui/GenericMasterPage';
import { masterApi } from '@/services/api/master';

export const ItemsPage = () => {
  const { data: itemGroupsData } = useQuery({
    queryKey: ['itemGroups'],
    queryFn: () => masterApi.itemGroups.list(),
  });

  const payload = (itemGroupsData as any)?.data || itemGroupsData;
  const itemGroupsList = Array.isArray(payload) ? payload : payload?.results || payload?.data || [];
  const itemGroupOptions = itemGroupsList.map((group: any) => ({
    label: group.name,
    value: group.id,
  }));

  const transformDefaultValues = (item: any) => {
    return {
      ...item,
      item_group: typeof item.item_group === 'object' && item.item_group !== null ? item.item_group.id : item.item_group,
    };
  };

  const transformPayload = (data: any) => {
    // Ensure numeric fields are numbers (or default to 0 if blank)
    const numericFields = ['opening', 'rate', 'pcs_kg', 'gst'];
    numericFields.forEach(field => {
      if (data[field] !== undefined && data[field] !== '') {
        data[field] = Number(data[field]);
      } else if (field !== 'gst') {
        data[field] = 0; // Default optional numeric fields to 0
      }
    });
    return data;
  };

  return (
    <GenericMasterPage
      title="Items Master"
      description="Manage your raw materials and finished goods."
      queryKey="items"
      apiService={masterApi.items}
      searchKey="name"
      transformPayload={transformPayload}
      transformDefaultValues={transformDefaultValues}
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
        { name: 'hsn', label: 'HSN Code', type: 'text' },
        { 
          name: 'item_group', 
          label: 'Item Group', 
          type: 'select', 
          required: true,
          options: itemGroupOptions
        },
        { name: 'unit', label: 'Unit', type: 'text' },
        { name: 'opening', label: 'Opening Balance', type: 'number' },
        { name: 'rate', label: 'Rate', type: 'number' },
        { name: 'pcs_kg', label: 'PCS / KG', type: 'number' },
        { name: 'size', label: 'Size / Dimension', type: 'text' },
        { name: 'gst', label: 'GST (%)', type: 'number' },
        { name: 'category', label: 'Category', type: 'select', options: [
          { label: 'RAW', value: 'RAW' },
          { label: 'FINISH', value: 'FINISH' }
        ]},
      ]}
    />
  );
};
