<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <div class="text-center">
      <QrCode :value="qrCodeUrl" ref="qrRef" />
      <a-button class="mb-2" type="primary" @click="download"> 下载 </a-button>
    </div>
  </BasicModal>
</template>

<script lang="ts">
import { defineComponent, ref, computed, unref } from 'vue';
import { BasicModal, useModalInner } from '/@/components/Modal';
import {QrCode, QrCodeActionType} from '/@/components/Qrcode/index';

export default defineComponent({
  name: 'QrCodeModal',
  emits: ['success', 'register'],
  components: { BasicModal, QrCode },
  setup(_, { emit }) {
    const qrRef = ref<Nullable<QrCodeActionType>>(null);
    const qrCodeUrl = ref('')
    const qrName = ref('')

    const [registerModal, {setModalProps, closeModal}] = useModalInner(async (data) => {
      setModalProps({confirmLoading: false});
      const { marketName, record} = data
      if (record) {
        const { id, placeName, mid } = record
        const params = {
          id,
          placeName,
          marketId: mid,
          marketName
        }
        qrCodeUrl.value = JSON.stringify(params);
        qrName.value = record.placeName || ''
      }
    });

    const getTitle = computed(() =>  '二维码下载');

    async function handleSubmit() {
      try {
        setModalProps({confirmLoading: true});
        closeModal();
        emit('success', {});
      } finally {
        setModalProps({confirmLoading: false});
      }
    }
    function download() {
      const qrEl = unref(qrRef);
      if (!qrEl) return;
      qrEl.download(qrName.value);
    }

    return {registerModal, getTitle, handleSubmit, download, qrCodeUrl, qrRef};
  }
})
</script>
