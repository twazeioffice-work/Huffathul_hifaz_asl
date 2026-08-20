import { appSchema, tableSchema } from '@nozbe/watermelondb'

export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'student_enrollments',
      columns: [
        { name: 'student_name', type: 'string' },
        { name: 'roll_number', type: 'string' },
        { name: 'batch_details', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ]
    }),
    tableSchema({
      name: 'hifz_sabaq_records',
      columns: [
        { name: 'student_enrollment_id', type: 'string', isIndexed: true },
        { name: 'staff_id', type: 'string', isIndexed: true },
        { name: 'juz', type: 'number' },
        { name: 'start_page', type: 'number' },
        { name: 'end_page', type: 'number' },
        { name: 'grade', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ]
    }),
    tableSchema({
      name: 'hifz_sabqi_records',
      columns: [
        { name: 'student_enrollment_id', type: 'string', isIndexed: true },
        { name: 'staff_id', type: 'string', isIndexed: true },
        { name: 'juz', type: 'number' },
        { name: 'grade', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ]
    }),
    tableSchema({
      name: 'hifz_manzil_records',
      columns: [
        { name: 'student_enrollment_id', type: 'string', isIndexed: true },
        { name: 'staff_id', type: 'string', isIndexed: true },
        { name: 'juz', type: 'number' },
        { name: 'grade', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ]
    }),
  ]
})
