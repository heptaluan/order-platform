<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue';
import { BasicModal, useModalInner } from '/@/components/Modal';
import { BasicForm, useForm } from '/@/components/Form/index';
import { WorkLogFormSchema } from './inspectionWorkLog.data';

export default defineComponent({
  name: 'WorkLogModal',
  components: { BasicModal, BasicForm },
  emits: ['success', 'register'],
  setup(_, { emit }) {

    const [registerForm, { setFieldsValue, resetFields }] = useForm({
      labelWidth: 100,
      baseColProps: { span: 24 },
      schemas: WorkLogFormSchema,
      showActionButtonGroup: false,
      actionColOptions: {
        span: 23,
      },
    });

    const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
      resetFields();
      setModalProps({ confirmLoading: false });
      setFieldsValue({
        ...data.record,
      });
    });

    const getTitle = computed(() => ('工作日志--详情'));

    async function handleSubmit() {
      try {
        setModalProps({ confirmLoading: true });
        closeModal();
        emit('success', { } );
      } finally {
        setModalProps({ confirmLoading: false });
      }
    }

    return { registerModal, registerForm, getTitle, handleSubmit };
  },
});
</script>
