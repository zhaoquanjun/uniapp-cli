import { host } from "./request";

export const get_pay_template_list = host + '/v1/pay/template/list'; // 获取支付模版列表

export const get_sell_pay_QrCode = host + "/v1/pay/template/use"; // 获取模版发起收款码

export const get_pay_QrCode = host + "/v1/pay/info/createQrCodePost"; // 合同相关支付 - 销售即开票 - 收款