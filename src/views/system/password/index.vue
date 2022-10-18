<template>
  <PageWrapper title="修改当前用户密码" content="修改成功后会自动退出当前登录！">
    <div class="py-8 bg-white flex flex-col justify-center items-center">
      <BasicForm @register="register" />
      <div class="flex justify-center">
        <a-button @click="resetFields"> 重置 </a-button>
        <a-button class="!ml-4" type="primary" @click="handleSubmit"> 确认 </a-button>
      </div>
    </div>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicForm, useForm } from '/@/components/Form';
  import { formSchema } from './pwd.data';
  import {modifyPassword} from "/@/api/base/base";
  import {useUserStore} from '/@/store/modules/user';

  export default defineComponent({
    name: 'ChangePassword',
    components: { BasicForm, PageWrapper },
    setup() {
      const userStore = useUserStore();
      const [register, { validate, resetFields }] = useForm({
        size: 'large',
        baseColProps: { span: 24 },
        labelWidth: 100,
        showActionButtonGroup: false,
        schemas: formSchema,
      });

      async function handleSubmit() {
        try {
          const values = await validate();
          const { newPassword, oldPassword, confirmPassword } = values;
          // TODO custom api
          const params = {
            oldPassword,
            newPassword,
            confirmPassword
          }

          const res = await modifyPassword(params)
          if (res) {
            await userStore.logout(true)
          }
        } catch (error) {}
      }

      return { register, resetFields, handleSubmit };
    },
  });
</script>
