-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'CAMPUS_ADMIN', 'ADMIN', 'TEACHER', 'ASSISTANT', 'GUARDIAN', 'STUDENT');

-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('中午托', '下午托', '晚辅导', '晚全托');

-- CreateEnum
CREATE TYPE "StudentStatus" AS ENUM ('ACTIVE', 'PAUSED', 'LEFT');

-- CreateEnum
CREATE TYPE "BillingCycle" AS ENUM ('MONTHLY', 'SEMESTER');

-- CreateEnum
CREATE TYPE "TeacherFeeBillingMode" AS ENUM ('CLASS_FIXED', 'DAILY_FIXED');

-- CreateEnum
CREATE TYPE "CampusStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('VIEW_SENSITIVE_IDENTITY', 'EXPORT_SENSITIVE_DATA', 'UPDATE_BILLING');

-- CreateEnum
CREATE TYPE "AiIntent" AS ENUM ('queryAttendance', 'queryHomework', 'createLeaveRequest', 'queryBilling', 'sendTeacherMessage', 'recordHomeworkFeedback', 'suggestMistakeAreas', 'generateSimilarQuestions', 'queryClassSettlement');

-- CreateEnum
CREATE TYPE "AiRiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "AiActionResultStatus" AS ENUM ('DRAFTED', 'CONFIRMATION_REQUIRED', 'EXECUTED', 'REJECTED', 'FAILED');

-- CreateEnum
CREATE TYPE "ConfirmationRequestStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'EXPIRED', 'EXECUTED');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('已到', '请假', '缺勤', '迟到', '已离托', '待确认');

-- CreateEnum
CREATE TYPE "AttendanceMatchStatus" AS ENUM ('MATCHED', 'PENDING_CONFIRMATION', 'FAILED');

-- CreateEnum
CREATE TYPE "AttendanceNotificationStatus" AS ENUM ('PENDING', 'SENT', 'SUPPRESSED', 'FAILED');

-- CreateEnum
CREATE TYPE "FileVisibility" AS ENUM ('PRIVATE');

-- CreateEnum
CREATE TYPE "NoticePushStatus" AS ENUM ('PENDING', 'SENT', 'SUPPRESSED', 'FAILED');

-- CreateEnum
CREATE TYPE "HomeworkReviewStatus" AS ENUM ('UPLOADED', 'AI_SUGGESTED', 'TEACHER_REVIEWED');

-- CreateEnum
CREATE TYPE "HomeworkPublishStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "FeedbackPublishStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "MistakeCorrectionStatus" AS ENUM ('PENDING_CORRECTION', 'CORRECTED', 'MASTERED');

-- CreateEnum
CREATE TYPE "TeacherAttendanceStatus" AS ENUM ('已签到', '已签退', '迟到', '早退', '请假', '缺勤', '补签');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "phone" TEXT,
    "image" TEXT,
    "passwordHash" TEXT,
    "role" "Role" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campus" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "principalName" TEXT NOT NULL,
    "status" "CampusStatus" NOT NULL DEFAULT 'ACTIVE',
    "serviceHours" TEXT NOT NULL,
    "supportedServiceTypes" "ServiceType"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Campus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustodyClass" (
    "id" TEXT NOT NULL,
    "campusId" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustodyClass_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "name" TEXT NOT NULL,
    "identityNumber" TEXT,
    "school" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "campusId" TEXT NOT NULL,
    "classId" TEXT,
    "serviceType" "ServiceType" NOT NULL,
    "status" "StudentStatus" NOT NULL DEFAULT 'ACTIVE',
    "safetyNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuardianStudent" (
    "id" TEXT NOT NULL,
    "guardianUserId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "notifyEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GuardianStudent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeacherAssignment" (
    "id" TEXT NOT NULL,
    "teacherUserId" TEXT NOT NULL,
    "campusId" TEXT NOT NULL,
    "classId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeacherAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "actorUserId" TEXT NOT NULL,
    "action" "AuditAction" NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "reason" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiActionLog" (
    "id" TEXT NOT NULL,
    "actorUserId" TEXT NOT NULL,
    "actorRole" "Role" NOT NULL,
    "rawInput" TEXT NOT NULL,
    "intent" "AiIntent",
    "entities" JSONB,
    "confidence" DOUBLE PRECISION NOT NULL,
    "risk" "AiRiskLevel" NOT NULL,
    "confirmationRequired" BOOLEAN NOT NULL,
    "confirmedAt" TIMESTAMP(3),
    "resultStatus" "AiActionResultStatus" NOT NULL,
    "resultSummary" TEXT,
    "failureReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiActionLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConfirmationRequest" (
    "id" TEXT NOT NULL,
    "actorUserId" TEXT NOT NULL,
    "actorRole" "Role" NOT NULL,
    "intent" "AiIntent" NOT NULL,
    "risk" "AiRiskLevel" NOT NULL DEFAULT 'MEDIUM',
    "rawInput" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "summary" TEXT NOT NULL,
    "status" "ConfirmationRequestStatus" NOT NULL DEFAULT 'PENDING',
    "confirmationRequired" BOOLEAN NOT NULL DEFAULT true,
    "confirmedByUserId" TEXT,
    "confirmedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "expiredAt" TIMESTAMP(3),
    "executedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConfirmationRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttendanceRecord" (
    "id" TEXT NOT NULL,
    "campusId" TEXT NOT NULL,
    "classId" TEXT,
    "studentId" TEXT NOT NULL,
    "teacherUserId" TEXT,
    "serviceType" "ServiceType" NOT NULL,
    "status" "AttendanceStatus" NOT NULL,
    "checkedAt" TIMESTAMP(3),
    "photoFileId" TEXT,
    "matchStatus" "AttendanceMatchStatus" NOT NULL DEFAULT 'PENDING_CONFIRMATION',
    "notificationStatus" "AttendanceNotificationStatus" NOT NULL DEFAULT 'SUPPRESSED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AttendanceRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrivateFile" (
    "id" TEXT NOT NULL,
    "campusId" TEXT NOT NULL,
    "studentId" TEXT,
    "uploadedByUserId" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "byteSize" INTEGER NOT NULL,
    "purpose" TEXT NOT NULL,
    "visibility" "FileVisibility" NOT NULL DEFAULT 'PRIVATE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PrivateFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomeworkReview" (
    "id" TEXT NOT NULL,
    "campusId" TEXT NOT NULL,
    "classId" TEXT,
    "studentId" TEXT NOT NULL,
    "teacherUserId" TEXT NOT NULL,
    "originalImageFileId" TEXT NOT NULL,
    "correctedImageFileId" TEXT,
    "subject" TEXT NOT NULL,
    "status" "HomeworkReviewStatus" NOT NULL DEFAULT 'UPLOADED',
    "aiSuggestedAreas" JSONB,
    "teacherConfirmedAreas" JSONB,
    "publishStatus" "HomeworkPublishStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomeworkReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL,
    "campusId" TEXT NOT NULL,
    "classId" TEXT,
    "studentId" TEXT NOT NULL,
    "teacherUserId" TEXT NOT NULL,
    "homeworkReviewId" TEXT,
    "behaviorPerformance" TEXT,
    "homeworkCompletion" TEXT NOT NULL,
    "knowledgeMastery" TEXT,
    "publishStatus" "FeedbackPublishStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MistakeBookItem" (
    "id" TEXT NOT NULL,
    "campusId" TEXT NOT NULL,
    "classId" TEXT,
    "studentId" TEXT NOT NULL,
    "homeworkReviewId" TEXT NOT NULL,
    "sourceAreaId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "knowledgePoint" TEXT NOT NULL,
    "mistakeReason" TEXT NOT NULL,
    "imageRegion" JSONB NOT NULL,
    "questionText" TEXT,
    "correctionStatus" "MistakeCorrectionStatus" NOT NULL DEFAULT 'PENDING_CORRECTION',
    "aiConfidence" DOUBLE PRECISION,
    "correctedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MistakeBookItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BillingRecord" (
    "id" TEXT NOT NULL,
    "campusId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "classId" TEXT,
    "serviceType" "ServiceType" NOT NULL,
    "billingCycle" "BillingCycle" NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "amountDue" DECIMAL(65,30) NOT NULL,
    "amountPaid" DECIMAL(65,30) NOT NULL,
    "balanceAmount" DECIMAL(65,30) NOT NULL,
    "debtAmount" DECIMAL(65,30) NOT NULL,
    "validUntil" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BillingRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeacherFeeRule" (
    "id" TEXT NOT NULL,
    "campusId" TEXT NOT NULL,
    "classId" TEXT,
    "teacherUserId" TEXT NOT NULL,
    "serviceType" "ServiceType" NOT NULL,
    "billingMode" "TeacherFeeBillingMode" NOT NULL,
    "feeAmount" DECIMAL(65,30) NOT NULL,
    "effectiveFrom" TIMESTAMP(3) NOT NULL,
    "effectiveTo" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeacherFeeRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassSettlement" (
    "id" TEXT NOT NULL,
    "campusId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "serviceType" "ServiceType" NOT NULL,
    "settlementDate" TIMESTAMP(3) NOT NULL,
    "expectedCount" INTEGER NOT NULL,
    "arrivedCount" INTEGER NOT NULL,
    "leaveCount" INTEGER NOT NULL,
    "absentCount" INTEGER NOT NULL,
    "pendingCount" INTEGER NOT NULL,
    "studentRevenueAmount" DECIMAL(65,30) NOT NULL,
    "teacherFeeAmount" DECIMAL(65,30) NOT NULL,
    "reservedCostAmount" DECIMAL(65,30) NOT NULL,
    "estimatedGrossProfitAmount" DECIMAL(65,30) NOT NULL,
    "teacherFeeRuleIds" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassSettlement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParentNotice" (
    "id" TEXT NOT NULL,
    "campusId" TEXT NOT NULL,
    "guardianUserId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "attendanceRecordId" TEXT,
    "photoFileId" TEXT,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "pushStatus" "NoticePushStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sentAt" TIMESTAMP(3),

    CONSTRAINT "ParentNotice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeacherAttendance" (
    "id" TEXT NOT NULL,
    "teacherUserId" TEXT NOT NULL,
    "campusId" TEXT NOT NULL,
    "classId" TEXT,
    "status" "TeacherAttendanceStatus" NOT NULL,
    "checkedInAt" TIMESTAMP(3),
    "checkedOutAt" TIMESTAMP(3),
    "makeupByUserId" TEXT,
    "makeupReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeacherAttendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refreshToken" TEXT,
    "accessToken" TEXT,
    "expiresAt" INTEGER,
    "tokenType" TEXT,
    "scope" TEXT,
    "idToken" TEXT,
    "sessionState" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_isActive_idx" ON "User"("isActive");

-- CreateIndex
CREATE INDEX "Campus_status_idx" ON "Campus"("status");

-- CreateIndex
CREATE INDEX "CustodyClass_campusId_idx" ON "CustodyClass"("campusId");

-- CreateIndex
CREATE UNIQUE INDEX "CustodyClass_campusId_name_key" ON "CustodyClass"("campusId", "name");

-- CreateIndex
CREATE INDEX "Student_campusId_idx" ON "Student"("campusId");

-- CreateIndex
CREATE INDEX "Student_classId_idx" ON "Student"("classId");

-- CreateIndex
CREATE INDEX "Student_serviceType_idx" ON "Student"("serviceType");

-- CreateIndex
CREATE INDEX "Student_status_idx" ON "Student"("status");

-- CreateIndex
CREATE INDEX "GuardianStudent_studentId_idx" ON "GuardianStudent"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "GuardianStudent_guardianUserId_studentId_key" ON "GuardianStudent"("guardianUserId", "studentId");

-- CreateIndex
CREATE INDEX "TeacherAssignment_campusId_idx" ON "TeacherAssignment"("campusId");

-- CreateIndex
CREATE INDEX "TeacherAssignment_classId_idx" ON "TeacherAssignment"("classId");

-- CreateIndex
CREATE UNIQUE INDEX "TeacherAssignment_teacherUserId_campusId_classId_key" ON "TeacherAssignment"("teacherUserId", "campusId", "classId");

-- CreateIndex
CREATE INDEX "AuditLog_actorUserId_idx" ON "AuditLog"("actorUserId");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_targetType_targetId_idx" ON "AuditLog"("targetType", "targetId");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "AiActionLog_actorUserId_idx" ON "AiActionLog"("actorUserId");

-- CreateIndex
CREATE INDEX "AiActionLog_actorRole_idx" ON "AiActionLog"("actorRole");

-- CreateIndex
CREATE INDEX "AiActionLog_intent_idx" ON "AiActionLog"("intent");

-- CreateIndex
CREATE INDEX "AiActionLog_risk_idx" ON "AiActionLog"("risk");

-- CreateIndex
CREATE INDEX "AiActionLog_confirmationRequired_idx" ON "AiActionLog"("confirmationRequired");

-- CreateIndex
CREATE INDEX "AiActionLog_resultStatus_idx" ON "AiActionLog"("resultStatus");

-- CreateIndex
CREATE INDEX "AiActionLog_createdAt_idx" ON "AiActionLog"("createdAt");

-- CreateIndex
CREATE INDEX "ConfirmationRequest_actorUserId_idx" ON "ConfirmationRequest"("actorUserId");

-- CreateIndex
CREATE INDEX "ConfirmationRequest_actorRole_idx" ON "ConfirmationRequest"("actorRole");

-- CreateIndex
CREATE INDEX "ConfirmationRequest_intent_idx" ON "ConfirmationRequest"("intent");

-- CreateIndex
CREATE INDEX "ConfirmationRequest_risk_idx" ON "ConfirmationRequest"("risk");

-- CreateIndex
CREATE INDEX "ConfirmationRequest_status_idx" ON "ConfirmationRequest"("status");

-- CreateIndex
CREATE INDEX "ConfirmationRequest_expiresAt_idx" ON "ConfirmationRequest"("expiresAt");

-- CreateIndex
CREATE INDEX "ConfirmationRequest_createdAt_idx" ON "ConfirmationRequest"("createdAt");

-- CreateIndex
CREATE INDEX "AttendanceRecord_campusId_idx" ON "AttendanceRecord"("campusId");

-- CreateIndex
CREATE INDEX "AttendanceRecord_classId_idx" ON "AttendanceRecord"("classId");

-- CreateIndex
CREATE INDEX "AttendanceRecord_studentId_idx" ON "AttendanceRecord"("studentId");

-- CreateIndex
CREATE INDEX "AttendanceRecord_teacherUserId_idx" ON "AttendanceRecord"("teacherUserId");

-- CreateIndex
CREATE INDEX "AttendanceRecord_status_idx" ON "AttendanceRecord"("status");

-- CreateIndex
CREATE INDEX "AttendanceRecord_matchStatus_idx" ON "AttendanceRecord"("matchStatus");

-- CreateIndex
CREATE INDEX "AttendanceRecord_notificationStatus_idx" ON "AttendanceRecord"("notificationStatus");

-- CreateIndex
CREATE INDEX "AttendanceRecord_checkedAt_idx" ON "AttendanceRecord"("checkedAt");

-- CreateIndex
CREATE UNIQUE INDEX "PrivateFile_storageKey_key" ON "PrivateFile"("storageKey");

-- CreateIndex
CREATE INDEX "PrivateFile_campusId_idx" ON "PrivateFile"("campusId");

-- CreateIndex
CREATE INDEX "PrivateFile_studentId_idx" ON "PrivateFile"("studentId");

-- CreateIndex
CREATE INDEX "PrivateFile_uploadedByUserId_idx" ON "PrivateFile"("uploadedByUserId");

-- CreateIndex
CREATE INDEX "PrivateFile_purpose_idx" ON "PrivateFile"("purpose");

-- CreateIndex
CREATE INDEX "PrivateFile_createdAt_idx" ON "PrivateFile"("createdAt");

-- CreateIndex
CREATE INDEX "HomeworkReview_campusId_idx" ON "HomeworkReview"("campusId");

-- CreateIndex
CREATE INDEX "HomeworkReview_classId_idx" ON "HomeworkReview"("classId");

-- CreateIndex
CREATE INDEX "HomeworkReview_studentId_idx" ON "HomeworkReview"("studentId");

-- CreateIndex
CREATE INDEX "HomeworkReview_teacherUserId_idx" ON "HomeworkReview"("teacherUserId");

-- CreateIndex
CREATE INDEX "HomeworkReview_status_idx" ON "HomeworkReview"("status");

-- CreateIndex
CREATE INDEX "HomeworkReview_publishStatus_idx" ON "HomeworkReview"("publishStatus");

-- CreateIndex
CREATE INDEX "HomeworkReview_createdAt_idx" ON "HomeworkReview"("createdAt");

-- CreateIndex
CREATE INDEX "Feedback_campusId_idx" ON "Feedback"("campusId");

-- CreateIndex
CREATE INDEX "Feedback_classId_idx" ON "Feedback"("classId");

-- CreateIndex
CREATE INDEX "Feedback_studentId_idx" ON "Feedback"("studentId");

-- CreateIndex
CREATE INDEX "Feedback_teacherUserId_idx" ON "Feedback"("teacherUserId");

-- CreateIndex
CREATE INDEX "Feedback_homeworkReviewId_idx" ON "Feedback"("homeworkReviewId");

-- CreateIndex
CREATE INDEX "Feedback_publishStatus_idx" ON "Feedback"("publishStatus");

-- CreateIndex
CREATE INDEX "Feedback_createdAt_idx" ON "Feedback"("createdAt");

-- CreateIndex
CREATE INDEX "MistakeBookItem_campusId_idx" ON "MistakeBookItem"("campusId");

-- CreateIndex
CREATE INDEX "MistakeBookItem_classId_idx" ON "MistakeBookItem"("classId");

-- CreateIndex
CREATE INDEX "MistakeBookItem_studentId_idx" ON "MistakeBookItem"("studentId");

-- CreateIndex
CREATE INDEX "MistakeBookItem_homeworkReviewId_idx" ON "MistakeBookItem"("homeworkReviewId");

-- CreateIndex
CREATE INDEX "MistakeBookItem_subject_idx" ON "MistakeBookItem"("subject");

-- CreateIndex
CREATE INDEX "MistakeBookItem_knowledgePoint_idx" ON "MistakeBookItem"("knowledgePoint");

-- CreateIndex
CREATE INDEX "MistakeBookItem_correctionStatus_idx" ON "MistakeBookItem"("correctionStatus");

-- CreateIndex
CREATE INDEX "MistakeBookItem_createdAt_idx" ON "MistakeBookItem"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "MistakeBookItem_homeworkReviewId_sourceAreaId_key" ON "MistakeBookItem"("homeworkReviewId", "sourceAreaId");

-- CreateIndex
CREATE INDEX "BillingRecord_campusId_idx" ON "BillingRecord"("campusId");

-- CreateIndex
CREATE INDEX "BillingRecord_studentId_idx" ON "BillingRecord"("studentId");

-- CreateIndex
CREATE INDEX "BillingRecord_classId_idx" ON "BillingRecord"("classId");

-- CreateIndex
CREATE INDEX "BillingRecord_serviceType_idx" ON "BillingRecord"("serviceType");

-- CreateIndex
CREATE INDEX "BillingRecord_billingCycle_idx" ON "BillingRecord"("billingCycle");

-- CreateIndex
CREATE INDEX "BillingRecord_validUntil_idx" ON "BillingRecord"("validUntil");

-- CreateIndex
CREATE INDEX "TeacherFeeRule_campusId_idx" ON "TeacherFeeRule"("campusId");

-- CreateIndex
CREATE INDEX "TeacherFeeRule_classId_idx" ON "TeacherFeeRule"("classId");

-- CreateIndex
CREATE INDEX "TeacherFeeRule_teacherUserId_idx" ON "TeacherFeeRule"("teacherUserId");

-- CreateIndex
CREATE INDEX "TeacherFeeRule_serviceType_idx" ON "TeacherFeeRule"("serviceType");

-- CreateIndex
CREATE INDEX "TeacherFeeRule_isActive_idx" ON "TeacherFeeRule"("isActive");

-- CreateIndex
CREATE INDEX "TeacherFeeRule_effectiveFrom_effectiveTo_idx" ON "TeacherFeeRule"("effectiveFrom", "effectiveTo");

-- CreateIndex
CREATE INDEX "ClassSettlement_campusId_idx" ON "ClassSettlement"("campusId");

-- CreateIndex
CREATE INDEX "ClassSettlement_classId_idx" ON "ClassSettlement"("classId");

-- CreateIndex
CREATE INDEX "ClassSettlement_serviceType_idx" ON "ClassSettlement"("serviceType");

-- CreateIndex
CREATE INDEX "ClassSettlement_settlementDate_idx" ON "ClassSettlement"("settlementDate");

-- CreateIndex
CREATE UNIQUE INDEX "ClassSettlement_campusId_classId_serviceType_settlementDate_key" ON "ClassSettlement"("campusId", "classId", "serviceType", "settlementDate");

-- CreateIndex
CREATE INDEX "ParentNotice_campusId_idx" ON "ParentNotice"("campusId");

-- CreateIndex
CREATE INDEX "ParentNotice_guardianUserId_idx" ON "ParentNotice"("guardianUserId");

-- CreateIndex
CREATE INDEX "ParentNotice_studentId_idx" ON "ParentNotice"("studentId");

-- CreateIndex
CREATE INDEX "ParentNotice_attendanceRecordId_idx" ON "ParentNotice"("attendanceRecordId");

-- CreateIndex
CREATE INDEX "ParentNotice_pushStatus_idx" ON "ParentNotice"("pushStatus");

-- CreateIndex
CREATE INDEX "ParentNotice_createdAt_idx" ON "ParentNotice"("createdAt");

-- CreateIndex
CREATE INDEX "TeacherAttendance_teacherUserId_idx" ON "TeacherAttendance"("teacherUserId");

-- CreateIndex
CREATE INDEX "TeacherAttendance_campusId_idx" ON "TeacherAttendance"("campusId");

-- CreateIndex
CREATE INDEX "TeacherAttendance_classId_idx" ON "TeacherAttendance"("classId");

-- CreateIndex
CREATE INDEX "TeacherAttendance_status_idx" ON "TeacherAttendance"("status");

-- CreateIndex
CREATE INDEX "TeacherAttendance_checkedInAt_idx" ON "TeacherAttendance"("checkedInAt");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- AddForeignKey
ALTER TABLE "CustodyClass" ADD CONSTRAINT "CustodyClass_campusId_fkey" FOREIGN KEY ("campusId") REFERENCES "Campus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_campusId_fkey" FOREIGN KEY ("campusId") REFERENCES "Campus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_classId_fkey" FOREIGN KEY ("classId") REFERENCES "CustodyClass"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuardianStudent" ADD CONSTRAINT "GuardianStudent_guardianUserId_fkey" FOREIGN KEY ("guardianUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuardianStudent" ADD CONSTRAINT "GuardianStudent_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherAssignment" ADD CONSTRAINT "TeacherAssignment_teacherUserId_fkey" FOREIGN KEY ("teacherUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherAssignment" ADD CONSTRAINT "TeacherAssignment_campusId_fkey" FOREIGN KEY ("campusId") REFERENCES "Campus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherAssignment" ADD CONSTRAINT "TeacherAssignment_classId_fkey" FOREIGN KEY ("classId") REFERENCES "CustodyClass"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiActionLog" ADD CONSTRAINT "AiActionLog_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfirmationRequest" ADD CONSTRAINT "ConfirmationRequest_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceRecord" ADD CONSTRAINT "AttendanceRecord_campusId_fkey" FOREIGN KEY ("campusId") REFERENCES "Campus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceRecord" ADD CONSTRAINT "AttendanceRecord_classId_fkey" FOREIGN KEY ("classId") REFERENCES "CustodyClass"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceRecord" ADD CONSTRAINT "AttendanceRecord_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceRecord" ADD CONSTRAINT "AttendanceRecord_teacherUserId_fkey" FOREIGN KEY ("teacherUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrivateFile" ADD CONSTRAINT "PrivateFile_campusId_fkey" FOREIGN KEY ("campusId") REFERENCES "Campus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrivateFile" ADD CONSTRAINT "PrivateFile_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrivateFile" ADD CONSTRAINT "PrivateFile_uploadedByUserId_fkey" FOREIGN KEY ("uploadedByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomeworkReview" ADD CONSTRAINT "HomeworkReview_campusId_fkey" FOREIGN KEY ("campusId") REFERENCES "Campus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomeworkReview" ADD CONSTRAINT "HomeworkReview_classId_fkey" FOREIGN KEY ("classId") REFERENCES "CustodyClass"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomeworkReview" ADD CONSTRAINT "HomeworkReview_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomeworkReview" ADD CONSTRAINT "HomeworkReview_teacherUserId_fkey" FOREIGN KEY ("teacherUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomeworkReview" ADD CONSTRAINT "HomeworkReview_originalImageFileId_fkey" FOREIGN KEY ("originalImageFileId") REFERENCES "PrivateFile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomeworkReview" ADD CONSTRAINT "HomeworkReview_correctedImageFileId_fkey" FOREIGN KEY ("correctedImageFileId") REFERENCES "PrivateFile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_campusId_fkey" FOREIGN KEY ("campusId") REFERENCES "Campus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_classId_fkey" FOREIGN KEY ("classId") REFERENCES "CustodyClass"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_teacherUserId_fkey" FOREIGN KEY ("teacherUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_homeworkReviewId_fkey" FOREIGN KEY ("homeworkReviewId") REFERENCES "HomeworkReview"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MistakeBookItem" ADD CONSTRAINT "MistakeBookItem_campusId_fkey" FOREIGN KEY ("campusId") REFERENCES "Campus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MistakeBookItem" ADD CONSTRAINT "MistakeBookItem_classId_fkey" FOREIGN KEY ("classId") REFERENCES "CustodyClass"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MistakeBookItem" ADD CONSTRAINT "MistakeBookItem_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MistakeBookItem" ADD CONSTRAINT "MistakeBookItem_homeworkReviewId_fkey" FOREIGN KEY ("homeworkReviewId") REFERENCES "HomeworkReview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillingRecord" ADD CONSTRAINT "BillingRecord_campusId_fkey" FOREIGN KEY ("campusId") REFERENCES "Campus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillingRecord" ADD CONSTRAINT "BillingRecord_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillingRecord" ADD CONSTRAINT "BillingRecord_classId_fkey" FOREIGN KEY ("classId") REFERENCES "CustodyClass"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherFeeRule" ADD CONSTRAINT "TeacherFeeRule_campusId_fkey" FOREIGN KEY ("campusId") REFERENCES "Campus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherFeeRule" ADD CONSTRAINT "TeacherFeeRule_classId_fkey" FOREIGN KEY ("classId") REFERENCES "CustodyClass"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherFeeRule" ADD CONSTRAINT "TeacherFeeRule_teacherUserId_fkey" FOREIGN KEY ("teacherUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassSettlement" ADD CONSTRAINT "ClassSettlement_campusId_fkey" FOREIGN KEY ("campusId") REFERENCES "Campus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassSettlement" ADD CONSTRAINT "ClassSettlement_classId_fkey" FOREIGN KEY ("classId") REFERENCES "CustodyClass"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParentNotice" ADD CONSTRAINT "ParentNotice_guardianUserId_fkey" FOREIGN KEY ("guardianUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParentNotice" ADD CONSTRAINT "ParentNotice_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParentNotice" ADD CONSTRAINT "ParentNotice_attendanceRecordId_fkey" FOREIGN KEY ("attendanceRecordId") REFERENCES "AttendanceRecord"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParentNotice" ADD CONSTRAINT "ParentNotice_photoFileId_fkey" FOREIGN KEY ("photoFileId") REFERENCES "PrivateFile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherAttendance" ADD CONSTRAINT "TeacherAttendance_teacherUserId_fkey" FOREIGN KEY ("teacherUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherAttendance" ADD CONSTRAINT "TeacherAttendance_campusId_fkey" FOREIGN KEY ("campusId") REFERENCES "Campus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherAttendance" ADD CONSTRAINT "TeacherAttendance_classId_fkey" FOREIGN KEY ("classId") REFERENCES "CustodyClass"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherAttendance" ADD CONSTRAINT "TeacherAttendance_makeupByUserId_fkey" FOREIGN KEY ("makeupByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
