import { Pool } from 'pg';

import { DEMO_SEED } from './seed-data';

function requireDatabaseUrl() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required. Copy .env.example to .env before running demo seed.');
  }

  return process.env.DATABASE_URL;
}

function getSchemaName(databaseUrl: string) {
  const schemaName = new URL(databaseUrl).searchParams.get('schema');

  if (!schemaName) {
    return null;
  }

  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(schemaName)) {
    throw new Error('DATABASE_URL schema parameter must be a safe PostgreSQL identifier.');
  }

  return schemaName;
}

function quoteIdentifier(identifier: string) {
  return `"${identifier.replaceAll('"', '""')}"`;
}

export async function seedDemoData() {
  const databaseUrl = requireDatabaseUrl();
  const pool = new Pool({ connectionString: databaseUrl });
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const schemaName = getSchemaName(databaseUrl);

    if (schemaName) {
      await client.query(`SET LOCAL search_path TO ${quoteIdentifier(schemaName)}`);
    }

    for (const user of DEMO_SEED.users) {
      await client.query(
        `INSERT INTO "User" ("id", "name", "email", "phone", "role", "isActive", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5::"Role", true, now(), now())
         ON CONFLICT ("id") DO UPDATE SET
           "name" = EXCLUDED."name",
           "email" = EXCLUDED."email",
           "phone" = EXCLUDED."phone",
           "role" = EXCLUDED."role",
           "isActive" = true,
           "updatedAt" = now()`,
        [user.id, user.name, user.email, user.phone, user.role],
      );
    }

    for (const campus of DEMO_SEED.campuses) {
      await client.query(
        `INSERT INTO "Campus" ("id", "name", "address", "phone", "principalName", "status", "serviceHours", "supportedServiceTypes", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6::"CampusStatus", $7, $8::"ServiceType"[], now(), now())
         ON CONFLICT ("id") DO UPDATE SET
           "name" = EXCLUDED."name",
           "address" = EXCLUDED."address",
           "phone" = EXCLUDED."phone",
           "principalName" = EXCLUDED."principalName",
           "status" = EXCLUDED."status",
           "serviceHours" = EXCLUDED."serviceHours",
           "supportedServiceTypes" = EXCLUDED."supportedServiceTypes",
           "updatedAt" = now()`,
        [campus.id, campus.name, campus.address, campus.phone, campus.principalName, campus.status, campus.serviceHours, campus.supportedServiceTypes],
      );
    }

    for (const custodyClass of DEMO_SEED.classes) {
      await client.query(
        `INSERT INTO "CustodyClass" ("id", "campusId", "grade", "name", "capacity", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, now(), now())
         ON CONFLICT ("id") DO UPDATE SET
           "campusId" = EXCLUDED."campusId",
           "grade" = EXCLUDED."grade",
           "name" = EXCLUDED."name",
           "capacity" = EXCLUDED."capacity",
           "updatedAt" = now()`,
        [custodyClass.id, custodyClass.campusId, custodyClass.grade, custodyClass.name, custodyClass.capacity],
      );
    }

    for (const student of DEMO_SEED.students) {
      await client.query(
        `INSERT INTO "Student" ("id", "userId", "name", "identityNumber", "school", "grade", "campusId", "classId", "serviceType", "status", "safetyNote", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::"ServiceType", $10::"StudentStatus", $11, now(), now())
         ON CONFLICT ("id") DO UPDATE SET
           "userId" = EXCLUDED."userId",
           "name" = EXCLUDED."name",
           "identityNumber" = EXCLUDED."identityNumber",
           "school" = EXCLUDED."school",
           "grade" = EXCLUDED."grade",
           "campusId" = EXCLUDED."campusId",
           "classId" = EXCLUDED."classId",
           "serviceType" = EXCLUDED."serviceType",
           "status" = EXCLUDED."status",
           "safetyNote" = EXCLUDED."safetyNote",
           "updatedAt" = now()`,
        [student.id, student.userId, student.name, student.identityNumber, student.school, student.grade, student.campusId, student.classId, student.serviceType, student.status, student.safetyNote],
      );
    }

    for (const binding of DEMO_SEED.guardianStudents) {
      await client.query(
        `INSERT INTO "GuardianStudent" ("id", "guardianUserId", "studentId", "relationship", "phone", "notifyEnabled", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, now(), now())
         ON CONFLICT ("guardianUserId", "studentId") DO UPDATE SET
           "relationship" = EXCLUDED."relationship",
           "phone" = EXCLUDED."phone",
           "notifyEnabled" = EXCLUDED."notifyEnabled",
           "updatedAt" = now()`,
        [binding.id, binding.guardianUserId, binding.studentId, binding.relationship, binding.phone, binding.notifyEnabled],
      );
    }

    for (const assignment of DEMO_SEED.teacherAssignments) {
      await client.query(
        `INSERT INTO "TeacherAssignment" ("id", "teacherUserId", "campusId", "classId", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, now(), now())
         ON CONFLICT ("teacherUserId", "campusId", "classId") DO UPDATE SET "updatedAt" = now()`,
        [assignment.id, assignment.teacherUserId, assignment.campusId, assignment.classId],
      );
    }

    for (const file of DEMO_SEED.privateFiles) {
      await client.query(
        `INSERT INTO "PrivateFile" ("id", "campusId", "studentId", "uploadedByUserId", "originalName", "storageKey", "mimeType", "byteSize", "purpose", "visibility", "createdAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'PRIVATE'::"FileVisibility", now())
         ON CONFLICT ("id") DO UPDATE SET
           "campusId" = EXCLUDED."campusId",
           "studentId" = EXCLUDED."studentId",
           "uploadedByUserId" = EXCLUDED."uploadedByUserId",
           "originalName" = EXCLUDED."originalName",
           "storageKey" = EXCLUDED."storageKey",
           "mimeType" = EXCLUDED."mimeType",
           "byteSize" = EXCLUDED."byteSize",
           "purpose" = EXCLUDED."purpose"`,
        [file.id, file.campusId, file.studentId, file.uploadedByUserId, file.originalName, file.storageKey, file.mimeType, file.byteSize, file.purpose],
      );
    }

    for (const attendance of DEMO_SEED.attendanceRecords) {
      await client.query(
        `INSERT INTO "AttendanceRecord" ("id", "campusId", "classId", "studentId", "teacherUserId", "serviceType", "status", "checkedAt", "photoFileId", "matchStatus", "notificationStatus", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6::"ServiceType", $7::"AttendanceStatus", $8, $9, $10::"AttendanceMatchStatus", $11::"AttendanceNotificationStatus", now(), now())
         ON CONFLICT ("id") DO UPDATE SET
           "status" = EXCLUDED."status",
           "checkedAt" = EXCLUDED."checkedAt",
           "photoFileId" = EXCLUDED."photoFileId",
           "matchStatus" = EXCLUDED."matchStatus",
           "notificationStatus" = EXCLUDED."notificationStatus",
           "updatedAt" = now()`,
        [attendance.id, attendance.campusId, attendance.classId, attendance.studentId, attendance.teacherUserId, attendance.serviceType, attendance.status, attendance.checkedAt, attendance.photoFileId, attendance.matchStatus, attendance.notificationStatus],
      );
    }

    for (const attendance of DEMO_SEED.teacherAttendance) {
      await client.query(
        `INSERT INTO "TeacherAttendance" ("id", "teacherUserId", "campusId", "classId", "status", "checkedInAt", "checkedOutAt", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5::"TeacherAttendanceStatus", $6, $7, now(), now())
         ON CONFLICT ("id") DO UPDATE SET
           "status" = EXCLUDED."status",
           "checkedInAt" = EXCLUDED."checkedInAt",
           "checkedOutAt" = EXCLUDED."checkedOutAt",
           "updatedAt" = now()`,
        [attendance.id, attendance.teacherUserId, attendance.campusId, attendance.classId, attendance.status, attendance.checkedInAt, attendance.checkedOutAt],
      );
    }

    for (const notice of DEMO_SEED.parentNotices) {
      await client.query(
        `INSERT INTO "ParentNotice" ("id", "campusId", "guardianUserId", "studentId", "attendanceRecordId", "photoFileId", "type", "title", "message", "pushStatus", "createdAt", "sentAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::"NoticePushStatus", now(), $11)
         ON CONFLICT ("id") DO UPDATE SET
           "title" = EXCLUDED."title",
           "message" = EXCLUDED."message",
           "pushStatus" = EXCLUDED."pushStatus",
           "sentAt" = EXCLUDED."sentAt"`,
        [notice.id, notice.campusId, notice.guardianUserId, notice.studentId, notice.attendanceRecordId, notice.photoFileId, notice.type, notice.title, notice.message, notice.pushStatus, notice.sentAt],
      );
    }

    for (const review of DEMO_SEED.homeworkReviews) {
      await client.query(
        `INSERT INTO "HomeworkReview" ("id", "campusId", "classId", "studentId", "teacherUserId", "originalImageFileId", "correctedImageFileId", "subject", "status", "aiSuggestedAreas", "teacherConfirmedAreas", "publishStatus", "publishedAt", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::"HomeworkReviewStatus", $10::jsonb, $11::jsonb, $12::"HomeworkPublishStatus", $13, now(), now())
         ON CONFLICT ("id") DO UPDATE SET
           "correctedImageFileId" = EXCLUDED."correctedImageFileId",
           "status" = EXCLUDED."status",
           "aiSuggestedAreas" = EXCLUDED."aiSuggestedAreas",
           "teacherConfirmedAreas" = EXCLUDED."teacherConfirmedAreas",
           "publishStatus" = EXCLUDED."publishStatus",
           "publishedAt" = EXCLUDED."publishedAt",
           "updatedAt" = now()`,
        [review.id, review.campusId, review.classId, review.studentId, review.teacherUserId, review.originalImageFileId, review.correctedImageFileId, review.subject, review.status, JSON.stringify(review.aiSuggestedAreas), JSON.stringify(review.teacherConfirmedAreas), review.publishStatus, review.publishedAt],
      );
    }

    for (const feedback of DEMO_SEED.feedbacks) {
      await client.query(
        `INSERT INTO "Feedback" ("id", "campusId", "classId", "studentId", "teacherUserId", "homeworkReviewId", "behaviorPerformance", "homeworkCompletion", "knowledgeMastery", "publishStatus", "publishedAt", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::"FeedbackPublishStatus", $11, now(), now())
         ON CONFLICT ("id") DO UPDATE SET
           "behaviorPerformance" = EXCLUDED."behaviorPerformance",
           "homeworkCompletion" = EXCLUDED."homeworkCompletion",
           "knowledgeMastery" = EXCLUDED."knowledgeMastery",
           "publishStatus" = EXCLUDED."publishStatus",
           "publishedAt" = EXCLUDED."publishedAt",
           "updatedAt" = now()`,
        [feedback.id, feedback.campusId, feedback.classId, feedback.studentId, feedback.teacherUserId, feedback.homeworkReviewId, feedback.behaviorPerformance, feedback.homeworkCompletion, feedback.knowledgeMastery, feedback.publishStatus, feedback.publishedAt],
      );
    }

    for (const mistake of DEMO_SEED.mistakeBookItems) {
      await client.query(
        `INSERT INTO "MistakeBookItem" ("id", "campusId", "classId", "studentId", "homeworkReviewId", "sourceAreaId", "subject", "knowledgePoint", "mistakeReason", "imageRegion", "questionText", "correctionStatus", "aiConfidence", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::jsonb, $11, $12::"MistakeCorrectionStatus", $13, now(), now())
         ON CONFLICT ("id") DO UPDATE SET
           "knowledgePoint" = EXCLUDED."knowledgePoint",
           "mistakeReason" = EXCLUDED."mistakeReason",
           "imageRegion" = EXCLUDED."imageRegion",
           "questionText" = EXCLUDED."questionText",
           "correctionStatus" = EXCLUDED."correctionStatus",
           "aiConfidence" = EXCLUDED."aiConfidence",
           "updatedAt" = now()`,
        [mistake.id, mistake.campusId, mistake.classId, mistake.studentId, mistake.homeworkReviewId, mistake.sourceAreaId, mistake.subject, mistake.knowledgePoint, mistake.mistakeReason, JSON.stringify(mistake.imageRegion), mistake.questionText, mistake.correctionStatus, mistake.aiConfidence],
      );
    }

    for (const billing of DEMO_SEED.billingRecords) {
      await client.query(
        `INSERT INTO "BillingRecord" ("id", "campusId", "studentId", "classId", "serviceType", "billingCycle", "periodStart", "periodEnd", "amountDue", "amountPaid", "balanceAmount", "debtAmount", "validUntil", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5::"ServiceType", $6::"BillingCycle", $7, $8, $9, $10, $11, $12, $13, now(), now())
         ON CONFLICT ("id") DO UPDATE SET
           "periodStart" = EXCLUDED."periodStart",
           "periodEnd" = EXCLUDED."periodEnd",
           "amountDue" = EXCLUDED."amountDue",
           "amountPaid" = EXCLUDED."amountPaid",
           "balanceAmount" = EXCLUDED."balanceAmount",
           "debtAmount" = EXCLUDED."debtAmount",
           "validUntil" = EXCLUDED."validUntil",
           "updatedAt" = now()`,
        [billing.id, billing.campusId, billing.studentId, billing.classId, billing.serviceType, billing.billingCycle, billing.periodStart, billing.periodEnd, billing.amountDue, billing.amountPaid, billing.balanceAmount, billing.debtAmount, billing.validUntil],
      );
    }

    for (const rule of DEMO_SEED.teacherFeeRules) {
      await client.query(
        `INSERT INTO "TeacherFeeRule" ("id", "campusId", "classId", "teacherUserId", "serviceType", "billingMode", "feeAmount", "effectiveFrom", "isActive", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5::"ServiceType", $6::"TeacherFeeBillingMode", $7, $8, true, now(), now())
         ON CONFLICT ("id") DO UPDATE SET
           "feeAmount" = EXCLUDED."feeAmount",
           "effectiveFrom" = EXCLUDED."effectiveFrom",
           "isActive" = true,
           "updatedAt" = now()`,
        [rule.id, rule.campusId, rule.classId, rule.teacherUserId, rule.serviceType, rule.billingMode, rule.feeAmount, rule.effectiveFrom],
      );
    }

    for (const settlement of DEMO_SEED.classSettlements) {
      await client.query(
        `INSERT INTO "ClassSettlement" ("id", "campusId", "classId", "serviceType", "settlementDate", "expectedCount", "arrivedCount", "leaveCount", "absentCount", "pendingCount", "studentRevenueAmount", "teacherFeeAmount", "reservedCostAmount", "estimatedGrossProfitAmount", "teacherFeeRuleIds", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4::"ServiceType", $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, now(), now())
         ON CONFLICT ("campusId", "classId", "serviceType", "settlementDate") DO UPDATE SET
           "expectedCount" = EXCLUDED."expectedCount",
           "arrivedCount" = EXCLUDED."arrivedCount",
           "leaveCount" = EXCLUDED."leaveCount",
           "absentCount" = EXCLUDED."absentCount",
           "pendingCount" = EXCLUDED."pendingCount",
           "studentRevenueAmount" = EXCLUDED."studentRevenueAmount",
           "teacherFeeAmount" = EXCLUDED."teacherFeeAmount",
           "reservedCostAmount" = EXCLUDED."reservedCostAmount",
           "estimatedGrossProfitAmount" = EXCLUDED."estimatedGrossProfitAmount",
           "teacherFeeRuleIds" = EXCLUDED."teacherFeeRuleIds",
           "updatedAt" = now()`,
        [settlement.id, settlement.campusId, settlement.classId, settlement.serviceType, settlement.settlementDate, settlement.expectedCount, settlement.arrivedCount, settlement.leaveCount, settlement.absentCount, settlement.pendingCount, settlement.studentRevenueAmount, settlement.teacherFeeAmount, settlement.reservedCostAmount, settlement.estimatedGrossProfitAmount, settlement.teacherFeeRuleIds],
      );
    }

    for (const log of DEMO_SEED.aiActionLogs) {
      await client.query(
        `INSERT INTO "AiActionLog" ("id", "actorUserId", "actorRole", "rawInput", "intent", "entities", "confidence", "risk", "confirmationRequired", "resultStatus", "resultSummary", "createdAt")
         VALUES ($1, $2, $3::"Role", $4, $5::"AiIntent", $6::jsonb, $7, $8::"AiRiskLevel", $9, $10::"AiActionResultStatus", $11, now())
         ON CONFLICT ("id") DO UPDATE SET
           "rawInput" = EXCLUDED."rawInput",
           "entities" = EXCLUDED."entities",
           "confidence" = EXCLUDED."confidence",
           "risk" = EXCLUDED."risk",
           "confirmationRequired" = EXCLUDED."confirmationRequired",
           "resultStatus" = EXCLUDED."resultStatus",
           "resultSummary" = EXCLUDED."resultSummary"`,
        [log.id, log.actorUserId, log.actorRole, log.rawInput, log.intent, JSON.stringify(log.entities), log.confidence, log.risk, log.confirmationRequired, log.resultStatus, log.resultSummary],
      );
    }

    await client.query('COMMIT');

    return {
      campuses: DEMO_SEED.campuses.length,
      users: DEMO_SEED.users.length,
      students: DEMO_SEED.students.length,
      attendanceRecords: DEMO_SEED.attendanceRecords.length,
      homeworkReviews: DEMO_SEED.homeworkReviews.length,
      mistakeBookItems: DEMO_SEED.mistakeBookItems.length,
      billingRecords: DEMO_SEED.billingRecords.length,
      aiActionLogs: DEMO_SEED.aiActionLogs.length,
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

async function main() {
  const summary = await seedDemoData();
  console.info(
    `Demo seed applied: ${summary.campuses} campuses, ${summary.users} users, ${summary.students} students, ${summary.attendanceRecords} attendance records, ${summary.homeworkReviews} homework reviews, ${summary.mistakeBookItems} mistake items, ${summary.billingRecords} billing records, ${summary.aiActionLogs} AI logs.`,
  );
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
