<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit" :okText="getUploadBtnText" :okButtonProps="getOkButtonProps">
    <div class="upload-modal-toolbar">
      <Alert :message="getDownLoadHelpText" type="warning" banner class="upload-modal-toolbar__text" />
      <a-button type="link" :href="downloadUrl">下载模板</a-button>
    </div>
    <div class="upload-modal-toolbar mt-10 p-4">
<!--      <Alert :message="getHelpText" type="info" banner class="upload-modal-toolbar__text" />-->
      <label class="upload-modal-toolbar__text">填写完毕后：</label>
      <Upload
          :accept="getStringAccept"
          :before-upload="beforeUpload"
          :show-upload-list="false"
          class="upload-modal-toolbar__btn"
      >
        <a-button type="primary">
          {{ t('component.upload.choose') }}
        </a-button>
      </Upload>
    </div>
<!--    <template #centerFooter>-->
<!--      <a-button-->
<!--          @click="handleStartUpload"-->
<!--          color="success"-->
<!--          :disabled="!getIsSelectFile"-->
<!--          :loading="isUploadingRef"-->
<!--      >-->
<!--        {{ getUploadBtnText }}-->
<!--      </a-button>-->
<!--    </template>-->
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, toRefs } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useUploadType } from '/@/components/Upload/src/useUpload'
  import { basicProps } from '/@/components/Upload/src/props';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Upload, Alert } from 'ant-design-vue';
  import { importUsers } from '/@/api/base/base';

  export default defineComponent({
    name: 'AccountModalUpload',
    components: { BasicModal, Upload, Alert },
    emits: ['success', 'register'],
    props: {
      ...basicProps,
    },
    setup(props, { emit }) {
      const isUploadingRef = ref(false);
      const getIsSelectFile = ref(false)
      const { helpText, maxNumber, maxSize } = toRefs(props);
      const { t } = useI18n();
      const selectFile = ref();
      const accept = ref(['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'])

      const { getStringAccept, getHelpText } = useUploadType({
        acceptRef: accept,
        helpTextRef: helpText,
        maxNumberRef: maxNumber,
        maxSizeRef: maxSize,
      });
      // const [registerForm, { setFieldsValue, updateSchema, resetFields, validate }] = useForm({
      //   labelWidth: 100,
      //   baseColProps: { span: 24 },
      //   schemas: accountFormSchema,
      //   showActionButtonGroup: false,
      //   actionColOptions: {
      //     span: 23,
      //   },
      // });
      const { createMessage } = useMessage();
      const downloadUrl = ref(''); // 下载链接

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        setModalProps({ confirmLoading: false });
        downloadUrl.value = data.downloadUrl
      });


      const getTitle = computed(() => '登记员批量上传');
      const getDownLoadHelpText = computed(() => '请您下载导入模板，填写用户信息后上传 ');

      const getUploadBtnText = computed(() => {
        return isUploadingRef.value
            ? t('component.upload.uploading')
            : t('component.upload.startUpload');
      });
      const getOkButtonProps = computed(() => {
        return {
          loading: isUploadingRef.value,
          disabled: !getIsSelectFile.value,
        };
      });
      async function handleSubmit() {
        try {
          setModalProps({ confirmLoading: true });
          isUploadingRef.value = true;
          if (selectFile.value) {
            const params = {
              name: 'uploadFile',
              file: selectFile.value
            }
            const res = await importUsers(params)
            const { data, status, statusText } = res
            if (status === 200) {
              const { code, message } = data as any
              if (code === 200) {
                closeModal();
                emit('success', {message});
              } else {
                createMessage.warning(message)
              }
            } else {
              createMessage.warning(statusText)
            }
          }
        } finally {
          isUploadingRef.value = false;
          setModalProps({ confirmLoading: false });
        }
      }
      // 上传前校验
      function beforeUpload(file: File) {
        // const { maxSize } = props;
        // 设置最大值，则判断
        // if (maxSize && file.size / 1024 / 1024 >= maxSize) {
        //   createMessage.error(t('component.upload.maxSizeMultiple', [maxSize]));
        //   return false;
        // }
        if(!accept.value.some((fileType) => fileType === file.type)) {
            createMessage.warning(t('component.upload.acceptUpload', ['excel']));
            return false;
        }
        selectFile.value = file
        getIsSelectFile.value = true
        return false;
      }
      // 点击开始上传
      async function handleStartUpload() {
        try {
          isUploadingRef.value = true;
          // 只上传不是成功状态的
          // const uploadFileList =
          //     fileListRef.value.filter((item) => item.status !== UploadResultStatus.SUCCESS) || [];
          // const data = await Promise.all(
          //     uploadFileList.map((item) => {
          //       return uploadApiByItem(item);
          //     }),
          // );
          // const data = await uploadApiByItem()
          // isUploadingRef.value = false;
          // // 生产环境:抛出错误
          // const errorList = data.filter((item: any) => !item.success);
          // if (errorList.length > 0) throw errorList;
        } catch (e) {
          isUploadingRef.value = false;
          throw e;
        }
      }
      return {
        registerModal,
        getTitle,
        getHelpText,
        getStringAccept,
        beforeUpload,
        handleSubmit,
        handleStartUpload,
        isUploadingRef,
        getIsSelectFile,
        getUploadBtnText,
        t,
        getDownLoadHelpText,
        downloadUrl,
        getOkButtonProps
      };
    },
  });
</script>
<style lang="less">
.upload-modal {

  &-toolbar {
    display: flex;
    align-items: center;
    margin-bottom: 8px;

    &__btn {
      margin-left: 10px;
      text-align: left;
      flex: 1;
    }
  }
}
</style>
