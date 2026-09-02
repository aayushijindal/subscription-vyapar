import { useQuery } from '@tanstack/react-query';
import { GenericMasterPage } from '@/components/ui/GenericMasterPage';
import { masterApi } from '@/services/api/master';

export const SubDepartmentsPage = () => {
  const { data: departmentsData } = useQuery({
    queryKey: ['departments'],
    queryFn: () => masterApi.departments.list(),
  });

  const payload = (departmentsData as any)?.data || departmentsData;
  const departmentsList = Array.isArray(payload) ? payload : payload?.results || payload?.data || [];
  const departmentOptions = departmentsList.map((dept: any) => ({
    label: dept.name,
    value: dept.id,
  }));

  return (
    <GenericMasterPage
      title="Sub Departments"
      description="Manage sub departments within your organization."
      queryKey="subDepartments"
      apiService={masterApi.subDepartments}
      searchKey="name"
      columns={[
        { key: 'name', header: 'Sub Department Name', sortable: true },
        { key: 'department', header: 'Department' },
      ]}
      formFields={[
        { 
          name: 'department', 
          label: 'Department', 
          type: 'select', 
          required: true,
          options: departmentOptions
        },
        { name: 'name', label: 'Sub Department Name', type: 'text', required: true },
      ]}
    />
  );
};
