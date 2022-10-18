<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { questionListEditFormSchema } from './Question.data';
  import { getDeptList } from '/@/api/base/base';

  export default defineComponent({
    name: 'AccountModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const isHealthCommissionRole = ref(false);
      const rowId = ref('');
      const userName = ref('');

      const [registerForm, { setFieldsValue, updateSchema, resetFields, validate }] = useForm({
        labelWidth: 100,
        baseColProps: { span: 24 },
        schemas: questionListEditFormSchema,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 23,
        },
      });

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields();
        setModalProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;

        if (unref(isUpdate)) {
          rowId.value = data.record.id;
          userName.value = data.record.userName;
          isHealthCommissionRole.value = data.record.roleIdList
            ? data.record.roleIdList.includes('5')
            : false;

          setFieldsValue({
            ...data.record,
          });
        }

        const treeData = await getDeptList();
        updateSchema([
          // {
          //   field: 'userName',
          //   dynamicDisabled: unref(isUpdate),
          // },
          {
            field: 'pwd',
            show: !unref(isUpdate),
          },
          {
            field: 'marketIdList',
            ifShow: unref(isHealthCommissionRole),
            required: unref(isHealthCommissionRole),
          },
          {
            field: 'dept',
            componentProps: { treeData },
          },
        ]);
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增账号' : '编辑账号'));

      async function handleSubmit() {
        try {
          const values = await validate();
          setModalProps({ confirmLoading: true });
          const isUserNameModify = userName.value !== values.userName && unref(isUpdate);
          closeModal();
          emit('success', {
            isUpdate: unref(isUpdate),
            values: { ...values, id: rowId.value },
            isUserNameModify,
          });
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return { registerModal, registerForm, getTitle, handleSubmit };
    },
  });
</script>
