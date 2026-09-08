import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Plus, Edit2, Trash2 } from 'lucide-react';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { DynamicForm, type FormField } from '@/components/ui/DynamicForm';

interface GenericMasterPageProps {
  title: string;
  description?: string;
  queryKey: string;
  apiService: {
    list: () => Promise<any>;
    create: (data: any) => Promise<any>;
    update: (id: string | number, data: any) => Promise<any>;
    delete: (id: string | number) => Promise<any>;
  };
  columns: any[];
  formFields: FormField[] | ((watch: (name: string) => any) => FormField[]);
  searchKey?: string;
  transformPayload?: (data: any) => any;
  transformDefaultValues?: (item: any) => any;
}

export const GenericMasterPage: React.FC<GenericMasterPageProps> = ({
  title,
  description,
  queryKey,
  apiService,
  columns,
  formFields,
  searchKey,
  transformPayload,
  transformDefaultValues,
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  // Queries
  const { data, isLoading } = useQuery({
    queryKey: [queryKey],
    queryFn: () => apiService.list(),
  });

  // Since apiService.list now returns BaseResponse<T[] | PaginatedData>, data.data contains the actual payload
  const payload = data?.data || data;
  const listData = Array.isArray(payload) ? payload : payload?.results || payload?.data || [];

  // Mutations
  const createMutation = useMutation({
    mutationFn: apiService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      handleCloseModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (variables: { id: string | number; data: any }) => apiService.update(variables.id, variables.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      handleCloseModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: apiService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
  });

  const handleOpenModal = (item: any | null = null) => {
    const defaultVals = item ? (transformDefaultValues ? transformDefaultValues(item) : item) : null;
    setEditingItem(defaultVals);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingItem(null);
    setIsModalOpen(false);
  };

  const handleSubmit = (formData: any) => {
    const finalData = transformPayload ? transformPayload(formData) : formData;
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: finalData });
    } else {
      createMutation.mutate(finalData);
    }
  };

  // Add action column automatically
  const tableColumns = [
    ...columns,
    {
      key: 'actions',
      header: 'Actions',
      render: (item: any) => (
        <div className="flex items-center gap-2">
          <button onClick={() => handleOpenModal(item)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={() => { if(confirm('Are you sure?')) deleteMutation.mutate(item.id) }} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
            {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
          </div>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2 shadow-sm">
          <Plus className="w-4 h-4" /> Add New
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#eaf2f9] border-t-[#376fa9]" />
          <p className="mt-4 text-sm font-medium text-[#688099]">Loading data...</p>
        </div>
      ) : (
        <Table 
          columns={tableColumns} 
          data={listData} 
          searchKey={searchKey as any} 
          searchPlaceholder={`Search ${title.toLowerCase()}...`}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingItem ? `Edit ${title.replace('s', '')}` : `Add New ${title.replace('s', '')}`}
      >
        <DynamicForm
          fields={formFields}
          defaultValues={editingItem || {}}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          isLoading={createMutation.isPending || updateMutation.isPending}
          submitLabel={editingItem ? 'Update' : 'Create'}
        />
      </Modal>
    </div>
  );
};
