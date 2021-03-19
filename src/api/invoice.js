import { host } from "./request";

export const get_invoice_data = host + '/v1/invoice/findInvoiceList'; // 获取发票申请数据

export const get_invouce_info = host + '/v1/invoice/findInvoiceTitle'; // 获取发票信息

export const get_seller_companyName = host + '/v2/contract/findSponsor'; // 获取开票方信息

export const apply_invoice = host + '/v1/invoice/applyInvoice'; // 申请开票

export const get_pay_info = host + '/v2/contract/findPayInfoBySubjectId'; // 获取支付信息

export const get_pay_detail = host + '/v1/pay/info/payDetail'; // 获取发票详情信息