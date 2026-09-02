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
        { key: 'account_type', header: 'Account Type' },
      ]}
      formFields={[
        { name: 'name', label: 'Group Name', type: 'text', required: true },
        { name: 'account_type', label: 'Account Type', type: 'text', required: true },
        { name: 'annx_no', label: 'Annexure No.', type: 'number' },
      ]}
    />
  );
};
