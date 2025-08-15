export type Maybe<T> = T;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Json: { input: any; output: any; }
};

export type ActionMobile = {
  __typename?: 'ActionMobile';
  addBacklink?: Maybe<Scalars['Boolean']['output']>;
  addSession?: Maybe<Scalars['Boolean']['output']>;
  await?: Maybe<Scalars['Boolean']['output']>;
  code?: Maybe<Scalars['String']['output']>;
  replace?: Maybe<Scalars['Boolean']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  titleAuto?: Maybe<Scalars['Boolean']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type ActionWeb = {
  __typename?: 'ActionWeb';
  code?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type AppClient = {
  __typename?: 'AppClient';
  ACTIONS?: Maybe<Scalars['Json']['output']>;
  CLIENT_ID?: Maybe<Scalars['String']['output']>;
  CURRENT_SESSION_ID?: Maybe<Scalars['String']['output']>;
  DEBUG_PARAMS?: Maybe<AppClientDebugParams>;
  ID: Scalars['Int']['output'];
  MOBILE_PUSH_TOKEN?: Maybe<Scalars['String']['output']>;
  SESSION_ID?: Maybe<Scalars['String']['output']>;
  TOKEN?: Maybe<Scalars['String']['output']>;
  USER_ID?: Maybe<Scalars['Int']['output']>;
  WEB_PUSH_TOKEN?: Maybe<Scalars['String']['output']>;
};


export type AppClientActionsArgs = {
  detail?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
};

export type AppClientDebugParams = {
  __typename?: 'AppClientDebugParams';
  eventsTransport?: Maybe<Scalars['Json']['output']>;
};

export type Basket = {
  __typename?: 'Basket';
  BASE_PRICE?: Maybe<Scalars['Float']['output']>;
  COUNT?: Maybe<Scalars['Int']['output']>;
  HASH?: Maybe<Scalars['String']['output']>;
  ITEMS?: Maybe<Array<Maybe<BasketItem>>>;
  MIN_PRICE?: Maybe<Scalars['Float']['output']>;
  MIN_PRICE_REACHED?: Maybe<Scalars['Boolean']['output']>;
  OFFERS?: Maybe<Array<Maybe<SpecialOffer>>>;
  PRICE?: Maybe<Scalars['Float']['output']>;
  QUANTITY?: Maybe<Scalars['Float']['output']>;
  SYNCED?: Maybe<Scalars['Boolean']['output']>;
  TS?: Maybe<Scalars['String']['output']>;
  WEIGHT?: Maybe<Scalars['Float']['output']>;
};

export type BasketBuildItem = {
  __typename?: 'BasketBuildItem';
  ELEMENT?: Maybe<ProductElement>;
  PRODUCT_ID?: Maybe<Scalars['Int']['output']>;
  QUANTITY?: Maybe<Scalars['Int']['output']>;
};

export type BasketItem = {
  __typename?: 'BasketItem';
  BASE_PRICE?: Maybe<Scalars['Float']['output']>;
  BUILD?: Maybe<Array<Maybe<BasketBuildItem>>>;
  CLIENT_ID?: Maybe<Scalars['String']['output']>;
  COMMENT?: Maybe<Scalars['String']['output']>;
  DESC?: Maybe<Scalars['String']['output']>;
  DISABLE?: Maybe<Scalars['Boolean']['output']>;
  DISABLE_REASON?: Maybe<Scalars['String']['output']>;
  ELEMENT?: Maybe<ProductElement>;
  FINAL_PRICE?: Maybe<Scalars['Float']['output']>;
  FINAL_PRICE_BASE?: Maybe<Scalars['Float']['output']>;
  ID?: Maybe<Scalars['Int']['output']>;
  INPUT_PROPS_HASH?: Maybe<Scalars['String']['output']>;
  MEASURE_NAME?: Maybe<Scalars['String']['output']>;
  NAME?: Maybe<Scalars['String']['output']>;
  ORDER_ID?: Maybe<Scalars['Int']['output']>;
  PAID?: Maybe<Scalars['Boolean']['output']>;
  PRICE?: Maybe<Scalars['Float']['output']>;
  PRICE_BASE?: Maybe<Scalars['Float']['output']>;
  PRODUCT_ID?: Maybe<Scalars['Int']['output']>;
  PROPS?: Maybe<Array<Maybe<BasketItemProp>>>;
  QUANTITY?: Maybe<Scalars['Float']['output']>;
};

export type BasketItemProp = {
  __typename?: 'BasketItemProp';
  CODE?: Maybe<Scalars['String']['output']>;
  NAME?: Maybe<Scalars['String']['output']>;
  VALUE?: Maybe<Scalars['Json']['output']>;
  XML_ID?: Maybe<Scalars['String']['output']>;
};

export type BonusLevelElement = {
  __typename?: 'BonusLevelElement';
  ACCUMULATION_PERCENT?: Maybe<Scalars['String']['output']>;
  CODE?: Maybe<Scalars['String']['output']>;
  COLOR?: Maybe<Scalars['String']['output']>;
  ID?: Maybe<Scalars['Int']['output']>;
  MAX_USE_PERCENT?: Maybe<Scalars['String']['output']>;
  MONTH_SPENT_MAX?: Maybe<Scalars['Int']['output']>;
  MONTH_SPENT_MIN?: Maybe<Scalars['Int']['output']>;
  NAME?: Maybe<Scalars['String']['output']>;
  ORDERS_SUMM?: Maybe<Scalars['String']['output']>;
};

export type BuyerCompanyElement = {
  __typename?: 'BuyerCompanyElement';
  ACTIONS?: Maybe<Scalars['Json']['output']>;
  ACTIVE?: Maybe<Scalars['Boolean']['output']>;
  ACTIVE_FROM?: Maybe<Scalars['Json']['output']>;
  ADMIN_URL?: Maybe<Scalars['Json']['output']>;
  CODE?: Maybe<Scalars['String']['output']>;
  CREATED?: Maybe<Scalars['Json']['output']>;
  DETAIL_IMAGE?: Maybe<Image>;
  DETAIL_TEXT?: Maybe<Scalars['Json']['output']>;
  IBLOCK_CODE?: Maybe<Scalars['Int']['output']>;
  IBLOCK_ID?: Maybe<Scalars['Int']['output']>;
  IBLOCK_SECTION_ID?: Maybe<Scalars['Int']['output']>;
  IBLOCK_SECTION_IDS: Array<Maybe<Scalars['Int']['output']>>;
  ID: Scalars['Int']['output'];
  LIST_IMAGE?: Maybe<Image>;
  META?: Maybe<ElementMeta>;
  NAME?: Maybe<Scalars['String']['output']>;
  PATH?: Maybe<Array<Maybe<Section>>>;
  PREVIEW_TEXT?: Maybe<Scalars['Json']['output']>;
  PROPS?: Maybe<Array<Maybe<ElementProp>>>;
  PROPS_VALUES?: Maybe<Array<Maybe<ElementProp>>>;
  RATING?: Maybe<Scalars['Float']['output']>;
  RATING_VOTES?: Maybe<Scalars['Int']['output']>;
  ROOT_SECTION?: Maybe<Section>;
  SECTION?: Maybe<Section>;
  SECTIONS?: Maybe<Array<Maybe<Section>>>;
  SORT?: Maybe<Scalars['Int']['output']>;
  URL?: Maybe<Scalars['String']['output']>;
};


export type BuyerCompanyElementActionsArgs = {
  detail?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
};


export type BuyerCompanyElementActiveFromArgs = {
  format?: InputMaybe<Scalars['String']['input']>;
  formatDefault?: InputMaybe<Scalars['Boolean']['input']>;
  withTime?: InputMaybe<Scalars['Boolean']['input']>;
};


export type BuyerCompanyElementCreatedArgs = {
  format?: InputMaybe<Scalars['String']['input']>;
  formatDefault?: InputMaybe<Scalars['Boolean']['input']>;
  withTime?: InputMaybe<Scalars['Boolean']['input']>;
};


export type BuyerCompanyElementDetailTextArgs = {
  format?: InputMaybe<Scalars['Boolean']['input']>;
};


export type BuyerCompanyElementPreviewTextArgs = {
  format?: InputMaybe<Scalars['Boolean']['input']>;
};


export type BuyerCompanyElementPropsArgs = {
  detail?: InputMaybe<Scalars['Boolean']['input']>;
  includeEmptyValues?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
};


export type BuyerCompanyElementPropsValuesArgs = {
  detail?: InputMaybe<Scalars['Boolean']['input']>;
  includeEmptyValues?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
};

export type CaptchaInput = {
  ANSWER?: InputMaybe<Scalars['String']['input']>;
  PROVIDER?: InputMaybe<Scalars['String']['input']>;
  SID?: InputMaybe<Scalars['String']['input']>;
  VALUE?: InputMaybe<Scalars['Json']['input']>;
};

export type CaptchaModel = {
  __typename?: 'CaptchaModel';
  ACTIONS?: Maybe<Scalars['Json']['output']>;
  DATA?: Maybe<Scalars['Json']['output']>;
  ID: Scalars['Int']['output'];
  PROVIDER?: Maybe<Scalars['String']['output']>;
  SID?: Maybe<Scalars['String']['output']>;
};


export type CaptchaModelActionsArgs = {
  detail?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
};

export type CaptchaVerify = {
  __typename?: 'CaptchaVerify';
  id?: Maybe<Scalars['String']['output']>;
  reload?: Maybe<Scalars['Boolean']['output']>;
  state?: Maybe<ResponseState>;
  status?: Maybe<CaptchaVerifyStatusEnum>;
};

export enum CaptchaVerifyStatusEnum {
  Error = 'error',
  Info = 'info',
  RateLimit = 'rate_limit',
  Success = 'success',
  Warning = 'warning',
  WrongCaptcha = 'wrong_captcha'
}

export type CatalogFav = {
  __typename?: 'CatalogFav';
  ACTIONS?: Maybe<Scalars['Json']['output']>;
  BASKET_HASH?: Maybe<Scalars['String']['output']>;
  BASKET_ITEM?: Maybe<BasketItem>;
  ELEMENT_ID?: Maybe<Scalars['Int']['output']>;
  IBLOCK_ID?: Maybe<Scalars['Int']['output']>;
  ID: Scalars['Int']['output'];
  SALES_COUNT?: Maybe<Scalars['Int']['output']>;
  TYPE?: Maybe<Scalars['String']['output']>;
  TYPE_NAME?: Maybe<Scalars['String']['output']>;
  USER_ID?: Maybe<Scalars['Int']['output']>;
};


export type CatalogFavActionsArgs = {
  detail?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
};

export type ClientEmit = {
  __typename?: 'ClientEmit';
  body?: Maybe<Scalars['String']['output']>;
  cls?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Json']['output'];
  eventData?: Maybe<Scalars['Json']['output']>;
  eventGroup?: Maybe<Scalars['String']['output']>;
  eventName?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  targetClientId?: Maybe<Scalars['String']['output']>;
  targetUserId?: Maybe<Scalars['Int']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};


export type ClientEmitCreatedAtArgs = {
  format?: InputMaybe<Scalars['String']['input']>;
  formatDefault?: InputMaybe<Scalars['Boolean']['input']>;
  withTime?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ClientNotice = {
  __typename?: 'ClientNotice';
  actionsEmitMobile?: Maybe<Array<Maybe<ActionMobile>>>;
  actionsMobile?: Maybe<Array<Maybe<MenuItemMobile>>>;
  actionsWeb?: Maybe<Array<Maybe<MenuItem>>>;
  body?: Maybe<Scalars['String']['output']>;
  bodyHtml?: Maybe<Scalars['String']['output']>;
  cls?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Json']['output'];
  eventData?: Maybe<Scalars['Json']['output']>;
  eventGroup?: Maybe<Scalars['String']['output']>;
  eventName?: Maybe<Scalars['String']['output']>;
  haveBody?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['Int']['output'];
  image?: Maybe<Scalars['String']['output']>;
  isReaded?: Maybe<Scalars['Boolean']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  offerId?: Maybe<Scalars['Int']['output']>;
  showAs?: Maybe<Scalars['String']['output']>;
  targetClientId?: Maybe<Scalars['String']['output']>;
  targetCode?: Maybe<Scalars['String']['output']>;
  targetUserId?: Maybe<Scalars['Int']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};


export type ClientNoticeCreatedAtArgs = {
  format?: InputMaybe<Scalars['String']['input']>;
  formatDefault?: InputMaybe<Scalars['Boolean']['input']>;
  withTime?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Command = {
  __typename?: 'Command';
  code?: Maybe<Scalars['String']['output']>;
  confirm?: Maybe<Scalars['Boolean']['output']>;
  params?: Maybe<Scalars['Json']['output']>;
  path?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

export type CompanyContact = {
  __typename?: 'CompanyContact';
  ACTIONS?: Maybe<Scalars['Json']['output']>;
  ACTIVE?: Maybe<Scalars['Boolean']['output']>;
  ACTIVE_FROM?: Maybe<Scalars['Json']['output']>;
  ADMIN_URL?: Maybe<Scalars['Json']['output']>;
  CODE?: Maybe<Scalars['String']['output']>;
  CREATED?: Maybe<Scalars['Json']['output']>;
  DETAIL_IMAGE?: Maybe<Image>;
  DETAIL_TEXT?: Maybe<Scalars['Json']['output']>;
  IBLOCK_CODE?: Maybe<Scalars['Int']['output']>;
  IBLOCK_ID?: Maybe<Scalars['Int']['output']>;
  IBLOCK_SECTION_ID?: Maybe<Scalars['Int']['output']>;
  IBLOCK_SECTION_IDS: Array<Maybe<Scalars['Int']['output']>>;
  ID: Scalars['Int']['output'];
  LIST_IMAGE?: Maybe<Image>;
  META?: Maybe<ElementMeta>;
  NAME?: Maybe<Scalars['String']['output']>;
  PATH?: Maybe<Array<Maybe<Section>>>;
  PREVIEW_TEXT?: Maybe<Scalars['Json']['output']>;
  PROPS?: Maybe<Array<Maybe<ElementProp>>>;
  PROPS_VALUES?: Maybe<Array<Maybe<ElementProp>>>;
  PROP_EMAIL?: Maybe<Scalars['String']['output']>;
  PROP_JOB?: Maybe<Scalars['String']['output']>;
  PROP_OFFICE?: Maybe<Scalars['String']['output']>;
  PROP_PHONE?: Maybe<Scalars['String']['output']>;
  PROP_PHONE_WHATSAPP?: Maybe<Scalars['String']['output']>;
  RATING?: Maybe<Scalars['Float']['output']>;
  RATING_VOTES?: Maybe<Scalars['Int']['output']>;
  ROOT_SECTION?: Maybe<Section>;
  SECTION?: Maybe<Section>;
  SECTIONS?: Maybe<Array<Maybe<Section>>>;
  SORT?: Maybe<Scalars['Int']['output']>;
  URL?: Maybe<Scalars['String']['output']>;
};


export type CompanyContactActionsArgs = {
  detail?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
};


export type CompanyContactActiveFromArgs = {
  format?: InputMaybe<Scalars['String']['input']>;
  formatDefault?: InputMaybe<Scalars['Boolean']['input']>;
  withTime?: InputMaybe<Scalars['Boolean']['input']>;
};


export type CompanyContactCreatedArgs = {
  format?: InputMaybe<Scalars['String']['input']>;
  formatDefault?: InputMaybe<Scalars['Boolean']['input']>;
  withTime?: InputMaybe<Scalars['Boolean']['input']>;
};


export type CompanyContactDetailTextArgs = {
  format?: InputMaybe<Scalars['Boolean']['input']>;
};


export type CompanyContactPreviewTextArgs = {
  format?: InputMaybe<Scalars['Boolean']['input']>;
};


export type CompanyContactPropsArgs = {
  detail?: InputMaybe<Scalars['Boolean']['input']>;
  includeEmptyValues?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
};


export type CompanyContactPropsValuesArgs = {
  detail?: InputMaybe<Scalars['Boolean']['input']>;
  includeEmptyValues?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
};

export type CompanyContactConnection = {
  __typename?: 'CompanyContactConnection';
  info?: Maybe<QueryInfo>;
  nodes?: Maybe<Array<Maybe<CompanyContact>>>;
};

export type CompanyOffice = {
  __typename?: 'CompanyOffice';
  ACTIONS?: Maybe<Scalars['Json']['output']>;
  ACTIVE?: Maybe<Scalars['Boolean']['output']>;
  ACTIVE_FROM?: Maybe<Scalars['Json']['output']>;
  ADMIN_URL?: Maybe<Scalars['Json']['output']>;
  CODE?: Maybe<Scalars['String']['output']>;
  COORDS?: Maybe<Coordinates>;
  CREATED?: Maybe<Scalars['Json']['output']>;
  DEBUG?: Maybe<Scalars['Json']['output']>;
  DETAIL_IMAGE?: Maybe<Image>;
  DETAIL_TEXT?: Maybe<Scalars['Json']['output']>;
  DISABLE?: Maybe<Scalars['Boolean']['output']>;
  DISABLE_REASON?: Maybe<Scalars['String']['output']>;
  DISTANCE?: Maybe<Scalars['Int']['output']>;
  IBLOCK_CODE?: Maybe<Scalars['Int']['output']>;
  IBLOCK_ID?: Maybe<Scalars['Int']['output']>;
  IBLOCK_SECTION_ID?: Maybe<Scalars['Int']['output']>;
  IBLOCK_SECTION_IDS: Array<Maybe<Scalars['Int']['output']>>;
  ID: Scalars['Int']['output'];
  LIST_IMAGE?: Maybe<Image>;
  META?: Maybe<ElementMeta>;
  NAME?: Maybe<Scalars['String']['output']>;
  PATH?: Maybe<Array<Maybe<Section>>>;
  PREVIEW_TEXT?: Maybe<Scalars['Json']['output']>;
  PROPS?: Maybe<Array<Maybe<ElementProp>>>;
  PROPS_VALUES?: Maybe<Array<Maybe<ElementProp>>>;
  RATING?: Maybe<Scalars['Float']['output']>;
  RATING_VOTES?: Maybe<Scalars['Int']['output']>;
  ROLES?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  ROOT_SECTION?: Maybe<Section>;
  SECTION?: Maybe<Section>;
  SECTIONS?: Maybe<Array<Maybe<Section>>>;
  SORT?: Maybe<Scalars['Int']['output']>;
  URL?: Maybe<Scalars['String']['output']>;
  WORKTIME?: Maybe<Scalars['String']['output']>;
  WORKTIME_NOW?: Maybe<Scalars['Boolean']['output']>;
  WORKTIME_TODAY?: Maybe<Scalars['Json']['output']>;
  WORKTIME_WEEK?: Maybe<Scalars['Json']['output']>;
};


export type CompanyOfficeActionsArgs = {
  detail?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
};


export type CompanyOfficeActiveFromArgs = {
  format?: InputMaybe<Scalars['String']['input']>;
  formatDefault?: InputMaybe<Scalars['Boolean']['input']>;
  withTime?: InputMaybe<Scalars['Boolean']['input']>;
};


export type CompanyOfficeCreatedArgs = {
  format?: InputMaybe<Scalars['String']['input']>;
  formatDefault?: InputMaybe<Scalars['Boolean']['input']>;
  withTime?: InputMaybe<Scalars['Boolean']['input']>;
};


export type CompanyOfficeDetailTextArgs = {
  format?: InputMaybe<Scalars['Boolean']['input']>;
};


export type CompanyOfficePreviewTextArgs = {
  format?: InputMaybe<Scalars['Boolean']['input']>;
};


export type CompanyOfficePropsArgs = {
  detail?: InputMaybe<Scalars['Boolean']['input']>;
  includeEmptyValues?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
};


export type CompanyOfficePropsValuesArgs = {
  detail?: InputMaybe<Scalars['Boolean']['input']>;
  includeEmptyValues?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
};

export type CompanyOfficeConnection = {
  __typename?: 'CompanyOfficeConnection';
  info?: Maybe<QueryInfo>;
  nodes?: Maybe<Array<Maybe<CompanyOffice>>>;
};

export type CompanyOfficeFilter = {
  ACTIVE?: InputMaybe<Scalars['Boolean']['input']>;
  CODE?: InputMaybe<StringFilterInput>;
  IBLOCK_ID?: InputMaybe<Scalars['Int']['input']>;
  ID?: InputMaybe<IntFilterInput>;
  INCLUDE_SUBSECTIONS?: InputMaybe<Scalars['Boolean']['input']>;
  NAME?: InputMaybe<StringFilterInput>;
  ROLES_XMLID?: InputMaybe<StringFilterInput>;
  SEARCH?: InputMaybe<StringFilterInput>;
  SECTION_CODE?: InputMaybe<StringFilterInput>;
  SECTION_CODE_PATH?: InputMaybe<StringFilterInput>;
  SECTION_ID?: InputMaybe<IntFilterInput>;
};

export type CompanyVacancy = {
  __typename?: 'CompanyVacancy';
  ACTIONS?: Maybe<Scalars['Json']['output']>;
  ACTIVE?: Maybe<Scalars['Boolean']['output']>;
  ACTIVE_FROM?: Maybe<Scalars['Json']['output']>;
  ADMIN_URL?: Maybe<Scalars['Json']['output']>;
  CODE?: Maybe<Scalars['String']['output']>;
  CREATED?: Maybe<Scalars['Json']['output']>;
  DETAIL_IMAGE?: Maybe<Image>;
  DETAIL_TEXT?: Maybe<Scalars['Json']['output']>;
  IBLOCK_CODE?: Maybe<Scalars['Int']['output']>;
  IBLOCK_ID?: Maybe<Scalars['Int']['output']>;
  IBLOCK_SECTION_ID?: Maybe<Scalars['Int']['output']>;
  IBLOCK_SECTION_IDS: Array<Maybe<Scalars['Int']['output']>>;
  ID: Scalars['Int']['output'];
  LIST_IMAGE?: Maybe<Image>;
  META?: Maybe<ElementMeta>;
  NAME?: Maybe<Scalars['String']['output']>;
  PATH?: Maybe<Array<Maybe<Section>>>;
  PREVIEW_TEXT?: Maybe<Scalars['Json']['output']>;
  PROPS?: Maybe<Array<Maybe<ElementProp>>>;
  PROPS_VALUES?: Maybe<Array<Maybe<ElementProp>>>;
  RATING?: Maybe<Scalars['Float']['output']>;
  RATING_VOTES?: Maybe<Scalars['Int']['output']>;
  ROOT_SECTION?: Maybe<Section>;
  SECTION?: Maybe<Section>;
  SECTIONS?: Maybe<Array<Maybe<Section>>>;
  SORT?: Maybe<Scalars['Int']['output']>;
  URL?: Maybe<Scalars['String']['output']>;
};


export type CompanyVacancyActionsArgs = {
  detail?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
};


export type CompanyVacancyActiveFromArgs = {
  format?: InputMaybe<Scalars['String']['input']>;
  formatDefault?: InputMaybe<Scalars['Boolean']['input']>;
  withTime?: InputMaybe<Scalars['Boolean']['input']>;
};


export type CompanyVacancyCreatedArgs = {
  format?: InputMaybe<Scalars['String']['input']>;
  formatDefault?: InputMaybe<Scalars['Boolean']['input']>;
  withTime?: InputMaybe<Scalars['Boolean']['input']>;
};


export type CompanyVacancyDetailTextArgs = {
  format?: InputMaybe<Scalars['Boolean']['input']>;
};


export type CompanyVacancyPreviewTextArgs = {
  format?: InputMaybe<Scalars['Boolean']['input']>;
};


export type CompanyVacancyPropsArgs = {
  detail?: InputMaybe<Scalars['Boolean']['input']>;
  includeEmptyValues?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
};


export type CompanyVacancyPropsValuesArgs = {
  detail?: InputMaybe<Scalars['Boolean']['input']>;
  includeEmptyValues?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
};

export type Condition = {
  __typename?: 'Condition';
  eq?: Maybe<Scalars['Json']['output']>;
  gt?: Maybe<Scalars['Json']['output']>;
  lt?: Maybe<Scalars['Json']['output']>;
  path?: Maybe<Scalars['String']['output']>;
};

export type ConstructorBuild = {
  __typename?: 'ConstructorBuild';
  CONSTRUCTOR_CODE?: Maybe<Scalars['String']['output']>;
  CONSTRUCTOR_URL?: Maybe<Scalars['String']['output']>;
  SOSTAV?: Maybe<Array<Maybe<ConstructorBuildItem>>>;
};

export type ConstructorBuildItem = {
  __typename?: 'ConstructorBuildItem';
  ELEMENT?: Maybe<ConstructorElement>;
  ELEMENT_ID?: Maybe<Scalars['Int']['output']>;
  QUANTITY?: Maybe<Scalars['Int']['output']>;
};

export type ConstructorElement = {
  __typename?: 'ConstructorElement';
  ACTIONS?: Maybe<Scalars['Json']['output']>;
  ACTIVE?: Maybe<Scalars['Boolean']['output']>;
  ACTIVE_FROM?: Maybe<Scalars['Json']['output']>;
  ADDITIVES?: Maybe<Array<Maybe<ProductElement>>>;
  ADMIN_URL?: Maybe<Scalars['Json']['output']>;
  AVAILABLE?: Maybe<Scalars['Boolean']['output']>;
  BUILD?: Maybe<ConstructorBuild>;
  CODE?: Maybe<Scalars['String']['output']>;
  CREATED?: Maybe<Scalars['Json']['output']>;
  DETAIL_IMAGE?: Maybe<Image>;
  DETAIL_TEXT?: Maybe<Scalars['Json']['output']>;
  FAV?: Maybe<CatalogFav>;
  FLAGS?: Maybe<Array<Maybe<ProductFlag>>>;
  GIFTS?: Maybe<Array<Maybe<ProductGift>>>;
  IBLOCK_CODE?: Maybe<Scalars['Int']['output']>;
  IBLOCK_ID?: Maybe<Scalars['Int']['output']>;
  IBLOCK_SECTION_ID?: Maybe<Scalars['Int']['output']>;
  IBLOCK_SECTION_IDS: Array<Maybe<Scalars['Int']['output']>>;
  ID: Scalars['Int']['output'];
  IS_SALE_SPECIAL?: Maybe<Scalars['Boolean']['output']>;
  LIST_IMAGE?: Maybe<Image>;
  MEASURE?: Maybe<ProductMeasure>;
  META?: Maybe<ElementMeta>;
  NAME?: Maybe<Scalars['String']['output']>;
  NOT_AVAILABLE_REASON?: Maybe<Scalars['Json']['output']>;
  OFFERS?: Maybe<Array<Maybe<ProductElement>>>;
  OFFER_PARENT_ELEMENT?: Maybe<ProductElement>;
  PARENT?: Maybe<ProductElement>;
  PATH?: Maybe<Array<Maybe<ConstructorSection>>>;
  PREVIEW_TEXT?: Maybe<Scalars['Json']['output']>;
  PRICE?: Maybe<ProductPrice>;
  PROPS?: Maybe<Array<Maybe<ElementProp>>>;
  PROPS_VALUES?: Maybe<Array<Maybe<ElementProp>>>;
  RATING?: Maybe<Scalars['Float']['output']>;
  RATING_VOTES?: Maybe<Scalars['Int']['output']>;
  REQUIRED_MIN_PRICE?: Maybe<Scalars['Int']['output']>;
  ROOT_SECTION?: Maybe<ConstructorSection>;
  SALES_COUNT?: Maybe<Scalars['Int']['output']>;
  SALE_TIME?: Maybe<Scalars['Json']['output']>;
  SECTION?: Maybe<ConstructorSection>;
  SECTIONS?: Maybe<Array<Maybe<ConstructorSection>>>;
  SORT?: Maybe<Scalars['Int']['output']>;
  TAGS?: Maybe<Array<Maybe<ProductTagElement>>>;
  UPSALE_ELEMENTS: Array<Maybe<Scalars['Int']['output']>>;
  UPSALE_SECTIONS: Array<Maybe<Scalars['Int']['output']>>;
  URL?: Maybe<Scalars['String']['output']>;
  WEIGHT?: Maybe<Scalars['Int']['output']>;
};


export type ConstructorElementActionsArgs = {
  detail?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
};


export type ConstructorElementActiveFromArgs = {
  format?: InputMaybe<Scalars['String']['input']>;
  formatDefault?: InputMaybe<Scalars['Boolean']['input']>;
  withTime?: InputMaybe<Scalars['Boolean']['input']>;
};


export type ConstructorElementCreatedArgs = {
  format?: InputMaybe<Scalars['String']['input']>;
  formatDefault?: InputMaybe<Scalars['Boolean']['input']>;
  withTime?: InputMaybe<Scalars['Boolean']['input']>;
};


export type ConstructorElementDetailTextArgs = {
  format?: InputMaybe<Scalars['Boolean']['input']>;
};


export type ConstructorElementPreviewTextArgs = {
  format?: InputMaybe<Scalars['Boolean']['input']>;
};


export type ConstructorElementPropsArgs = {
  detail?: InputMaybe<Scalars['Boolean']['input']>;
  includeEmptyValues?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
};


export type ConstructorElementPropsValuesArgs = {
  detail?: InputMaybe<Scalars['Boolean']['input']>;
  includeEmptyValues?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
};

export type ConstructorSection = {
  __typename?: 'ConstructorSection';
  BUILD_IBLOCK_ID?: Maybe<Scalars['Int']['output']>;
  BUILD_POP_SECTION?: Maybe<Scalars['Int']['output']>;
  CHILDREN?: Maybe<Array<Maybe<ConstructorSection>>>;
  CODE?: Maybe<Scalars['String']['output']>;
  ELEMENTS?: Maybe<Array<Maybe<ProductElement>>>;
  ELEMENT_CNT?: Maybe<Scalars['Int']['output']>;
  IBLOCK_SECTION_ID?: Maybe<Scalars['Int']['output']>;
  ID: Scalars['Int']['output'];
  IS_CORE?: Maybe<Scalars['Boolean']['output']>;
  META?: Maybe<ElementMeta>;
  NAME?: Maybe<Scalars['String']['output']>;
  PARENT?: Maybe<ConstructorSection>;
  PARENTS?: Maybe<Array<Maybe<ConstructorSection>>>;
  PICTURE?: Maybe<Image>;
  PROPS?: Maybe<Array<Maybe<EntityProp>>>;
  REPLACE_LINK?: Maybe<Scalars['String']['output']>;
  SORT?: Maybe<Scalars['Int']['output']>;
  URL?: Maybe<Scalars['String']['output']>;
};


export type ConstructorSectionChildrenArgs = {
  nav?: InputMaybe<QueryNavInput>;
  subsections?: InputMaybe<Scalars['Boolean']['input']>;
  where?: InputMaybe<ProductSectionFilter>;
};


export type ConstructorSectionElementsArgs = {
  filter?: InputMaybe<ProductElementFilter>;
  nav?: InputMaybe<QueryNavInput>;
};


export type ConstructorSectionPropsArgs = {
  detail?: InputMaybe<Scalars['Boolean']['input']>;
  includeEmptyValues?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
};

export type Coordinates = {
  __typename?: 'Coordinates';
  LAT?: Maybe<Scalars['Float']['output']>;
  LON?: Maybe<Scalars['Float']['output']>;
};

export type Coupon = {
  __typename?: 'Coupon';
  COUPON?: Maybe<Scalars['String']['output']>;
  ID?: Maybe<Scalars['Int']['output']>;
  NAME?: Maybe<Scalars['String']['output']>;
  PRODUCT?: Maybe<ProductElement>;
  PRODUCT_ID?: Maybe<Scalars['Int']['output']>;
};

export type CourierState = {
  __typename?: 'CourierState';
  ARRIVAL_TIME?: Maybe<Scalars['String']['output']>;
  ARRIVAL_TIME_CAPTION?: Maybe<Scalars['String']['output']>;
  CAR_COLOR?: Maybe<Scalars['String']['output']>;
  CAR_NUMBER?: Maybe<Scalars['String']['output']>;
  COORDS?: Maybe<Scalars['Json']['output']>;
};

export type DeliveryComputed = {
  __typename?: 'DeliveryComputed';
  CALCULATE_DESCRIPTION?: Maybe<Scalars['Json']['output']>;
  CALCULATE_ERRORS?: Maybe<Scalars['Json']['output']>;
  CALC_TIMESTAMP?: Maybe<Scalars['Int']['output']>;
  DELIVERY_DISCOUNT_PRICE?: Maybe<Scalars['String']['output']>;
  DELIVERY_DISCOUNT_PRICE_FORMATED?: Maybe<Scalars['String']['output']>;
  ID: Scalars['Int']['output'];
  NAME?: Maybe<Scalars['String']['output']>;
  PERIOD_TEXT?: Maybe<Scalars['String']['output']>;
  PRICE?: Maybe<Scalars['Float']['output']>;
  PRICE_FORMATED?: Maybe<Scalars['String']['output']>;
  SERVICE?: Maybe<DeliveryService>;
};

export type DeliveryService = {
  __typename?: 'DeliveryService';
  ID?: Maybe<Scalars['Int']['output']>;
  NAME?: Maybe<Scalars['String']['output']>;
  PARENT_ID?: Maybe<Scalars['Int']['output']>;
  TRANSPORT_TYPE?: Maybe<Scalars['String']['output']>;
};

export type DeliveryZoneElement = {
  __typename?: 'DeliveryZoneElement';
  CODE?: Maybe<Scalars['String']['output']>;
  ID?: Maybe<Scalars['Int']['output']>;
  NAME?: Maybe<Scalars['String']['output']>;
  PREVIEW_TEXT?: Maybe<Scalars['Json']['output']>;
  PROP_COLOR?: Maybe<Scalars['String']['output']>;
  PROP_FREE_FROM_PRICE?: Maybe<Scalars['Int']['output']>;
  PROP_FREE_TEXT?: Maybe<Scalars['String']['output']>;
  PROP_GEOJSON?: Maybe<Scalars['Json']['output']>;
  PROP_OUTSIDE?: Maybe<Scalars['Boolean']['output']>;
  PROP_PRICE_BY_DELIVERY?: Maybe<Scalars['Int']['output']>;
  PROP_PRICE_BY_KM?: Maybe<Scalars['Int']['output']>;
  PROP_PRICE_TEXT?: Maybe<Scalars['String']['output']>;
};


export type DeliveryZoneElementPreviewTextArgs = {
  format?: InputMaybe<Scalars['Boolean']['input']>;
};

export type DeliveryZoneElementConnection = {
  __typename?: 'DeliveryZoneElementConnection';
  info?: Maybe<QueryInfo>;
  nodes?: Maybe<Array<Maybe<DeliveryZoneElement>>>;
};

export type DeliveryZoneElementFilter = {
  ACTIVE?: InputMaybe<Scalars['Boolean']['input']>;
  CODE?: InputMaybe<StringFilterInput>;
  IBLOCK_ID?: InputMaybe<Scalars['Int']['input']>;
  ID?: InputMaybe<IntFilterInput>;
  INCLUDE_SUBSECTIONS?: InputMaybe<Scalars['Boolean']['input']>;
  NAME?: InputMaybe<StringFilterInput>;
  SEARCH?: InputMaybe<StringFilterInput>;
  SECTION_CODE?: InputMaybe<StringFilterInput>;
  SECTION_CODE_PATH?: InputMaybe<StringFilterInput>;
  SECTION_ID?: InputMaybe<IntFilterInput>;
};

export type Discount = {
  __typename?: 'Discount';
  CODE?: Maybe<Scalars['String']['output']>;
  CONDITIONS?: Maybe<Array<Maybe<DiscountCondition>>>;
  ID?: Maybe<Scalars['Int']['output']>;
  NAME?: Maybe<Scalars['String']['output']>;
};

export type DiscountCondition = {
  __typename?: 'DiscountCondition';
  ID?: Maybe<Scalars['Int']['output']>;
  NAME?: Maybe<Scalars['String']['output']>;
  TYPE?: Maybe<Scalars['String']['output']>;
  VALUE?: Maybe<Scalars['Json']['output']>;
};

export type DiscountItem = {
  __typename?: 'DiscountItem';
  CAPTION?: Maybe<Scalars['String']['output']>;
  CODE?: Maybe<Scalars['String']['output']>;
  CONDITIONS?: Maybe<Array<Maybe<DiscountCondition>>>;
  DISCOUNT?: Maybe<Discount>;
  DISCOUNT_ID?: Maybe<Scalars['Int']['output']>;
  HOTEST?: Maybe<Scalars['Boolean']['output']>;
  ID?: Maybe<Scalars['Int']['output']>;
  NAME?: Maybe<Scalars['String']['output']>;
  NAME_TEMPLATE?: Maybe<Scalars['String']['output']>;
  PERCENT?: Maybe<Scalars['Int']['output']>;
};

export type Element = {
  __typename?: 'Element';
  ACTIONS?: Maybe<Scalars['Json']['output']>;
  ACTIVE?: Maybe<Scalars['Boolean']['output']>;
  ACTIVE_FROM?: Maybe<Scalars['Json']['output']>;
  ADMIN_URL?: Maybe<Scalars['Json']['output']>;
  CODE?: Maybe<Scalars['String']['output']>;
  CREATED?: Maybe<Scalars['Json']['output']>;
  DETAIL_IMAGE?: Maybe<Image>;
  DETAIL_TEXT?: Maybe<Scalars['Json']['output']>;
  IBLOCK_CODE?: Maybe<Scalars['Int']['output']>;
  IBLOCK_ID?: Maybe<Scalars['Int']['output']>;
  IBLOCK_SECTION_ID?: Maybe<Scalars['Int']['output']>;
  IBLOCK_SECTION_IDS: Array<Maybe<Scalars['Int']['output']>>;
  ID: Scalars['Int']['output'];
  LIST_IMAGE?: Maybe<Image>;
  META?: Maybe<ElementMeta>;
  NAME?: Maybe<Scalars['String']['output']>;
  PATH?: Maybe<Array<Maybe<Section>>>;
  PREVIEW_TEXT?: Maybe<Scalars['Json']['output']>;
  PROPS?: Maybe<Array<Maybe<ElementProp>>>;
  PROPS_VALUES?: Maybe<Array<Maybe<ElementProp>>>;
  RATING?: Maybe<Scalars['Float']['output']>;
  RATING_VOTES?: Maybe<Scalars['Int']['output']>;
  ROOT_SECTION?: Maybe<Section>;
  SECTION?: Maybe<Section>;
  SECTIONS?: Maybe<Array<Maybe<Section>>>;
  SORT?: Maybe<Scalars['Int']['output']>;
  URL?: Maybe<Scalars['String']['output']>;
};


export type ElementActionsArgs = {
  detail?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
};


export type ElementActiveFromArgs = {
  format?: InputMaybe<Scalars['String']['input']>;
  formatDefault?: InputMaybe<Scalars['Boolean']['input']>;
  withTime?: InputMaybe<Scalars['Boolean']['input']>;
};


export type ElementCreatedArgs = {
  format?: InputMaybe<Scalars['String']['input']>;
  formatDefault?: InputMaybe<Scalars['Boolean']['input']>;
  withTime?: InputMaybe<Scalars['Boolean']['input']>;
};


export type ElementDetailTextArgs = {
  format?: InputMaybe<Scalars['Boolean']['input']>;
};


export type ElementPreviewTextArgs = {
  format?: InputMaybe<Scalars['Boolean']['input']>;
};


export type ElementPropsArgs = {
  detail?: InputMaybe<Scalars['Boolean']['input']>;
  includeEmptyValues?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
};


export type ElementPropsValuesArgs = {
  detail?: InputMaybe<Scalars['Boolean']['input']>;
  includeEmptyValues?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
};

export type ElementConnection = {
  __typename?: 'ElementConnection';
  info?: Maybe<QueryInfo>;
  nodes?: Maybe<Array<Maybe<Element>>>;
};

export type ElementFilter = {
  ACTIVE?: InputMaybe<Scalars['Boolean']['input']>;
  CODE?: InputMaybe<StringFilterInput>;
  IBLOCK_ID?: InputMaybe<Scalars['Int']['input']>;
  ID?: InputMaybe<IntFilterInput>;
  INCLUDE_SUBSECTIONS?: InputMaybe<Scalars['Boolean']['input']>;
  NAME?: InputMaybe<StringFilterInput>;
  SEARCH?: InputMaybe<StringFilterInput>;
  SECTION_CODE?: InputMaybe<StringFilterInput>;
  SECTION_CODE_PATH?: InputMaybe<StringFilterInput>;
  SECTION_ID?: InputMaybe<IntFilterInput>;
};

export type ElementMeta = {
  __typename?: 'ElementMeta';
  DESCRIPTION?: Maybe<Scalars['String']['output']>;
  KEYWORDS?: Maybe<Scalars['String']['output']>;
  PAGE_TITLE?: Maybe<Scalars['String']['output']>;
  TITLE?: Maybe<Scalars['String']['output']>;
};

export type ElementProp = {
  __typename?: 'ElementProp';
  CODE?: Maybe<Scalars['String']['output']>;
  DESC?: Maybe<Scalars['Json']['output']>;
  FEATURES?: Maybe<Scalars['Json']['output']>;
  FILE?: Maybe<Image>;
  FILES?: Maybe<Array<Maybe<Image>>>;
  ID?: Maybe<Scalars['Int']['output']>;
  MUL?: Maybe<Scalars['Boolean']['output']>;
  NAME?: Maybe<Scalars['String']['output']>;
  OPTIONS?: Maybe<Array<Maybe<ElementPropEnum>>>;
  TYPE?: Maybe<Scalars['String']['output']>;
  VAL?: Maybe<Scalars['Json']['output']>;
  VAL_ENUM_ID?: Maybe<Scalars['Json']['output']>;
  VAL_ID?: Maybe<Scalars['Json']['output']>;
};

export type ElementPropEnum = {
  __typename?: 'ElementPropEnum';
  CODE?: Maybe<Scalars['String']['output']>;
  ID?: Maybe<Scalars['Int']['output']>;
  NAME?: Maybe<Scalars['String']['output']>;
  SORT?: Maybe<Scalars['Int']['output']>;
  VALUE?: Maybe<Scalars['String']['output']>;
};

export type EntityProp = {
  __typename?: 'EntityProp';
  CODE?: Maybe<Scalars['String']['output']>;
  DESC?: Maybe<Scalars['Json']['output']>;
  FILE?: Maybe<Image>;
  FILES?: Maybe<Array<Maybe<Image>>>;
  ID?: Maybe<Scalars['Int']['output']>;
  MUL?: Maybe<Scalars['Boolean']['output']>;
  NAME?: Maybe<Scalars['String']['output']>;
  TYPE?: Maybe<Scalars['String']['output']>;
  VAL?: Maybe<Scalars['Json']['output']>;
  VAL_ENUM_ID?: Maybe<Scalars['Json']['output']>;
  VAL_ID?: Maybe<Scalars['Json']['output']>;
};

export type FaqElement = {
  __typename?: 'FaqElement';
  ACTIONS?: Maybe<Scalars['Json']['output']>;
  ACTIONS_MOBILE?: Maybe<Array<Maybe<MenuItemMobile>>>;
  ACTIVE?: Maybe<Scalars['Boolean']['output']>;
  ACTIVE_FROM?: Maybe<Scalars['Json']['output']>;
  ADMIN_URL?: Maybe<Scalars['Json']['output']>;
  CODE?: Maybe<Scalars['String']['output']>;
  CREATED?: Maybe<Scalars['Json']['output']>;
  DETAIL_IMAGE?: Maybe<Image>;
  DETAIL_TEXT?: Maybe<Scalars['Json']['output']>;
  IBLOCK_CODE?: Maybe<Scalars['Int']['output']>;
  IBLOCK_ID?: Maybe<Scalars['Int']['output']>;
  IBLOCK_SECTION_ID?: Maybe<Scalars['Int']['output']>;
  IBLOCK_SECTION_IDS: Array<Maybe<Scalars['Int']['output']>>;
  ID: Scalars['Int']['output'];
  LIST_IMAGE?: Maybe<Image>;
  META?: Maybe<ElementMeta>;
  NAME?: Maybe<Scalars['String']['output']>;
  PATH?: Maybe<Array<Maybe<Section>>>;
  PREVIEW_TEXT?: Maybe<Scalars['Json']['output']>;
  PROPS?: Maybe<Array<Maybe<ElementProp>>>;
  PROPS_VALUES?: Maybe<Array<Maybe<ElementProp>>>;
  RATING?: Maybe<Scalars['Float']['output']>;
  RATING_VOTES?: Maybe<Scalars['Int']['output']>;
  ROOT_SECTION?: Maybe<Section>;
  SECTION?: Maybe<Section>;
  SECTIONS?: Maybe<Array<Maybe<Section>>>;
  SORT?: Maybe<Scalars['Int']['output']>;
  URL?: Maybe<Scalars['String']['output']>;
};


export type FaqElementActionsArgs = {
  detail?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
};


export type FaqElementActiveFromArgs = {
  format?: InputMaybe<Scalars['String']['input']>;
  formatDefault?: InputMaybe<Scalars['Boolean']['input']>;
  withTime?: InputMaybe<Scalars['Boolean']['input']>;
};


export type FaqElementCreatedArgs = {
  format?: InputMaybe<Scalars['String']['input']>;
  formatDefault?: InputMaybe<Scalars['Boolean']['input']>;
  withTime?: InputMaybe<Scalars['Boolean']['input']>;
};


export type FaqElementDetailTextArgs = {
  format?: InputMaybe<Scalars['Boolean']['input']>;
};


export type FaqElementPreviewTextArgs = {
  format?: InputMaybe<Scalars['Boolean']['input']>;
};


export type FaqElementPropsArgs = {
  detail?: InputMaybe<Scalars['Boolean']['input']>;
  includeEmptyValues?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
};


export type FaqElementPropsValuesArgs = {
  detail?: InputMaybe<Scalars['Boolean']['input']>;
  includeEmptyValues?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
};

export type FavItem = {
  __typename?: 'FavItem';
  BASE_PRICE?: Maybe<Scalars['Float']['output']>;
  BUILD?: Maybe<Array<Maybe<BasketBuildItem>>>;
  CLIENT_ID?: Maybe<Scalars['String']['output']>;
  COMMENT?: Maybe<Scalars['String']['output']>;
  DESC?: Maybe<Scalars['String']['output']>;
  DISABLE?: Maybe<Scalars['Boolean']['output']>;
  DISABLE_REASON?: Maybe<Scalars['String']['output']>;
  ELEMENT?: Maybe<ProductElement>;
  FINAL_PRICE?: Maybe<Scalars['Float']['output']>;
  FINAL_PRICE_BASE?: Maybe<Scalars['Float']['output']>;
  ID?: Maybe<Scalars['Int']['output']>;
  INPUT_PROPS_HASH?: Maybe<Scalars['String']['output']>;
  MEASURE_NAME?: Maybe<Scalars['String']['output']>;
  NAME?: Maybe<Scalars['String']['output']>;
  ORDER_ID?: Maybe<Scalars['Int']['output']>;
  PAID?: Maybe<Scalars['Boolean']['output']>;
  PRICE?: Maybe<Scalars['Float']['output']>;
  PRICE_BASE?: Maybe<Scalars['Float']['output']>;
  PRODUCT_ID?: Maybe<Scalars['Int']['output']>;
  PROPS?: Maybe<Array<Maybe<BasketItemProp>>>;
  QUANTITY?: Maybe<Scalars['Float']['output']>;
};

export type GeoObject = {
  __typename?: 'GeoObject';
  address_full?: Maybe<Scalars['String']['output']>;
  address_original?: Maybe<Scalars['String']['output']>;
  address_short?: Maybe<Scalars['String']['output']>;
  area?: Maybe<Scalars['String']['output']>;
  area_fias_id?: Maybe<Scalars['String']['output']>;
  area_format?: Maybe<Scalars['String']['output']>;
  area_original?: Maybe<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  city_fias_id?: Maybe<Scalars['String']['output']>;
  city_format?: Maybe<Scalars['String']['output']>;
  city_original?: Maybe<Scalars['String']['output']>;
  district?: Maybe<Scalars['String']['output']>;
  district_fias_id?: Maybe<Scalars['String']['output']>;
  district_format?: Maybe<Scalars['String']['output']>;
  district_original?: Maybe<Scalars['String']['output']>;
  geo_lat?: Maybe<Scalars['Float']['output']>;
  geo_lon?: Maybe<Scalars['Float']['output']>;
  house?: Maybe<Scalars['String']['output']>;
  house_fias_id?: Maybe<Scalars['String']['output']>;
  house_format?: Maybe<Scalars['String']['output']>;
  house_original?: Maybe<Scalars['String']['output']>;
  region?: Maybe<Scalars['String']['output']>;
  region_fias_id?: Maybe<Scalars['String']['output']>;
  region_format?: Maybe<Scalars['String']['output']>;
  region_original?: Maybe<Scalars['String']['output']>;
  street?: Maybe<Scalars['String']['output']>;
  street_fias_id?: Maybe<Scalars['String']['output']>;
  street_format?: Maybe<Scalars['String']['output']>;
  street_original?: Maybe<Scalars['String']['output']>;
  street_path_full?: Maybe<Scalars['String']['output']>;
  street_path_short?: Maybe<Scalars['String']['output']>;
};

export type Image = {
  __typename?: 'Image';
  FILE_SIZE?: Maybe<Scalars['String']['output']>;
  ID?: Maybe<Scalars['ID']['output']>;
  ORIGINAL_NAME?: Maybe<Scalars['String']['output']>;
  SRC?: Maybe<Scalars['String']['output']>;
  SRC_DEFAULT?: Maybe<Scalars['String']['output']>;
};

export type IntFilterInput = {
  eq?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  not?: InputMaybe<Scalars['Int']['input']>;
};

export type JobResult = {
  __typename?: 'JobResult';
  payload?: Maybe<Scalars['Json']['output']>;
  state?: Maybe<ResponseState>;
};

export type JobType = {
  __typename?: 'JobType';
  code?: Maybe<Scalars['String']['output']>;
};

export type Location = {
  __typename?: 'Location';
  CODE?: Maybe<Scalars['String']['output']>;
  ID?: Maybe<Scalars['Int']['output']>;
  NAME?: Maybe<Scalars['String']['output']>;
  REGION?: Maybe<Location>;
};

export type MenuItem = {
  __typename?: 'MenuItem';
  badge?: Maybe<Scalars['Json']['output']>;
  bgColor?: Maybe<Scalars['String']['output']>;
  blank?: Maybe<Scalars['Boolean']['output']>;
  children?: Maybe<Array<Maybe<MenuItem>>>;
  color?: Maybe<Scalars['String']['output']>;
  command?: Maybe<Command>;
  display?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  entityId?: Maybe<Scalars['String']['output']>;
  entityType?: Maybe<Scalars['String']['output']>;
  icon?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  image?: Maybe<Image>;
  imageId?: Maybe<Scalars['Int']['output']>;
  infoLabel?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  native?: Maybe<Scalars['Boolean']['output']>;
  params?: Maybe<Scalars['Json']['output']>;
  parent?: Maybe<Scalars['String']['output']>;
  roles?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  url?: Maybe<Scalars['String']['output']>;
};

export type MenuItemMobile = {
  __typename?: 'MenuItemMobile';
  action?: Maybe<ActionMobile>;
  backgroundColor?: Maybe<Scalars['String']['output']>;
  badge?: Maybe<Scalars['Json']['output']>;
  color?: Maybe<Scalars['String']['output']>;
  condition?: Maybe<Condition>;
  icon?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  image?: Maybe<Image>;
  imageId?: Maybe<Scalars['Int']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  labelColor?: Maybe<Scalars['String']['output']>;
  link?: Maybe<Scalars['Boolean']['output']>;
  outline?: Maybe<Scalars['Boolean']['output']>;
  outlineColor?: Maybe<Scalars['String']['output']>;
  outlineWidth?: Maybe<Scalars['Int']['output']>;
  params?: Maybe<Scalars['Json']['output']>;
  parent?: Maybe<Scalars['String']['output']>;
  roles?: Maybe<Scalars['Json']['output']>;
  templatable?: Maybe<Scalars['Boolean']['output']>;
  templatableProps?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type MenuMobile = {
  __typename?: 'MenuMobile';
  children?: Maybe<Array<Maybe<MenuItemMobile>>>;
  code?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
};

export type Message = {
  __typename?: 'Message';
  category?: Maybe<Scalars['String']['output']>;
  code?: Maybe<Scalars['String']['output']>;
  data?: Maybe<Scalars['Json']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  notify?: Maybe<Scalars['Boolean']['output']>;
  rel?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  app_callback?: Maybe<Scalars['Boolean']['output']>;
  app_send_promocode_first_order?: Maybe<Scalars['Boolean']['output']>;
  app_subscribe_promo?: Maybe<Scalars['Boolean']['output']>;
  captcha_draggable_create?: Maybe<CaptchaModel>;
  captcha_draggable_verify?: Maybe<CaptchaVerify>;
  catalog_fav_add?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  catalog_fav_clear?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  catalog_fav_remove?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  catalog_product_order?: Maybe<Response>;
  company_pub_vacancy_order?: Maybe<VacancyOrderAdd>;
  main_admin_iblock_element_delete?: Maybe<MainAdminIblockElementDelete>;
  main_admin_iblock_element_set_active?: Maybe<MainAdminIblockElementSetActive>;
  notice_pub_push_send_queue?: Maybe<Scalars['Boolean']['output']>;
  notice_pub_push_update_token?: Maybe<Scalars['Boolean']['output']>;
  notice_pub_sync_readed?: Maybe<NoticeSyncReaded>;
  review_pub_service_review?: Maybe<ServiceReviewAdd>;
  review_pub_user_order?: Maybe<ReviewOrderAdd>;
  review_pub_user_product?: Maybe<ReviewProductAdd>;
  sale_pub_buyer_company_default?: Maybe<SalePubBuyerCompanyDefault>;
  sale_pub_buyer_company_delete?: Maybe<SalePubBuyerCompanyDelete>;
  sale_pub_buyer_company_save?: Maybe<SalePubBuyerCompanySave>;
  sale_pub_fav_add?: Maybe<SalePubFavAdd>;
  sale_pub_fav_clear?: Maybe<SalePubFavClear>;
  sale_pub_fav_remove?: Maybe<SalePubFavRemove>;
  sale_pub_order_cancel?: Maybe<OrderCancel>;
  sale_pub_order_repeat?: Maybe<Order>;
  sale_pub_paycard_default?: Maybe<Scalars['String']['output']>;
  sale_pub_paycard_delete?: Maybe<Scalars['String']['output']>;
  sale_pub_profile_default?: Maybe<OrderProfileDefault>;
  sale_pub_profile_delete?: Maybe<OrderProfileDelete>;
  sale_pub_profile_save?: Maybe<OrderProfile>;
  sale_pub_profile_save_mobile?: Maybe<OrderProfile>;
  sale_pub_vorder_apply?: Maybe<VOrderApply>;
  sale_pub_vorder_basket?: Maybe<VOrderBasket>;
  sale_pub_vorder_coupon?: Maybe<VOrderCoupon>;
  sale_pub_vorder_new?: Maybe<VorderResult>;
  sale_pub_vorder_reserve?: Maybe<VOrderReserve>;
  sale_pub_vorder_submit?: Maybe<VOrderSubmit>;
  sale_pub_vorder_sync?: Maybe<Vorder>;
  subscribe_subscribeEmail?: Maybe<Response>;
  user_logout?: Maybe<Scalars['Boolean']['output']>;
  user_profile_save?: Maybe<UserProfileSave>;
  user_pub_app_client?: Maybe<AppClient>;
  user_pub_app_client_update_test?: Maybe<Scalars['Boolean']['output']>;
  user_pub_create_sa?: Maybe<Scalars['Boolean']['output']>;
  user_pub_login_confirm?: Maybe<MutationLoginConfirm>;
  user_pub_login_request?: Maybe<MutationLoginRequest>;
  user_pub_login_start?: Maybe<MutationLoginStart>;
  user_pub_logout?: Maybe<MutationLogout>;
  user_pub_profile_all_filled?: Maybe<UserProfileAllFilled>;
  user_pub_profile_birthday?: Maybe<MutationUserBirthday>;
  user_pub_profile_child?: Maybe<MutationUserChild>;
  user_pub_profile_email?: Maybe<MutationUserEmail>;
  user_pub_profile_name?: Maybe<MutationUserName>;
  websocket_ping?: Maybe<Scalars['Json']['output']>;
};


export type MutationAppCallbackArgs = {
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
};


export type MutationAppSendPromocodeFirstOrderArgs = {
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};


export type MutationAppSubscribePromoArgs = {
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};


export type MutationCaptchaDraggableCreateArgs = {
  handleHeight?: InputMaybe<Scalars['Int']['input']>;
  handleWidth?: InputMaybe<Scalars['Int']['input']>;
  height?: InputMaybe<Scalars['Int']['input']>;
  width?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationCatalogFavAddArgs = {
  productId?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationCatalogFavRemoveArgs = {
  productId?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationCatalogProductOrderArgs = {
  elementId?: InputMaybe<Scalars['Int']['input']>;
  model?: InputMaybe<Scalars['Json']['input']>;
};


export type MutationCompanyPubVacancyOrderArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  model?: InputMaybe<Scalars['Json']['input']>;
};


export type MutationMainAdminIblockElementDeleteArgs = {
  elementId?: InputMaybe<Scalars['Int']['input']>;
  iblockId?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationMainAdminIblockElementSetActiveArgs = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  elementId?: InputMaybe<Scalars['Int']['input']>;
  iblockId?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationNoticePubPushUpdateTokenArgs = {
  pushToken?: InputMaybe<Scalars['String']['input']>;
};


export type MutationNoticePubSyncReadedArgs = {
  ids?: InputMaybe<Scalars['Json']['input']>;
};


export type MutationReviewPubServiceReviewArgs = {
  model?: InputMaybe<Scalars['Json']['input']>;
};


export type MutationReviewPubUserOrderArgs = {
  model?: InputMaybe<Scalars['Json']['input']>;
  orderId?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationReviewPubUserProductArgs = {
  model?: InputMaybe<Scalars['Json']['input']>;
};


export type MutationSalePubBuyerCompanyDefaultArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationSalePubBuyerCompanyDeleteArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationSalePubBuyerCompanySaveArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  props?: InputMaybe<Scalars['Json']['input']>;
};


export type MutationSalePubFavAddArgs = {
  basketId?: InputMaybe<Scalars['Int']['input']>;
  productId?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationSalePubFavClearArgs = {
  action?: InputMaybe<Scalars['String']['input']>;
  itemId?: InputMaybe<Scalars['Int']['input']>;
  productId?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationSalePubFavRemoveArgs = {
  action?: InputMaybe<Scalars['String']['input']>;
  itemId?: InputMaybe<Scalars['Int']['input']>;
  productId?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationSalePubOrderCancelArgs = {
  comment?: InputMaybe<Scalars['String']['input']>;
  hash?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  reason?: InputMaybe<Scalars['String']['input']>;
};


export type MutationSalePubOrderRepeatArgs = {
  hash?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationSalePubPaycardDefaultArgs = {
  sid?: InputMaybe<Scalars['String']['input']>;
};


export type MutationSalePubPaycardDeleteArgs = {
  sid?: InputMaybe<Scalars['String']['input']>;
};


export type MutationSalePubProfileDefaultArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  personTypeId?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationSalePubProfileDeleteArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationSalePubProfileSaveArgs = {
  attrs?: InputMaybe<Scalars['Json']['input']>;
  fields?: InputMaybe<Scalars['Json']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  props?: InputMaybe<Scalars['Json']['input']>;
};


export type MutationSalePubProfileSaveMobileArgs = {
  attrs?: InputMaybe<Scalars['Json']['input']>;
  fields?: InputMaybe<Scalars['Json']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  props?: InputMaybe<Scalars['Json']['input']>;
};


export type MutationSalePubVorderApplyArgs = {
  action?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<VorderInput>;
  params?: InputMaybe<Scalars['Json']['input']>;
};


export type MutationSalePubVorderBasketArgs = {
  order?: InputMaybe<VorderInput>;
};


export type MutationSalePubVorderCouponArgs = {
  action?: InputMaybe<Scalars['String']['input']>;
  couponCode?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<VorderInput>;
};


export type MutationSalePubVorderReserveArgs = {
  order?: InputMaybe<VorderInput>;
  profileId?: InputMaybe<Scalars['Int']['input']>;
  time?: InputMaybe<Scalars['Int']['input']>;
  timeMode?: InputMaybe<Scalars['String']['input']>;
  timeSave?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationSalePubVorderSubmitArgs = {
  order?: InputMaybe<VorderInput>;
};


export type MutationSalePubVorderSyncArgs = {
  order?: InputMaybe<VorderInput>;
};


export type MutationSubscribeSubscribeEmailArgs = {
  email?: InputMaybe<Scalars['String']['input']>;
  rubrics?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
};


export type MutationUserProfileSaveArgs = {
  form?: InputMaybe<Scalars['Json']['input']>;
};


export type MutationUserPubAppClientArgs = {
  debugParams?: InputMaybe<Scalars['Json']['input']>;
  mobilePushToken?: InputMaybe<Scalars['String']['input']>;
  webPushToken?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUserPubCreateSaArgs = {
  clientIds?: InputMaybe<Scalars['Json']['input']>;
  code?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUserPubLoginConfirmArgs = {
  captcha?: InputMaybe<CaptchaInput>;
  clientId?: InputMaybe<Scalars['String']['input']>;
  code?: InputMaybe<Scalars['String']['input']>;
  confirmMode?: InputMaybe<Scalars['String']['input']>;
  disableBasketTransfer?: InputMaybe<Scalars['Boolean']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  pushToken?: InputMaybe<Scalars['String']['input']>;
  sid?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUserPubLoginRequestArgs = {
  captcha?: InputMaybe<CaptchaInput>;
  confirmMode?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUserPubLoginStartArgs = {
  captcha?: InputMaybe<CaptchaInput>;
  phone?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUserPubProfileBirthdayArgs = {
  birthday?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUserPubProfileChildArgs = {
  action?: InputMaybe<Scalars['String']['input']>;
  child?: InputMaybe<UserFamilyInput>;
};


export type MutationUserPubProfileEmailArgs = {
  action?: InputMaybe<Scalars['String']['input']>;
  code?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUserPubProfileNameArgs = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type MutationLoginConfirm = {
  __typename?: 'MutationLoginConfirm';
  appClient?: Maybe<AppClient>;
  redirect?: Maybe<Scalars['Json']['output']>;
  sessionId?: Maybe<Scalars['String']['output']>;
  state: ResponseState;
  status?: Maybe<MutationLoginConfirmStatusEnum>;
  userId?: Maybe<Scalars['Int']['output']>;
};

export enum MutationLoginConfirmStatusEnum {
  Blocked = 'blocked',
  Error = 'error',
  Info = 'info',
  RateLimit = 'rate_limit',
  Success = 'success',
  Warning = 'warning'
}

export type MutationLoginRequest = {
  __typename?: 'MutationLoginRequest';
  captcha?: Maybe<CaptchaModel>;
  id?: Maybe<Scalars['String']['output']>;
  sid?: Maybe<Scalars['String']['output']>;
  state: ResponseState;
  status?: Maybe<MutationLoginRequestStatusEnum>;
};

export enum MutationLoginRequestStatusEnum {
  CaptchaNeed = 'captcha_need',
  CaptchaWrong = 'captcha_wrong',
  Error = 'error',
  Info = 'info',
  RateLimit = 'rate_limit',
  Success = 'success',
  UserBlocked = 'user_blocked',
  Warning = 'warning'
}

export type MutationLoginStart = {
  __typename?: 'MutationLoginStart';
  confirmModes?: Maybe<Array<Maybe<UserAuthConfirm>>>;
  state: ResponseState;
};

export type MutationLogout = {
  __typename?: 'MutationLogout';
  appClient?: Maybe<AppClient>;
  state: ResponseState;
};

export type MutationUserBirthday = {
  __typename?: 'MutationUserBirthday';
  state?: Maybe<ResponseState>;
  user?: Maybe<User>;
};

export type MutationUserChild = {
  __typename?: 'MutationUserChild';
  state?: Maybe<ResponseState>;
  user?: Maybe<User>;
};

export type MutationUserEmail = {
  __typename?: 'MutationUserEmail';
  state?: Maybe<ResponseState>;
  user?: Maybe<User>;
};

export type MutationUserName = {
  __typename?: 'MutationUserName';
  state?: Maybe<ResponseState>;
  user?: Maybe<User>;
};

export type NoticeSyncReaded = {
  __typename?: 'NoticeSyncReaded';
  payload?: Maybe<NoticeSyncReadedPayload>;
  state: ResponseState;
};

export type NoticeSyncReadedPayload = {
  __typename?: 'NoticeSyncReadedPayload';
  notices?: Maybe<Array<Maybe<ClientNotice>>>;
};

export type Offer = {
  __typename?: 'Offer';
  ACTIONS_MOBILE?: Maybe<Array<Maybe<MenuItemMobile>>>;
  ACTIONS_WEB?: Maybe<Array<Maybe<MenuItem>>>;
  ACTIVE_FROM?: Maybe<Scalars['Json']['output']>;
  BANNER_HOR_DESKTOP?: Maybe<Image>;
  BANNER_HOR_MOBILE?: Maybe<Image>;
  BANNER_INTERNAL_TEXT?: Maybe<Scalars['String']['output']>;
  BANNER_SQUARE?: Maybe<Image>;
  CODE?: Maybe<Scalars['String']['output']>;
  CONTENT_IMAGE?: Maybe<Image>;
  DETAIL_TEXT?: Maybe<Scalars['Json']['output']>;
  DISCOUNT_ID?: Maybe<Scalars['Int']['output']>;
  ID?: Maybe<Scalars['Int']['output']>;
  IS_HOT?: Maybe<Scalars['Boolean']['output']>;
  NAME?: Maybe<Scalars['String']['output']>;
  OFFER_NAME?: Maybe<Scalars['String']['output']>;
  PREVIEW_TEXT?: Maybe<Scalars['Json']['output']>;
  SLIDES?: Maybe<Array<Maybe<OfferSlide>>>;
  STARTUP_SHOW?: Maybe<Scalars['String']['output']>;
  VARS?: Maybe<Scalars['Json']['output']>;
  VID?: Maybe<Scalars['String']['output']>;
  VIEW_MODE?: Maybe<Scalars['String']['output']>;
};


export type OfferActiveFromArgs = {
  format?: InputMaybe<Scalars['String']['input']>;
  formatDefault?: InputMaybe<Scalars['Boolean']['input']>;
  withTime?: InputMaybe<Scalars['Boolean']['input']>;
};


export type OfferDetailTextArgs = {
  format?: InputMaybe<Scalars['Boolean']['input']>;
};


export type OfferPreviewTextArgs = {
  format?: InputMaybe<Scalars['Boolean']['input']>;
};

export type OfferSlide = {
  __typename?: 'OfferSlide';
  BG_COLOR?: Maybe<Scalars['String']['output']>;
  CODE?: Maybe<Scalars['String']['output']>;
  CONTENT_HTML?: Maybe<Scalars['String']['output']>;
  CONTENT_IMAGE?: Maybe<Image>;
  CONTENT_TYPE?: Maybe<Scalars['String']['output']>;
  ID?: Maybe<Scalars['Int']['output']>;
  NAME?: Maybe<Scalars['String']['output']>;
};

export type Operation = {
  __typename?: 'Operation';
  ID?: Maybe<Scalars['Int']['output']>;
  NAME?: Maybe<Scalars['String']['output']>;
  PROCESSED?: Maybe<Scalars['Boolean']['output']>;
  PROCESSED_REDIRECT?: Maybe<Scalars['String']['output']>;
  SID?: Maybe<Scalars['Int']['output']>;
};

export type Order = {
  __typename?: 'Order';
  ACCESS_HASH?: Maybe<Scalars['String']['output']>;
  ACCOUNT_NUMBER?: Maybe<Scalars['String']['output']>;
  ACTIONS?: Maybe<Scalars['Json']['output']>;
  ADDRESS_FOR_1C?: Maybe<Scalars['String']['output']>;
  ATTRS?: Maybe<Array<Maybe<OrderAttr>>>;
  BASKET?: Maybe<Array<Maybe<BasketItem>>>;
  BONUSES?: Maybe<Scalars['Int']['output']>;
  BUYER_NAME?: Maybe<Scalars['String']['output']>;
  CANCEL_REASONS?: Maybe<Array<Maybe<OrderCancelReason>>>;
  CONTRACT_NUM?: Maybe<Scalars['String']['output']>;
  COUPONS?: Maybe<Array<Maybe<Coupon>>>;
  COURIER_STATE?: Maybe<CourierState>;
  CSTATUS_COLOR?: Maybe<Scalars['String']['output']>;
  CSTATUS_ID?: Maybe<Scalars['String']['output']>;
  CSTATUS_NAME?: Maybe<Scalars['String']['output']>;
  DATE_FORMATTED?: Maybe<Scalars['Json']['output']>;
  DATE_INSERT?: Maybe<Scalars['Json']['output']>;
  DATE_PAYED?: Maybe<Scalars['Json']['output']>;
  DATE_TIME_FORMATTED?: Maybe<Scalars['Json']['output']>;
  DATE_UPDATE?: Maybe<Scalars['Json']['output']>;
  DELIVERY?: Maybe<DeliveryService>;
  DELIVERY_ADDRESS_FULL?: Maybe<Scalars['String']['output']>;
  DELIVERY_CALCULATED?: Maybe<Scalars['Boolean']['output']>;
  DELIVERY_DATETIME?: Maybe<Scalars['Json']['output']>;
  DELIVERY_DEPARTMENT?: Maybe<CompanyOffice>;
  DELIVERY_FREE_FROM_PRICE?: Maybe<Scalars['Int']['output']>;
  DELIVERY_ID?: Maybe<Scalars['Int']['output']>;
  DISCOUNT_PERCENT?: Maybe<Scalars['Float']['output']>;
  DISCOUNT_REASON?: Maybe<Scalars['String']['output']>;
  EDU_GROUP_NUM?: Maybe<Scalars['String']['output']>;
  ID?: Maybe<Scalars['Int']['output']>;
  IS_ACTIVE?: Maybe<Scalars['Boolean']['output']>;
  IS_CANCELED?: Maybe<Scalars['Boolean']['output']>;
  IS_CAN_CANCEL?: Maybe<Scalars['Boolean']['output']>;
  IS_CAN_PAY?: Maybe<Scalars['Boolean']['output']>;
  IS_CAN_PAY_BILL?: Maybe<Scalars['Boolean']['output']>;
  IS_CAN_PAY_ONLINE?: Maybe<Scalars['Boolean']['output']>;
  IS_FINISHED?: Maybe<Scalars['Boolean']['output']>;
  IS_PAID?: Maybe<Scalars['Boolean']['output']>;
  PAYMENTS?: Maybe<Array<Maybe<Payment>>>;
  PAYSYSTEM?: Maybe<Paysystem>;
  PAYSYSTEM_ID?: Maybe<Scalars['Int']['output']>;
  PAYSYSTEM_IS_ONLINE?: Maybe<Scalars['Boolean']['output']>;
  PAY_LINK?: Maybe<Scalars['String']['output']>;
  PERSON_TYPE_ID?: Maybe<Scalars['Int']['output']>;
  PICKUP_DEPARTMENT?: Maybe<CompanyOffice>;
  PRICE?: Maybe<Scalars['Float']['output']>;
  PRICE_BASKET?: Maybe<Scalars['Float']['output']>;
  PRICE_BASKET_BASE?: Maybe<Scalars['Float']['output']>;
  PRICE_DELIVERY?: Maybe<Scalars['Float']['output']>;
  PRICE_DELIVERY_BASE?: Maybe<Scalars['Float']['output']>;
  PRICE_DISCOUNT?: Maybe<Scalars['Float']['output']>;
  PRICE_PAY?: Maybe<Scalars['Float']['output']>;
  PRICE_PAY_BASE?: Maybe<Scalars['Float']['output']>;
  PRICE_TOTAL?: Maybe<Scalars['Float']['output']>;
  PRICE_TOTAL_BASE?: Maybe<Scalars['Float']['output']>;
  PROPS?: Maybe<Array<Maybe<OrderPropValue>>>;
  SCOPE?: Maybe<OrderScope>;
  SCOPE_ENTITY?: Maybe<Element>;
  SECRET_URL?: Maybe<Scalars['String']['output']>;
  SERVICE_ID?: Maybe<Scalars['Int']['output']>;
  STATUS?: Maybe<OrderStatus>;
  STATUS_COLOR?: Maybe<Scalars['String']['output']>;
  STATUS_ID?: Maybe<Scalars['String']['output']>;
  STATUS_NAME?: Maybe<Scalars['String']['output']>;
  STUDENT_FIO?: Maybe<Scalars['String']['output']>;
  SYNCED?: Maybe<Scalars['Boolean']['output']>;
  TS?: Maybe<Scalars['String']['output']>;
  URL?: Maybe<Scalars['String']['output']>;
  USER?: Maybe<User>;
  USER_DESCRIPTION?: Maybe<Scalars['String']['output']>;
  USER_ID?: Maybe<Scalars['Int']['output']>;
};


export type OrderDateFormattedArgs = {
  format?: InputMaybe<Scalars['String']['input']>;
  formatDefault?: InputMaybe<Scalars['Boolean']['input']>;
  withTime?: InputMaybe<Scalars['Boolean']['input']>;
};


export type OrderDateInsertArgs = {
  format?: InputMaybe<Scalars['String']['input']>;
  formatDefault?: InputMaybe<Scalars['Boolean']['input']>;
  withTime?: InputMaybe<Scalars['Boolean']['input']>;
};


export type OrderDatePayedArgs = {
  format?: InputMaybe<Scalars['String']['input']>;
  formatDefault?: InputMaybe<Scalars['Boolean']['input']>;
  withTime?: InputMaybe<Scalars['Boolean']['input']>;
};


export type OrderDateTimeFormattedArgs = {
  format?: InputMaybe<Scalars['String']['input']>;
  formatDefault?: InputMaybe<Scalars['Boolean']['input']>;
  withTime?: InputMaybe<Scalars['Boolean']['input']>;
};


export type OrderDateUpdateArgs = {
  format?: InputMaybe<Scalars['String']['input']>;
  formatDefault?: InputMaybe<Scalars['Boolean']['input']>;
  withTime?: InputMaybe<Scalars['Boolean']['input']>;
};


export type OrderDeliveryDatetimeArgs = {
  format?: InputMaybe<Scalars['String']['input']>;
  formatDefault?: InputMaybe<Scalars['Boolean']['input']>;
  withTime?: InputMaybe<Scalars['Boolean']['input']>;
};

export type OrderAttr = {
  __typename?: 'OrderAttr';
  ATTR_TYPE?: Maybe<Scalars['String']['output']>;
  CODE?: Maybe<Scalars['String']['output']>;
  DEFAULT_VALUE?: Maybe<Scalars['Json']['output']>;
  NAME?: Maybe<Scalars['String']['output']>;
  OPTIONS?: Maybe<Array<Maybe<OrderAttrOption>>>;
  VALUE?: Maybe<Scalars['Json']['output']>;
  VALUE_DESCRIPTION?: Maybe<Scalars['String']['output']>;
  VALUE_VIEW?: Maybe<Scalars['String']['output']>;
};

export type OrderAttrOption = {
  __typename?: 'OrderAttrOption';
  DESCRIPTION?: Maybe<Scalars['String']['output']>;
  ICON?: Maybe<Scalars['String']['output']>;
  ID?: Maybe<Scalars['Int']['output']>;
  NAME?: Maybe<Scalars['String']['output']>;
  NAME_SHORT?: Maybe<Scalars['String']['output']>;
  SORT?: Maybe<Scalars['Int']['output']>;
  VALUE?: Maybe<Scalars['Json']['output']>;
  XML_ID?: Maybe<Scalars['String']['output']>;
};

export type OrderCancel = {
  __typename?: 'OrderCancel';
  payload?: Maybe<OrderCancelPayload>;
  state: ResponseState;
};

export type OrderCancelPayload = {
  __typename?: 'OrderCancelPayload';
  entity?: Maybe<Order>;
};

export type OrderCancelReason = {
  __typename?: 'OrderCancelReason';
  CODE?: Maybe<Scalars['String']['output']>;
  NAME?: Maybe<Scalars['String']['output']>;
};

export type OrderConnection = {
  __typename?: 'OrderConnection';
  info?: Maybe<QueryInfo>;
  nodes?: Maybe<Array<Maybe<Order>>>;
};

export type OrderFilter = {
  ACCOUNT_NUMBER?: InputMaybe<StringFilterInput>;
  CANCELED?: InputMaybe<Scalars['Boolean']['input']>;
  DATE_DAY?: InputMaybe<Scalars['Int']['input']>;
  DATE_MONTH?: InputMaybe<Scalars['Int']['input']>;
  DATE_PAYED_DAY?: InputMaybe<Scalars['Int']['input']>;
  DATE_PAYED_MONTH?: InputMaybe<Scalars['Int']['input']>;
  DATE_PAYED_YEAR?: InputMaybe<Scalars['Int']['input']>;
  DATE_YEAR?: InputMaybe<Scalars['Int']['input']>;
  ELEMENT_NAME?: InputMaybe<StringFilterInput>;
  EMAIL?: InputMaybe<StringFilterInput>;
  ID?: InputMaybe<IntFilterInput>;
  MODE?: InputMaybe<Scalars['String']['input']>;
  PAYED?: InputMaybe<Scalars['Boolean']['input']>;
  PAY_SYSTEM_ID?: InputMaybe<IntFilterInput>;
  PHONE?: InputMaybe<StringFilterInput>;
  PROP_CONTRACT_NUM?: InputMaybe<StringFilterInput>;
  PROP_EDU_GROUP_NUM?: InputMaybe<StringFilterInput>;
  PROP_EMAIL?: InputMaybe<StringFilterInput>;
  PROP_FIO?: InputMaybe<StringFilterInput>;
  PROP_PHONE?: InputMaybe<StringFilterInput>;
  PROP_PRODUCT_SECTIONS?: InputMaybe<StringFilterInput>;
  PROP_STUDENT_FIO?: InputMaybe<StringFilterInput>;
  SECTION_ID?: InputMaybe<IntFilterInput>;
  STATUS_ID?: InputMaybe<StringFilterInput>;
  USER_ID?: InputMaybe<IntFilterInput>;
};

export type OrderPayOnline = {
  __typename?: 'OrderPayOnline';
  payload?: Maybe<OrderPayOnlinePayload>;
  state: ResponseState;
};

export type OrderPayOnlinePayload = {
  __typename?: 'OrderPayOnlinePayload';
  actionMobile?: Maybe<ActionMobile>;
  actionWeb?: Maybe<ActionWeb>;
  order?: Maybe<Order>;
};

export type OrderProfile = {
  __typename?: 'OrderProfile';
  ACTIONS?: Maybe<Scalars['Json']['output']>;
  ATTRS?: Maybe<Array<Maybe<OrderAttr>>>;
  CAPTION?: Maybe<Scalars['String']['output']>;
  COMPANY?: Maybe<BuyerCompanyElement>;
  COMPANY_ID?: Maybe<Scalars['Int']['output']>;
  COORDS?: Maybe<Coordinates>;
  DELIVERY_FREE_FROM_PRICE: Scalars['Int']['output'];
  ID: Scalars['Int']['output'];
  IS_DEFAULT?: Maybe<Scalars['Boolean']['output']>;
  NAME: Scalars['String']['output'];
  PERSON_TYPE?: Maybe<PersonType>;
  PERSON_TYPE_ID: Scalars['Int']['output'];
  PROPS?: Maybe<Array<Maybe<OrderPropValue>>>;
  USER?: Maybe<User>;
  USER_ID: Scalars['Int']['output'];
};


export type OrderProfileActionsArgs = {
  detail?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
};

export type OrderProfileDefault = {
  __typename?: 'OrderProfileDefault';
  payload?: Maybe<Scalars['Int']['output']>;
  state: ResponseState;
};

export type OrderProfileDelete = {
  __typename?: 'OrderProfileDelete';
  payload?: Maybe<Scalars['Int']['output']>;
  state: ResponseState;
};

export type OrderProfileForm = {
  __typename?: 'OrderProfileForm';
  ACTIONS?: Maybe<Scalars['Json']['output']>;
  ATTRS?: Maybe<Array<Maybe<OrderAttr>>>;
  CAPTION?: Maybe<Scalars['String']['output']>;
  COMPANIES?: Maybe<Array<Maybe<BuyerCompanyElement>>>;
  COMPANY?: Maybe<BuyerCompanyElement>;
  COMPANY_ID?: Maybe<Scalars['Int']['output']>;
  COORDS?: Maybe<Coordinates>;
  DELIVERY_FREE_FROM_PRICE: Scalars['Int']['output'];
  ID: Scalars['Int']['output'];
  IS_DEFAULT?: Maybe<Scalars['Boolean']['output']>;
  NAME: Scalars['String']['output'];
  PERSON_TYPE?: Maybe<PersonType>;
  PERSON_TYPES?: Maybe<Array<Maybe<PersonType>>>;
  PERSON_TYPE_ID: Scalars['Int']['output'];
  PROPS?: Maybe<Array<Maybe<OrderPropValue>>>;
  USER?: Maybe<User>;
  USER_ID: Scalars['Int']['output'];
};


export type OrderProfileFormActionsArgs = {
  detail?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
};

export type OrderProp = {
  __typename?: 'OrderProp';
  CODE?: Maybe<Scalars['String']['output']>;
  COMPONENT_NAMES?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  DEFAULT_VALUE?: Maybe<Scalars['String']['output']>;
  DESC?: Maybe<Scalars['String']['output']>;
  GROUP_ID?: Maybe<Scalars['Int']['output']>;
  ID?: Maybe<Scalars['Int']['output']>;
  IS_PROFILE?: Maybe<Scalars['Boolean']['output']>;
  IS_PROFILE_NAME?: Maybe<Scalars['Boolean']['output']>;
  IS_READONLY?: Maybe<Scalars['Boolean']['output']>;
  IS_REQUIRED?: Maybe<Scalars['Boolean']['output']>;
  IS_UTIL?: Maybe<Scalars['Boolean']['output']>;
  NAME?: Maybe<Scalars['String']['output']>;
  OPTIONS?: Maybe<Array<Maybe<OrderPropOption>>>;
  PARAMS?: Maybe<Scalars['Json']['output']>;
  PERSON_TYPE_ID?: Maybe<Scalars['Int']['output']>;
  PROFILE_TEASER_HIDE?: Maybe<Scalars['Boolean']['output']>;
  ROLE?: Maybe<Scalars['String']['output']>;
  SORT?: Maybe<Scalars['Int']['output']>;
  TYPE?: Maybe<Scalars['String']['output']>;
};

export type OrderPropGroup = {
  __typename?: 'OrderPropGroup';
  ID?: Maybe<Scalars['Int']['output']>;
  NAME?: Maybe<Scalars['String']['output']>;
  PERSON_TYPE_ID?: Maybe<Scalars['Int']['output']>;
  SORT?: Maybe<Scalars['Int']['output']>;
};

export type OrderPropOption = {
  __typename?: 'OrderPropOption';
  DESCRIPTION?: Maybe<Scalars['String']['output']>;
  ICON?: Maybe<Scalars['String']['output']>;
  ID?: Maybe<Scalars['Int']['output']>;
  NAME?: Maybe<Scalars['String']['output']>;
  SORT?: Maybe<Scalars['Int']['output']>;
  VALUE?: Maybe<Scalars['Json']['output']>;
  XML_ID?: Maybe<Scalars['String']['output']>;
};

export type OrderPropValue = {
  __typename?: 'OrderPropValue';
  CODE?: Maybe<Scalars['String']['output']>;
  ID?: Maybe<Scalars['Int']['output']>;
  IS_READONLY?: Maybe<Scalars['Boolean']['output']>;
  NAME?: Maybe<Scalars['String']['output']>;
  PROP?: Maybe<OrderProp>;
  VALUE?: Maybe<Scalars['Json']['output']>;
  VALUES?: Maybe<Scalars['Json']['output']>;
  VALUE_DESCRIPTION?: Maybe<Scalars['String']['output']>;
  VALUE_SHORT?: Maybe<Scalars['String']['output']>;
  VALUE_VIEW?: Maybe<Scalars['String']['output']>;
};

export type OrderScope = {
  __typename?: 'OrderScope';
  CONTRACT_NUM?: Maybe<Scalars['String']['output']>;
  ENTITY_ID?: Maybe<Scalars['Int']['output']>;
  ENTITY_TYPE?: Maybe<Scalars['String']['output']>;
};

export type OrderStatus = {
  __typename?: 'OrderStatus';
  COLOR?: Maybe<Scalars['String']['output']>;
  ID?: Maybe<Scalars['String']['output']>;
  NAME?: Maybe<Scalars['String']['output']>;
  SORT?: Maybe<Scalars['Int']['output']>;
  TYPE?: Maybe<Scalars['String']['output']>;
};

export type PageContentChunk = {
  __typename?: 'PageContentChunk';
  CODE?: Maybe<Scalars['String']['output']>;
  GROUP?: Maybe<Scalars['String']['output']>;
  NAME?: Maybe<Scalars['String']['output']>;
  TYPE?: Maybe<Scalars['String']['output']>;
  VALUE?: Maybe<Scalars['String']['output']>;
};

export type PageDataChunk = {
  __typename?: 'PageDataChunk';
  CODE?: Maybe<Scalars['String']['output']>;
  TYPE?: Maybe<Scalars['String']['output']>;
  VALUE?: Maybe<Scalars['Json']['output']>;
};

export type PageElement = {
  __typename?: 'PageElement';
  ACTIONS?: Maybe<Scalars['Json']['output']>;
  ACTIVE?: Maybe<Scalars['Boolean']['output']>;
  ACTIVE_FROM?: Maybe<Scalars['Json']['output']>;
  ADMIN_URL?: Maybe<Scalars['Json']['output']>;
  CODE?: Maybe<Scalars['String']['output']>;
  CONTENT_CHUNKS?: Maybe<Array<Maybe<PageContentChunk>>>;
  CREATED?: Maybe<Scalars['Json']['output']>;
  DATA_CHUNKS?: Maybe<Array<Maybe<PageDataChunk>>>;
  DETAIL_IMAGE?: Maybe<Image>;
  DETAIL_TEXT?: Maybe<Scalars['Json']['output']>;
  IBLOCK_CODE?: Maybe<Scalars['Int']['output']>;
  IBLOCK_ID?: Maybe<Scalars['Int']['output']>;
  IBLOCK_SECTION_ID?: Maybe<Scalars['Int']['output']>;
  IBLOCK_SECTION_IDS: Array<Maybe<Scalars['Int']['output']>>;
  ID: Scalars['Int']['output'];
  LIST_IMAGE?: Maybe<Image>;
  META?: Maybe<ElementMeta>;
  NAME?: Maybe<Scalars['String']['output']>;
  PATH?: Maybe<Array<Maybe<Section>>>;
  PREVIEW_TEXT?: Maybe<Scalars['Json']['output']>;
  PROPS?: Maybe<Array<Maybe<ElementProp>>>;
  PROPS_VALUES?: Maybe<Array<Maybe<ElementProp>>>;
  PROP_TPL_PAGE_CONTENT?: Maybe<Scalars['String']['output']>;
  PROP_TPL_PAGE_VIEW?: Maybe<Scalars['String']['output']>;
  RATING?: Maybe<Scalars['Float']['output']>;
  RATING_VOTES?: Maybe<Scalars['Int']['output']>;
  ROOT_SECTION?: Maybe<Section>;
  SECTION?: Maybe<Section>;
  SECTIONS?: Maybe<Array<Maybe<Section>>>;
  SORT?: Maybe<Scalars['Int']['output']>;
  URL?: Maybe<Scalars['String']['output']>;
};


export type PageElementActionsArgs = {
  detail?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
};


export type PageElementActiveFromArgs = {
  format?: InputMaybe<Scalars['String']['input']>;
  formatDefault?: InputMaybe<Scalars['Boolean']['input']>;
  withTime?: InputMaybe<Scalars['Boolean']['input']>;
};


export type PageElementCreatedArgs = {
  format?: InputMaybe<Scalars['String']['input']>;
  formatDefault?: InputMaybe<Scalars['Boolean']['input']>;
  withTime?: InputMaybe<Scalars['Boolean']['input']>;
};


export type PageElementDetailTextArgs = {
  format?: InputMaybe<Scalars['Boolean']['input']>;
};


export type PageElementPreviewTextArgs = {
  format?: InputMaybe<Scalars['Boolean']['input']>;
};


export type PageElementPropsArgs = {
  detail?: InputMaybe<Scalars['Boolean']['input']>;
  includeEmptyValues?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
};


export type PageElementPropsValuesArgs = {
  detail?: InputMaybe<Scalars['Boolean']['input']>;
  includeEmptyValues?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
};

export type Paycard = {
  __typename?: 'Paycard';
  ACTIONS?: Maybe<Scalars['Json']['output']>;
  DATE_CREATE?: Maybe<Scalars['Json']['output']>;
  DEFAULT?: Maybe<Scalars['Boolean']['output']>;
  ID: Scalars['Int']['output'];
  NAME?: Maybe<Scalars['String']['output']>;
  TITLE?: Maybe<Scalars['String']['output']>;
  USER?: Maybe<User>;
  USER_ID?: Maybe<Scalars['Int']['output']>;
  VALUE?: Maybe<Scalars['String']['output']>;
};


export type PaycardActionsArgs = {
  detail?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
};


export type PaycardDateCreateArgs = {
  format?: InputMaybe<Scalars['String']['input']>;
  formatDefault?: InputMaybe<Scalars['Boolean']['input']>;
  withTime?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Payment = {
  __typename?: 'Payment';
  DATE_PAID?: Maybe<Scalars['Json']['output']>;
  ID?: Maybe<Scalars['Int']['output']>;
  IS_PAID?: Maybe<Scalars['Boolean']['output']>;
  ORDER_ID?: Maybe<Scalars['String']['output']>;
  ORDER_URL?: Maybe<Scalars['String']['output']>;
  PAYSYSTEM?: Maybe<Paysystem>;
  PAYSYSTEM_ID?: Maybe<Scalars['Int']['output']>;
  PAY_NAV?: Maybe<Scalars['Json']['output']>;
  PS_INVOICE_ID?: Maybe<Scalars['String']['output']>;
  PS_STATUS?: Maybe<Scalars['String']['output']>;
  PS_STATUS_CODE?: Maybe<Scalars['String']['output']>;
  PS_STATUS_ID?: Maybe<Scalars['String']['output']>;
  PS_STATUS_NAME?: Maybe<Scalars['String']['output']>;
  SUM?: Maybe<Scalars['Float']['output']>;
  SUM_PAID?: Maybe<Scalars['Float']['output']>;
};


export type PaymentDatePaidArgs = {
  format?: InputMaybe<Scalars['String']['input']>;
  formatDefault?: InputMaybe<Scalars['Boolean']['input']>;
  withTime?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Paysystem = {
  __typename?: 'Paysystem';
  CODE?: Maybe<Scalars['String']['output']>;
  DESCRIPTION?: Maybe<Scalars['String']['output']>;
  ID?: Maybe<Scalars['Int']['output']>;
  IS_BILL?: Maybe<Scalars['Boolean']['output']>;
  IS_INNER?: Maybe<Scalars['Boolean']['output']>;
  IS_ONLINE?: Maybe<Scalars['Boolean']['output']>;
  IS_ONLINE_DELAYED?: Maybe<Scalars['Boolean']['output']>;
  NAME?: Maybe<Scalars['String']['output']>;
};

export type PaysystemComputed = {
  __typename?: 'PaysystemComputed';
  CALC_TIMESTAMP?: Maybe<Scalars['Int']['output']>;
  ID?: Maybe<Scalars['Int']['output']>;
  NAME?: Maybe<Scalars['String']['output']>;
  PRICE?: Maybe<Scalars['Float']['output']>;
  PRICE_FORMATED?: Maybe<Scalars['String']['output']>;
  SERVICE?: Maybe<Paysystem>;
};

export type PersonType = {
  __typename?: 'PersonType';
  CODE?: Maybe<Scalars['String']['output']>;
  ID?: Maybe<Scalars['Int']['output']>;
  IS_COMPANY?: Maybe<Scalars['Boolean']['output']>;
  NAME?: Maybe<Scalars['String']['output']>;
  RESTRICTED?: Maybe<Scalars['Boolean']['output']>;
  SORT?: Maybe<Scalars['Int']['output']>;
};

export type ProductElement = {
  __typename?: 'ProductElement';
  ACTIONS?: Maybe<Scalars['Json']['output']>;
  ACTIVE?: Maybe<Scalars['Boolean']['output']>;
  ACTIVE_FROM?: Maybe<Scalars['Json']['output']>;
  ADDITIVES?: Maybe<Array<Maybe<ProductElement>>>;
  ADMIN_URL?: Maybe<Scalars['Json']['output']>;
  AVAILABLE?: Maybe<Scalars['Boolean']['output']>;
  BUILD?: Maybe<ConstructorBuild>;
  CODE?: Maybe<Scalars['String']['output']>;
  CREATED?: Maybe<Scalars['Json']['output']>;
  DETAIL_IMAGE?: Maybe<Image>;
  DETAIL_TEXT?: Maybe<Scalars['Json']['output']>;
  FAV?: Maybe<CatalogFav>;
  FLAGS?: Maybe<Array<Maybe<ProductFlag>>>;
  GIFTS?: Maybe<Array<Maybe<ProductGift>>>;
  IBLOCK_CODE?: Maybe<Scalars['Int']['output']>;
  IBLOCK_ID?: Maybe<Scalars['Int']['output']>;
  IBLOCK_SECTION_ID?: Maybe<Scalars['Int']['output']>;
  IBLOCK_SECTION_IDS: Array<Maybe<Scalars['Int']['output']>>;
  ID: Scalars['Int']['output'];
  IS_SALE_SPECIAL?: Maybe<Scalars['Boolean']['output']>;
  LIST_IMAGE?: Maybe<Image>;
  MEASURE?: Maybe<ProductMeasure>;
  META?: Maybe<ElementMeta>;
  NAME?: Maybe<Scalars['String']['output']>;
  NOT_AVAILABLE_REASON?: Maybe<Scalars['Json']['output']>;
  OFFERS?: Maybe<Array<Maybe<ProductElement>>>;
  OFFER_PARENT_ELEMENT?: Maybe<ProductElement>;
  PARENT?: Maybe<ProductElement>;
  PATH?: Maybe<Array<Maybe<ProductSection>>>;
  PREVIEW_TEXT?: Maybe<Scalars['Json']['output']>;
  PRICE?: Maybe<ProductPrice>;
  PROPS?: Maybe<Array<Maybe<ElementProp>>>;
  PROPS_VALUES?: Maybe<Array<Maybe<ElementProp>>>;
  PROP_CHTO_PO_SOSTAVU?: Maybe<Scalars['String']['output']>;
  PROP_DOPOLNITELNO?: Maybe<Scalars['String']['output']>;
  PROP_DOSTAVKA?: Maybe<Scalars['String']['output']>;
  PROP_FLAZHKI_ENUM_ID?: Maybe<Scalars['Int']['output']>;
  PROP_IS_FARM_XML_ID?: Maybe<Scalars['String']['output']>;
  PROP_IS_NEW_XML_ID?: Maybe<Scalars['String']['output']>;
  PROP_IZBRANNYE_TOVARY_XML_ID?: Maybe<Scalars['String']['output']>;
  PROP_KAK_GOTOVIT?: Maybe<Scalars['String']['output']>;
  PROP_MINIMALNYY_ZAKAZ?: Maybe<Scalars['Float']['output']>;
  PROP_MORE_PHOTO?: Maybe<Array<Maybe<Image>>>;
  PROP_PRICE_OLD_1?: Maybe<Scalars['Int']['output']>;
  PROP_SEO_TEXT?: Maybe<Scalars['String']['output']>;
  PROP_STRANA_PROISKHOZHDENIYA?: Maybe<Scalars['String']['output']>;
  PROP_TOVAR_PO_AKTSII?: Maybe<Scalars['String']['output']>;
  PROP_TOVAR_PO_AKTSII_XML_ID?: Maybe<Scalars['String']['output']>;
  PROP_VES_UPAKOVKI_1?: Maybe<Scalars['String']['output']>;
  RATING?: Maybe<Scalars['Float']['output']>;
  RATING_VOTES?: Maybe<Scalars['Int']['output']>;
  REQUIRED_MIN_PRICE?: Maybe<Scalars['Int']['output']>;
  ROOT_SECTION?: Maybe<ProductSection>;
  SALES_COUNT?: Maybe<Scalars['Int']['output']>;
  SALE_TIME?: Maybe<Scalars['Json']['output']>;
  SECTION?: Maybe<ProductSection>;
  SECTIONS?: Maybe<Array<Maybe<ProductSection>>>;
  SORT?: Maybe<Scalars['Int']['output']>;
  SOSTAV_ROLLS?: Maybe<Array<Maybe<ProductElement>>>;
  SOSTAV_ROLLS_COUNT?: Maybe<Scalars['Json']['output']>;
  SOSTAV_ROLLS_IDS: Array<Maybe<Scalars['Int']['output']>>;
  TAGS?: Maybe<Array<Maybe<ProductTagElement>>>;
  UPSALE_ELEMENTS: Array<Maybe<Scalars['Int']['output']>>;
  UPSALE_SECTIONS: Array<Maybe<Scalars['Int']['output']>>;
  URL?: Maybe<Scalars['String']['output']>;
  WEIGHT?: Maybe<Scalars['Int']['output']>;
};


export type ProductElementActionsArgs = {
  detail?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
};


export type ProductElementActiveFromArgs = {
  format?: InputMaybe<Scalars['String']['input']>;
  formatDefault?: InputMaybe<Scalars['Boolean']['input']>;
  withTime?: InputMaybe<Scalars['Boolean']['input']>;
};


export type ProductElementCreatedArgs = {
  format?: InputMaybe<Scalars['String']['input']>;
  formatDefault?: InputMaybe<Scalars['Boolean']['input']>;
  withTime?: InputMaybe<Scalars['Boolean']['input']>;
};


export type ProductElementDetailTextArgs = {
  format?: InputMaybe<Scalars['Boolean']['input']>;
};


export type ProductElementPreviewTextArgs = {
  format?: InputMaybe<Scalars['Boolean']['input']>;
};


export type ProductElementPropsArgs = {
  detail?: InputMaybe<Scalars['Boolean']['input']>;
  includeEmptyValues?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
};


export type ProductElementPropsValuesArgs = {
  detail?: InputMaybe<Scalars['Boolean']['input']>;
  includeEmptyValues?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
};


export type ProductElementPropSeoTextArgs = {
  format?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ProductElementConnection = {
  __typename?: 'ProductElementConnection';
  info?: Maybe<QueryInfo>;
  nodes?: Maybe<Array<Maybe<ProductElement>>>;
};

export type ProductElementFilter = {
  ACTIVE?: InputMaybe<Scalars['Boolean']['input']>;
  CATALOG_AVAILABLE?: InputMaybe<Scalars['Boolean']['input']>;
  CODE?: InputMaybe<StringFilterInput>;
  FLAG_CODE?: InputMaybe<Scalars['String']['input']>;
  FLAG_ID?: InputMaybe<Scalars['Int']['input']>;
  IBLOCK_ID?: InputMaybe<Scalars['Int']['input']>;
  ID?: InputMaybe<IntFilterInput>;
  INCLUDE_SUBSECTIONS?: InputMaybe<Scalars['Boolean']['input']>;
  IN_BESTSELLERS?: InputMaybe<Scalars['Boolean']['input']>;
  IN_FAVORITES?: InputMaybe<Scalars['Json']['input']>;
  IN_USER_BESTSELLERS?: InputMaybe<Scalars['Boolean']['input']>;
  IN_VIEWED?: InputMaybe<Scalars['Boolean']['input']>;
  IS_DISCOUNT?: InputMaybe<Scalars['Boolean']['input']>;
  IS_FARM?: InputMaybe<Scalars['Boolean']['input']>;
  IS_HIT?: InputMaybe<Scalars['Boolean']['input']>;
  IS_NEW?: InputMaybe<Scalars['Boolean']['input']>;
  IS_SEASON?: InputMaybe<Scalars['Boolean']['input']>;
  NAME?: InputMaybe<StringFilterInput>;
  REQUIRED_MIN_PRICE?: InputMaybe<Scalars['Boolean']['input']>;
  SEARCH?: InputMaybe<StringFilterInput>;
  SECTION_CODE?: InputMaybe<StringFilterInput>;
  SECTION_CODE_PATH?: InputMaybe<StringFilterInput>;
  SECTION_ID?: InputMaybe<IntFilterInput>;
};

export type ProductFlag = {
  __typename?: 'ProductFlag';
  CODE?: Maybe<Scalars['String']['output']>;
  COLOR?: Maybe<Scalars['String']['output']>;
  COLOR_HEX?: Maybe<Scalars['String']['output']>;
  MOBILE_TEXT_CLASS?: Maybe<Scalars['String']['output']>;
  MOBILE_TEXT_CLASS_DETAIL?: Maybe<Scalars['String']['output']>;
  NAME?: Maybe<Scalars['String']['output']>;
  NAME_SHORT?: Maybe<Scalars['String']['output']>;
};

export type ProductGift = {
  __typename?: 'ProductGift';
  GIFT_ID?: Maybe<Scalars['String']['output']>;
  IMAGE?: Maybe<Image>;
  NAME?: Maybe<Scalars['String']['output']>;
};

export type ProductMeasure = {
  __typename?: 'ProductMeasure';
  NAME?: Maybe<Scalars['String']['output']>;
  RATIO?: Maybe<Scalars['Float']['output']>;
};

export type ProductPrice = {
  __typename?: 'ProductPrice';
  DISCOUNTED?: Maybe<Scalars['Float']['output']>;
  DISCOUNT_PERCENT?: Maybe<Scalars['Float']['output']>;
  PRICE?: Maybe<Scalars['Float']['output']>;
};

export type ProductSection = {
  __typename?: 'ProductSection';
  CHILDREN?: Maybe<Array<Maybe<ProductSection>>>;
  CODE?: Maybe<Scalars['String']['output']>;
  ELEMENTS?: Maybe<Array<Maybe<ProductElement>>>;
  ELEMENT_CNT?: Maybe<Scalars['Int']['output']>;
  IBLOCK_SECTION_ID?: Maybe<Scalars['Int']['output']>;
  ID: Scalars['Int']['output'];
  META?: Maybe<ElementMeta>;
  NAME?: Maybe<Scalars['String']['output']>;
  PARENT?: Maybe<ProductSection>;
  PARENTS?: Maybe<Array<Maybe<ProductSection>>>;
  PICTURE?: Maybe<Image>;
  PROPS?: Maybe<Array<Maybe<EntityProp>>>;
  REPLACE_LINK?: Maybe<Scalars['String']['output']>;
  SORT?: Maybe<Scalars['Int']['output']>;
  URL?: Maybe<Scalars['String']['output']>;
};


export type ProductSectionChildrenArgs = {
  nav?: InputMaybe<QueryNavInput>;
  subsections?: InputMaybe<Scalars['Boolean']['input']>;
  where?: InputMaybe<ProductSectionFilter>;
};


export type ProductSectionElementsArgs = {
  filter?: InputMaybe<ProductElementFilter>;
  nav?: InputMaybe<QueryNavInput>;
};


export type ProductSectionPropsArgs = {
  detail?: InputMaybe<Scalars['Boolean']['input']>;
  includeEmptyValues?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
};

export type ProductSectionFilter = {
  ACTIVE?: InputMaybe<Scalars['String']['input']>;
  CNT_ACTIVE?: InputMaybe<Scalars['String']['input']>;
  CODE?: InputMaybe<StringFilterInput>;
  CODE_PATH?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  IBLOCK_ID?: InputMaybe<Scalars['Int']['input']>;
  ID?: InputMaybe<IntFilterInput>;
  NAME?: InputMaybe<StringFilterInput>;
  PARENT_CODE?: InputMaybe<StringFilterInput>;
  ROOT?: InputMaybe<Scalars['Boolean']['input']>;
  UF_FRONTPAGE?: InputMaybe<Scalars['String']['input']>;
  WITH_ELEMENT_COUNT?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ProductStop = {
  __typename?: 'ProductStop';
  ACTIONS?: Maybe<Scalars['Json']['output']>;
  ACTIVE?: Maybe<Scalars['Boolean']['output']>;
  ACTIVE_FROM?: Maybe<Scalars['Json']['output']>;
  ADMIN_URL?: Maybe<Scalars['Json']['output']>;
  CODE?: Maybe<Scalars['String']['output']>;
  CREATED?: Maybe<Scalars['Json']['output']>;
  DETAIL_IMAGE?: Maybe<Image>;
  DETAIL_TEXT?: Maybe<Scalars['Json']['output']>;
  IBLOCK_CODE?: Maybe<Scalars['Int']['output']>;
  IBLOCK_ID?: Maybe<Scalars['Int']['output']>;
  IBLOCK_SECTION_ID?: Maybe<Scalars['Int']['output']>;
  IBLOCK_SECTION_IDS: Array<Maybe<Scalars['Int']['output']>>;
  ID: Scalars['Int']['output'];
  LIST_IMAGE?: Maybe<Image>;
  META?: Maybe<ElementMeta>;
  NAME?: Maybe<Scalars['String']['output']>;
  PATH?: Maybe<Array<Maybe<Section>>>;
  PREVIEW_TEXT?: Maybe<Scalars['Json']['output']>;
  PROPS?: Maybe<Array<Maybe<ElementProp>>>;
  PROPS_VALUES?: Maybe<Array<Maybe<ElementProp>>>;
  RATING?: Maybe<Scalars['Float']['output']>;
  RATING_VOTES?: Maybe<Scalars['Int']['output']>;
  ROOT_SECTION?: Maybe<Section>;
  SECTION?: Maybe<Section>;
  SECTIONS?: Maybe<Array<Maybe<Section>>>;
  SORT?: Maybe<Scalars['Int']['output']>;
  URL?: Maybe<Scalars['String']['output']>;
};


export type ProductStopActionsArgs = {
  detail?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
};


export type ProductStopActiveFromArgs = {
  format?: InputMaybe<Scalars['String']['input']>;
  formatDefault?: InputMaybe<Scalars['Boolean']['input']>;
  withTime?: InputMaybe<Scalars['Boolean']['input']>;
};


export type ProductStopCreatedArgs = {
  format?: InputMaybe<Scalars['String']['input']>;
  formatDefault?: InputMaybe<Scalars['Boolean']['input']>;
  withTime?: InputMaybe<Scalars['Boolean']['input']>;
};


export type ProductStopDetailTextArgs = {
  format?: InputMaybe<Scalars['Boolean']['input']>;
};


export type ProductStopPreviewTextArgs = {
  format?: InputMaybe<Scalars['Boolean']['input']>;
};


export type ProductStopPropsArgs = {
  detail?: InputMaybe<Scalars['Boolean']['input']>;
  includeEmptyValues?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
};


export type ProductStopPropsValuesArgs = {
  detail?: InputMaybe<Scalars['Boolean']['input']>;
  includeEmptyValues?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
};

export type ProductTag = {
  __typename?: 'ProductTag';
  ACTIONS?: Maybe<Scalars['Json']['output']>;
  ACTIVE?: Maybe<Scalars['Boolean']['output']>;
  ACTIVE_FROM?: Maybe<Scalars['Json']['output']>;
  ADMIN_URL?: Maybe<Scalars['Json']['output']>;
  CODE?: Maybe<Scalars['String']['output']>;
  CREATED?: Maybe<Scalars['Json']['output']>;
  DETAIL_IMAGE?: Maybe<Image>;
  DETAIL_TEXT?: Maybe<Scalars['Json']['output']>;
  IBLOCK_CODE?: Maybe<Scalars['Int']['output']>;
  IBLOCK_ID?: Maybe<Scalars['Int']['output']>;
  IBLOCK_SECTION_ID?: Maybe<Scalars['Int']['output']>;
  IBLOCK_SECTION_IDS: Array<Maybe<Scalars['Int']['output']>>;
  ID: Scalars['Int']['output'];
  LIST_IMAGE?: Maybe<Image>;
  META?: Maybe<ElementMeta>;
  NAME?: Maybe<Scalars['String']['output']>;
  PATH?: Maybe<Array<Maybe<Section>>>;
  PREVIEW_TEXT?: Maybe<Scalars['Json']['output']>;
  PROPS?: Maybe<Array<Maybe<ElementProp>>>;
  PROPS_VALUES?: Maybe<Array<Maybe<ElementProp>>>;
  RATING?: Maybe<Scalars['Float']['output']>;
  RATING_VOTES?: Maybe<Scalars['Int']['output']>;
  ROOT_SECTION?: Maybe<Section>;
  SECTION?: Maybe<Section>;
  SECTIONS?: Maybe<Array<Maybe<Section>>>;
  SORT?: Maybe<Scalars['Int']['output']>;
  URL?: Maybe<Scalars['String']['output']>;
};


export type ProductTagActionsArgs = {
  detail?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
};


export type ProductTagActiveFromArgs = {
  format?: InputMaybe<Scalars['String']['input']>;
  formatDefault?: InputMaybe<Scalars['Boolean']['input']>;
  withTime?: InputMaybe<Scalars['Boolean']['input']>;
};


export type ProductTagCreatedArgs = {
  format?: InputMaybe<Scalars['String']['input']>;
  formatDefault?: InputMaybe<Scalars['Boolean']['input']>;
  withTime?: InputMaybe<Scalars['Boolean']['input']>;
};


export type ProductTagDetailTextArgs = {
  format?: InputMaybe<Scalars['Boolean']['input']>;
};


export type ProductTagPreviewTextArgs = {
  format?: InputMaybe<Scalars['Boolean']['input']>;
};


export type ProductTagPropsArgs = {
  detail?: InputMaybe<Scalars['Boolean']['input']>;
  includeEmptyValues?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
};


export type ProductTagPropsValuesArgs = {
  detail?: InputMaybe<Scalars['Boolean']['input']>;
  includeEmptyValues?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
};

export type ProductTagElement = {
  __typename?: 'ProductTagElement';
  CODE?: Maybe<Scalars['String']['output']>;
  ID?: Maybe<Scalars['Int']['output']>;
  NAME?: Maybe<Scalars['String']['output']>;
};

export type PromoElement = {
  __typename?: 'PromoElement';
  ACTIONS?: Maybe<Scalars['Json']['output']>;
  ACTIVE?: Maybe<Scalars['Boolean']['output']>;
  ACTIVE_FROM?: Maybe<Scalars['Json']['output']>;
  ADMIN_URL?: Maybe<Scalars['Json']['output']>;
  CODE?: Maybe<Scalars['String']['output']>;
  CREATED?: Maybe<Scalars['Json']['output']>;
  DETAIL_IMAGE?: Maybe<Image>;
  DETAIL_TEXT?: Maybe<Scalars['Json']['output']>;
  IBLOCK_CODE?: Maybe<Scalars['Int']['output']>;
  IBLOCK_ID?: Maybe<Scalars['Int']['output']>;
  IBLOCK_SECTION_ID?: Maybe<Scalars['Int']['output']>;
  IBLOCK_SECTION_IDS: Array<Maybe<Scalars['Int']['output']>>;
  ID: Scalars['Int']['output'];
  LIST_IMAGE?: Maybe<Image>;
  META?: Maybe<ElementMeta>;
  MOBILE_ACTION?: Maybe<MenuItem>;
  NAME?: Maybe<Scalars['String']['output']>;
  PATH?: Maybe<Array<Maybe<Section>>>;
  PREVIEW_TEXT?: Maybe<Scalars['Json']['output']>;
  PROPS?: Maybe<Array<Maybe<ElementProp>>>;
  PROPS_VALUES?: Maybe<Array<Maybe<ElementProp>>>;
  RATING?: Maybe<Scalars['Float']['output']>;
  RATING_VOTES?: Maybe<Scalars['Int']['output']>;
  ROOT_SECTION?: Maybe<Section>;
  SECTION?: Maybe<Section>;
  SECTIONS?: Maybe<Array<Maybe<Section>>>;
  SORT?: Maybe<Scalars['Int']['output']>;
  URL?: Maybe<Scalars['String']['output']>;
  WEB_ACTION?: Maybe<MenuItem>;
};


export type PromoElementActionsArgs = {
  detail?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
};


export type PromoElementActiveFromArgs = {
  format?: InputMaybe<Scalars['String']['input']>;
  formatDefault?: InputMaybe<Scalars['Boolean']['input']>;
  withTime?: InputMaybe<Scalars['Boolean']['input']>;
};


export type PromoElementCreatedArgs = {
  format?: InputMaybe<Scalars['String']['input']>;
  formatDefault?: InputMaybe<Scalars['Boolean']['input']>;
  withTime?: InputMaybe<Scalars['Boolean']['input']>;
};


export type PromoElementDetailTextArgs = {
  format?: InputMaybe<Scalars['Boolean']['input']>;
};


export type PromoElementPreviewTextArgs = {
  format?: InputMaybe<Scalars['Boolean']['input']>;
};


export type PromoElementPropsArgs = {
  detail?: InputMaybe<Scalars['Boolean']['input']>;
  includeEmptyValues?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
};


export type PromoElementPropsValuesArgs = {
  detail?: InputMaybe<Scalars['Boolean']['input']>;
  includeEmptyValues?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
};

export type Query = {
  __typename?: 'Query';
  banner_element?: Maybe<Element>;
  banner_elements?: Maybe<ElementConnection>;
  catalog_constructor?: Maybe<ConstructorSection>;
  catalog_constructor_build_bestsellers?: Maybe<Array<Maybe<ProductElement>>>;
  catalog_constructor_build_list?: Maybe<Array<Maybe<ProductElement>>>;
  catalog_constructor_ensure_element?: Maybe<ProductElement>;
  catalog_fav_items?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  catalog_favorites?: Maybe<Array<Maybe<ProductElement>>>;
  catalog_product?: Maybe<ProductElement>;
  catalog_product_favorites?: Maybe<Array<Maybe<ProductElement>>>;
  catalog_product_list?: Maybe<Array<Maybe<ProductElement>>>;
  catalog_product_recordset?: Maybe<ProductElementConnection>;
  catalog_search?: Maybe<SearchResult>;
  catalog_search_new?: Maybe<Array<Maybe<ProductElement>>>;
  catalog_section?: Maybe<ProductSection>;
  catalog_section_list?: Maybe<Array<Maybe<ProductSection>>>;
  catalog_stop_products?: Maybe<Array<Maybe<ProductStop>>>;
  catalog_tag_list?: Maybe<Array<Maybe<ProductTag>>>;
  command_commands?: Maybe<Array<Maybe<Command>>>;
  company_pub_contact?: Maybe<CompanyContact>;
  company_pub_contacts?: Maybe<CompanyContactConnection>;
  company_pub_office?: Maybe<CompanyOffice>;
  company_pub_office_list?: Maybe<Array<Maybe<CompanyOffice>>>;
  company_pub_office_recordset?: Maybe<CompanyOfficeConnection>;
  company_pub_vacancy_list?: Maybe<Array<Maybe<CompanyVacancy>>>;
  entity_types_info?: Maybe<Scalars['Json']['output']>;
  event_pub_list?: Maybe<Array<Maybe<ClientEmit>>>;
  faq_element?: Maybe<FaqElement>;
  faq_element_list?: Maybe<Array<Maybe<FaqElement>>>;
  faq_elements?: Maybe<ElementConnection>;
  faq_sections?: Maybe<Array<Maybe<Section>>>;
  geo_geocoder_location_by_address?: Maybe<GeoObject>;
  geo_geocoder_locations_by_coords?: Maybe<Array<Maybe<GeoObject>>>;
  job_admin_run?: Maybe<JobResult>;
  job_admin_type_list?: Maybe<Array<Maybe<JobType>>>;
  main_appState?: Maybe<Scalars['Json']['output']>;
  main_operation?: Maybe<Operation>;
  menu_mobile_menus?: Maybe<Array<Maybe<MenuMobile>>>;
  notice_pub_list?: Maybe<Array<Maybe<ClientNotice>>>;
  offer_pub_common_list?: Maybe<Array<Maybe<Offer>>>;
  offer_pub_user_list?: Maybe<Array<Maybe<Offer>>>;
  page_element?: Maybe<PageElement>;
  page_element_list?: Maybe<Array<Maybe<PageElement>>>;
  page_elements?: Maybe<ElementConnection>;
  page_route?: Maybe<PageElement>;
  post_element?: Maybe<Element>;
  post_elements?: Maybe<ElementConnection>;
  promo_element?: Maybe<PromoElement>;
  promo_elements?: Maybe<Array<Maybe<PromoElement>>>;
  review_pub_list?: Maybe<Array<Maybe<ReviewElement>>>;
  review_pub_product_recordset?: Maybe<ReviewElementConnection>;
  review_pub_recordset?: Maybe<ReviewElementConnection>;
  review_pub_user_list?: Maybe<Array<Maybe<ReviewElement>>>;
  review_pub_user_recordset?: Maybe<ReviewElementConnection>;
  review_pub_user_single?: Maybe<ReviewElement>;
  review_pub_user_stat?: Maybe<ReviewUserStat>;
  sale_bonus_levels?: Maybe<Array<Maybe<BonusLevelElement>>>;
  sale_delivery_services?: Maybe<Array<Maybe<DeliveryService>>>;
  sale_delivery_zone_element?: Maybe<DeliveryZoneElement>;
  sale_delivery_zone_elements?: Maybe<DeliveryZoneElementConnection>;
  sale_delivery_zone_list?: Maybe<Array<Maybe<DeliveryZoneElement>>>;
  sale_departments?: Maybe<Array<Maybe<SaleDepartment>>>;
  sale_locations_default?: Maybe<Array<Maybe<Location>>>;
  sale_order_prop_groups?: Maybe<Array<Maybe<OrderPropGroup>>>;
  sale_order_props?: Maybe<Array<Maybe<OrderProp>>>;
  sale_order_statuses?: Maybe<Array<Maybe<OrderStatus>>>;
  sale_paysystems?: Maybe<Array<Maybe<Paysystem>>>;
  sale_person_types?: Maybe<Array<Maybe<PersonType>>>;
  sale_pub_buyer_company_list?: Maybe<Array<Maybe<BuyerCompanyElement>>>;
  sale_pub_buyer_company_scope_list?: Maybe<Array<Maybe<BuyerCompanyElement>>>;
  sale_pub_buyer_company_single?: Maybe<BuyerCompanyElement>;
  sale_pub_client_card_apply_by_phone?: Maybe<SaleClientCard>;
  sale_pub_client_card_fetch?: Maybe<SaleClientCard>;
  sale_pub_fav_state?: Maybe<Array<Maybe<FavItem>>>;
  sale_pub_order_active_list?: Maybe<Array<Maybe<Order>>>;
  sale_pub_order_ensure_payment?: Maybe<Payment>;
  sale_pub_order_list?: Maybe<Array<Maybe<Order>>>;
  sale_pub_order_pay_online?: Maybe<OrderPayOnline>;
  sale_pub_order_recordset?: Maybe<OrderConnection>;
  sale_pub_order_single?: Maybe<Order>;
  sale_pub_order_test?: Maybe<Order>;
  sale_pub_paycard_list?: Maybe<Array<Maybe<Paycard>>>;
  sale_pub_person_type_list?: Maybe<Array<Maybe<PersonType>>>;
  sale_pub_person_types?: Maybe<Array<Maybe<PersonType>>>;
  sale_pub_profile_form?: Maybe<OrderProfileForm>;
  sale_pub_profile_list?: Maybe<Array<Maybe<OrderProfile>>>;
  sale_pub_profile_single?: Maybe<OrderProfile>;
  sale_pub_service_order_list?: Maybe<Array<Maybe<ServiceOrder>>>;
  sale_pub_vorder?: Maybe<Vorder>;
  sale_pub_vorder_basket_products?: Maybe<Array<Maybe<ProductElement>>>;
  sale_pub_vorder_summary?: Maybe<VorderSummary>;
  search_suggestions?: Maybe<Array<Maybe<SearchSuggestion>>>;
  search_suggestions_popular?: Maybe<Array<Maybe<SearchSuggestionElement>>>;
  settings_list?: Maybe<Array<Maybe<Setting>>>;
  user_avatar_elements?: Maybe<Array<Maybe<UserAvatarElement>>>;
  user_fetch?: Maybe<User>;
  user_pub_app_client?: Maybe<AppClient>;
  user_pub_login_find?: Maybe<Scalars['Json']['output']>;
  user_session?: Maybe<UserSession>;
  webcam_recordset?: Maybe<WebcamConnection>;
  webcam_single?: Maybe<Webcam>;
};


export type QueryBannerElementArgs = {
  filter?: InputMaybe<ElementFilter>;
  id?: InputMaybe<Scalars['Int']['input']>;
  nav?: InputMaybe<QueryNavInput>;
  nocache?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<Scalars['Json']['input']>;
};


export type QueryBannerElementsArgs = {
  filter?: InputMaybe<ElementFilter>;
  id?: InputMaybe<Scalars['Int']['input']>;
  nav?: InputMaybe<QueryNavInput>;
  nocache?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<Scalars['Json']['input']>;
};


export type QueryCatalogConstructorArgs = {
  elementDetail?: InputMaybe<Scalars['Boolean']['input']>;
  elementViewmode?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<ProductSectionFilter>;
  id?: InputMaybe<Scalars['Int']['input']>;
  nav?: InputMaybe<QueryNavInput>;
  sectionViewmode?: InputMaybe<Scalars['String']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCatalogConstructorBuildBestsellersArgs = {
  elementDetail?: InputMaybe<Scalars['Boolean']['input']>;
  elementViewmode?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<ProductElementFilter>;
  id?: InputMaybe<Scalars['Int']['input']>;
  nav?: InputMaybe<QueryNavInput>;
  sectionViewmode?: InputMaybe<Scalars['String']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCatalogConstructorBuildListArgs = {
  elementDetail?: InputMaybe<Scalars['Boolean']['input']>;
  elementViewmode?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<ProductElementFilter>;
  id?: InputMaybe<Scalars['Int']['input']>;
  nav?: InputMaybe<QueryNavInput>;
  sectionViewmode?: InputMaybe<Scalars['String']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCatalogConstructorEnsureElementArgs = {
  constructor?: InputMaybe<Scalars['Json']['input']>;
  sectionCode?: InputMaybe<Scalars['String']['input']>;
  sectionId?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryCatalogFavoritesArgs = {
  type?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCatalogProductArgs = {
  elementDetail?: InputMaybe<Scalars['Boolean']['input']>;
  elementViewmode?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<ProductElementFilter>;
  id?: InputMaybe<Scalars['Int']['input']>;
  nav?: InputMaybe<QueryNavInput>;
  sectionViewmode?: InputMaybe<Scalars['String']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCatalogProductFavoritesArgs = {
  elementDetail?: InputMaybe<Scalars['Boolean']['input']>;
  elementViewmode?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<ProductElementFilter>;
  id?: InputMaybe<Scalars['Int']['input']>;
  nav?: InputMaybe<QueryNavInput>;
  nocache?: InputMaybe<Scalars['Boolean']['input']>;
  sectionViewmode?: InputMaybe<Scalars['String']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<Scalars['Json']['input']>;
};


export type QueryCatalogProductListArgs = {
  elementDetail?: InputMaybe<Scalars['Boolean']['input']>;
  elementViewmode?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<ProductElementFilter>;
  id?: InputMaybe<Scalars['Int']['input']>;
  nav?: InputMaybe<QueryNavInput>;
  nocache?: InputMaybe<Scalars['Boolean']['input']>;
  sectionViewmode?: InputMaybe<Scalars['String']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<Scalars['Json']['input']>;
};


export type QueryCatalogProductRecordsetArgs = {
  elementDetail?: InputMaybe<Scalars['Boolean']['input']>;
  elementViewmode?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<ProductElementFilter>;
  id?: InputMaybe<Scalars['Int']['input']>;
  nav?: InputMaybe<QueryNavInput>;
  nocache?: InputMaybe<Scalars['Boolean']['input']>;
  sectionViewmode?: InputMaybe<Scalars['String']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<Scalars['Json']['input']>;
};


export type QueryCatalogSearchArgs = {
  elementDetail?: InputMaybe<Scalars['Boolean']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCatalogSearchNewArgs = {
  elementDetail?: InputMaybe<Scalars['Boolean']['input']>;
  filterSuggestion?: InputMaybe<Scalars['Json']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCatalogSectionArgs = {
  elementDetail?: InputMaybe<Scalars['Boolean']['input']>;
  elementViewmode?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<ProductSectionFilter>;
  id?: InputMaybe<Scalars['Int']['input']>;
  nav?: InputMaybe<QueryNavInput>;
  sectionViewmode?: InputMaybe<Scalars['String']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCatalogSectionListArgs = {
  elementDetail?: InputMaybe<Scalars['Boolean']['input']>;
  elementViewmode?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<ProductSectionFilter>;
  id?: InputMaybe<Scalars['Int']['input']>;
  nav?: InputMaybe<QueryNavInput>;
  nocache?: InputMaybe<Scalars['Boolean']['input']>;
  sectionViewmode?: InputMaybe<Scalars['String']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<Scalars['Json']['input']>;
};


export type QueryCompanyPubContactArgs = {
  filter?: InputMaybe<ElementFilter>;
  id?: InputMaybe<Scalars['Int']['input']>;
  nav?: InputMaybe<QueryNavInput>;
  nocache?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<Scalars['Json']['input']>;
};


export type QueryCompanyPubContactsArgs = {
  filter?: InputMaybe<ElementFilter>;
  id?: InputMaybe<Scalars['Int']['input']>;
  nav?: InputMaybe<QueryNavInput>;
  nocache?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<Scalars['Json']['input']>;
};


export type QueryCompanyPubOfficeArgs = {
  filter?: InputMaybe<CompanyOfficeFilter>;
  id?: InputMaybe<Scalars['Int']['input']>;
  nav?: InputMaybe<QueryNavInput>;
  nocache?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<Scalars['Json']['input']>;
};


export type QueryCompanyPubOfficeListArgs = {
  filter?: InputMaybe<CompanyOfficeFilter>;
  id?: InputMaybe<Scalars['Int']['input']>;
  nav?: InputMaybe<QueryNavInput>;
  nocache?: InputMaybe<Scalars['Boolean']['input']>;
  position?: InputMaybe<Scalars['Json']['input']>;
  time?: InputMaybe<Scalars['Int']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<Scalars['Json']['input']>;
};


export type QueryCompanyPubOfficeRecordsetArgs = {
  filter?: InputMaybe<CompanyOfficeFilter>;
  id?: InputMaybe<Scalars['Int']['input']>;
  nav?: InputMaybe<QueryNavInput>;
  nocache?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<Scalars['Json']['input']>;
};


export type QueryCompanyPubVacancyListArgs = {
  filter?: InputMaybe<ElementFilter>;
  id?: InputMaybe<Scalars['Int']['input']>;
  nav?: InputMaybe<QueryNavInput>;
  nocache?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<Scalars['Json']['input']>;
};


export type QueryFaqElementArgs = {
  filter?: InputMaybe<ElementFilter>;
  id?: InputMaybe<Scalars['Int']['input']>;
  nav?: InputMaybe<QueryNavInput>;
  nocache?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<Scalars['Json']['input']>;
};


export type QueryFaqElementListArgs = {
  filter?: InputMaybe<ElementFilter>;
  id?: InputMaybe<Scalars['Int']['input']>;
  nav?: InputMaybe<QueryNavInput>;
  nocache?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<Scalars['Json']['input']>;
};


export type QueryFaqElementsArgs = {
  filter?: InputMaybe<ElementFilter>;
  id?: InputMaybe<Scalars['Int']['input']>;
  nav?: InputMaybe<QueryNavInput>;
  nocache?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<Scalars['Json']['input']>;
};


export type QueryGeoGeocoderLocationByAddressArgs = {
  address?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGeoGeocoderLocationsByCoordsArgs = {
  lat?: InputMaybe<Scalars['Float']['input']>;
  lon?: InputMaybe<Scalars['Float']['input']>;
};


export type QueryJobAdminRunArgs = {
  code?: InputMaybe<Scalars['String']['input']>;
};


export type QueryMainOperationArgs = {
  entityType?: InputMaybe<Scalars['String']['input']>;
  sid?: InputMaybe<Scalars['String']['input']>;
};


export type QueryPageElementArgs = {
  filter?: InputMaybe<ElementFilter>;
  id?: InputMaybe<Scalars['Int']['input']>;
  nav?: InputMaybe<QueryNavInput>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
};


export type QueryPageElementListArgs = {
  filter?: InputMaybe<ElementFilter>;
  id?: InputMaybe<Scalars['Int']['input']>;
  nav?: InputMaybe<QueryNavInput>;
  nocache?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<Scalars['Json']['input']>;
};


export type QueryPageElementsArgs = {
  filter?: InputMaybe<ElementFilter>;
  id?: InputMaybe<Scalars['Int']['input']>;
  nav?: InputMaybe<QueryNavInput>;
  nocache?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<Scalars['Json']['input']>;
};


export type QueryPageRouteArgs = {
  URL?: InputMaybe<Scalars['String']['input']>;
};


export type QueryPostElementArgs = {
  filter?: InputMaybe<ElementFilter>;
  id?: InputMaybe<Scalars['Int']['input']>;
  nav?: InputMaybe<QueryNavInput>;
  nocache?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<Scalars['Json']['input']>;
};


export type QueryPostElementsArgs = {
  filter?: InputMaybe<ElementFilter>;
  id?: InputMaybe<Scalars['Int']['input']>;
  nav?: InputMaybe<QueryNavInput>;
  nocache?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<Scalars['Json']['input']>;
};


export type QueryPromoElementArgs = {
  filter?: InputMaybe<ElementFilter>;
  id?: InputMaybe<Scalars['Int']['input']>;
  nav?: InputMaybe<QueryNavInput>;
  nocache?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<Scalars['Json']['input']>;
};


export type QueryPromoElementsArgs = {
  filter?: InputMaybe<ElementFilter>;
  id?: InputMaybe<Scalars['Int']['input']>;
  nav?: InputMaybe<QueryNavInput>;
  nocache?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<Scalars['Json']['input']>;
};


export type QueryReviewPubListArgs = {
  filter?: InputMaybe<ReviewElementFilter>;
  id?: InputMaybe<Scalars['Int']['input']>;
  nav?: InputMaybe<QueryNavInput>;
  nocache?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<Scalars['Json']['input']>;
};


export type QueryReviewPubProductRecordsetArgs = {
  filter?: InputMaybe<ReviewElementFilter>;
  id?: InputMaybe<Scalars['Int']['input']>;
  nav?: InputMaybe<QueryNavInput>;
  nocache?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<Scalars['Json']['input']>;
};


export type QueryReviewPubRecordsetArgs = {
  filter?: InputMaybe<ReviewElementFilter>;
  id?: InputMaybe<Scalars['Int']['input']>;
  nav?: InputMaybe<QueryNavInput>;
  nocache?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<Scalars['Json']['input']>;
};


export type QueryReviewPubUserListArgs = {
  filter?: InputMaybe<ReviewElementFilter>;
  id?: InputMaybe<Scalars['Int']['input']>;
  nav?: InputMaybe<QueryNavInput>;
  nocache?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<Scalars['Json']['input']>;
};


export type QueryReviewPubUserRecordsetArgs = {
  filter?: InputMaybe<ReviewElementFilter>;
  id?: InputMaybe<Scalars['Int']['input']>;
  nav?: InputMaybe<QueryNavInput>;
  nocache?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<Scalars['Json']['input']>;
};


export type QueryReviewPubUserSingleArgs = {
  filter?: InputMaybe<ReviewElementFilter>;
  id?: InputMaybe<Scalars['Int']['input']>;
  nav?: InputMaybe<QueryNavInput>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySaleDeliveryZoneElementArgs = {
  nav?: InputMaybe<QueryNavInput>;
  where?: InputMaybe<DeliveryZoneElementFilter>;
};


export type QuerySaleDeliveryZoneElementsArgs = {
  nav?: InputMaybe<QueryNavInput>;
  where?: InputMaybe<DeliveryZoneElementFilter>;
};


export type QuerySaleDeliveryZoneListArgs = {
  filter?: InputMaybe<DeliveryZoneElementFilter>;
  id?: InputMaybe<Scalars['Int']['input']>;
  nav?: InputMaybe<QueryNavInput>;
  nocache?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<Scalars['Json']['input']>;
};


export type QuerySalePubBuyerCompanyListArgs = {
  filter?: InputMaybe<ElementFilter>;
  id?: InputMaybe<Scalars['Int']['input']>;
  nav?: InputMaybe<QueryNavInput>;
  nocache?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<Scalars['Json']['input']>;
};


export type QuerySalePubBuyerCompanySingleArgs = {
  filter?: InputMaybe<ElementFilter>;
  id?: InputMaybe<Scalars['Int']['input']>;
  nav?: InputMaybe<QueryNavInput>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySalePubClientCardApplyByPhoneArgs = {
  phone?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySalePubClientCardFetchArgs = {
  isScope?: InputMaybe<Scalars['Boolean']['input']>;
  refetch?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QuerySalePubOrderActiveListArgs = {
  filter?: InputMaybe<OrderFilter>;
  nav?: InputMaybe<QueryNavInput>;
};


export type QuerySalePubOrderEnsurePaymentArgs = {
  hash?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  paymentId?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerySalePubOrderListArgs = {
  filter?: InputMaybe<OrderFilter>;
  nav?: InputMaybe<QueryNavInput>;
};


export type QuerySalePubOrderPayOnlineArgs = {
  hash?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  savePaymentType?: InputMaybe<Scalars['Boolean']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySalePubOrderRecordsetArgs = {
  filter?: InputMaybe<OrderFilter>;
  nav?: InputMaybe<QueryNavInput>;
};


export type QuerySalePubOrderSingleArgs = {
  hash?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerySalePubProfileFormArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  personTypeId?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerySalePubProfileSingleArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerySalePubServiceOrderListArgs = {
  filter?: InputMaybe<OrderFilter>;
  nav?: InputMaybe<QueryNavInput>;
};


export type QuerySalePubVorderArgs = {
  check?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QuerySearchSuggestionsArgs = {
  query?: InputMaybe<Scalars['String']['input']>;
};


export type QueryUserFetchArgs = {
  sessionWrite?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryUserPubLoginFindArgs = {
  by?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
};


export type QueryWebcamRecordsetArgs = {
  filter?: InputMaybe<ElementFilter>;
  id?: InputMaybe<Scalars['Int']['input']>;
  nav?: InputMaybe<QueryNavInput>;
  nocache?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<Scalars['Json']['input']>;
};


export type QueryWebcamSingleArgs = {
  nav?: InputMaybe<QueryNavInput>;
};

export type QueryInfo = {
  __typename?: 'QueryInfo';
  limit?: Maybe<Scalars['Int']['output']>;
  nextPage?: Maybe<Scalars['Int']['output']>;
  page?: Maybe<Scalars['Int']['output']>;
  pages?: Maybe<Scalars['Int']['output']>;
  total?: Maybe<Scalars['Int']['output']>;
};

export type QueryNavInput = {
  asc?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  postLimit?: InputMaybe<Scalars['Int']['input']>;
  postSort?: InputMaybe<Scalars['String']['input']>;
  postSortAsc?: InputMaybe<Scalars['Boolean']['input']>;
  sort?: InputMaybe<Scalars['String']['input']>;
  sortAscending?: InputMaybe<Scalars['Boolean']['input']>;
  sortField?: InputMaybe<Scalars['String']['input']>;
};

export type Response = {
  __typename?: 'Response';
  payload?: Maybe<Scalars['Json']['output']>;
  state?: Maybe<ResponseState>;
};

export type ResponseState = {
  __typename?: 'ResponseState';
  actionsMobile?: Maybe<Array<Maybe<MenuItemMobile>>>;
  actionsWeb?: Maybe<MenuItem>;
  events?: Maybe<Scalars['Json']['output']>;
  message?: Maybe<Message>;
  messages?: Maybe<Array<Maybe<Message>>>;
  notices?: Maybe<Array<Maybe<ClientNotice>>>;
  rateLimitTtl?: Maybe<Scalars['Int']['output']>;
  redirect?: Maybe<Scalars['Json']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type ReviewElement = {
  __typename?: 'ReviewElement';
  ACTIONS?: Maybe<Scalars['Json']['output']>;
  ACTIVE?: Maybe<Scalars['Boolean']['output']>;
  ACTIVE_FROM?: Maybe<Scalars['Json']['output']>;
  ADMIN_URL?: Maybe<Scalars['Json']['output']>;
  CHILDREN?: Maybe<Array<Maybe<ReviewElement>>>;
  CODE?: Maybe<Scalars['String']['output']>;
  CREATED?: Maybe<Scalars['Json']['output']>;
  DETAIL_IMAGE?: Maybe<Image>;
  DETAIL_TEXT?: Maybe<Scalars['Json']['output']>;
  ELEMENT?: Maybe<Element>;
  IBLOCK_CODE?: Maybe<Scalars['Int']['output']>;
  IBLOCK_ID?: Maybe<Scalars['Int']['output']>;
  IBLOCK_SECTION_ID?: Maybe<Scalars['Int']['output']>;
  IBLOCK_SECTION_IDS: Array<Maybe<Scalars['Int']['output']>>;
  ID: Scalars['Int']['output'];
  LIST_IMAGE?: Maybe<Image>;
  META?: Maybe<ElementMeta>;
  NAME?: Maybe<Scalars['String']['output']>;
  ORDER?: Maybe<Order>;
  ORDER_ID?: Maybe<Scalars['Int']['output']>;
  PATH?: Maybe<Array<Maybe<Section>>>;
  PREVIEW_TEXT?: Maybe<Scalars['Json']['output']>;
  PROPS?: Maybe<Array<Maybe<ElementProp>>>;
  PROPS_VALUES?: Maybe<Array<Maybe<ElementProp>>>;
  PROP_AUTHOR_NAME?: Maybe<Scalars['String']['output']>;
  PROP_CONTEXT_ID?: Maybe<Scalars['Int']['output']>;
  PROP_ELEMENT_ID?: Maybe<Scalars['Int']['output']>;
  PROP_RATING?: Maybe<Scalars['Float']['output']>;
  PROP_TARGET_XML_ID?: Maybe<Scalars['String']['output']>;
  RATING?: Maybe<Scalars['Float']['output']>;
  RATING_VOTES?: Maybe<Scalars['Int']['output']>;
  ROOT_SECTION?: Maybe<Section>;
  SECTION?: Maybe<Section>;
  SECTIONS?: Maybe<Array<Maybe<Section>>>;
  SORT?: Maybe<Scalars['Int']['output']>;
  URL?: Maybe<Scalars['String']['output']>;
  USER?: Maybe<UserSafe>;
};


export type ReviewElementActionsArgs = {
  detail?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
};


export type ReviewElementActiveFromArgs = {
  format?: InputMaybe<Scalars['String']['input']>;
  formatDefault?: InputMaybe<Scalars['Boolean']['input']>;
  withTime?: InputMaybe<Scalars['Boolean']['input']>;
};


export type ReviewElementCreatedArgs = {
  format?: InputMaybe<Scalars['String']['input']>;
  formatDefault?: InputMaybe<Scalars['Boolean']['input']>;
  withTime?: InputMaybe<Scalars['Boolean']['input']>;
};


export type ReviewElementDetailTextArgs = {
  format?: InputMaybe<Scalars['Boolean']['input']>;
};


export type ReviewElementPreviewTextArgs = {
  format?: InputMaybe<Scalars['Boolean']['input']>;
};


export type ReviewElementPropsArgs = {
  detail?: InputMaybe<Scalars['Boolean']['input']>;
  includeEmptyValues?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
};


export type ReviewElementPropsValuesArgs = {
  detail?: InputMaybe<Scalars['Boolean']['input']>;
  includeEmptyValues?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
};

export type ReviewElementConnection = {
  __typename?: 'ReviewElementConnection';
  info?: Maybe<QueryInfo>;
  nodes?: Maybe<Array<Maybe<ReviewElement>>>;
};

export type ReviewElementFilter = {
  ACTIVE?: InputMaybe<Scalars['Boolean']['input']>;
  CODE?: InputMaybe<StringFilterInput>;
  CONTEXT_ID?: InputMaybe<IntFilterInput>;
  CONTEXT_TYPE?: InputMaybe<Scalars['String']['input']>;
  ELEMENT_ID?: InputMaybe<IntFilterInput>;
  IBLOCK_ID?: InputMaybe<Scalars['Int']['input']>;
  ID?: InputMaybe<IntFilterInput>;
  INCLUDE_SUBSECTIONS?: InputMaybe<Scalars['Boolean']['input']>;
  NAME?: InputMaybe<StringFilterInput>;
  SEARCH?: InputMaybe<StringFilterInput>;
  SECTION_CODE?: InputMaybe<StringFilterInput>;
  SECTION_CODE_PATH?: InputMaybe<StringFilterInput>;
  SECTION_ID?: InputMaybe<IntFilterInput>;
  TARGET?: InputMaybe<Scalars['String']['input']>;
};

export type ReviewOrderAdd = {
  __typename?: 'ReviewOrderAdd';
  payload?: Maybe<ReviewElement>;
  state: ResponseState;
};

export type ReviewProductAdd = {
  __typename?: 'ReviewProductAdd';
  payload?: Maybe<ReviewElement>;
  state: ResponseState;
};

export type ReviewUserStat = {
  __typename?: 'ReviewUserStat';
  COUNT?: Maybe<Scalars['Int']['output']>;
};

export type SaleClientCard = {
  __typename?: 'SaleClientCard';
  BONUSES?: Maybe<Scalars['Int']['output']>;
  BONUSES_EXPIRE?: Maybe<Scalars['Json']['output']>;
  BONUSES_PERCENT?: Maybe<Scalars['Int']['output']>;
  CLIENT_PHONE?: Maybe<Scalars['String']['output']>;
  DISCOUNTS?: Maybe<Array<Maybe<DiscountItem>>>;
  DIS_FIRST_ORDER?: Maybe<Scalars['Int']['output']>;
  DIS_SELF_PICKUP?: Maybe<Scalars['Int']['output']>;
  EXPIRED?: Maybe<Scalars['Boolean']['output']>;
  FETCHED?: Maybe<Scalars['Boolean']['output']>;
  FETCHED_ACTUAL?: Maybe<Scalars['Boolean']['output']>;
  GIFTS: Array<Maybe<Scalars['Int']['output']>>;
  ID?: Maybe<Scalars['Int']['output']>;
  LEVEL?: Maybe<BonusLevelElement>;
  LEVEL_CODE?: Maybe<Scalars['String']['output']>;
  LEVEL_NAME?: Maybe<Scalars['String']['output']>;
  MONTH_SPENT?: Maybe<Scalars['Int']['output']>;
};


export type SaleClientCardBonusesExpireArgs = {
  format?: InputMaybe<Scalars['String']['input']>;
  formatDefault?: InputMaybe<Scalars['Boolean']['input']>;
  withTime?: InputMaybe<Scalars['Boolean']['input']>;
};

export type SaleDepartment = {
  __typename?: 'SaleDepartment';
  ACTIONS?: Maybe<Scalars['Json']['output']>;
  ADDRESS?: Maybe<Scalars['String']['output']>;
  ID: Scalars['Int']['output'];
  NAME?: Maybe<Scalars['String']['output']>;
  SERVICE_ID?: Maybe<Scalars['Int']['output']>;
};


export type SaleDepartmentActionsArgs = {
  detail?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
};

export type SearchResult = {
  __typename?: 'SearchResult';
  ELEMENTS?: Maybe<Array<Maybe<ProductElement>>>;
  SECTIONS?: Maybe<Array<Maybe<ProductSection>>>;
};

export type SearchSuggestion = {
  __typename?: 'SearchSuggestion';
  data?: Maybe<SearchSuggestionData>;
  label?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

export type SearchSuggestionData = {
  __typename?: 'SearchSuggestionData';
  entityId?: Maybe<Scalars['Int']['output']>;
  entityRole?: Maybe<Scalars['String']['output']>;
  entityTitle?: Maybe<Scalars['String']['output']>;
  entityTypeCode?: Maybe<Scalars['String']['output']>;
  entityTypeId?: Maybe<Scalars['String']['output']>;
  entityTypeName?: Maybe<Scalars['String']['output']>;
  hint?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

export type SearchSuggestionElement = {
  __typename?: 'SearchSuggestionElement';
  ACTIONS?: Maybe<Scalars['Json']['output']>;
  ACTIVE?: Maybe<Scalars['Boolean']['output']>;
  ACTIVE_FROM?: Maybe<Scalars['Json']['output']>;
  ADMIN_URL?: Maybe<Scalars['Json']['output']>;
  CODE?: Maybe<Scalars['String']['output']>;
  CREATED?: Maybe<Scalars['Json']['output']>;
  DETAIL_IMAGE?: Maybe<Image>;
  DETAIL_TEXT?: Maybe<Scalars['Json']['output']>;
  IBLOCK_CODE?: Maybe<Scalars['Int']['output']>;
  IBLOCK_ID?: Maybe<Scalars['Int']['output']>;
  IBLOCK_SECTION_ID?: Maybe<Scalars['Int']['output']>;
  IBLOCK_SECTION_IDS: Array<Maybe<Scalars['Int']['output']>>;
  ID: Scalars['Int']['output'];
  LIST_IMAGE?: Maybe<Image>;
  META?: Maybe<ElementMeta>;
  NAME?: Maybe<Scalars['String']['output']>;
  PATH?: Maybe<Array<Maybe<Section>>>;
  PREVIEW_TEXT?: Maybe<Scalars['Json']['output']>;
  PROPS?: Maybe<Array<Maybe<ElementProp>>>;
  PROPS_VALUES?: Maybe<Array<Maybe<ElementProp>>>;
  RATING?: Maybe<Scalars['Float']['output']>;
  RATING_VOTES?: Maybe<Scalars['Int']['output']>;
  ROOT_SECTION?: Maybe<Section>;
  SECTION?: Maybe<Section>;
  SECTIONS?: Maybe<Array<Maybe<Section>>>;
  SORT?: Maybe<Scalars['Int']['output']>;
  URL?: Maybe<Scalars['String']['output']>;
};


export type SearchSuggestionElementActionsArgs = {
  detail?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
};


export type SearchSuggestionElementActiveFromArgs = {
  format?: InputMaybe<Scalars['String']['input']>;
  formatDefault?: InputMaybe<Scalars['Boolean']['input']>;
  withTime?: InputMaybe<Scalars['Boolean']['input']>;
};


export type SearchSuggestionElementCreatedArgs = {
  format?: InputMaybe<Scalars['String']['input']>;
  formatDefault?: InputMaybe<Scalars['Boolean']['input']>;
  withTime?: InputMaybe<Scalars['Boolean']['input']>;
};


export type SearchSuggestionElementDetailTextArgs = {
  format?: InputMaybe<Scalars['Boolean']['input']>;
};


export type SearchSuggestionElementPreviewTextArgs = {
  format?: InputMaybe<Scalars['Boolean']['input']>;
};


export type SearchSuggestionElementPropsArgs = {
  detail?: InputMaybe<Scalars['Boolean']['input']>;
  includeEmptyValues?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
};


export type SearchSuggestionElementPropsValuesArgs = {
  detail?: InputMaybe<Scalars['Boolean']['input']>;
  includeEmptyValues?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
};

export type Section = {
  __typename?: 'Section';
  CHILDREN?: Maybe<Array<Maybe<Section>>>;
  CODE?: Maybe<Scalars['String']['output']>;
  ELEMENTS?: Maybe<Array<Maybe<ProductElement>>>;
  ELEMENT_CNT?: Maybe<Scalars['Int']['output']>;
  IBLOCK_SECTION_ID?: Maybe<Scalars['Int']['output']>;
  ID: Scalars['Int']['output'];
  META?: Maybe<ElementMeta>;
  NAME?: Maybe<Scalars['String']['output']>;
  PARENT?: Maybe<Section>;
  PARENTS?: Maybe<Array<Maybe<Section>>>;
  PICTURE?: Maybe<Image>;
  PROPS?: Maybe<Array<Maybe<EntityProp>>>;
  REPLACE_LINK?: Maybe<Scalars['String']['output']>;
  SORT?: Maybe<Scalars['Int']['output']>;
  URL?: Maybe<Scalars['String']['output']>;
};


export type SectionChildrenArgs = {
  nav?: InputMaybe<QueryNavInput>;
  subsections?: InputMaybe<Scalars['Boolean']['input']>;
  where?: InputMaybe<ProductSectionFilter>;
};


export type SectionElementsArgs = {
  filter?: InputMaybe<ElementFilter>;
  nav?: InputMaybe<QueryNavInput>;
};


export type SectionPropsArgs = {
  detail?: InputMaybe<Scalars['Boolean']['input']>;
  includeEmptyValues?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
};

export type ServiceOrder = {
  __typename?: 'ServiceOrder';
  ACCESS_HASH?: Maybe<Scalars['String']['output']>;
  ACCOUNT_NUMBER?: Maybe<Scalars['String']['output']>;
  ACTIONS?: Maybe<Scalars['Json']['output']>;
  ADDRESS_FOR_1C?: Maybe<Scalars['String']['output']>;
  ATTRS?: Maybe<Array<Maybe<OrderAttr>>>;
  BASKET?: Maybe<Array<Maybe<BasketItem>>>;
  BONUSES?: Maybe<Scalars['Int']['output']>;
  BUYER_NAME?: Maybe<Scalars['String']['output']>;
  CANCEL_REASONS?: Maybe<Array<Maybe<OrderCancelReason>>>;
  CONTRACT_NUM?: Maybe<Scalars['String']['output']>;
  COUPONS?: Maybe<Array<Maybe<Coupon>>>;
  COURIER_STATE?: Maybe<CourierState>;
  CSTATUS_COLOR?: Maybe<Scalars['String']['output']>;
  CSTATUS_ID?: Maybe<Scalars['String']['output']>;
  CSTATUS_NAME?: Maybe<Scalars['String']['output']>;
  DATE_FORMATTED?: Maybe<Scalars['Json']['output']>;
  DATE_INSERT?: Maybe<Scalars['Json']['output']>;
  DATE_PAYED?: Maybe<Scalars['Json']['output']>;
  DATE_TIME_FORMATTED?: Maybe<Scalars['Json']['output']>;
  DATE_UPDATE?: Maybe<Scalars['Json']['output']>;
  DELIVERY?: Maybe<DeliveryService>;
  DELIVERY_ADDRESS_FULL?: Maybe<Scalars['String']['output']>;
  DELIVERY_CALCULATED?: Maybe<Scalars['Boolean']['output']>;
  DELIVERY_DATETIME?: Maybe<Scalars['Json']['output']>;
  DELIVERY_DEPARTMENT?: Maybe<CompanyOffice>;
  DELIVERY_FREE_FROM_PRICE?: Maybe<Scalars['Int']['output']>;
  DELIVERY_ID?: Maybe<Scalars['Int']['output']>;
  DISCOUNT_PERCENT?: Maybe<Scalars['Float']['output']>;
  DISCOUNT_REASON?: Maybe<Scalars['String']['output']>;
  EDU_GROUP_NUM?: Maybe<Scalars['String']['output']>;
  ID?: Maybe<Scalars['Int']['output']>;
  IS_ACTIVE?: Maybe<Scalars['Boolean']['output']>;
  IS_CANCELED?: Maybe<Scalars['Boolean']['output']>;
  IS_CAN_CANCEL?: Maybe<Scalars['Boolean']['output']>;
  IS_CAN_PAY?: Maybe<Scalars['Boolean']['output']>;
  IS_CAN_PAY_BILL?: Maybe<Scalars['Boolean']['output']>;
  IS_CAN_PAY_ONLINE?: Maybe<Scalars['Boolean']['output']>;
  IS_FINISHED?: Maybe<Scalars['Boolean']['output']>;
  IS_PAID?: Maybe<Scalars['Boolean']['output']>;
  PAYMENTS?: Maybe<Array<Maybe<Payment>>>;
  PAYSYSTEM?: Maybe<Paysystem>;
  PAYSYSTEM_ID?: Maybe<Scalars['Int']['output']>;
  PAYSYSTEM_IS_ONLINE?: Maybe<Scalars['Boolean']['output']>;
  PAY_LINK?: Maybe<Scalars['String']['output']>;
  PERSON_TYPE_ID?: Maybe<Scalars['Int']['output']>;
  PICKUP_DEPARTMENT?: Maybe<CompanyOffice>;
  PRICE?: Maybe<Scalars['Float']['output']>;
  PRICE_BASKET?: Maybe<Scalars['Float']['output']>;
  PRICE_BASKET_BASE?: Maybe<Scalars['Float']['output']>;
  PRICE_DELIVERY?: Maybe<Scalars['Float']['output']>;
  PRICE_DELIVERY_BASE?: Maybe<Scalars['Float']['output']>;
  PRICE_DISCOUNT?: Maybe<Scalars['Float']['output']>;
  PRICE_PAY?: Maybe<Scalars['Float']['output']>;
  PRICE_PAY_BASE?: Maybe<Scalars['Float']['output']>;
  PRICE_TOTAL?: Maybe<Scalars['Float']['output']>;
  PRICE_TOTAL_BASE?: Maybe<Scalars['Float']['output']>;
  PROPS?: Maybe<Array<Maybe<OrderPropValue>>>;
  SCOPE?: Maybe<OrderScope>;
  SCOPE_ENTITY?: Maybe<Element>;
  SECRET_URL?: Maybe<Scalars['String']['output']>;
  SERVICE_ID?: Maybe<Scalars['Int']['output']>;
  STATUS?: Maybe<OrderStatus>;
  STATUS_COLOR?: Maybe<Scalars['String']['output']>;
  STATUS_ID?: Maybe<Scalars['String']['output']>;
  STATUS_NAME?: Maybe<Scalars['String']['output']>;
  STUDENT_FIO?: Maybe<Scalars['String']['output']>;
  SYNCED?: Maybe<Scalars['Boolean']['output']>;
  TS?: Maybe<Scalars['String']['output']>;
  URL?: Maybe<Scalars['String']['output']>;
  USER?: Maybe<User>;
  USER_DESCRIPTION?: Maybe<Scalars['String']['output']>;
  USER_ID?: Maybe<Scalars['Int']['output']>;
};


export type ServiceOrderDateFormattedArgs = {
  format?: InputMaybe<Scalars['String']['input']>;
  formatDefault?: InputMaybe<Scalars['Boolean']['input']>;
  withTime?: InputMaybe<Scalars['Boolean']['input']>;
};


export type ServiceOrderDateInsertArgs = {
  format?: InputMaybe<Scalars['String']['input']>;
  formatDefault?: InputMaybe<Scalars['Boolean']['input']>;
  withTime?: InputMaybe<Scalars['Boolean']['input']>;
};


export type ServiceOrderDatePayedArgs = {
  format?: InputMaybe<Scalars['String']['input']>;
  formatDefault?: InputMaybe<Scalars['Boolean']['input']>;
  withTime?: InputMaybe<Scalars['Boolean']['input']>;
};


export type ServiceOrderDateTimeFormattedArgs = {
  format?: InputMaybe<Scalars['String']['input']>;
  formatDefault?: InputMaybe<Scalars['Boolean']['input']>;
  withTime?: InputMaybe<Scalars['Boolean']['input']>;
};


export type ServiceOrderDateUpdateArgs = {
  format?: InputMaybe<Scalars['String']['input']>;
  formatDefault?: InputMaybe<Scalars['Boolean']['input']>;
  withTime?: InputMaybe<Scalars['Boolean']['input']>;
};


export type ServiceOrderDeliveryDatetimeArgs = {
  format?: InputMaybe<Scalars['String']['input']>;
  formatDefault?: InputMaybe<Scalars['Boolean']['input']>;
  withTime?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ServiceReviewAdd = {
  __typename?: 'ServiceReviewAdd';
  payload?: Maybe<ReviewElement>;
  state: ResponseState;
};

export type Setting = {
  __typename?: 'Setting';
  KEY?: Maybe<Scalars['String']['output']>;
  VALUE?: Maybe<Scalars['Json']['output']>;
};

export type SpecialOffer = {
  __typename?: 'SpecialOffer';
  ELEMENT?: Maybe<ProductElement>;
  ELEMENT_ID?: Maybe<Scalars['Int']['output']>;
  MIN_PRICE?: Maybe<Scalars['Int']['output']>;
  MODE?: Maybe<Scalars['String']['output']>;
  TYPE?: Maybe<Scalars['String']['output']>;
  TYPE_INFO?: Maybe<SpecialOfferType>;
};

export type SpecialOfferType = {
  __typename?: 'SpecialOfferType';
  CODE?: Maybe<Scalars['String']['output']>;
  COLOR?: Maybe<Scalars['String']['output']>;
  NAME?: Maybe<Scalars['String']['output']>;
};

export type StringFilterInput = {
  eq?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  like?: InputMaybe<Scalars['String']['input']>;
  not?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  ACTIONS?: Maybe<Scalars['Json']['output']>;
  AVATAR?: Maybe<UserAvatar>;
  EMAIL?: Maybe<Scalars['String']['output']>;
  FAMILY?: Maybe<Array<Maybe<UserFamily>>>;
  GREETING_NAME?: Maybe<Scalars['String']['output']>;
  GROUPS_INFO?: Maybe<Array<Maybe<UserGroup>>>;
  ID?: Maybe<Scalars['Int']['output']>;
  LAST_NAME?: Maybe<Scalars['String']['output']>;
  LOGIN?: Maybe<Scalars['String']['output']>;
  LOGIN_FORMAT?: Maybe<Scalars['String']['output']>;
  NAME?: Maybe<Scalars['String']['output']>;
  NAME_FULL?: Maybe<Scalars['String']['output']>;
  NAME_TEASER?: Maybe<Scalars['String']['output']>;
  PERSONAL_BIRTHDAY?: Maybe<Scalars['String']['output']>;
  PERSONAL_PHOTO?: Maybe<Image>;
  PERSON_TYPE_ID?: Maybe<Scalars['Int']['output']>;
  PHONE?: Maybe<Scalars['String']['output']>;
  PHONE_FORMATTED?: Maybe<Scalars['String']['output']>;
  PROFILE_FILLED?: Maybe<Scalars['Boolean']['output']>;
  PROFILE_GIFT_USED?: Maybe<Scalars['Boolean']['output']>;
  PROMOCODE?: Maybe<Scalars['String']['output']>;
  PROPS?: Maybe<Array<Maybe<EntityProp>>>;
  ROLES?: Maybe<Scalars['Json']['output']>;
  SECOND_NAME?: Maybe<Scalars['String']['output']>;
  SESSION_ID?: Maybe<Scalars['String']['output']>;
};


export type UserActionsArgs = {
  detail?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
};

export type UserAuthConfirm = {
  __typename?: 'UserAuthConfirm';
  CODE?: Maybe<Scalars['String']['output']>;
  COLOR?: Maybe<Scalars['String']['output']>;
  CONFIRM_CONTENT_MOBILE?: Maybe<Scalars['String']['output']>;
  CONFIRM_CONTENT_WEB?: Maybe<Scalars['String']['output']>;
  CONFIRM_STEPS?: Maybe<Array<Maybe<UserAuthConfirmStep>>>;
  ICON?: Maybe<Scalars['String']['output']>;
  LIST_BUTTON_MOBILE?: Maybe<MenuItemMobile>;
  LIST_BUTTON_WEB?: Maybe<MenuItem>;
  LIST_CAPTION?: Maybe<Scalars['String']['output']>;
  LIST_NAME?: Maybe<Scalars['String']['output']>;
  NAME?: Maybe<Scalars['String']['output']>;
  RESEND_TITLE?: Maybe<Scalars['String']['output']>;
};

export type UserAuthConfirmStep = {
  __typename?: 'UserAuthConfirmStep';
  CAPTION?: Maybe<Scalars['String']['output']>;
  CODE?: Maybe<Scalars['String']['output']>;
  NAME?: Maybe<Scalars['String']['output']>;
};

export type UserAvatar = {
  __typename?: 'UserAvatar';
  ELEMENT_ID?: Maybe<Scalars['Int']['output']>;
  IMAGE?: Maybe<Image>;
};

export type UserAvatarElement = {
  __typename?: 'UserAvatarElement';
  CODE?: Maybe<Scalars['String']['output']>;
  ID?: Maybe<Scalars['Int']['output']>;
  NAME?: Maybe<Scalars['String']['output']>;
};

export type UserFamily = {
  __typename?: 'UserFamily';
  ACTIONS?: Maybe<Scalars['Json']['output']>;
  BIRTHDAY?: Maybe<Scalars['String']['output']>;
  ID: Scalars['Int']['output'];
  NAME?: Maybe<Scalars['String']['output']>;
  RELATION?: Maybe<Scalars['String']['output']>;
  USER_ID?: Maybe<Scalars['String']['output']>;
};


export type UserFamilyActionsArgs = {
  detail?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
};

export type UserFamilyInput = {
  BIRTHDAY?: InputMaybe<Scalars['String']['input']>;
  ID?: InputMaybe<Scalars['Int']['input']>;
  NAME?: InputMaybe<Scalars['String']['input']>;
};

export type UserGroup = {
  __typename?: 'UserGroup';
  ID?: Maybe<Scalars['Int']['output']>;
  NAME?: Maybe<Scalars['String']['output']>;
  TYPE?: Maybe<Scalars['String']['output']>;
};

export type UserProfileAllFilled = {
  __typename?: 'UserProfileAllFilled';
  payload?: Maybe<UserProfileAllFilledPayload>;
  state: ResponseState;
};

export type UserProfileAllFilledPayload = {
  __typename?: 'UserProfileAllFilledPayload';
  notice?: Maybe<ClientNotice>;
};

export type UserProfileSave = {
  __typename?: 'UserProfileSave';
  payload?: Maybe<User>;
  state: ResponseState;
};

export type UserSafe = {
  __typename?: 'UserSafe';
  AVATAR?: Maybe<UserAvatar>;
  ID?: Maybe<Scalars['Int']['output']>;
  NAME?: Maybe<Scalars['String']['output']>;
  NAME_FULL?: Maybe<Scalars['String']['output']>;
};

export type UserSession = {
  __typename?: 'UserSession';
  FUSER_ID?: Maybe<Scalars['Int']['output']>;
  SESSION_ID?: Maybe<Scalars['String']['output']>;
  USER_ID?: Maybe<Scalars['Int']['output']>;
};

export type VOrderApply = {
  __typename?: 'VOrderApply';
  payload?: Maybe<VOrderApplyPayload>;
  state: ResponseState;
};

export type VOrderApplyPayload = {
  __typename?: 'VOrderApplyPayload';
  vorder?: Maybe<Vorder>;
};

export type VOrderBasket = {
  __typename?: 'VOrderBasket';
  payload?: Maybe<VOrderBasketPayload>;
  state: ResponseState;
};

export type VOrderBasketPayload = {
  __typename?: 'VOrderBasketPayload';
  vorder?: Maybe<Vorder>;
};

export type VOrderCoupon = {
  __typename?: 'VOrderCoupon';
  payload?: Maybe<VOrderCouponPayload>;
  state: ResponseState;
};

export type VOrderCouponPayload = {
  __typename?: 'VOrderCouponPayload';
  coupon?: Maybe<Coupon>;
  vorder?: Maybe<Vorder>;
};

export type VOrderReserve = {
  __typename?: 'VOrderReserve';
  payload?: Maybe<VOrderReservePayload>;
  state: ResponseState;
};

export type VOrderReservePayload = {
  __typename?: 'VOrderReservePayload';
  deliveryFreeFromPrice?: Maybe<Scalars['Int']['output']>;
  deliveryPrice?: Maybe<Scalars['Int']['output']>;
  departmentId?: Maybe<Scalars['Int']['output']>;
  departmentName?: Maybe<Scalars['String']['output']>;
  departmentServiceId?: Maybe<Scalars['Int']['output']>;
  departmentServiceName?: Maybe<Scalars['String']['output']>;
  profileId?: Maybe<Scalars['Int']['output']>;
  timeAvailable?: Maybe<Scalars['Int']['output']>;
  timeAvailableFormatted?: Maybe<Scalars['String']['output']>;
  vorder?: Maybe<Vorder>;
};

export type VOrderSubmit = {
  __typename?: 'VOrderSubmit';
  payload?: Maybe<VOrderSubmitPayload>;
  state: ResponseState;
};

export type VOrderSubmitPayload = {
  __typename?: 'VOrderSubmitPayload';
  order?: Maybe<Order>;
  orderId?: Maybe<Scalars['Int']['output']>;
  orderUrl?: Maybe<Scalars['String']['output']>;
  vorder?: Maybe<Vorder>;
};

export type VacancyOrderAdd = {
  __typename?: 'VacancyOrderAdd';
  payload?: Maybe<Scalars['Boolean']['output']>;
  state: ResponseState;
};

export type Vorder = {
  __typename?: 'Vorder';
  ACTIONS?: Maybe<Scalars['Json']['output']>;
  BASKET?: Maybe<Basket>;
  EMAIL?: Maybe<Scalars['String']['output']>;
  FIELDS_RAW?: Maybe<Scalars['Json']['output']>;
  FORM?: Maybe<VorderForm>;
  FUSER_ID?: Maybe<Scalars['Int']['output']>;
  ID: Scalars['Int']['output'];
  ORDER?: Maybe<Order>;
  ORDER_ID?: Maybe<Scalars['Int']['output']>;
  PHONE?: Maybe<Scalars['String']['output']>;
  PROPS_RAW?: Maybe<Scalars['Json']['output']>;
  SESSION_ID?: Maybe<Scalars['String']['output']>;
  USER?: Maybe<User>;
  USER_ID?: Maybe<Scalars['Int']['output']>;
};


export type VorderActionsArgs = {
  detail?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
};


export type VorderBasketArgs = {
  recalc?: InputMaybe<Scalars['Boolean']['input']>;
};

export type VorderFields = {
  __typename?: 'VorderFields';
  DATA?: Maybe<Scalars['Json']['output']>;
  DELIVERY_ID?: Maybe<Scalars['Int']['output']>;
  PAY_SYSTEM_ID?: Maybe<Scalars['Int']['output']>;
  PERSON_TYPE_ID?: Maybe<Scalars['Int']['output']>;
  USER_DESCRIPTION?: Maybe<Scalars['String']['output']>;
};

export type VorderForm = {
  __typename?: 'VorderForm';
  ATTRS: Array<Maybe<OrderAttr>>;
  BONUSES?: Maybe<Scalars['Int']['output']>;
  BONUSES_AVAILABLE?: Maybe<Scalars['Int']['output']>;
  BONUSES_PERCENT?: Maybe<Scalars['Int']['output']>;
  COMPANIES: Array<Maybe<BuyerCompanyElement>>;
  COMPANY_ID?: Maybe<Scalars['Int']['output']>;
  COUPONS?: Maybe<Array<Maybe<Coupon>>>;
  COUPON_CAN_ADD?: Maybe<Scalars['Boolean']['output']>;
  DELIVERIES: Array<Maybe<DeliveryComputed>>;
  DELIVERY_CALCULATED?: Maybe<Scalars['Boolean']['output']>;
  DELIVERY_DEPARTMENT_ID?: Maybe<Scalars['Int']['output']>;
  DELIVERY_FREE_FROM_PRICE?: Maybe<Scalars['Float']['output']>;
  DEPARTMENTS: Array<Maybe<CompanyOffice>>;
  DEPARTMENT_ID?: Maybe<Scalars['Int']['output']>;
  DISCOUNT?: Maybe<DiscountItem>;
  DISCOUNTS?: Maybe<Array<Maybe<DiscountItem>>>;
  FIELDS?: Maybe<VorderFields>;
  PAYCARDS: Array<Maybe<Paycard>>;
  PAYCARD_SID?: Maybe<Scalars['Int']['output']>;
  PAYSYSTEMS: Array<Maybe<PaysystemComputed>>;
  PERSON_TYPES: Array<Maybe<PersonType>>;
  PICKUP_DEPARTMENT_ID?: Maybe<Scalars['Int']['output']>;
  PROFILES: Array<Maybe<OrderProfile>>;
  PROFILE_ID?: Maybe<Scalars['Json']['output']>;
  PROPS: Array<Maybe<OrderPropValue>>;
  SPECIAL_OFFERS?: Maybe<Array<Maybe<SpecialOffer>>>;
  STATE?: Maybe<Scalars['Json']['output']>;
  SYNCED?: Maybe<Scalars['Boolean']['output']>;
  TS?: Maybe<Scalars['String']['output']>;
};

export type VorderInput = {
  attrs?: InputMaybe<Scalars['Json']['input']>;
  basket?: InputMaybe<Scalars['Json']['input']>;
  fields?: InputMaybe<Scalars['Json']['input']>;
  props?: InputMaybe<Scalars['Json']['input']>;
};

export type VorderResult = {
  __typename?: 'VorderResult';
  data?: Maybe<Scalars['Json']['output']>;
  payload?: Maybe<Vorder>;
  state?: Maybe<ResponseState>;
};

export type VorderSummary = {
  __typename?: 'VorderSummary';
  EMAIL?: Maybe<Scalars['String']['output']>;
  FUSER_ID?: Maybe<Scalars['Int']['output']>;
  ID?: Maybe<Scalars['Int']['output']>;
  PHONE?: Maybe<Scalars['String']['output']>;
};

export type Webcam = {
  __typename?: 'Webcam';
  ACTIONS?: Maybe<Scalars['Json']['output']>;
  ACTIVE?: Maybe<Scalars['Boolean']['output']>;
  ACTIVE_FROM?: Maybe<Scalars['Json']['output']>;
  ADMIN_URL?: Maybe<Scalars['Json']['output']>;
  CODE?: Maybe<Scalars['String']['output']>;
  CREATED?: Maybe<Scalars['Json']['output']>;
  DETAIL_IMAGE?: Maybe<Image>;
  DETAIL_TEXT?: Maybe<Scalars['Json']['output']>;
  IBLOCK_CODE?: Maybe<Scalars['Int']['output']>;
  IBLOCK_ID?: Maybe<Scalars['Int']['output']>;
  IBLOCK_SECTION_ID?: Maybe<Scalars['Int']['output']>;
  IBLOCK_SECTION_IDS: Array<Maybe<Scalars['Int']['output']>>;
  ID: Scalars['Int']['output'];
  LIST_IMAGE?: Maybe<Image>;
  META?: Maybe<ElementMeta>;
  NAME?: Maybe<Scalars['String']['output']>;
  PATH?: Maybe<Array<Maybe<Section>>>;
  PREVIEW_TEXT?: Maybe<Scalars['Json']['output']>;
  PROPS?: Maybe<Array<Maybe<ElementProp>>>;
  PROPS_VALUES?: Maybe<Array<Maybe<ElementProp>>>;
  RATING?: Maybe<Scalars['Float']['output']>;
  RATING_VOTES?: Maybe<Scalars['Int']['output']>;
  ROOT_SECTION?: Maybe<Section>;
  SECTION?: Maybe<Section>;
  SECTIONS?: Maybe<Array<Maybe<Section>>>;
  SORT?: Maybe<Scalars['Int']['output']>;
  URL?: Maybe<Scalars['String']['output']>;
};


export type WebcamActionsArgs = {
  detail?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
};


export type WebcamActiveFromArgs = {
  format?: InputMaybe<Scalars['String']['input']>;
  formatDefault?: InputMaybe<Scalars['Boolean']['input']>;
  withTime?: InputMaybe<Scalars['Boolean']['input']>;
};


export type WebcamCreatedArgs = {
  format?: InputMaybe<Scalars['String']['input']>;
  formatDefault?: InputMaybe<Scalars['Boolean']['input']>;
  withTime?: InputMaybe<Scalars['Boolean']['input']>;
};


export type WebcamDetailTextArgs = {
  format?: InputMaybe<Scalars['Boolean']['input']>;
};


export type WebcamPreviewTextArgs = {
  format?: InputMaybe<Scalars['Boolean']['input']>;
};


export type WebcamPropsArgs = {
  detail?: InputMaybe<Scalars['Boolean']['input']>;
  includeEmptyValues?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
};


export type WebcamPropsValuesArgs = {
  detail?: InputMaybe<Scalars['Boolean']['input']>;
  includeEmptyValues?: InputMaybe<Scalars['Boolean']['input']>;
  viewmode?: InputMaybe<Scalars['String']['input']>;
};

export type WebcamConnection = {
  __typename?: 'WebcamConnection';
  info?: Maybe<QueryInfo>;
  nodes?: Maybe<Array<Maybe<Webcam>>>;
};

export type MainAdminIblockElementDelete = {
  __typename?: 'main_admin_iblock_element_delete';
  payload?: Maybe<Scalars['Int']['output']>;
  state: ResponseState;
};

export type MainAdminIblockElementSetActive = {
  __typename?: 'main_admin_iblock_element_set_active';
  payload?: Maybe<Scalars['Int']['output']>;
  state: ResponseState;
};

export type SalePubBuyerCompanyDefault = {
  __typename?: 'sale_pub_buyer_company_default';
  payload?: Maybe<Scalars['Int']['output']>;
  state: ResponseState;
};

export type SalePubBuyerCompanyDelete = {
  __typename?: 'sale_pub_buyer_company_delete';
  payload?: Maybe<Scalars['Int']['output']>;
  state: ResponseState;
};

export type SalePubBuyerCompanySave = {
  __typename?: 'sale_pub_buyer_company_save';
  payload?: Maybe<BuyerCompanyElement>;
  state: ResponseState;
};

export type SalePubFavAdd = {
  __typename?: 'sale_pub_fav_add';
  payload?: Maybe<FavItem>;
  state: ResponseState;
};

export type SalePubFavClear = {
  __typename?: 'sale_pub_fav_clear';
  state: ResponseState;
};

export type SalePubFavRemove = {
  __typename?: 'sale_pub_fav_remove';
  payload?: Maybe<Scalars['Int']['output']>;
  state: ResponseState;
};
