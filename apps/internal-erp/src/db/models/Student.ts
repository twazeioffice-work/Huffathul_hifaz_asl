import { Model } from '@nozbe/watermelondb'
import { field, date, readonly } from '@nozbe/watermelondb/decorators'

export default class Student extends Model {
  static table = 'students'

  @field('first_name') firstName!: string
  @field('last_name') lastName!: string
  @date('dob') dob?: Date
  @field('gender') gender?: string
  @date('enrollment_date') enrollmentDate!: Date
  @field('tenant_id') tenantId!: string

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date
}
