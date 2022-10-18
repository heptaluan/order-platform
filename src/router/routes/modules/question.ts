import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const dashboard: AppRouteModule = {
  path: '/question',
  name: 'Question',
  component: LAYOUT,
  redirect: '/question/index',
  meta: {
    icon: 'ion:aperture-outline',
    title: t('routes.question.question'),
    orderNo: 100002,
    roles: ['superAdmin', 'tenantAdmin'],
  },
  children: [
    {
      path: 'index',
      name: 'questionTemplate',
      component: () => import('/@/views/question/QuestionTemplate.vue'),
      meta: {
        title: t('routes.question.questionTemplate'),
        roles: ['superAdmin', 'tenantAdmin'],
      },
    },
    {
      path: 'list',
      name: 'questionList',
      component: () => import('/@/views/question/QuestionList.vue'),
      meta: {
        title: t('routes.question.questionList'),
        roles: ['superAdmin', 'tenantAdmin', 'register'],
      },
    },
    {
      path: 'questionTemplateEdit',
      name: 'questionTemplateEdit',
      component: () => import('/@/views/question/QuestionTemplateEdit.vue'),
      meta: {
        hideMenu: true,
        title: t('routes.question.questionTemplateEdit'),
      },
    },
  ],
};

export default dashboard;
