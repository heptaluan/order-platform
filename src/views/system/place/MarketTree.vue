<template>
  <div class="m-4 mr-0 overflow-hidden bg-white">
    <BasicTree
        title="县（市）、区列表"
        toolbar
        search
        :clickRowToExpand="false"
        :treeData="treeData"
        :replaceFields="{ key: 'id', title: 'marketName' }"
        @select="handleSelect"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import {BasicTree, TreeItem} from '/@/components/Tree';
import { getAllPlace } from "/@/api/base/base";

export default defineComponent( {
  name: 'MarketTree',
  components: {
    BasicTree
  },
  emits: ['select'],
  setup(_, { emit }) {
    const treeData = ref<TreeItem[]>([]);

    async function fetch() {
      treeData.value = (await getAllPlace()) as unknown as TreeItem[];
      const firstNode = treeData.value[0] || {}
      emit('select', { marketId: firstNode.id, marketName: firstNode.marketName });
    }

    function handleSelect(keys, { selectedNodes }) {
      // emit('select', keys[0], selectedNodes[0]);
      const node = selectedNodes[0]
      emit('select', { marketId: keys[0], marketName: node?.props.marketName })
    }

    onMounted(() => {
      fetch();
    });
    return { treeData, handleSelect };
  },
})
</script>
