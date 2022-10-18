<template>
  <PreviewGroup class="image-list">
    <template v-for="image in ImageList" :key="image.Url">
      <Image :width="100" :src="image.Url"/>
    </template>
  </PreviewGroup>
</template>
<script lang="ts">
import {defineComponent, PropType, ref, watch} from "vue";
import { Image } from "ant-design-vue";
import {propTypes} from "/@/utils/propTypes";
interface ImageRecord {
  Url: string
}
export default defineComponent({
  name: 'ImageList',
  props: {
    value: {
      type: Array as PropType<any[]>,
    },
    urlField: propTypes.string.def('Url'),
  },
  components: {
    Image,
    PreviewGroup: Image.PreviewGroup,
  },
  setup(props, {}) {
    // const { urlField, value } = toRefs(props)
    const ImageList = ref<ImageRecord[]>([]);

    // const ImageList = computed((): ImageRecord[] => {
    //   const {value, urlField} = props;
    //   return value ? value.map((item) => ({Url: item[urlField]})) as ImageRecord[] : [];
    // });
    watch(
        () => props.value,
        () => {
          const {value, urlField} = props;
          ImageList.value = value ? value.map((item) => ({Url: item[urlField]})) as ImageRecord[] : [];
        },
        {deep: true},
    );
    return {
      ImageList
    }
  }
})
</script>
