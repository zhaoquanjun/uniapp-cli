import { host } from "./request";

export const get_phone_wx_code = host + "/v1/account/get/phone"; // 获取用户注册信息以及手机号openid uniid 等信息 微信

export const get_phone_zfb_code = host + "/v1/account/get/phone"; // 获取用户注册信息以及手机号openid uniid 等信息 支付宝

export const decode_phone = host + "/v1/account/decode/wxapp/phone"; // 获取手机以及微信信息

export const get_user_info = host + "/v1/account/user/info"; // 获取用户信息

export const upload_local = host + "/v1/account/update/local"; // 更新本地信息

export const companyList = host + "/v1/account/apply/auth/company/list"; // 企业列表

export const get_contract_uploadFile = host + "/v2/contract/uploadFile"; // 上传合同文件

export const update_count = host + "/v1/account/getCurrentUserOrCompanyInfo"; // 更新与自己相关合同数量信息

export const login_url = host + "/v1/account/login/wxapp"; // 微信登录

export const get_register_sms_code_url = host + "/v1/sms"; // 获取验证码

export const pc_login = host + '/v1/account/login'; // pc版登录

export const update_usericon = host + "/v1/account/update/icon";

export const get_evidence_affirm_count = host + "/v1/evidence/affirm/count";

export const company_message = host + "/v1/account/company/getOneAuthCompanyByName"; // 通过公司名称获取公司认证状态

export const person_message = host + "/v1/account/user/getAuthUserByNameAndPhone"; // 通过姓名电话获取个人认证状态


// ******************** h5
export const get_zfb_phone = host + "/v1/account/alipay/decryptPhoneNum"

export const zfb_login = host + "/v1/account/login/aliPayApp"

// ******************** h5
export const h5_get_yzm_code = host + "/v1/sms/"; // 获取验证码

export const h5_login = host + "/v1/account/login"; // 登录

