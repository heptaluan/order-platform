<template>
  <a-cascader
    v-model:value="state"
    :options="options"
    change-on-select
    @change="handleChange"
    :displayRender="handleRenderDisplay"
  >
    <template #suffixIcon v-if="loading">
      <LoadingOutlined spin/>
    </template>
    <template #notFoundContent v-if="loading">
      <span>
        <LoadingOutlined spin class="mr-1"/>
        {{ t('component.form.apiSelectNotFound') }}
      </span>
    </template>
  </a-cascader>
</template>
<script lang="ts">
import {defineComponent, PropType, ref, unref, watch, watchEffect} from 'vue';
import {Cascader} from 'ant-design-vue';
import {propTypes} from '/@/utils/propTypes';
import {isFunction} from '/@/utils/is';
import {get, omit} from 'lodash-es';
import {useRuleFormItem} from '/@/hooks/component/useFormItem';
import {LoadingOutlined} from '@ant-design/icons-vue';

interface Option {
  value: string;
  label: string;
  loading?: boolean;
  isLeaf?: boolean;
  children?: Option[];
}

export default defineComponent({
  name: 'ApiCascaderMarket',
  components: {
    LoadingOutlined,
    [Cascader.name]: Cascader,
  },
  props: {
    value: {
      type: Array,
    },
    api: {
      type: Function as PropType<(arg?: Recordable) => Promise<Option[]>>,
      default: null,
    },
    numberToString: propTypes.bool,
    resultField: propTypes.string.def(''),
    labelField: propTypes.string.def('label'),
    valueField: propTypes.string.def('value'),
    childrenField: propTypes.string.def('children'),
    asyncFetchParamKey: propTypes.string.def('parentCode'),
    immediate: propTypes.bool.def(true),
    // init fetch params
    initFetchParams: {
      type: Object as PropType<Recordable>,
      default: () => ({}),
    },
    // 是否有下级，默认是
    isLeaf: {
      type: Function as PropType<(arg: Recordable) => boolean>,
      default: null,
    },
    displayRenderArray: {
      type: Array,
    },
  },
  emits: ['change', 'defaultChange'],
  setup(props, {emit}) {
    const apiData = ref<any[]>([]);
    const options = ref<Option[]>([]);
    const loading = ref<boolean>(false);
    const emitData = ref<any[]>([]);
    const isFirstLoad = ref(true);

    // Embedded in the form, just use the hook binding to perform form verification
    const [state] = useRuleFormItem(props, 'value', 'change', emitData);

    watch(
      apiData,
      (data) => {
        const opts = generatorOptions(data);
        options.value = opts;
      },
      {deep: true},
    );

    function generatorOptions(options: any[]): Option[] {
      const {labelField, valueField, numberToString, childrenField, isLeaf} = props;
      return options.reduce((prev, next: Recordable) => {
        if (next) {
          const value = next[valueField];
          const children = Reflect.get(next, childrenField);
          let isLeafNode = isLeaf && typeof isLeaf === 'function' ? isLeaf(next) : false
          const nodeLabel = isLeafNode ? 'placeName' : labelField
          const item = {
            ...omit(next, [nodeLabel, valueField]),
            label: next[nodeLabel],
            value: numberToString ? `${value}` : value,
            isLeaf: isLeafNode,
          };
          if (children) {
            Reflect.set(item, 'children', generatorOptions(children));
          }
          prev.push(item);
        }
        return prev;
      }, [] as Option[]);
    }

    async function initialFetch() {
      const api = props.api;
      if (!api || !isFunction(api)) return;
      apiData.value = [];
      loading.value = true;
      try {
        const res = await api(props.initFetchParams);
        if (Array.isArray(res)) {
          apiData.value = res;
          return;
        }
        if (props.resultField) {
          apiData.value = get(res, props.resultField) || [];
        }
      } catch (error) {
        console.warn(error);
      } finally {
        loading.value = false;
      }
    }

    watchEffect(() => {
      props.immediate && initialFetch();
    });

    watch(
      () => props.initFetchParams,
      () => {
        !unref(isFirstLoad) && initialFetch();
      },
      {deep: true},
    );

    function handleChange(keys, args) {
      emitData.value = keys;
      emit('defaultChange', keys, args);
    }

    function handleRenderDisplay({labels, selectedOptions}) {
      if (unref(emitData).length === selectedOptions.length) {
        return labels.join(' / ');
      }
      if (props.displayRenderArray) {
        return props.displayRenderArray.join(' / ');
      }
      return '';
    }

    return {
      state,
      options,
      loading,
      handleChange,
      handleRenderDisplay,
    };
  },
});
</script>
