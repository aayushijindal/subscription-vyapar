import { GenericMasterPage } from '@/components/ui/GenericMasterPage';
import { masterApi } from '@/services/api/master';

export const ItemGroupsPage = () => {
  return (
    <GenericMasterPage
      title="Item Groups"
      description="Manage categories for your items."
      queryKey="itemGroups"
      apiService={masterApi.itemGroups}
      searchKey="name"
      columns={[
        { key: 'name', header: 'Group Name', sortable: true },
        { key: 'description', header: 'Description' },
      ]}
      formFields={[
        { name: 'name', label: 'Group Name', type: 'text', required: true },
        { name: 'description', label: 'Description', type: 'text' },
      ]}
    />
  );
};
