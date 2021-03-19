import { host } from "./request";

export const get_signal_sign_person_list = host + "/v1/contacts/findContacts"; // 获取签署人列表 个人

export const get_templateList = host + '/v1/contract/template/templateList'; // 获取模版列表

export const get_template_detail = host + '/v1/contract/template/detail'; // 获取模版详情

export const confirm_contract_launch_by_template = host + "/v1/contract/template/launch"; // 通过合同模版发起