import { host } from "./request";

export const get_contract_list = host + "/v2/contract/list";

export const get_all_contract_list = host + "/v2/contract/count"; // 获取所有合同列表数据

export const previewChainImg = host + "/v1/blockchain/contractCert/preview/"; // 预览图片

export const findNoRelatedContractSubject = host + "/v1/contractEvidence/findNoRelatedContractSubject"; // 获取添加证据链关联(证据关联合同)

export const saveEvidenceContractRel = host + "/v1/contractEvidence/saveEvidenceContractRel"; // 确认关联

export const findNoRelatedContractEvidence = host + "/v1/contractEvidence/findNoRelatedContractEvidence"; // 添加证据链关联（合同关联证据）

export const saveContractEvidenceRel = host + "/v1/contractEvidence/saveContractEvidenceRel"; // 保存关联

export const getChainsList = host + "/v1/contractEvidence/findContractEvidence"; // 合同存证预览

export const deleteContractEvidenceRel = host + "/v1/contractEvidence/deleteContractEvidenceRel"; // 取消关联

export const get_contract_detail = host + "/v2/contract/detail"; // 获取合同详情

export const get_contract_launch = host + "/v2/contract/launch";

export const get_signal_sign_person_list = host + "/v1/contacts/findContacts";
