import { Model } from '@nozbe/watermelondb'
import { field, date, readonly } from '@nozbe/watermelondb/decorators'

export default class SabaqRecord extends Model {
  static table = 'hifz_sabaq_records'

  @field('student_enrollment_id') studentEnrollmentId!: string
  @field('staff_id') staffId!: string
  @field('juz') juz!: number
  @field('start_page') startPage!: number
  @field('end_page') endPage!: number
  @field('grade') grade!: string
  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date
}
