<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts">
import { defineComponent, ref, computed, unref } from 'vue';
import { BasicModal, useModalInner } from '/@/components/Modal';
import { BasicForm, useForm } from '/@/components/Form/index';
import { placeFormSchema } from './place.data';

export default defineComponent({
  name: 'PlaceModal',
  emits: ['success', 'register'],
  components: { BasicModal, BasicForm },
  setup(_, { emit }) {
    const isUpdate = ref(true);
    const rowId = ref('');

    const [registerForm, { setFieldsValue, updateSchema, resetFields, validate }] = useForm({
      labelWidth: 100,
      baseColProps: { span: 24 },
      schemas: placeFormSchema,
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

        setFieldsValue({
          ...data.record,
        });
      } else {
        rowId.value = '';
      }
      updateSchema([
        {
          field: 'id',
          show: !unref(isUpdate),
          required: !unref(isUpdate),
        },
        {
          field: 'marketIdList',
          show: true,
        },
      ]);
    });

    const getTitle = computed(() => (!unref(isUpdate) ? '关联检测点' : '编辑检测点'));

    async function handleSubmit() {
      try {
        const values = await validate();
        setModalProps({ confirmLoading: true });
        closeModal();
        // 如果新增，以values里面id 为准
        if (!unref(isUpdate)) rowId.value = values.id || ''
        emit('success', { isUpdate: unref(isUpdate), values: { ...values, id: rowId.value } });
      } finally {
        setModalProps({ confirmLoading: false });
      }
    }

    return { registerModal, registerForm, getTitle, handleSubmit };
  },
})
</script>
