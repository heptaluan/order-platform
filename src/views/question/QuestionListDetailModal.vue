<template>
  <BasicModal
    @register="register"
    v-bind="$attrs"
    title="查看问卷"
    @ok="handleSubmit"
    :useWrapper="false"
  >
    <ul class="list" v-if="showDetail">
      <li v-for="(item, index) of list" :key="index">
        <div>
          <span>{{ index + 1 }}、</span>
          <span class="questionTitle">{{ item['questionTitle'] }}</span>
          <span class="itemTitle">{{ item['itemTitle'] }}</span>
        </div>
      </li>
    </ul>
    <div v-if="!showDetail"><a-empty /></div>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { findAnswerListById } from '/@/api/base/question';

  export default defineComponent({
    components: { BasicModal },
    setup() {
      const isUpdate = ref(true);
      const list = ref([]);
      const showDetail = ref(true);
      const [register, { closeModal, setModalProps }] = useModalInner(async (data) => {
        if (unref(isUpdate)) {
          const res = await findAnswerListById({
            id: data.id,
          });
          if (res && (res as any).length > 0) {
            list.value = res as any;
            showDetail.value = true;
            setModalProps({
              useWrapper: true,
            });
          } else {
            showDetail.value = false;
            setModalProps({
              useWrapper: true,
            });
          }
        }
      });

      function handleSubmit() {
        closeModal();
      }

      return {
        list,
        showDetail,
        register,
        handleSubmit,
      };
    },
  });
</script>
<style lang="less" scoped>
  .list {
    li {
      margin-bottom: 8px;
      font-size: 14px;
      line-height: 1.5;
      font-family: PingFang SC, Source Han Sans SC, Microsoft YaHei, Noto Sans CJK SC,
        WenQuanYi Micro Hei, sans-serif !important;
      color: rgb(81, 90, 110);
      .questionTitle {
        font-weight: bold;
      }
    }
  }
</style>
