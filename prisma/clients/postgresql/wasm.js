
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.15.0
 * Query Engine version: 12e25d8d06f6ea5a0252864dd9a03b1bb51f3022
 */
Prisma.prismaVersion = {
  client: "5.15.0",
  engine: "12e25d8d06f6ea5a0252864dd9a03b1bb51f3022"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}

/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  username: 'username',
  password: 'password'
};

exports.Prisma.RoleScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description'
};

exports.Prisma.UserRoleScalarFieldEnum = {
  userId: 'userId',
  roleId: 'roleId'
};

exports.Prisma.PermissionScalarFieldEnum = {
  id: 'id',
  name: 'name',
  action: 'action',
  description: 'description'
};

exports.Prisma.RolePermissionsScalarFieldEnum = {
  roleId: 'roleId',
  permissionId: 'permissionId'
};

exports.Prisma.PolicyScalarFieldEnum = {
  id: 'id',
  type: 'type',
  effect: 'effect',
  action: 'action',
  subject: 'subject',
  fields: 'fields',
  conditions: 'conditions',
  args: 'args',
  encode: 'encode'
};

exports.Prisma.RolePolicyScalarFieldEnum = {
  roleId: 'roleId',
  policyId: 'policyId'
};

exports.Prisma.PermissionPolicyScalarFieldEnum = {
  permissionId: 'permissionId',
  policyId: 'policyId'
};

exports.Prisma.MenuScalarFieldEnum = {
  id: 'id',
  name: 'name',
  path: 'path',
  component: 'component',
  redirect: 'redirect',
  fullPath: 'fullPath',
  alias: 'alias',
  label: 'label',
  parentId: 'parentId'
};

exports.Prisma.MetaScalarFieldEnum = {
  id: 'id',
  title: 'title',
  layout: 'layout',
  order: 'order',
  icon: 'icon',
  hideMenu: 'hideMenu',
  disabled: 'disabled',
  menuId: 'menuId'
};

exports.Prisma.RoleMenuScalarFieldEnum = {
  roleId: 'roleId',
  menuId: 'menuId'
};

exports.Prisma.DictAttachmentAttributeScalarFieldEnum = {
  id: 'id',
  type: 'type',
  name: 'name',
  desc: 'desc'
};

exports.Prisma.AttachmentAttributeScalarFieldEnum = {
  attachmentId: 'attachmentId',
  attributeId: 'attributeId',
  value: 'value',
  desc: 'desc'
};

exports.Prisma.AttachmentScalarFieldEnum = {
  id: 'id',
  type: 'type',
  location: 'location',
  name: 'name',
  ossType: 'ossType',
  userId: 'userId',
  status: 'status',
  desc: 'desc',
  createdAt: 'createdAt'
};

exports.Prisma.CourseScalarFieldEnum = {
  id: 'id',
  title: 'title',
  subTitle: 'subTitle',
  desc: 'desc',
  coverId: 'coverId',
  authorId: 'authorId',
  originPrice: 'originPrice',
  price: 'price',
  status: 'status',
  counts: 'counts',
  order: 'order',
  detail: 'detail',
  type: 'type'
};

exports.Prisma.CourseContentScalarFieldEnum = {
  id: 'id',
  courseId: 'courseId',
  title: 'title',
  type: 'type',
  order: 'order',
  pid: 'pid',
  status: 'status',
  authorId: 'authorId'
};

exports.Prisma.ContentAttachmentScalarFieldEnum = {
  contentId: 'contentId',
  attachmentId: 'attachmentId'
};

exports.Prisma.DictCourseTagScalarFieldEnum = {
  id: 'id',
  name: 'name',
  typeId: 'typeId',
  order: 'order',
  status: 'status'
};

exports.Prisma.DictCourseTypeScalarFieldEnum = {
  id: 'id',
  name: 'name',
  order: 'order',
  status: 'status'
};

exports.Prisma.CourseTagScalarFieldEnum = {
  courseId: 'courseId',
  tagId: 'tagId'
};

exports.Prisma.ContentTagScalarFieldEnum = {
  contentId: 'contentId',
  tagId: 'tagId'
};

exports.Prisma.CommentScalarFieldEnum = {
  id: 'id',
  pid: 'pid',
  userId: 'userId',
  content: 'content',
  created: 'created',
  hands: 'hands',
  status: 'status',
  isBest: 'isBest'
};

exports.Prisma.CourseCommentScalarFieldEnum = {
  courseId: 'courseId',
  commentId: 'commentId'
};

exports.Prisma.ContentCommentScalarFieldEnum = {
  contentId: 'contentId',
  commentId: 'commentId'
};

exports.Prisma.NoteScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  content: 'content',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  status: 'status'
};

exports.Prisma.DictPlatformScalarFieldEnum = {
  id: 'id',
  name: 'name',
  url: 'url',
  desc: 'desc'
};

exports.Prisma.TransactionScalarFieldEnum = {
  id: 'id',
  courseId: 'courseId',
  userId: 'userId',
  amount: 'amount',
  platformId: 'platformId',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.GroupTransactionScalarFieldEnum = {
  id: 'id',
  groupId: 'groupId',
  transactionId: 'transactionId'
};

exports.Prisma.AuditFlowScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description'
};

exports.Prisma.AuditStageScalarFieldEnum = {
  id: 'id',
  flowId: 'flowId',
  name: 'name',
  level: 'level',
  pid: 'pid'
};

exports.Prisma.AuditRecordScalarFieldEnum = {
  id: 'id',
  entityId: 'entityId',
  entityType: 'entityType',
  stageId: 'stageId',
  status: 'status',
  reviewerId: 'reviewerId',
  createdAt: 'createdAt',
  notes: 'notes'
};

exports.Prisma.DictCouponTypeScalarFieldEnum = {
  id: 'id',
  name: 'name',
  desc: 'desc'
};

exports.Prisma.CouponScalarFieldEnum = {
  id: 'id',
  productId: 'productId',
  typeId: 'typeId',
  threshold: 'threshold',
  discount: 'discount',
  validUntil: 'validUntil',
  universal: 'universal'
};

exports.Prisma.BalanceRecordScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  transactionId: 'transactionId',
  amount: 'amount',
  type: 'type',
  createdAt: 'createdAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};


exports.Prisma.ModelName = {
  User: 'User',
  Role: 'Role',
  UserRole: 'UserRole',
  Permission: 'Permission',
  RolePermissions: 'RolePermissions',
  Policy: 'Policy',
  RolePolicy: 'RolePolicy',
  PermissionPolicy: 'PermissionPolicy',
  Menu: 'Menu',
  Meta: 'Meta',
  RoleMenu: 'RoleMenu',
  DictAttachmentAttribute: 'DictAttachmentAttribute',
  AttachmentAttribute: 'AttachmentAttribute',
  Attachment: 'Attachment',
  Course: 'Course',
  CourseContent: 'CourseContent',
  ContentAttachment: 'ContentAttachment',
  DictCourseTag: 'DictCourseTag',
  DictCourseType: 'DictCourseType',
  CourseTag: 'CourseTag',
  ContentTag: 'ContentTag',
  Comment: 'Comment',
  CourseComment: 'CourseComment',
  ContentComment: 'ContentComment',
  Note: 'Note',
  DictPlatform: 'DictPlatform',
  Transaction: 'Transaction',
  GroupTransaction: 'GroupTransaction',
  AuditFlow: 'AuditFlow',
  AuditStage: 'AuditStage',
  AuditRecord: 'AuditRecord',
  DictCouponType: 'DictCouponType',
  Coupon: 'Coupon',
  BalanceRecord: 'BalanceRecord'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
