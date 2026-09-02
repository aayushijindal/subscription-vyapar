import { GenericMasterPage } from '@/components/ui/GenericMasterPage';
import { masterApi } from '@/services/api/master';

export const AccountsPage = () => {
  return (
    <GenericMasterPage
      title="Accounts (Ledger)"
      description="Manage your ledger accounts and opening balances."
      queryKey="accounts"
      apiService={masterApi.accounts}
      searchKey="name"
      columns={[
        { key: 'name', header: 'Account Name', sortable: true },
        { key: 'account_group', header: 'Group', sortable: true },
        { key: 'opening_balance', header: 'Opening Balance' },
        { key: 'balance_type', header: 'Balance Type' },
        { key: 'gstin', header: 'GSTIN' },
      ]}
      formFields={[
        { name: 'name', label: 'Account Name', type: 'text', required: true },
        { name: 'account_group', label: 'Account Group', type: 'text', required: true },
        { name: 'opening_balance', label: 'Opening Balance', type: 'number' },
        { name: 'balance_type', label: 'Balance Type', type: 'select', options: [
          { label: 'Debit', value: 'Debit' }, { label: 'Credit', value: 'Credit' }
        ]},
        { name: 'gstin', label: 'GSTIN', type: 'text' },
        { name: 'mobile_no', label: 'Mobile No', type: 'text' },
        { name: 'city', label: 'City', type: 'text' },
        { name: 'state', label: 'State', type: 'text' },
      ]}
    />
  );
};
