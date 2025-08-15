
import {gql} from "@apollo/client"

import CaptchaModel from './CaptchaModel'
import CaptchaVerify from './CaptchaVerify'
import Response from './Response'
import VacancyOrderAdd from './VacancyOrderAdd'
import main_admin_iblock_element_delete from './main_admin_iblock_element_delete'
import main_admin_iblock_element_set_active from './main_admin_iblock_element_set_active'
import NoticeSyncReaded from './NoticeSyncReaded'
import ServiceReviewAdd from './ServiceReviewAdd'
import ReviewOrderAdd from './ReviewOrderAdd'
import ReviewProductAdd from './ReviewProductAdd'
import sale_pub_buyer_company_default from './sale_pub_buyer_company_default'
import sale_pub_buyer_company_delete from './sale_pub_buyer_company_delete'
import sale_pub_buyer_company_save from './sale_pub_buyer_company_save'
import sale_pub_fav_add from './sale_pub_fav_add'
import sale_pub_fav_clear from './sale_pub_fav_clear'
import sale_pub_fav_remove from './sale_pub_fav_remove'
import OrderCancel from './OrderCancel'
import Order from './Order'
import OrderProfileDefault from './OrderProfileDefault'
import OrderProfileDelete from './OrderProfileDelete'
import OrderProfile from './OrderProfile'
import VOrderApply from './VOrderApply'
import VOrderBasket from './VOrderBasket'
import VOrderCoupon from './VOrderCoupon'
import VorderResult from './VorderResult'
import VOrderReserve from './VOrderReserve'
import VOrderSubmit from './VOrderSubmit'
import Vorder from './Vorder'
import UserProfileSave from './UserProfileSave'
import AppClient from './AppClient'
import MutationLoginConfirm from './MutationLoginConfirm'
import MutationLoginRequest from './MutationLoginRequest'
import MutationLoginStart from './MutationLoginStart'
import MutationLogout from './MutationLogout'
import UserProfileAllFilled from './UserProfileAllFilled'
import MutationUserBirthday from './MutationUserBirthday'
import MutationUserChild from './MutationUserChild'
import MutationUserEmail from './MutationUserEmail'
import MutationUserName from './MutationUserName'
export default gql`

fragment Mutation on Mutation {
  app_callback
  app_send_promocode_first_order
  app_subscribe_promo
  captcha_draggable_create {
    ...CaptchaModel
  }
  captcha_draggable_verify {
    ...CaptchaVerify
  }
  catalog_fav_add
  catalog_fav_clear
  catalog_fav_remove
  catalog_product_order {
    ...Response
  }
  company_pub_vacancy_order {
    ...VacancyOrderAdd
  }
  main_admin_iblock_element_delete {
    ...main_admin_iblock_element_delete
  }
  main_admin_iblock_element_set_active {
    ...main_admin_iblock_element_set_active
  }
  notice_pub_push_send_queue
  notice_pub_push_update_token
  notice_pub_sync_readed {
    ...NoticeSyncReaded
  }
  review_pub_service_review {
    ...ServiceReviewAdd
  }
  review_pub_user_order {
    ...ReviewOrderAdd
  }
  review_pub_user_product {
    ...ReviewProductAdd
  }
  sale_pub_buyer_company_default {
    ...sale_pub_buyer_company_default
  }
  sale_pub_buyer_company_delete {
    ...sale_pub_buyer_company_delete
  }
  sale_pub_buyer_company_save {
    ...sale_pub_buyer_company_save
  }
  sale_pub_fav_add {
    ...sale_pub_fav_add
  }
  sale_pub_fav_clear {
    ...sale_pub_fav_clear
  }
  sale_pub_fav_remove {
    ...sale_pub_fav_remove
  }
  sale_pub_order_cancel {
    ...OrderCancel
  }
  sale_pub_order_repeat {
    ...Order
  }
  sale_pub_paycard_default
  sale_pub_paycard_delete
  sale_pub_profile_default {
    ...OrderProfileDefault
  }
  sale_pub_profile_delete {
    ...OrderProfileDelete
  }
  sale_pub_profile_save {
    ...OrderProfile
  }
  sale_pub_profile_save_mobile {
    ...OrderProfile
  }
  sale_pub_vorder_apply {
    ...VOrderApply
  }
  sale_pub_vorder_basket {
    ...VOrderBasket
  }
  sale_pub_vorder_coupon {
    ...VOrderCoupon
  }
  sale_pub_vorder_new {
    ...VorderResult
  }
  sale_pub_vorder_reserve {
    ...VOrderReserve
  }
  sale_pub_vorder_submit {
    ...VOrderSubmit
  }
  sale_pub_vorder_sync {
    ...Vorder
  }
  subscribe_subscribeEmail {
    ...Response
  }
  user_logout
  user_profile_save {
    ...UserProfileSave
  }
  user_pub_app_client {
    ...AppClient
  }
  user_pub_app_client_update_test
  user_pub_create_sa
  user_pub_login_confirm {
    ...MutationLoginConfirm
  }
  user_pub_login_request {
    ...MutationLoginRequest
  }
  user_pub_login_start {
    ...MutationLoginStart
  }
  user_pub_logout {
    ...MutationLogout
  }
  user_pub_profile_all_filled {
    ...UserProfileAllFilled
  }
  user_pub_profile_birthday {
    ...MutationUserBirthday
  }
  user_pub_profile_child {
    ...MutationUserChild
  }
  user_pub_profile_email {
    ...MutationUserEmail
  }
  user_pub_profile_name {
    ...MutationUserName
  }
  websocket_ping
}
${CaptchaModel}
${CaptchaVerify}
${Response}
${VacancyOrderAdd}
${main_admin_iblock_element_delete}
${main_admin_iblock_element_set_active}
${NoticeSyncReaded}
${ServiceReviewAdd}
${ReviewOrderAdd}
${ReviewProductAdd}
${sale_pub_buyer_company_default}
${sale_pub_buyer_company_delete}
${sale_pub_buyer_company_save}
${sale_pub_fav_add}
${sale_pub_fav_clear}
${sale_pub_fav_remove}
${OrderCancel}
${Order}
${OrderProfileDefault}
${OrderProfileDelete}
${OrderProfile}
${VOrderApply}
${VOrderBasket}
${VOrderCoupon}
${VorderResult}
${VOrderReserve}
${VOrderSubmit}
${Vorder}
${UserProfileSave}
${AppClient}
${MutationLoginConfirm}
${MutationLoginRequest}
${MutationLoginStart}
${MutationLogout}
${UserProfileAllFilled}
${MutationUserBirthday}
${MutationUserChild}
${MutationUserEmail}
${MutationUserName}
`
