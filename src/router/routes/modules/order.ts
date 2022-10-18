import type { AppRouteModule } from '/@/router/types';

import {LAYOUT} from '/@/router/constant';
import {t} from '/@/hooks/web/useI18n';

const dashboard: AppRouteModule = {
    path: '/order',
    name: 'Order',
    component: LAYOUT,
    redirect: '/order/index',
    meta: {
        icon: 'ion:aperture-outline',
        title: t('routes.order.order'),
        orderNo: 100000,
        roles: ['superAdmin', 'tenantAdmin', 'healthCommission', 'register']
    },
    children: [
        {
            path: 'index',
            name: 'orderExport',
            component: () => import('/@/views/order/orderExport/index.vue'),
            meta: {
                title: t('routes.order.orderExport'),
                roles: ['superAdmin', 'tenantAdmin']
            }
        },
        {
            path: 'orderExportWJW',
            name: 'orderExportWJW',
            component: () => import('/@/views/order/orderExportWJW/index.vue'),
            meta: {
                title: t('routes.order.orderExportWJW'),
                roles: ['superAdmin', 'healthCommission']
            }
        },
        {
            path: 'list',
            name: 'orderList',
            component: () => import('/@/views/order/orderList/index.vue'),
            meta: {
                title: t('routes.order.orderList'),
                roles: ['superAdmin', 'tenantAdmin', 'healthCommission', 'register']
            }
        }
    ],
};

export default dashboard;
