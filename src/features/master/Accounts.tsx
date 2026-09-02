import { useQuery } from '@tanstack/react-query';
import { GenericMasterPage } from '@/components/ui/GenericMasterPage';
import { masterApi } from '@/services/api/master';

const stateCodeMap: Record<string, string> = {
  'Jammu & Kashmir': '01',
  'Himachal Pradesh': '02',
  'Punjab': '03',
  'Chandigarh': '04',
  'Uttarakhand': '05',
  'Haryana': '06',
  'Delhi': '07',
  'Rajasthan': '08',
  'Uttar Pradesh': '09',
  'Bihar': '10',
  'Sikkim': '11',
  'Arunachal Pradesh': '12',
  'Nagaland': '13',
  'Manipur': '14',
  'Mizoram': '15',
  'Tripura': '16',
  'Meghalaya': '17',
  'Assam': '18',
  'West Bengal': '19',
  'Jharkhand': '20',
  'Odisha': '21',
  'Chhattisgarh': '22',
  'Madhya Pradesh': '23',
  'Gujarat': '24',
  'Daman & Diu': '25',
  'Dadra & Nagar Haveli and Daman & Diu': '26',
  'Maharashtra': '27',
  'Karnataka': '29',
  'Goa': '30',
  'Lakshadweep': '31',
  'Kerala': '32',
  'Tamil Nadu': '33',
  'Puducherry': '34',
  'Andaman & Nicobar Islands': '35',
  'Telangana': '36',
  'Andhra Pradesh': '37',
  'Ladakh': '38',
  'Other Territory': '97',
  'Foreign Country': '96'
};

const stateOptions = Object.keys(stateCodeMap).sort().map(state => ({ label: state, value: state }));

export const AccountsPage = () => {
  const { data: groupsData } = useQuery({
    queryKey: ['accountGroups'],
    queryFn: () => masterApi.accountGroups.list(),
  });

  const payload = (groupsData as any)?.data || groupsData;
  const groupsList = Array.isArray(payload) ? payload : payload?.results || payload?.data || [];
  const groupOptions = groupsList.map((group: any) => ({
    label: group.name,
    value: group.id,
  }));

  const transformPayload = (data: any) => {
    if (data.state && stateCodeMap[data.state]) {
      data.state_code = stateCodeMap[data.state];
    }
    // Ensure opening balance is a number
    if (data.opening_balance !== undefined && data.opening_balance !== '') {
      data.opening_balance = Number(data.opening_balance);
    } else {
      data.opening_balance = 0;
    }
    return data;
  };

  const transformDefaultValues = (item: any) => {
    return {
      ...item,
      account_group: typeof item.account_group === 'object' && item.account_group !== null ? item.account_group.id : item.account_group,
    };
  };

  return (
    <GenericMasterPage
      title="Accounts (Ledger)"
      description="Manage your ledger accounts and opening balances."
      queryKey="accounts"
      apiService={masterApi.accounts}
      searchKey="name"
      transformPayload={transformPayload}
      transformDefaultValues={transformDefaultValues}
      columns={[
        { key: 'name', header: 'Account Name', sortable: true },
        { key: 'account_group', header: 'Group', sortable: true },
        { key: 'opening_balance', header: 'Opening Balance' },
        { key: 'balance_type', header: 'Balance Type' },
        { key: 'gstin', header: 'GSTIN' },
      ]}
      formFields={[
        { name: 'name', label: 'Account Name', type: 'text', required: true },
        { 
          name: 'account_group', 
          label: 'Account Group', 
          type: 'select', 
          required: true,
          options: groupOptions
        },
        { name: 'account_group_type', label: 'Account Group Type', type: 'text', required: true },
        { name: 'address', label: 'Address', type: 'text' },
        { name: 'city', label: 'City', type: 'text' },
        { 
          name: 'state', 
          label: 'State', 
          type: 'select', 
          options: stateOptions,
          onChange: (e, setValue) => {
            const stateName = e.target.value;
            if (stateName && stateCodeMap[stateName]) {
              setValue('state_code', stateCodeMap[stateName]);
            } else {
              setValue('state_code', '');
            }
          }
        },
        { name: 'mobile_no', label: 'Mobile No.', type: 'text' },
        { name: 'other_mobile_no', label: 'Other Mobile No.', type: 'text' },
        { name: 'email', label: 'Email', type: 'text' },
        { name: 'opening_balance', label: 'Opening Balance', type: 'number', required: true },
        { name: 'balance_type', label: 'Balance Type', type: 'select', options: [
          { label: 'Debit', value: 'Debit' }, { label: 'Credit', value: 'Credit' }
        ]},
        { name: 'gstin', label: 'GSTIN', type: 'text' },
        { name: 'pan_no', label: 'PAN No.', type: 'text' },
        { name: 'tan_no', label: 'TAN No.', type: 'text' },
        { name: 'pin_code', label: 'Pincode', type: 'text', required: true },
        { name: 'state_code', label: 'State Code', type: 'text', disabled: true },
      ]}
    />
  );
};
