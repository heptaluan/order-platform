import { defHttp } from '/@/utils/http/axios';
import { BaseResultModel } from '/@/api/base/model/accountModel';
import qs from 'qs';
import { QuestionModel } from '/@/api/base/model/questionModel';

enum Api {
  getQuestionTemplate = '/tailai-cloud-questionnaire/questionnaire-template/findBySearchDTO',
  saveQuestionTemplate = '/tailai-cloud-questionnaire/questionnaire-template/save',
  deleteQuestionTemplate = '/tailai-cloud-questionnaire/questionnaire-template/deleteById',
  getQuestionList = '/tailai-cloud-questionnaire/questionnaire-question/queryByTemplateId',
  saveQuestionList = '/tailai-cloud-questionnaire/questionnaire-question/save',
  getCodeType = '/tailai-cloud-system/sys-dict-item/getItemsByType',
  deleteQuestionById = '/tailai-cloud-questionnaire/questionnaire-question/deleteById',
  getQuestionDetail = '/tailai-cloud-questionnaire/questionnaire-item/queryByQuestionId',
  saveQuestionDetail = '/tailai-cloud-questionnaire/questionnaire-item/save',
  deleteQuestionDetail = '/tailai-cloud-questionnaire/questionnaire-item/deleteById',
  enableTemplate = '/tailai-cloud-questionnaire/questionnaire-template/enableTemplate',
  addTemplateVersion = '/tailai-cloud-questionnaire/questionnaire-template/addVersion',
  getTemplateFindById = '/tailai-cloud-questionnaire/questionnaire-template/findById',
  getQuestionnaireList = '/tailai-cloud-questionnaire/questionnaire-customer/findBySearchDTO',
  findAnswerListById = '/tailai-cloud-questionnaire/questionnaire-customer/findAnswerListById',
  exportQuestionnaireList = '/tailai-cloud-questionnaire/questionnaire-customer/exportQuestionnaireList',
  getAllEnabled = '/tailai-cloud-questionnaire/questionnaire-template/getAllEnabled',
}

// 获取字典值
export const getCodeType = (params) => {
  return defHttp.post<BaseResultModel>({
    url: Api.getCodeType,
    data: qs.stringify({
      ...params,
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};

// 查询所有已启用的问卷
export const getAllEnabled = () => {
  return defHttp.post<BaseResultModel>({
    url: Api.getAllEnabled,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};

// 查询模板列表
export const getQuestionTemplate = (params) => {
  return defHttp.post<BaseResultModel>({
    url: Api.getQuestionTemplate,
    data: params,
  });
};

// 新增模板列表
export const saveQuestionTemplate = (params) => {
  return defHttp.post<BaseResultModel>({
    url: Api.saveQuestionTemplate,
    data: params,
  });
};

// 删除模板列表
export const deleteQuestionTemplate = (params) => {
  return defHttp.post<BaseResultModel>({
    url: Api.deleteQuestionTemplate,
    data: qs.stringify({
      ...params,
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};

// 启用模板
export const enableQuestionTemplate = (id) => {
  return defHttp.post<BaseResultModel>({
    url: Api.enableTemplate,
    data: qs.stringify({
      ...id,
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};

// 根据问卷模板Id 新增问卷模板版本
export const addTemplateVersion = (id) => {
  return defHttp.post<BaseResultModel>({
    url: Api.addTemplateVersion,
    data: qs.stringify({
      ...id,
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};

// 根据问卷模板id 查询问卷信息
export const getTemplateFindById = (id) => {
  return defHttp.post<QuestionModel>({
    url: Api.getTemplateFindById,
    data: qs.stringify({
      ...id,
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};

// 查询问题列表
export const getQuestionList = (params) => {
  return defHttp.post<BaseResultModel>({
    url: Api.getQuestionList,
    data: qs.stringify({
      ...params,
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};

// 新增问题列表
export const saveQuestionList = (params) => {
  return defHttp.post<BaseResultModel>({
    url: Api.saveQuestionList,
    data: params,
  });
};

// 删除问题列表
export const deleteQuestionById = (params) => {
  return defHttp.post<BaseResultModel>({
    url: Api.deleteQuestionById,
    data: qs.stringify({
      ...params,
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};

// 查询问题选项
export const getQuestionDetail = (params) => {
  return defHttp.post<BaseResultModel>({
    url: Api.getQuestionDetail,
    data: qs.stringify({
      ...params,
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};

// 新增问题选项
export const saveQuestionDetail = (params) => {
  return defHttp.post<BaseResultModel>({
    url: Api.saveQuestionDetail,
    data: params,
  });
};

// 删除问题选项
export const deleteQuestionDetail = (params) => {
  return defHttp.post<BaseResultModel>({
    url: Api.deleteQuestionDetail,
    data: qs.stringify({
      ...params,
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};

// 问卷列表
export const getQuestionnaireList = (params) => {
  return defHttp.post<BaseResultModel>({
    url: Api.getQuestionnaireList,
    data: params,
  });
};

// 按 id 查找问卷回答明细列表
export const findAnswerListById = (params) => {
  return defHttp.post<BaseResultModel>({
    url: Api.findAnswerListById,
    data: qs.stringify({
      ...params,
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};

// 导出问卷
export const exportQuestionnaireList = (params) => {
  return defHttp.post<BaseResultModel>({
    url: Api.exportQuestionnaireList,
    data: params,
  });
};
