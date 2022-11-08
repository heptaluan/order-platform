<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    @ok="handleSubmit"
    :ok-button-props="{ disabled: !canEdit }"
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { addQuestionDetailFormSchema } from './Question.data';

  export default defineComponent({
    name: 'AddQuestionDetailModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const rowId = ref('');
      const canEdit = ref(true);
      const isSingle = ref(true);

      const [registerForm, { setFieldsValue, resetFields, validate, updateSchema }] = useForm({
        labelWidth: 100,
        baseColProps: { span: 24 },
        schemas: addQuestionDetailFormSchema,
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
        isSingle.value = !!data?.isSingle;

        updateSchema([
          {
            field: 'itemTitle',
            dynamicDisabled: false,
          },
          {
            field: 'itemDescribe',
            dynamicDisabled: false,
          },
          {
            field: 'itemValue',
            dynamicDisabled: false,
          },
          {
            field: 'memo',
            dynamicDisabled: false,
          },
          {
            field: 'hasRemark',
            dynamicDisabled: false,
          },
          {
            field: 'isExclusive',
            dynamicDisabled: false,
          },
          {
            field: 'orderNum',
            dynamicDisabled: false,
          },
          {
            field: 'questionRemark',
            dynamicDisabled: false,
          },
        ]);

        if (unref(isUpdate)) {
          rowId.value = data.record.id;

          setFieldsValue({
            ...data.record,
          });

          updateSchema([
            {
              field: 'itemTitle',
              dynamicDisabled: !unref(canEdit),
            },
            {
              field: 'itemDescribe',
              dynamicDisabled: !unref(canEdit),
            },
            {
              field: 'itemValue',
              dynamicDisabled: !unref(canEdit),
            },
            {
              field: 'memo',
              dynamicDisabled: !unref(canEdit),
            },
            {
              field: 'hasRemark',
              dynamicDisabled: !unref(canEdit),
            },
            {
              field: 'isExclusive',
              dynamicDisabled: !unref(canEdit),
            },
            {
              field: 'orderNum',
              dynamicDisabled: !unref(canEdit),
            },
            {
              field: 'questionRemark',
              dynamicDisabled: !unref(canEdit),
            },
          ]);
        } else {
          rowId.value = '';
          if (isSingle.value) {
            setFieldsValue({
              isExclusive: '01',
            });
            updateSchema([
              {
                field: 'isExclusive',
                dynamicDisabled: true,
              },
            ]);
          }
        }
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增问题选项' : '编辑问题选项'));

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
