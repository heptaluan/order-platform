<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit" width="1024px">
    <BasicForm @register="registerForm">
      <template #statementSlot="{ model, field }">
        <Tinymce v-model:value="model[field]" width="100%" :showImageUpload="false" @update:modelValue="handleUpdateStatement" :disabled="!canEdit" :options="{ readonly: !canEdit}"/>
      </template>
      <template #informedConsentSlot="{ model, field }">
        <Tinymce v-model:value="model[field]"  width="100%" :showImageUpload="false" @update:modelValue="handleUpdateInformedConsent" :disabled="!canEdit" :options="{ readonly: !canEdit}"/>
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts">
import {defineComponent, ref, computed, unref } from 'vue';
import { BasicModal, useModalInner } from '/@/components/Modal';
import {BasicForm, useForm} from '/@/components/Form/index';
import {Tinymce} from "/@/components/Tinymce";
import { addTemplateFormSchema } from "/@/views/question/Question.data";

  export default defineComponent({
    name: 'AddTemplateModal',
    components: { BasicModal, BasicForm, Tinymce},
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const rowId = ref('');
      const canEdit = ref(true);

      const [registerForm, { setFieldsValue, resetFields, validate, updateSchema }] = useForm({
        labelWidth: 100,
        baseColProps: { span: 24 },
        schemas: addTemplateFormSchema,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 23,
        },
      });

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields();
        setModalProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;
        canEdit.value = unref(isUpdate) ? (data.record.status ? data.record.status === '99' : false) : true

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
            field: 'templateCode',
            dynamicDisabled: !unref(canEdit),
          },
          {
            field: 'questionnaireTitle',
            dynamicDisabled: !unref(canEdit),
          },
          {
            field: 'questionnaireRemark',
            dynamicDisabled: !unref(canEdit),
          },
        ])
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增问卷' : '编辑问卷'));

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
      function handleUpdateStatement(content) {
        setFieldsValue({
          statement: content
        })
      }
      function handleUpdateInformedConsent(content) {
        setFieldsValue({
          informedConsent: content
        })
      }
      return { registerModal, registerForm, getTitle, handleSubmit, canEdit, handleUpdateStatement, handleUpdateInformedConsent };
    },
  });
</script>
