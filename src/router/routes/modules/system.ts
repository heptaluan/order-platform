import type { AppRouteModule } from '/@/router/types';

import {LAYOUT} from '/@/router/constant';
import {t} from '/@/hooks/web/useI18n';

const dashboard: AppRouteModule = {
    path: '/system',
    name: 'System',
    component: LAYOUT,
    redirect: '/system/account',
    meta: {
        icon: 'ion:settings-outline',
        title: t('routes.base.system.moduleName'),
        orderNo: 100001,
        roles: ['superAdmin', 'tenantAdmin']
    },
    children: [
        {
            path: 'account',
            name: 'AccountManagement',
            meta: {
                title: t('routes.base.system.account'),
                ignoreKeepAlive: false,
                roles: ['superAdmin', 'tenantAdmin']
            },
            component: () => import('/@/views/system/account/index.vue'),
        },
        {
            path: 'account_detail/:id',
            name: 'AccountDetail',
            meta: {
                hideMenu: true,
                title: t('routes.base.system.account_detail'),
                ignoreKeepAlive: true,
                showMenu: false,
                currentActiveMenu: '/system/account',
            },
            component: () => import('/@/views/system/account/AccountDetail.vue'),
        },
        {
            path: 'place',
            name: 'Place',
            meta: {
                title: t('routes.base.system.place'),
                ignoreKeepAlive: false,
                roles: ['superAdmin', 'tenantAdmin']
            },
            component: () => import('/@/views/system/place/index.vue'),
        },
        {
            path: 'inspection',
            name: 'Inspection',
            meta: {
                title: t('routes.base.system.inspection'),
                ignoreKeepAlive: false,
                roles: ['superAdmin', 'tenantAdmin']
            },
            component: () => import('/@/views/system/inspection/index.vue'),
        },
        {
            path: 'inspection-workLog',
            name: 'InspectionWorkLog',
            meta: {
                title: t('routes.base.system.InspectionWorkLog'),
                ignoreKeepAlive: false,
                roles: ['superAdmin', 'tenantAdmin']
            },
            component: () => import('/@/views/system/InspectionWorkLog/index.vue'),
        },
    ],
};

export default dashboard;
