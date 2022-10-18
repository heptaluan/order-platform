import type {UserInfo} from '/#/store';
import type {ErrorMessageMode} from '/#/axios';
import {defineStore} from 'pinia';
import {store} from '/@/store';
import {RoleEnum} from '/@/enums/roleEnum';
import {PageEnum} from '/@/enums/pageEnum';
import {MARKET_KEY, ROLES_KEY, TOKEN_KEY, USER_INFO_KEY} from '/@/enums/cacheEnum';
import {getAuthCache, setAuthCache} from '/@/utils/auth';
import {GetUserInfoModel, LoginParams} from '/@/api/sys/model/userModel';
import {GetCaptcha, getUserInfo, loginApi} from '/@/api/sys/user';
import {useI18n} from '/@/hooks/web/useI18n';
import {useMessage} from '/@/hooks/web/useMessage';
import {router} from '/@/router';
import {usePermissionStore} from '/@/store/modules/permission';
import {RouteRecordRaw} from 'vue-router';
import {PAGE_NOT_FOUND_ROUTE} from '/@/router/routes/basic';
import {isArray} from '/@/utils/is';
import {h} from 'vue';
import {getAllPlace} from "/@/api/base/base";

interface UserState {
  userInfo: Nullable<UserInfo>;
  token?: string;
  roleList: RoleEnum[];
  sessionTimeout?: boolean;
  lastUpdateTime: number;
  MarketTree: MarketTreeItem[];
}
interface MarketTreeItem {
  value: string;
  label: string;
  children: Array<MarketTreeItem>,
  marketId: string
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    // user info
    userInfo: null,
    // token
    token: undefined,
    // roleList
    roleList: [],
    // Whether the login expired
    sessionTimeout: false,
    // Last fetch time
    lastUpdateTime: 0,
    // market tree
    MarketTree: []
  }),
  getters: {
    getUserInfo(): UserInfo {
      return this.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {};
    },
    getToken(): string {
      return this.token || getAuthCache<string>(TOKEN_KEY);
    },
    getRoleList(): RoleEnum[] {
      return this.roleList.length > 0 ? this.roleList : getAuthCache<RoleEnum[]>(ROLES_KEY);
    },
    getSessionTimeout(): boolean {
      return !!this.sessionTimeout;
    },
    getLastUpdateTime(): number {
      return this.lastUpdateTime;
    },
    getMarketTree(): MarketTreeItem[] {
      return this.MarketTree.length > 0 ? this.MarketTree : getAuthCache<MarketTreeItem[]>(MARKET_KEY);
    }
  },
  actions: {
    setToken(info: string | undefined) {
      this.token = info ? info : ''; // for null or undefined value
      setAuthCache(TOKEN_KEY, info);
    },
    setRoleList(roleList: RoleEnum[]) {
      this.roleList = roleList;
      setAuthCache(ROLES_KEY, roleList);
    },
    setUserInfo(info: UserInfo | null) {
      this.userInfo = info;
      this.lastUpdateTime = new Date().getTime();
      setAuthCache(USER_INFO_KEY, info);
    },
    setMarketTree(marketTree: MarketTreeItem[]) {
      this.MarketTree = marketTree
      setAuthCache(MARKET_KEY, marketTree);
    },
    setSessionTimeout(flag: boolean) {
      this.sessionTimeout = flag;
    },
    resetState() {
      this.userInfo = null;
      this.token = '';
      this.roleList = [];
      this.sessionTimeout = false;
    },
    /**
     * @description: login
     */
    async login(
      params: LoginParams & {
        goHome?: boolean;
        mode?: ErrorMessageMode;
      },
    ): Promise<GetUserInfoModel> {
      try {
        const {goHome = true, mode, ...loginParams} = params;
        const userInfo = await loginApi(loginParams, mode);
        const { token } = userInfo;
        // save token
        this.setToken(token);
        const sessionTimeout = this.sessionTimeout;
        const {roleKeyList = []} = userInfo;
        if (isArray(roleKeyList)) {
          const _roleList = roleKeyList.map((item) => item) as RoleEnum[];
          this.setRoleList(_roleList);
        } else {
          userInfo.roles = [];
          this.setRoleList([]);
        }
        this.setUserInfo(userInfo);
        if (sessionTimeout) {
          this.setSessionTimeout(false);
        } else {
          const permissionStore = usePermissionStore();
          if (!permissionStore.isDynamicAddedRoute) {
            const routes = await permissionStore.buildRoutesAction();
            routes.forEach((route) => {
              router.addRoute(route as unknown as RouteRecordRaw);
            });
            router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw);
            permissionStore.setDynamicAddedRoute(true);
          }
          goHome && (await router.replace(userInfo?.homePath || PageEnum.BASE_HOME));
        }
        // 刷新 渠道商
        // await getAllPlace()
        return userInfo
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async getUserInfoAction(): Promise<UserInfo | null> {
      if (!this.getToken) return null;
      const userInfo = await getUserInfo();
      const {roles = []} = userInfo;
      if (isArray(roles)) {
        const roleList = roles.map((item) => item.value) as RoleEnum[];
        this.setRoleList(roleList);
      } else {
        userInfo.roles = [];
        this.setRoleList([]);
      }
      this.setUserInfo(userInfo);
      return userInfo;
    },
    async GetCaptcha(key: string): Promise<string> {
      const data = await GetCaptcha(key);
      return data
    },
    /**
     * @description: logout
     */
    async logout(goLogin = false) {
      // if (this.getToken) {
      //   try {
      //     await doLogout();
      //   } catch {
      //     console.log('注销Token失败');
      //   }
      // }
      this.setToken(undefined);
      this.setSessionTimeout(false);
      this.setUserInfo(null);
      goLogin && router.push(PageEnum.BASE_LOGIN);
    },
    /**
     * @description: Confirm before logging out
     */
    confirmLoginOut() {
      const {createConfirm} = useMessage();
      const {t} = useI18n();
      createConfirm({
        iconType: 'warning',
        title: () => h('span', t('sys.app.logoutTip')),
        content: () => h('span', t('sys.app.logoutMessage')),
        onOk: async () => {
          await this.logout(true);
        },
      });
    },
    async getAllMarket() {
      if (!this.getToken) return null;
      const v = await getAllPlace()
      let retValue = []
      if (isArray(v)) {
        // @ts-ignore
        retValue = v.map(o => {
          const {id, marketName, registerMarketPlaceVOList} = o
          let children: any = []
          if (isArray(v)) {
            children = registerMarketPlaceVOList.map(t => {
              return {
                value: t.id,
                label: t.placeName,
                marketId: t.marketId
              }
            })
          }
          return {
            value: id,
            label: marketName,
            children: children
          }
        })
      }
      this.setMarketTree(retValue);
    }
  },
});

// Need to be used outside the setup
export function useUserStoreWithOut() {
  return useUserStore(store);
}
