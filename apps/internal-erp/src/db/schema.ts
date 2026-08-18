import { appSchema, tableSchema } from '@nozbe/watermelondb'

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'students',
      columns: [
        { name: 'first_name', type: 'string' },
        { name: 'last_name', type: 'string' },
        { name: 'dob', type: 'number', isOptional: true },
        { name: 'gender', type: 'string', isOptional: true },
        { name: 'enrollment_date', type: 'number' },
        { name: 'tenant_id', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ]
    }),
    tableSchema({
      name: 'staff',
      columns: [
        { name: 'employee_code', type: 'string' },
        { name: 'full_name', type: 'string' },
        { name: 'designation', type: 'string' },
        { name: 'tenant_id', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ]
    }),
  ]
})
