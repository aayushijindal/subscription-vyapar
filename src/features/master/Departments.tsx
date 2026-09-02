import { GenericMasterPage } from '@/components/ui/GenericMasterPage';
import { masterApi } from '@/services/api/master';

export const DepartmentsPage = () => {
  return (
    <GenericMasterPage
      title="Departments"
      description="Manage company departments."
      queryKey="departments"
      apiService={masterApi.departments}
      searchKey="name"
      columns={[
        { key: 'name', header: 'Department Name', sortable: true },
      ]}
      formFields={[
        { name: 'name', label: 'Department Name', type: 'text', required: true },
      ]}
    />
  );
};
