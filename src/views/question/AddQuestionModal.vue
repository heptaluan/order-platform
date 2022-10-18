<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit" :ok-button-props="{ disabled: !canEdit }">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { addQuestionFormSchema } from './Question.data';

  export default defineComponent({
    name: 'AddQuestionModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const rowId = ref('');
      const canEdit = ref(true);

      const [registerForm, { setFieldsValue, resetFields, validate, updateSchema }] = useForm({
        labelWidth: 100,
        baseColProps: { span: 24 },
        schemas: addQuestionFormSchema,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 23,
        },
      });

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields();
        setModalProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;
        canEdit.value = !!data?.canEdit;

        if (unref(isUpdate)) {
          rowId.value = data.record.id;

          setFieldsValue({
            ...data.record,
          });
          updateSchema([
            {
              field: 'questionTitle',
              dynamicDisabled: !unref(canEdit),
            },
            {
              field: 'questionDescribe',
              dynamicDisabled: !unref(canEdit),
            },
            {
              field: 'questionType',
              dynamicDisabled: !unref(canEdit),
            },
            {
              field: 'orderNum',
              dynamicDisabled: !unref(canEdit),
            },
            {
              field: 'questionRemark',
              dynamicDisabled: !unref(canEdit),
            }
          ])
        } else {
          rowId.value = '';
        }
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增问题' : '编辑问题'));

      async function handleSubmit() {
        try {
          const values = await validate();
          setModalProps({ confirmLoading: true });
          closeModal();
          emit('success', { isUpdate: unref(isUpdate), values: { ...values, id: rowId.value } });
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return { registerModal, registerForm, getTitle, handleSubmit, canEdit };
    },
  });
</script>
