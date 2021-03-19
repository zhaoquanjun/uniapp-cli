import { host } from "./request";

export const createCompany = host + "/v1/account/create/company"; // 创建企业

export const businessLicenseUpload = host + "/v1/account/apply/auth/businessLicense"; // 上传营业执照解析数据

export const companyAuth = host + "/v1/account/apply/auth/company"; // 法人认证

export const companyHandle = host + "/v1/account/apply/auth/company/handle"; // 经办人认证

export const authFace = host + "/v1/account/auth/face"; // 人脸进行实名认证(只小程序用)

export const applyAuth = host + "/v1/account/apply/auth"; // 人脸进行实名认证(只小程序用)

export const smsSend = host + "/v1/sms/"; // 获取验证码

export const authPhone = host + "/v1/account/auth/phone"; // 个人手机号认证