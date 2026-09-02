import { GenericMasterPage } from '@/components/ui/GenericMasterPage';
import { masterApi } from '@/services/api/master';

export const SubDepartmentsPage = () => {
  return (
    <GenericMasterPage
      title="Sub Departments"
      description="Manage sub departments within your organization."
      queryKey="subDepartments"
      apiService={masterApi.subDepartments}
      searchKey="name"
      columns={[
        { key: 'name', header: 'Sub Department Name', sortable: true },
        { key: 'department', header: 'Department ID' },
      ]}
      formFields={[
        { name: 'name', label: 'Sub Department Name', type: 'text', required: true },
        { name: 'department', label: 'Department ID', type: 'number', required: true },
      ]}
    />
  );
};
