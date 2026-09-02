import { GenericMasterPage } from '@/components/ui/GenericMasterPage';
import { masterApi } from '@/services/api/master';

export const AccountGroupsPage = () => {
  return (
    <GenericMasterPage
      title="Account Groups"
      description="Manage ledger account groupings."
      queryKey="accountGroups"
      apiService={masterApi.accountGroups}
      searchKey="name"
      columns={[
        { key: 'name', header: 'Account Group', sortable: true },
        { key: 'parent', header: 'Parent Group ID' },
      ]}
      formFields={[
        { name: 'name', label: 'Group Name', type: 'text', required: true },
        { name: 'parent', label: 'Parent Group ID (Optional)', type: 'number' },
      ]}
    />
  );
};
