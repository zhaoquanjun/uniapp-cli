import { host } from "./request";

export const get_gift_card_from_wx = host + '/v1/expense/receiveShareGiftCard/'; // 领取礼品卡

export const get_gift_card_status = host + '/v1/expense/transferGiftCardTimeout/'; // 获取礼品卡状态

export const get_accout_info = host + '/v1/account/getCurrentUserOrCompanyInfo'; // 获取账户信息（余额 礼品卡）

export const get_balance_list = host + '/v1/expense/consumptionDetailsList'; // 收入支出明细

export const get_card_list = host + '/v1/expense/couponList'; // 卡片列表

export const buy_card_by_account = host + '/v1/pay/account/pay'; // 账户余额购买

export const get_wx_pay_params = host + '/v1/pay/create/order'; // 获取微信支付参数

export const get_zfb_pay_params = host + '/v1/pay/ali/create/applets/order'; // 获取支付宝支付参数

export const share_card = host + '/v1/expense/shareGiftCard'; // 获取分享礼品卡orderid

export const cancel_hare_card = host + '/v1/expense/cancelShareGiftCard/'; // 撤销分享

export const get_personal_auth_status = host + '/v1/account/user/getAuthUserInfoByNameAndPhone'; // 查询个人/经办人认证状态

export const get_company_auth_status = host + '/v1/account/company/getOneAuthCompanyByName'; // 查询企业认证状态

export const send_by_buy = host + '/v1/expense/batchTransfer'; // 礼品卡购买之后赠送

export const send_card_directive = host + '/v1/expense/transfer'; // 礼品卡直接赠送

export const get_account_and_card_info = host + '/v1/expense/accountBalance' // 获取账户余额以及礼品卡余额

export const get_package_list = host + '/v1/contractExpense/listContractSetMeals' // 获取信息 （余额 礼品卡）

export const buy_package = host + '/v1/contractExpense/purchaseContractSetMeal' // 购买

export const get_pay_url = host + '/v1/pay/icourt/create/pc/scan/order' // 获取H5端的支付中间页url