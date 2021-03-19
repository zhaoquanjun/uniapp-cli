import { host } from "./request";

export const create_seal = host + "/v1/pass/uploadImgByBase64String"; // 生成印章base64

export const upload_company_seal = host + "/v1/file/saveCompanySeal"; // 保存公司印章

export const upload_person_seal = host + "/v1/file/savePersonalSeal"; // 保存个人印章

export const person_painted_list = host + "/v1/file/getPersonalSealList"; // 获取个人印章列表

export const company_painted_list = host + "/v1/file/getEnterpriseSealList"; // 获取公司印章列表

export const set_default_seal = host + "/v1/file/painted/default"; // 设置为默认印章

export const delete_painted_url = host + "/v1/file/handleSignImageStatus"; // 删除印章

export const upload_painted_wx_url = host + "/v1/pass/uploadFile"; // 上传印章

export const save_personnal_seal = host + "/v1/file/savePersonalSeal"; // 保存印章

module.exports.create_company_cachet_url = host + "/v1/file/create/cachet"; // 绘制公司印章